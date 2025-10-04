import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { Bullet } from "./bullet.js";
import { InputHandler } from "./input.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 敵の最大数
const MAX_ENEMIES = 5;

// オブジェクト管理
const player = new Player(canvas.width / 2, canvas.height / 2, canvas);
const enemies = [];
const bullets = [];
const input = new InputHandler();

let isGameOver = false;

// ==========================
// 🔹 拡散弾を撃つ関数
// ==========================
function shootSpread(x, y, angle, canvas) {
  const spreadCount = 5; // 発射する弾の本数
  const spreadAngle = 30 * (Math.PI / 180); // 全体の広がり角度（30度）

  for (let i = 0; i < spreadCount; i++) {
    // 左右対称に角度をずらす
    const offset = (i - (spreadCount - 1) / 2) * (spreadAngle / (spreadCount - 1));
    const bulletAngle = angle + offset;
    bullets.push(new Bullet(x, y, bulletAngle, canvas));
  }
}

// ==========================
// 🔹 敵の生成
// ==========================
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

// ==========================
// 🔹 当たり判定
// ==========================
function checkCollisions() {
  // 弾と敵
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
      break;
    }
  }
}

// ==========================
// 🔹 ゲームループ
// ==========================
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!isGameOver) {
    player.update(input.keys);
    spawnEnemy();

    // 敵と弾の更新
    enemies.forEach(e => e.update(player.x, player.y));
    bullets.forEach(b => b.update());

    // 画面外の弾削除
    for (let i = bullets.length - 1; i >= 0; i--) {
      if (bullets[i].isOutOfBounds()) bullets.splice(i, 1);
    }

    checkCollisions();
  }

  // 描画
  player.draw(ctx);
  enemies.forEach(e => e.draw(ctx));
  bullets.forEach(b => b.draw(ctx));

  // GAME OVER表示
  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "bold 48px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  }

  requestAnimationFrame(gameLoop);
}

// ==========================
// 🔹 スペースキーで拡散弾発射
// ==========================
window.addEventListener("keydown", e => {
  if (e.key === " " && !isGameOver) {
    shootSpread(player.x, player.y, player.angle, canvas);
  }
});

// ==========================
// 🔹 ゲーム開始
// ==========================
gameLoop();
