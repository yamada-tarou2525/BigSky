export class Enemy {
  constructor(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.speed = 2;
    this.radius = 10;
    this.canvas = canvas;

    this.shootInterval = 1000; // 発射間隔(ms)
    this.lastShotTime = 0;     // 最後に撃った時刻
    this.bullets = [];         // 敵の弾を管理する配列
  }

  update(targetX, targetY, deltaTime) {
    // ターゲット（プレイヤー）に追尾
    let angle = Math.atan2(targetY - this.y, targetX - this.x);
    this.x += Math.cos(angle) * this.speed;
    this.y += Math.sin(angle) * this.speed;

    // 弾の更新
    this.bullets.forEach(bullet => bullet.update());
    this.bullets = this.bullets.filter(b => !b.isOutOfBounds());

    // 一定間隔で弾を発射
    this.lastShotTime += deltaTime;
    if (this.lastShotTime >= this.shootInterval) {
      this.shoot(targetX, targetY);
      this.lastShotTime = 0;
    }
  }

  shoot(targetX, targetY) {
    let angle = Math.atan2(targetY - this.y, targetX - this.x);
    this.bullets.push(new EnemyBullet(this.x, this.y, angle, this.canvas));
  }

  draw(ctx) {
    // 敵本体
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // 弾の描画
    this.bullets.forEach(bullet => bullet.draw(ctx));
  }
}
