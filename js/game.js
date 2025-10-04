import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { EnemyBullet } from "./enemyBullet.js";
import { Bullet } from "./bullet.js";
import { InputHandler } from "./input.js";
import { Sword } from "./sword.js";
import { Beam } from "./beam.js";
import { Explosion } from "./explosion.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const MAX_ENEMIES = 10;

const player = new Player(canvas.width / 2, canvas.height / 2, canvas);
const enemies = [];
const bullets = [];
const swords = [];
const beams = [];
const enemyBullets = [];
let explosions = [];

const input = new InputHandler();
let isGameOver = false;

// 🔋チャージ関連
let isCharging = false;
let chargeStartTime = 0;
let chargeLevel = 0;

// ------------------- 敵生成 -------------------
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

// ------------------- 当たり判定 -------------------
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
        if (!player.isInvincible) {   // 無敵ならゲームオーバー無効
          isGameOver = true;
          break;
        }
      }
  }
}

// ------------------- チャージショット -------------------
function fireChargeShot(level) {
  const x = player.x;
  const y = player.y;
  const angle = player.angle;

  if (level === 1) {
    bullets.push(new Bullet(x, y, angle, canvas, {
      speed: 10, radius: 5, color: "white"
    }));
  } else if (level === 2) {
    bullets.push(new Bullet(x, y, angle, canvas, {
      speed: 14, radius: 10, color: "yellow"
    }));
  } else if (level === 3) {
    beams.push(new Beam(x, y, angle, canvas, {
      color: "orange", width: 10, length: 500, life: 60
    }));
  }
}

// ------------------- ゲームループ -------------------
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!isGameOver) {
    player.update(input.keys);
    player.toggleInvincibility(input.keys); // ← 無敵切替チェック
    spawnEnemy();

    enemies.forEach(e => e.update(player.x, player.y));

    // 敵の攻撃
    enemies.forEach(e => {
      if (Math.random() < 0.02) {
        const angle = Math.atan2(player.y - e.y, player.x - e.x);
        enemyBullets.push(new EnemyBullet(e.x, e.y, angle, canvas));
      }
    });

    bullets.forEach(b => b.update());
    swords.forEach(s => s.update(enemies));
    beams.forEach(bm => bm.update());
    enemyBullets.forEach(eb => eb.update());
    explosions.forEach(ex => ex.update());

    // 🔥爆発を破壊的に更新
    explosions = explosions.filter(ex => ex.active);

    // 画面外・寿命処理
    for (let i = bullets.length - 1; i >= 0; i--) if (bullets[i].isOutOfBounds()) bullets.splice(i, 1);
    for (let i = swords.length - 1; i >= 0; i--) if (swords[i].isOutOfBounds()) swords.splice(i, 1);
    for (let i = enemyBullets.length - 1; i >= 0; i--) if (enemyBullets[i].isOutOfBounds()) enemyBullets.splice(i, 1);

    // ビーム寿命
    for (let i = beams.length - 1; i >= 0; i--) {
      if (beams[i].life !== undefined) {
        beams[i].life--;
        if (beams[i].life <= 0) beams.splice(i, 1);
      }
    }

    checkCollisions();
  }

  // ------------------- 描画 -------------------
  player.draw(ctx);
  explosions.forEach(ex => ex.draw(ctx));
  enemies.forEach(e => e.draw(ctx));
  bullets.forEach(b => b.draw(ctx));
  swords.forEach(s => s.draw(ctx));
  beams.forEach(bm => bm.draw(ctx));
  enemyBullets.forEach(eb => eb.draw(ctx));

  // 🔋チャージエフェクト
  if (isCharging) {
    const chargeTime = (Date.now() - chargeStartTime) / 1000;
    const ratio = Math.min(chargeTime / 2, 1);
    const radius = 20 + 20 * ratio;
    ctx.beginPath();
    ctx.arc(player.x, player.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 0, ${0.5 + 0.5 * ratio})`;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "bold 48px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  }

  requestAnimationFrame(gameLoop);
}

// ------------------- キー入力 -------------------
window.addEventListener("keydown", e => {
  if (isGameOver) return;

  // 通常ショット
  if (e.key === " ") bullets.push(new Bullet(player.x, player.y, player.angle, canvas));

  // 拡散ショット
  if (e.key === "Shift") {
    const spreadCount = 5;
    const spreadAngle = 10 * (Math.PI / 180);
    for (let i = 0; i < spreadCount; i++) bullets.push(new Bullet(player.x, player.y, player.angle + (i - 2) * spreadAngle, canvas));
  }

  // Z：剣
  if (e.key === "z" || e.key === "Z") {
    const swordCount = 5;
    const randomRange = Math.PI / 3;
    for (let i = 0; i < swordCount; i++) {
      const offset = (Math.random() - 0.5) * randomRange;
      swords.push(new Sword(player.x, player.y, player.angle + offset, canvas, { color: "cyan", speed: 15, length: 40, width: 6 }));
    }
  }

  // X：ビーム
  if (e.key === "x" || e.key === "X") {
    beams.push(new Beam(player.x, player.y, player.angle, canvas, { color: "lime", width: 6, length: 500, duration: 20 }));
  }

  // V：8方向ビーム
  if (e.key === "v" || e.key === "V") {
    const count = 8;
    const spread = (Math.PI * 2) / count;
    const delay = 100;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        beams.push(new Beam(player.x, player.y, player.angle + i * spread, canvas, { color: "lime", length: 250, width: 6, life: 90 }));
      }, i * delay);
    }
  }

  // B：ホーミング剣
  if (e.key === "b" || e.key === "B") {
    const count = 12;
    const spread = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
      swords.push(new Sword(player.x, player.y, i * spread, canvas, { color: "magenta", speed: 6, length: 50, width: 6, homing: true, turnSpeed: 0.05 }));
    }
  }

  // N：チャージ開始
  if ((e.key === "n" || e.key === "N") && !isCharging) {
    isCharging = true;
    chargeStartTime = Date.now();
  }
});

window.addEventListener("keyup", e => {
  // Nキー離す → 発射
  if (e.key === "n" || e.key === "N") {
    if (isCharging) {
      isCharging = false;
      const chargeTime = (Date.now() - chargeStartTime) / 1000;
      if (chargeTime < 0.7) chargeLevel = 1;
      else if (chargeTime < 1.4) chargeLevel = 2;
      else chargeLevel = 3;
      fireChargeShot(chargeLevel);
    }
  }

  // Mキーで爆発攻撃
  if (e.key === "m" || e.key === "M") {
    explosions.push(new Explosion(player.x, player.y));
    const blastRadius = 150;
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      if (Math.hypot(player.x - e.x, player.y - e.y) < blastRadius) enemies.splice(i, 1);
    }
  }
});

gameLoop();








