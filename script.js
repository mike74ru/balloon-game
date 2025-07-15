const API_URL = 'https://balloon-api-y74o.onrender.com';

let hit = 0;
let missed = 0;
let level = 1;
let isPlaying = true;
let spawnInterval = 1200;
let spawnTimer;

function spawnBall() {
  const ball = document.createElement('div');
  const size = Math.random() * 50 + 30;

  // Центр и радиус разлёта
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
  ball.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 60%)`;

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
}

async function saveScore() {
  const name = document.getElementById('playerName').value.trim();
  if (!name) return alert('Введите имя!');

  const score = {
    name,
    level,
    hit,
    timestamp: Date.now()
  };

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

// Запуск
updateStats();
restartSpawn();
fetchOnlineScores();
