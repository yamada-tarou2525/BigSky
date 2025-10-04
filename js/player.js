export class Player {
  constructor(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.speed = 5;
    this.canvas = canvas;
    this.radius = 10;
  }
  update(keys) {
    let dx = 0, dy = 0;
    if (keys["ArrowLeft"])  dx -= 1;
    if (keys["ArrowRight"]) dx += 1;
    if (keys["ArrowUp"])    dy -= 1;
    if (keys["ArrowDown"])  dy += 1;

    if (dx !== 0 || dy !== 0) {
      this.angle = Math.atan2(dy, dx);
      let len = Math.sqrt(dx*dx + dy*dy);
      this.x += this.speed * (dx / len);
      this.y += this.speed * (dy / len);

      // 画面内制限
      this.x = Math.min(Math.max(this.x, this.radius), this.canvas.width - this.radius);
      this.y = Math.min(Math.max(this.y, this.radius), this.canvas.height - this.radius);
    }
  }
  draw(ctx) {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x + Math.cos(this.angle) * this.radius * 2,
      this.y + Math.sin(this.angle) * this.radius * 2
    );
    ctx.stroke();
  }
}