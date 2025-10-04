export class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = 150; // 爆発範囲
    this.growth = 10;     // 1フレームでの拡大量
    this.active = true;   // trueの間だけ描画
  }

  update() {
    if (!this.active) return;
    this.radius += this.growth;
    if (this.radius >= this.maxRadius) {
      this.active = false; // 一定以上で描画終了
    }
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // 透明度を半透明にしてアニメーション風に
    ctx.fillStyle = `rgba(255, 165, 0, ${1 - this.radius / this.maxRadius})`;
    ctx.fill();
  }
}

