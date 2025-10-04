import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { Bullet } from "./bullet.js";
import { InputHandler } from "./input.js";
import { Sword } from "./sword.js";
import { Beam } from "./beam.js";
import { EnemyBullet } from "./enemyBullet.js"; // 敵弾クラス追加

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const MAX_ENEMIES = 10;

const player = new Player(canvas.width / 2, canvas.height / 2, canvas);
const enemies = [];
const bullets = [];
const swords = [];
const beams = [];
const enemyBullets = []; // 敵の弾を管理

const input = new InputHandler();

let isGameOver = false;

// 敵生成
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

// 当たり判定
function checkCollisions() {
  // 自弾と敵
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

  // 剣と敵
  for (let i = swords.length - 1; i >= 0; i--) {
    const s = swords[i];
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      const dist = Math.hypot(s.x - e.x, s.y - e.y);
      if (dist < s.length / 2 + e.radius) {
        enemies.splice(j, 1);
      }
    }
  }

  // ビームと敵
  for (let bm of beams) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      const dx = e.x - bm.x;
      const dy = e.y - bm.y;
      const beamDirX = Math.cos(bm.angle);
      const beamDirY = Math.sin(bm.angle);
      const proj = dx * beamDirX + dy * beamDirY;
      if (proj >= 0 && proj <= bm.length) {
        const perpDist = Math.abs(-beamDirY * dx + beamDirX * dy);
        if (perpDist < e.radius + bm.width / 2) {
          enemies.splice(j, 1);
        }
      }
    }
  }

  // 敵弾とプレイヤー
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const eb = enemyBullets[i];
    const dist = Math.hypot(player.x - eb.x, player.y - eb.y);
    if (dist < player.radius + eb.radius) {
      isGameOver = true;
      break;
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

// ゲームループ
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!isGameOver) {
    player.update(input.keys);
    spawnEnemy();

    enemies.forEach(e => {
      e.update(player.x, player.y);

      // ランダムに弾を撃たせる（1/100 の確率）
      if (Math.random() < 0.01) {
        const angle = Math.atan2(player.y - e.y, player.x - e.x);
        enemyBullets.push(new EnemyBullet(e.x, e.y, angle, canvas));
      }
    });

    bullets.forEach(b => b.update());
    swords.forEach(s => s.update());
    beams.forEach(bm => bm.update());
    enemyBullets.forEach(eb => eb.update());

    // 画面外削除
    for (let i = bullets.length - 1; i >= 0; i--) {
      if (bullets[i].isOutOfBounds()) bullets.splice(i, 1);
    }
    for (let i = swords.length - 1; i >= 0; i--) {
      if (swords[i].isOutOfBounds()) swords.splice(i, 1);
    }
    for (let i = beams.length - 1; i >= 0; i--) {
      if (beams[i].isExpired()) beams.splice(i, 1);
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
  swords.forEach(s => s.draw(ctx));
  beams.forEach(bm => bm.draw(ctx));
  enemyBullets.forEach(eb => eb.draw(ctx));

  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "bold 48px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  }

  requestAnimationFrame(gameLoop);
}

// キー入力
window.addEventListener("keydown", e => {
  if (isGameOver) return;

  if (e.key === " ") {
    bullets.push(new Bullet(player.x, player.y, player.angle, canvas));
  }
  if (e.key === "Shift") {
    const spreadCount = 5;
    const spreadAngle = 10 * (Math.PI / 180);
    for (let i = 0; i < spreadCount; i++) {
      const offset = (i - Math.floor(spreadCount / 2)) * spreadAngle;
      const angle = player.angle + offset;
      bullets.push(new Bullet(player.x, player.y, angle, canvas));
    }
  }
  if (e.key === "z" || e.key === "Z") {
    const swordCount = 5;
    const randomRange = Math.PI / 3;
    for (let i = 0; i < swordCount; i++) {
      const randomOffset = (Math.random() - 0.5) * randomRange;
      const angle = player.angle + randomOffset;
      swords.push(new Sword(player.x, player.y, angle, canvas, {
        color: "cyan", speed: 15, length: 40, width: 6
      }));
    }
  }
  if (e.key === "x" || e.key === "X") {
    beams.push(new Beam(player.x, player.y, player.angle, canvas, {
      color: "lime", width: 6, length: 500, duration: 20
    }));
  }
});

gameLoop();



