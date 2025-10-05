// game.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 星クラス
class Star {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1; // 星の大きさ
    this.speed = Math.random() * 1 + 0.5; // 落下スピード
    this.alpha = Math.random(); // 輝き
  }

  update() {
    this.y += this.speed;
    if (this.y > canvas.height) {
      this.reset();
      this.y = 0;
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// 星を大量に作成
const stars = [];
for (let i = 0; i < 200; i++) {
  stars.push(new Star());
}

// 背景の描画ループ
function animate() {
  // グラデーション背景
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#020024");   // 上の濃い青
  gradient.addColorStop(1, "#090979");   // 下の紫青
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 星を描画
  for (let star of stars) {
    star.update();
    star.draw();
  }
  

  requestAnimationFrame(animate);
}

animate();
