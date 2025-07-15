const API_URL = 'https://balloon-api-y74o.onrender.com';

let hit = 0, missed = 0, level = 1, isPlaying = false;
let spawnInterval = 1200;
let spawnTimer;

function startGame() {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('gameStats').style.display = 'flex';
  isPlaying = true;
  restartSpawn();
  fetchOnlineScores();
}

function spawnBall() {
  const ball = document.createElement('div');
  const size = Math.random() * 50 + 30;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const maxRadius = 100 + level * 100;

  const angle = Math.random() * 2 * Math.PI;
  const radius = Math.random() * maxRadius;
  const x = centerX + Math.cos(angle) * radius - size / 2;
  const y = centerY + Math.sin(angle) * radius - size / 2;

  ball.classList.add('ball');
  ball.style.width = size + 'px';
  ball.style.height = size + 'px';
  ball.style.left = `${x}px`;
  ball.style.top = `${y}px`;

  // Скины по уровню
  let color;
  if (level >= 10) {
    color = `hsl(${Math.random() * 20}, 100%, 60%)`; // огненные
  } else if (level >= 5) {
    color = `hsl(190, 80%, ${50 + Math.random() * 20}%)`; // ледяные
  } else {
    color = `hsl(${Math.random() * 360}, 80%, 60%)`; // радужные
  }
  ball.style.backgroundColor = color;

  document.body.appendChild(ball);

  const timeout = setTimeout(() => {
    if (document.body.contains(ball)) {
      document.body.removeChild(ball);
      missed++;
      updateStats();
      checkGameState();
    }
  }, 3000);

  ball.addEventListener('click', () => {
    clearTimeout(timeout);
    ball.classList.add('pop');
    setTimeout(() => ball.remove(), 200);
    hit++;
    updateStats();
    adjustDifficulty();
    checkGameState();
  });
}

function adjustDifficulty() {
  if (hit % 5 === 0 && spawnInterval > 300) {
    spawnInterval -= 100;
    restartSpawn();
  }
}

function updateStats() {
  document.getElementById('score').innerText = `Поймано: ${hit}`;
  document.getElementById('missed').innerText = `Пропущено: ${missed} / 5`;
  document.getElementById('level').innerText = `Уровень: ${level}`;

  const progress = (hit % 20) / 20 * 100;
  document.getElementById('progressFill').style.width = `${progress}%`;
}

function checkGameState() {
  if (missed >= 5) {
    endGame();
  } else if (hit >= level * 20) {
    level++;
    missed = 0;
    restartSpawn();
  }
}

function restartSpawn() {
  clearInterval(spawnTimer);
  spawnTimer = setInterval(spawnBall, spawnInterval);
}

function endGame() {
  isPlaying = false;
  clearInterval(spawnTimer);
  document.querySelectorAll('.ball').forEach(b => b.remove());

  document.getElementById('result').innerText =
    `Игра окончена!\nУровень: ${level}, Поймано: ${hit}, Пропущено: ${missed}`;
  document.getElementById('endScreen').style.display = 'flex';
  document.getElementById('nameInput').style.display = 'flex';
  document.getElementById('playerName').value = '';
  showAchievements();
}

function showAchievements() {
  let messages = [];
  if (level >= 1) messages.push('🏅 Новичок');
  if (missed === 0 && hit > 0) messages.push('🎯 Меткий');
  if (level >= 5) messages.push('💎 Ветеран');

  if (messages.length) {
    document.getElementById('achievements').innerHTML = `
      <h3>🏆 Достижения:</h3>
      <ul>${messages.map(m => `<li>${m}</li>`).join('')}</ul>`;
  }
}

async function saveScore() {
  const name = document.getElementById('playerName').value.trim();
  if (!name) return alert('Введите имя!');

  const score = { name, level, hit, timestamp: Date.now() };

  try {
    const res = await fetch(`${API_URL}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(score)
    });
    const scores = await res.json();
    showOnlineScores(scores);
  } catch (err) {
    console.error('Ошибка отправки результата:', err);
  }

  document.getElementById('nameInput').style.display = 'none';
}

async function fetchOnlineScores() {
  try {
    const res = await fetch(`${API_URL}/scores`);
    const scores = await res.json();
    showOnlineScores(scores);
  } catch (err) {
    console.error('Ошибка загрузки результатов:', err);
  }
}

function showOnlineScores(scores) {
  const rows = scores.map(s => `
    <tr>
      <td>${s.name}</td>
      <td>${s.level}</td>
      <td>${s.hit}</td>
      <td>${new Date(s.timestamp).toLocaleString()}</td>
    </tr>`).join('');

  document.getElementById('highScoresTable').innerHTML = `
    <h3>🌍 Онлайн рекорды</h3>
    <table>
      <thead><tr><th>Игрок</th><th>Уровень</th><th>Поймано</th><th>Дата</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}
