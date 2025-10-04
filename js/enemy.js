import { EnemyBullet } from "./EnemyBullet.js";

export class Enemy {
  constructor(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.speed = 2;
    this.radius = 10;
    this.canvas = canvas;

    this.shootCooldown = 120; // 約2秒ごと
    this.shootTimer = 0;
  }

  update(targetX, targetY, enemyBullets) {
    let angle = Math.atan2(targetY - this.y, targetX - this.x);
    this.x += Math.cos(angle) * this.speed;
    this.y += Math.sin(angle) * this.speed;

    // 攻撃タイマー
    if (this.shootTimer <= 0) {
      let bulletAngle = Math.atan2(targetY - this.y, targetX - this.x);
      enemyBullets.push(new EnemyBullet(this.x, this.y, bulletAngle, this.canvas));
      this.shootTimer = this.shootCooldown;
    } else {
      this.shootTimer--;
    }
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
