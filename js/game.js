// game.js
import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { EnemyBullet } from "./enemyBullet.js";
import { Bullet } from "./bullet.js";
import { InputHandler } from "./input.js";
import { Sword } from "./sword.js";
import { Beam } from "./beam.js";
import { Explosion } from "./explosion.js";
import { ZigZagEnemy } from "./zigzagenemy.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const MAX_ENEMIES = 10;

let player;
let enemies = [];
let bullets = [];
let swords = [];
let beams = [];
let enemyBullets = [];
let explosions = [];

let input = new InputHandler();
let isGameOver = false;
let isGameRunning = false;
let score = 0;

// チャージ関連
let isCharging = false;
let chargeStartTime = 0;
let chargeLevel = 0;

// 無敵
let invincible = false;
let invincibleEffectAlpha = 0;

// キー連射防止
const keyPressed = {};

// UBW
let ubwActive = false;
let ubwTimer = 0;
let ubwDuration = 300;
let ubwSwords = [];
let ubwFade = 0;

// ------------------- 初期化 -------------------
function initGame() {
  player = new Player(canvas.width / 2, canvas.height / 2, canvas);
  enemies = [];
  bullets = [];
  swords = [];
  beams = [];
  enemyBullets = [];
  explosions = [];
  score = 0;
  isGameOver = false;
  invincible = false;
  invincibleEffectAlpha = 0;
  ubwActive = false;
  ubwSwords = [];
  ubwFade = 0;
}

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
  if (Math.random() < 0.5) enemies.push(new ZigZagEnemy(x, y, canvas));
  else enemies.push(new Enemy(x, y, canvas));
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
        explosions.push(new Explosion(e.x, e.y));
        score += 100;
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
        explosions.push(new Explosion(e.x, e.y));
        score += 150;
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
          explosions.push(new Explosion(e.x, e.y));
          score += 200;
        }
      }
    }
  }

  // 敵弾とプレイヤー
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const eb = enemyBullets[i];
    const dist = Math.hypot(player.x - eb.x, player.y - eb.y);
    if (dist < player.radius + eb.radius) {
      if (!invincible) isGameOver = true;
    }
  }

  // 敵とプレイヤー
  for (const e of enemies) {
    const dist = Math.hypot(player.x - e.x, player.y - e.y);
    if (dist < player.radius + e.radius) {
      if (!invincible) isGameOver = true;
    }
  }
}

// ------------------- チャージショット -------------------
function fireChargeShot(level) {
  const x = player.x;
  const y = player.y;
  const angle = player.angle;
  if (level === 1) {
    bullets.push(new Bullet(x, y, angle, canvas, { speed: 10, radius: 5, color: "white" }));
  } else if (level === 2) {
    bullets.push(new Bullet(x, y, angle, canvas, { speed: 14, radius: 10, color: "yellow" }));
  } else if (level === 3) {
    beams.push(new Beam(x, y, angle, canvas, { color: "orange", width: 10, length: 500, life: 60 }));
  }
}

// ------------------- ダッシュ -------------------
function dashForward(distance = 100) {
  player.x += Math.cos(player.angle) * distance;
  player.y += Math.sin(player.angle) * distance;
  clampPlayerPosition();
}
function dashBackward(distance = 100) {
  player.x -= Math.cos(player.angle) * distance;
  player.y -= Math.sin(player.angle) * distance;
  clampPlayerPosition();
}
function dashDiagonal(distance = 100) {
  const dir = Math.random() < 0.5 ? 1 : -1;
  const offsetAngle = (Math.random() - 0.5) * (Math.PI / 2);
  const angle = player.angle + offsetAngle;
  player.x += Math.cos(angle) * distance * dir;
  player.y += Math.sin(angle) * distance * dir;
  clampPlayerPosition();
}
function clampPlayerPosition() {
  player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
  player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));
}

// ------------------- UBW -------------------
function activateUBW() {
  if (ubwActive) return;
  ubwActive = true;
  ubwTimer = ubwDuration;
  ubwFade = 0;

  const swordCount = 50;
  for (let i = 0; i < swordCount; i++) {
    const angle = (Math.PI * 2 * i) / swordCount;
    const dist = 100 + Math.random() * 200;
    const x = player.x + Math.cos(angle) * dist;
    const y = player.y + Math.sin(angle) * dist;
    const sword = new Sword(x, y, angle, canvas, {
      color: "gold",
      speed: 0,
      length: 50,
      width: 6,
      homing: true,
      turnSpeed: 0.08,
    });
    ubwSwords.push(sword);
  }
}

function updateUBW() {
  if (!ubwActive) return;
  ubwTimer--;
  ubwFade = Math.min(1, ubwFade + 0.02);

  ubwSwords.forEach(s => s.update(enemies));

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    for (let s of ubwSwords) {
      const dist = Math.hypot(s.x - e.x, s.y - e.y);
      if (dist < e.radius + s.length / 2) {
        explosions.push(new Explosion(e.x, e.y));
        enemies.splice(i, 1);
        score += 300;
        break;
      }
    }
  }

  if (ubwTimer <= 0) {
    ubwActive = false;
    ubwSwords = [];
    ubwFade = 0;
  }
}

function drawUBW(ctx) {
  if (!ubwActive) return;
  const grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grd.addColorStop(0, `rgba(255, 80, 80, ${0.6 * ubwFade})`);
  grd.addColorStop(1, `rgba(50, 0, 0, ${0.8 * ubwFade})`);
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // STARBLADEX ロゴ
  ctx.save();
  const pulse = Math.sin(Date.now() / 200) * 0.5 + 0.5;
  const glow = 0.4 + pulse * 0.6;
  const fontSize = 100 + pulse * 10;
  const gradientText = ctx.createLinearGradient(
    canvas.width / 2 - 200,
    canvas.height / 2 - 100,
    canvas.width / 2 + 200,
    canvas.height / 2 + 100
  );
  gradientText.addColorStop(0, `rgba(255,200,50,${glow * ubwFade})`);
  gradientText.addColorStop(0.5, `rgba(255,255,255,${glow * ubwFade})`);
  gradientText.addColorStop(1, `rgba(255,50,50,${glow * ubwFade})`);

  ctx.font = `bold ${fontSize}px "Orbitron", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeStyle = `rgba(255,255,255,${0.8 * ubwFade})`;
  ctx.lineWidth = 4;
  ctx.strokeText("StarBladeX", canvas.width / 2, canvas.height / 2);
  ctx.fillStyle = gradientText;
  ctx.fillText("StarBladeX", canvas.width / 2, canvas.height / 2);
  ctx.restore();

  ubwSwords.forEach(s => s.draw(ctx));
}

// ------------------- ゲームループ -------------------
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawUBW(ctx);

  if (isGameRunning && !isGameOver) {
    player.update(input.keys);
    spawnEnemy();

    enemies.forEach(e => e.update(player.x, player.y));
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

    explosions = explosions.filter(ex => ex.active);
    bullets = bullets.filter(b => !b.isOutOfBounds());
    swords = swords.filter(s => !s.isOutOfBounds());
    enemyBullets = enemyBullets.filter(eb => !eb.isOutOfBounds());
    beams = beams.filter(bm => (bm.life === undefined ? true : --bm.life > 0));

    updateUBW();
    checkCollisions();
  }

  // プレイヤー & エフェクト
  player?.draw(ctx);

  // 🌟無敵エフェクト描画
  if (invincible) {
    invincibleEffectAlpha = Math.min(invincibleEffectAlpha + 0.05, 1);
  } else {
    invincibleEffectAlpha = Math.max(invincibleEffectAlpha - 0.05, 0);
  }

  if (invincibleEffectAlpha > 0 && player) {
    const time = Date.now() / 200;
    const waveRadius = player.radius * (3 + Math.sin(time) * 0.5);
    const gradient = ctx.createRadialGradient(player.x, player.y, player.radius, player.x, player.y, waveRadius);
    gradient.addColorStop(0, `rgba(255,255,255,${0.4 * invincibleEffectAlpha})`);
    gradient.addColorStop(1, `rgba(255,255,255,0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(player.x, player.y, waveRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  explosions.forEach(ex => ex.draw(ctx));
  enemies.forEach(e => e.draw(ctx));
  bullets.forEach(b => b.draw(ctx));
  swords.forEach(s => s.draw(ctx));
  beams.forEach(bm => bm.draw(ctx));
  enemyBullets.forEach(eb => eb.draw(ctx));

  // スコア
  ctx.fillStyle = "white";
  ctx.font = "20px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`SCORE: ${score}`, 20, 30);

  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "bold 48px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = "white";
    ctx.font = "28px monospace";
    ctx.fillText(`FINAL SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 60);
  }

  requestAnimationFrame(gameLoop);
}

// ------------------- キー入力 -------------------
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (!isGameRunning) {
      initGame();
      isGameRunning = true;
    } else {
      isGameRunning = !isGameRunning;
    }
  }

  if (!isGameRunning || isGameOver) return;
  if (keyPressed[e.key]) return;
  keyPressed[e.key] = true;

  if (e.key === "a" || e.key === "A") dashForward();
  if (e.key === "s" || e.key === "S") dashBackward();
  if (e.key === "d" || e.key === "D") dashDiagonal();

  if (e.key === "c" || e.key === "C") invincible = !invincible;

  if (e.key === " ") bullets.push(new Bullet(player.x, player.y, player.angle, canvas));

  if (e.key === "Shift") {
    const spreadCount = 5;
    const spreadAngle = 10 * (Math.PI / 180);
    for (let i = 0; i < spreadCount; i++)
      bullets.push(new Bullet(player.x, player.y, player.angle + (i - 2) * spreadAngle, canvas));
  }

  if (e.key === "z" || e.key === "Z") {
    const swordCount = 5;
    const randomRange = Math.PI / 3;
    for (let i = 0; i < swordCount; i++) {
      const offset = (Math.random() - 0.5) * randomRange;
      swords.push(new Sword(player.x, player.y, player.angle + offset, canvas, { color: "cyan", speed: 15, length: 40, width: 6 }));
    }
  }

  if (e.key === "x" || e.key === "X") {
    beams.push(new Beam(player.x, player.y, player.angle, canvas, { color: "lime", width: 6, length: 500, life: 20 }));
  }

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

  if (e.key === "b" || e.key === "B") {
    const count = 12;
    const spread = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
      swords.push(new Sword(player.x, player.y, i * spread, canvas, { color: "magenta", speed: 6, length: 50, width: 6, homing: true, turnSpeed: 0.05 }));
    }
  }

  if ((e.key === "n" || e.key === "N") && !isCharging) {
    isCharging = true;
    chargeStartTime = Date.now();
  }

  if (e.key === "m" || e.key === "M") {
    explosions.push(new Explosion(player.x, player.y));
    const blastRadius = 150;
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      if (Math.hypot(player.x - e.x, player.y - e.y) < blastRadius) {
        enemies.splice(i, 1);
        score += 250;
      }
    }
  }

  if (e.key === "u" || e.key === "U") activateUBW();
});

window.addEventListener("keyup", (e) => {
  keyPressed[e.key] = false;
  if (e.key === "n" || e.key === "N") {
    isCharging = false;
    chargeLevel = Math.min(3, Math.floor((Date.now() - chargeStartTime) / 1000) + 1);
    fireChargeShot(chargeLevel);
  }
});

gameLoop();

export function startGame() {
  initGame();
  isGameRunning = true;
}










