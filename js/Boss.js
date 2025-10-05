export class BossEnemy {
  constructor(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.radius = 50;
    this.hp = 50;  // HP高い
    this.color = "darkred";
    this.speed = 1.2;
  }

  update(playerX, playerY) {
    // プレイヤーにゆっくり近づく
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const len = Math.hypot(dx, dy);
    if (len > 0) {
      this.x += (dx / len) * this.speed;
      this.y += (dy / len) * this.speed;
    }
  }

  draw(ctx) {
    // 本体
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // HPバー
    ctx.fillStyle = "black";
    ctx.fillRect(this.x - 50, this.y - this.radius - 20, 100, 10);
    ctx.fillStyle = "lime";
    ctx.fillRect(this.x - 50, this.y - this.radius - 20, (this.hp / 50) * 100, 10);
  }
}
