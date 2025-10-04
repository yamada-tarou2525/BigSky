import { Player } from "/player.js";
import { Enemy } from "/enemy.js";
import { Bullet } from "/bullet.js";
import { InputHandler } from "/input.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const MAX_ENEMIES = 5;

const player = new Player(canvas.width / 2, canvas.height / 2, canvas);
const enemies = [];
const bullets = [];
const input = new InputHandler();

let isGameOver = false;

function spawnEnemy() {
  if (enemies.length >= MAX_ENEMIES) return;

  const edge = Math.floor(Math.random() * 4);
  let x, y;
  switch (edge) {
    case 0: // 上
      x = Math.random() * canvas.width;
      y = 0;
      break;
    case 1: // 下
      x = Math.random() * canvas.width;
      y = canvas.height;
      break;
    case 2: // 左
      x = 0;
      y = Math.random() * canvas.height;
      break;
    case 3: // 右
      x = canvas.width;
      y = Math.random() * canvas.height;
      break;
  }
  enemies.push(new Enemy(x, y, canvas));
}

function checkCollisions() {
  // 弾と敵の当たり判定
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      const dist = Math.hypot(b.x - e.x, b.y - e.y);
      if (dist < b.radius + e.radius) {
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        break;
      }
    }
  }

  // 敵とプレイヤーの当たり判定
  for (const e of enemies) {
    const dist = Math.hypot(player.x - e.x, player.y - e.y);
    if (dist < player.radius + e.radius) {
      isGameOver = true;
      break;
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!isGameOver) {
    player.update(input.keys);
    spawnEnemy();

    enemies.forEach(e => e.update(player.x, player.y));
    bullets.forEach(b => b.update());

    // 画面外の弾を削除
    for (let i = bullets.length - 1; i >= 0; i--) {
      if (bullets[i].isOutOfBounds()) bullets.splice(i, 1);
    }

    checkCollisions();
  }

  player.draw(ctx);
  enemies.forEach(e => e.draw(ctx));
  bullets.forEach(b => b.draw(ctx));

  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "bold 48px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  }

  requestAnimationFrame(gameLoop);
}

// スペースキーで弾を撃つ処理（連射制御は簡単に）
window.addEventListener("keydown", e => {
  if (e.key === " " && !isGameOver) {
    bullets.push(new Bullet(player.x, player.y, player.angle, canvas));
  }
});

gameLoop();