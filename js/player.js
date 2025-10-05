export class Player {
  constructor(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.angle = 0;       // 向き
    this.speed = 5;       // 移動速度
    this.canvas = canvas;
    this.radius = 14;     // 機体サイズ
  }

  update(keys) {
    let dx = 0, dy = 0;
    if (keys["ArrowLeft"])  dx -= 1;
    if (keys["ArrowRight"]) dx += 1;
    if (keys["ArrowUp"])    dy -= 1;
    if (keys["ArrowDown"])  dy += 1;

    if (dx !== 0 || dy !== 0) {
      this.angle = Math.atan2(dy, dx);
      let len = Math.sqrt(dx * dx + dy * dy);
      this.x += this.speed * (dx / len);
      this.y += this.speed * (dy / len);

      // 画面外に出ないよう制限
      this.x = Math.min(Math.max(this.x, this.radius), this.canvas.width - this.radius);
      this.y = Math.min(Math.max(this.y, this.radius), this.canvas.height - this.radius);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // ===== 機体の胴体 =====
    ctx.fillStyle = "silver"; // メタリックなボディ
    ctx.beginPath();
    ctx.moveTo(20, 0);   // 機首
    ctx.lineTo(-15, -8); // 左後ろ
    ctx.lineTo(-10, -3); 
    ctx.lineTo(-10,  3); 
    ctx.lineTo(-15,  8); // 右後ろ
    ctx.closePath();
    ctx.fill();

    // ===== 両翼 =====
    ctx.fillStyle = "gray";
    ctx.beginPath();
    ctx.moveTo(-8, -3);
    ctx.lineTo(-20, -10);
    ctx.lineTo(-15, -3);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-8, 3);
    ctx.lineTo(-20, 10);
    ctx.lineTo(-15, 3);
    ctx.closePath();
    ctx.fill();

    // ===== コクピット（青く光る） =====
    ctx.fillStyle = "cyan";
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // ===== エンジン光（後方に赤い炎っぽさ） =====
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(-15, -3);
    ctx.lineTo(-25, 0);
    ctx.lineTo(-15, 3);
    ctx.closePath();
    ctx.fill();

    // ===== 砲口（機首に赤い点） =====
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(20, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    // ===== 副砲（両翼に小さな赤点） =====
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(-5, -6, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-5, 6, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
