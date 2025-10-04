// explosion.js
export class Explosion {
  constructor(x, y, radius = 0, maxRadius = 150, color = "orange") {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.maxRadius = maxRadius;
    this.color = color;
    this.active = true;
  }

  update() {
    // 爆発の半径を広げる
    this.radius += 8;
    if (this.radius >= this.maxRadius) {
      this.active = false;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = 0.5;

    // グラデーションで爆発っぽく
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius
    );
    gradient.addColorStop(0, "yellow");
    gradient.addColorStop(0.4, this.color);
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
