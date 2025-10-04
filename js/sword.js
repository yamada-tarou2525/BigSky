export class Sword {
  constructor(x, y, angle, canvas, options = {}) {
    this.x = x;
    this.y = y;
    this.angle = angle; // 飛ぶ方向
    this.speed = options.speed || 12;
    this.length = options.length || 40;
    this.width = options.width || 6;
    this.color = options.color || "cyan";
    this.canvas = canvas;

    this.rotation = angle; // 回転角（描画用）
    this.rotationSpeed = 0.3; // 回転速度（弧度）
  }

  update() {
    // 飛ぶ方向へ移動
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    // 回転アニメーション
    this.rotation += this.rotationSpeed;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.fillStyle = this.color;
    ctx.fillRect(-this.length / 2, -this.width / 2, this.length, this.width);

    ctx.restore();
  }

  isOutOfBounds() {
    return (
      this.x < -this.length ||
      this.x > this.canvas.width + this.length ||
      this.y < -this.length ||
      this.y > this.canvas.height + this.length
    );
  }
}
