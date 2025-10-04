import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { Bullet } from "./bullet.js";
import { InputHandler } from "./input.js";
import { EnemyBullet } from "./enemyBullet.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const MAX_ENEMIES = 10;

const player = new Player(canvas.width / 2, canvas.height / 2, canvas);
const enemies = [];
const bullets = [];
const enemyBullets = [];
const input = new InputHandler();

let isGameOver = false;

function spawnEnemy() {
  if (enemies.length >= MAX_ENEMIES) return;

  const edge = Math.floor(Math.random() * 4);
  let x, y;
  switch (edge) {
    case 0: x = Math.random() * canvas.width; y = 0; break;
    case 1: x = Math.random() * canvas.width; y = canvas.height; break;
    case 2: x = 0; y = Math.random() * canvas.height; break;
    case 3: x = canvas.width; y = Math.random() * canvas.height; break;
  }
  enemies.push(new Enemy(x, y, canvas));
}

function checkCollisions() {
  // プレイヤー弾と敵
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

  // 敵とプレイヤー
  for (const e of enemies) {
    const dist = Math.hypot(player.x - e.x, player.y - e.y);
    if (dist < player.radius + e.radius) {
      isGameOver = true;
      return;
    }
  }

  // 敵弾とプレイヤー
  for (const b of enemyBullets) {
    const dist = Math.hypot(player.x - b.x, player.y - b.y);
    if (dist < player.radius + b.radius) {
      isGameOver = true;
      return;
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!isGameOver) {
    player.update(input.keys);
    spawnEnemy();

    enemies.forEach(e => e.update(player.x, player.y, enemyBullets));
    bullets.forEach(b => b.update());
    enemyBullets.forEach(b => b.update());

    // 画面外の弾削除
    for (let i = bullets.length - 1; i >= 0; i--) {
      if (bullets[i].isOutOfBounds()) bullets.splice(i, 1);
    }
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      if (enemyBullets[i].isOutOfBounds()) enemyBullets.splice(i, 1);
    }

    checkCollisions();
  }

  // 描画
  player.draw(ctx);
  enemies.forEach(e => e.draw(ctx));
  bullets.forEach(b => b.draw(ctx));
  enemyBullets.forEach(b => b.draw(ctx));

  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "bold 48px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  }

  requestAnimationFrame(gameLoop);
}

// 🎯 単発弾（スペースキー）と拡散弾（Shiftキー）の撃ち分け
window.addEventListener("keydown", e => {
  if (isGameOver) return;

  // 単発ショット（スペースキー）
  if (e.key === " ") {
    bullets.push(new Bullet(player.x, player.y, player.angle, canvas));
  }

  // 拡散ショット（Shiftキー）
  if (e.key === "Shift") {
    const spreadCount = 5; // 拡散弾の数（例：5発）
    const spreadAngle = 10 * (Math.PI / 180); // 拡散角度（度→ラジアン）

    for (let i = 0; i < spreadCount; i++) {
      const offset = (i - Math.floor(spreadCount / 2)) * spreadAngle;
      const angle = player.angle + offset;
      bullets.push(new Bullet(player.x, player.y, angle, canvas));
    }
  }
});


gameLoop();

