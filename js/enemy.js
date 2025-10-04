export class Enemy {
  constructor(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.speed = 2;
    this.radius = 10;
    this.canvas = canvas;
  }
  update(targetX, targetY) {
    let angle = Math.atan2(targetY - this.y, targetX - this.x);
    this.x += Math.cos(angle) * this.speed;
    this.y += Math.sin(angle) * this.speed;
  }
  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
