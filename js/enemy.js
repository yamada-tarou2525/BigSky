export class Enemy {
  constructor(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.speed = 2;
    this.radius = 10;
    this.canvas = canvas;
  }

  update(targetX, targetY) {
    let angle = Math.atan2(targetY - this.y, targetX - this.x);
    this.x += Math.cos(angle) * this.speed;
    this.y += Math.sin(angle) * this.speed;
  }

  draw(ctx) {
    // === 本体（コア部分） ===
    ctx.fillStyle = "crimson";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // === ウイルスのトゲトゲ（放射状のスパイク） ===
    ctx.strokeStyle = "darkred";
    ctx.lineWidth = 2;
    let spikes = 8; // トゲの数
    for (let i = 0; i < spikes; i++) {
      let angle = (Math.PI * 2 / spikes) * i;
      let sx = this.x + Math.cos(angle) * this.radius;
      let sy = this.y + Math.sin(angle) * this.radius;
      let ex = this.x + Math.cos(angle) * (this.radius + 5);
      let ey = this.y + Math.sin(angle) * (this.radius + 5);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    }

    // === 顔（目と口） ===
    ctx.fillStyle = "black";
    // 左目
    ctx.beginPath();
    ctx.arc(this.x - 4, this.y - 2, 2, 0, Math.PI * 2);
    ctx.fill();
    // 右目
    ctx.beginPath();
    ctx.arc(this.x + 4, this.y - 2, 2, 0, Math.PI * 2);
    ctx.fill();
    // 口（ちょっと笑ってる）
    ctx.beginPath();
    ctx.arc(this.x, this.y + 2, 4, 0, Math.PI);
    ctx.stroke();
  }
}

