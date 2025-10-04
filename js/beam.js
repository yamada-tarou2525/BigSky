export class Beam {
  constructor(x, y, angle, canvas, options = {}) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.canvas = canvas;

    this.length = options.length || 400; // ビームの長さ
    this.width = options.width || 4;     // 太さ
    this.color = options.color || "lime";
    this.duration = options.duration || 15; // 表示フレーム数（15 = 0.25秒）

    this.life = this.duration; // カウントダウン
  }

  update() {
    this.life--;
  }

  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x + Math.cos(this.angle) * this.length,
      this.y + Math.sin(this.angle) * this.length
    );
    ctx.stroke();
    ctx.restore();
  }

  isExpired() {
    return this.life <= 0;
  }
}
