export class Player {
  constructor(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.angle = 0;        // 向き
    this.speed = 5;        // 移動速度
    this.canvas = canvas;

    // === 当たり判定用 ===
    this.width = 40;       // 横幅（翼を含めたサイズ）
    this.height = 20;      // 縦幅（胴体）
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

      // 画面外制限（矩形判定にあわせる）
      this.x = Math.min(Math.max(this.x, this.width/2), this.canvas.width - this.width/2);
      this.y = Math.min(Math.max(this.y, this.height/2), this.canvas.height - this.height/2);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // ===== 胴体 =====
    ctx.fillStyle = "silver"; // メタリック
    ctx.beginPath();
    ctx.moveTo(20, 0);    // 機首
    ctx.lineTo(-15, -7);  // 左後方
    ctx.lineTo(-10, -3); 
    ctx.lineTo(-10,  3); 
    ctx.lineTo(-15,  7);  // 右後方
    ctx.closePath();
    ctx.fill();

    // ===== 翼（当たり判定幅に合わせる：左右にしっかり広げる） =====
    ctx.fillStyle = "gray";
    ctx.beginPath();
    ctx.moveTo(-8, -3);
    ctx.lineTo(-this.width/2, -this.height/2);
    ctx.lineTo(-12, -2);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-8, 3);
    ctx.lineTo(-this.width/2, this.height/2);
    ctx.lineTo(-12, 2);
    ctx.closePath();
    ctx.fill();

    // ===== コクピット =====
    ctx.fillStyle = "cyan";
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // ===== エンジン光 =====
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(-15, -3);
    ctx.lineTo(-25, 0);
    ctx.lineTo(-15, 3);
    ctx.closePath();
    ctx.fill();

    // ===== 主砲（機首） =====
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(20, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    // ===== 副砲（翼の先端） =====
    ctx.beginPath();
    ctx.arc(-this.width/2 + 5, -this.height/2 + 3, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-this.width/2 + 5, this.height/2 - 3, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // ===== 当たり判定の目安（デバッグ用で表示したい場合） =====
    /*
    ctx.save();
    ctx.strokeStyle = "lime";
    ctx.strokeRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    ctx.restore();
    */
  }

  // 当たり判定（矩形）用
  getHitbox() {
    return {
      x: this.x - this.width/2,
      y: this.y - this.height/2,
      w: this.width,
      h: this.height
    };
  }
}
