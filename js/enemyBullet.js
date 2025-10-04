export class EnemyBullet {
  constructor(x, y, angle, canvas) {
    this.x = x;
    this.y = y;
    this.speed = 4;
    this.dx = Math.cos(angle) * this.speed;
    this.dy = Math.sin(angle) * this.speed;
    this.radius = 4;
    this.canvas = canvas;
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;
  }
  draw(ctx) {
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  isOutOfBounds() {
    return (
      this.x < 0 || this.x > this.canvas.width ||
      this.y < 0 || this.y > this.canvas.height
    );
  }
}
