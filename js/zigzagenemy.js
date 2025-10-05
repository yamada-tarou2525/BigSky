export class ZigZagEnemy {
  constructor(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.radius = 15;
    this.speed = 2;

    // ジグザグ用
    this.zigzagAmplitude = 100;
    this.zigzagFrequency = 0.1;
    this.t = 0;
    this.prevX = x;
    this.prevY = y;
    this.angle = 0;  // 移動方向（描画用）
  }

  update(playerX, playerY) {
    this.t += 1;

    this.prevX = this.x;
    this.prevY = this.y;

    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const angleToPlayer = Math.atan2(dy, dx);

    const offset = Math.sin(this.t * this.zigzagFrequency) * this.zigzagAmplitude;

    const moveX = Math.cos(angleToPlayer) * this.speed - Math.sin(angleToPlayer) * (offset * 0.02);
    const moveY = Math.sin(angleToPlayer) * this.speed + Math.cos(angleToPlayer) * (offset * 0.02);

    this.x += moveX;
    this.y += moveY;

    this.angle = Math.atan2(this.y - this.prevY, this.x - this.prevX);

    this.x = Math.min(Math.max(this.x, this.radius), this.canvas.width - this.radius);
    this.y = Math.min(Math.max(this.y, this.radius), this.canvas.height - this.radius);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // === 本体（悪の宇宙船） ===
    // 機体グラデーション
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
    grad.addColorStop(0, "#ff4444"); // 中央赤
    grad.addColorStop(0.7, "#880000"); // 外側濃い赤
    grad.addColorStop(1, "#330000"); // 端を暗く
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(this.radius, 0);            // 機首
    ctx.lineTo(-this.radius * 0.6, -this.radius * 0.7);  // 左翼
    ctx.lineTo(-this.radius * 0.3, -this.radius * 0.2);  
    ctx.lineTo(-this.radius * 0.3, this.radius * 0.2);   
    ctx.lineTo(-this.radius * 0.6, this.radius * 0.7);   // 右翼
    ctx.closePath();
    ctx.fill();

    // === ハイライト（光沢感） ===
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(this.radius * 0.2, -this.radius * 0.1);
    ctx.lineTo(this.radius * 0.8, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.radius * 0.2, this.radius * 0.1);
    ctx.lineTo(this.radius * 0.8, 0);
    ctx.stroke();

    // === 機首に光る目（オレンジ） ===
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(this.radius, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // === 移動方向線（デバッグ／残すなら） ===
    /*
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x + Math.cos(this.angle) * this.radius * 2,
      this.y + Math.sin(this.angle) * this.radius * 2
    );
    ctx.stroke();
    */
  }
}

