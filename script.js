@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

body {
  margin: 0;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(to top, #0f2027, #203a43, #2c5364);
  cursor: crosshair;
  color: #f0f0f0;
}

.ball {
  position: absolute;
  border-radius: 50%;
  opacity: 0.85;
  transform: scale(0);
  animation: grow 3s linear forwards;
  transition: transform 0.2s, opacity 0.2s;
  pointer-events: auto;
}

@keyframes grow {
  to {
    transform: scale(1);
  }
}

.ball.pop {
  animation: pop 0.2s ease-out forwards;
}

@keyframes pop {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

#gameStats {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 999;
  background: rgba(0, 0, 0, 0.4);
  padding: 12px 20px;
  border-radius: 16px;
  font-size: 16px;
  display: flex;
  gap: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
}

#endScreen {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: none;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  z-index: 1000;
  padding: 30px;
}

#endScreen h3 {
  margin-top: 20px;
}

input, button {
  font-size: 18px;
  padding: 10px 18px;
  margin-top: 12px;
  border: none;
  border-radius: 8px;
  outline: none;
  background: #ffffff;
  color: #333;
  transition: background 0.3s;
}

button:hover {
  background: #eeeeee;
}

#restartButton {
  background: #FF4081;
  color: white;
  margin-top: 24px;
}

#restartButton:hover {
  background: #e91e63;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  color: white;
}

th, td {
  padding: 6px 12px;
  text-align: left;
}

thead {
  background: rgba(255, 255, 255, 0.15);
}

tbody tr:nth-child(even) {
  background: rgba(255, 255, 255, 0.08);
}

#highScoresTable {
  max-width: 600px;
  margin-top: 20px;
}
