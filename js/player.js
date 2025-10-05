export class Player {
  constructor(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.angle = 0;       // 向き
    this.speed = 5;       // 移動速度
    this.canvas = canvas;
    this.radius = 12;     // サイズ感（当たり判定用）
  }

  update(keys) {
    let dx = 0, dy = 0;
    if (keys["ArrowLeft"])  dx -= 1;
    if (keys["ArrowRight"]) dx += 1;
    if (keys["ArrowUp"])    dy -= 1;
    if (keys["ArrowDown"])  dy += 1;

    if (dx !== 0 || dy !== 0) {
      // 進行方向に角度を設定
      this.angle = Math.atan2(dy, dx);

      // 移動方向を正規化してスピード一定化
      let len = Math.sqrt(dx * dx + dy * dy);
      this.x += this.speed * (dx / len);
      this.y += this.speed * (dy / len);

      // 画面外に出ないよう制限
      this.x = Math.min(Math.max(this.x, this.radius), this.canvas.width - this.radius);
      this.y = Math.min(Math.max(this.y, this.radius), this.canvas.height - this.radius);
    }
  }

  draw(ctx) {
    // 本体（青い三角形）
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(
      this.x + Math.cos(this.angle) * this.radius * 1.5,
      this.y + Math.sin(this.angle) * this.radius * 1.5
    );
    ctx.lineTo(
      this.x + Math.cos(this.angle + Math.PI * 2 / 3) * this.radius,
      this.y + Math.sin(this.angle + Math.PI * 2 / 3) * this.radius
    );
    ctx.lineTo(
      this.x + Math.cos(this.angle - Math.PI * 2 / 3) * this.radius,
      this.y + Math.sin(this.angle - Math.PI * 2 / 3) * this.radius
    );
    ctx.closePath();
    ctx.fill();

    // 輪郭
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 発射口（中央）
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
      this.x + Math.cos(this.angle) * this.radius * 1.5,
      this.y + Math.sin(this.angle) * this.radius * 1.5,
      3, 0, Math.PI * 2
    );
    ctx.fill();

    // 発射口（両翼：副砲）
    for (let offset of [Math.PI/2.5, -Math.PI/2.5]) {
      ctx.beginPath();
      ctx.arc(
        this.x + Math.cos(this.angle + offset) * this.radius,
        this.y + Math.sin(this.angle + offset) * this.radius,
        3, 0, Math.PI * 2
      );
      ctx.fill();
    }
  }
}
