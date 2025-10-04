class EnemyBullet {
  constructor(x, y, angle, canvas) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.radius = 4;
    this.angle = angle;
    this.canvas = canvas;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  isOutOfBounds() {
    return (
      this.x < 0 ||
      this.x > this.canvas.width ||
      this.y < 0 ||
      this.y > this.canvas.height
    );
  }
}
