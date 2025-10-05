// sword.js
export class Sword {
  constructor(x, y, angle, canvas, options = {}) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = options.speed || 12;
    this.length = options.length || 70;
    this.width = options.width || 12;
    this.canvas = canvas;

    this.rotation = angle;
    this.rotationSpeed = options.rotationSpeed ?? 0.25;

    // ホーミング設定（任意）
    this.homing = options.homing || false;
    this.turnSpeed = options.turnSpeed || 0.05;

    // パーティクル用
    this.particles = [];
  }

  update(enemies = []) {
    // ホーミング処理
    if (this.homing && enemies.length > 0) {
      let target = null;
      let minDist = Infinity;
      for (const e of enemies) {
        const dist = Math.hypot(e.x - this.x, e.y - this.y);
        if (dist < minDist) {
          minDist = dist;
          target = e;
        }
      }

      if (target) {
        const targetAngle = Math.atan2(target.y - this.y, target.x - this.x);
        let angleDiff = targetAngle - this.angle;
        angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
        const delta = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), this.turnSpeed);
        this.angle += delta;
      }
    }

    // 飛行
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.rotation += this.rotationSpeed;

    // パーティクル更新
    this.particles.forEach(p => p.update());
    this.particles = this.particles.filter(p => p.life > 0);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    const bladeLength = this.length;
    const bladeWidth = this.width;

    // =====================
    // 🟡 刀身部分（エクスカリバー風）
    // =====================
    const gradient = ctx.createLinearGradient(-bladeLength / 2, 0, bladeLength / 2, 0);
    gradient.addColorStop(0.0, "#e0c65a");
    gradient.addColorStop(0.25, "#f5e17c");
    gradient.addColorStop(0.45, "#1e3fa9");
    gradient.addColorStop(0.55, "#1e3fa9");
    gradient.addColorStop(0.75, "#f5e17c");
    gradient.addColorStop(1.0, "#e0c65a");

    // 刃メイン
    ctx.fillStyle = gradient;
    ctx.fillRect(-bladeLength / 2, -bladeWidth / 2, bladeLength, bladeWidth);

    // 先端を鋭く（多角形）
    ctx.beginPath();
    ctx.moveTo(bladeLength / 2, 0);
    ctx.lineTo(bladeLength / 2 - bladeWidth * 0.6, -bladeWidth / 2);
    ctx.lineTo(bladeLength / 2 - bladeWidth * 0.6, bladeWidth / 2);
    ctx.closePath();
    ctx.fillStyle = "#e0c65a";
    ctx.fill();

    // =====================
    // 🟦 鍔（つば）部分：翼型＋金縁
    // =====================
    const guardWidth = bladeWidth * 3;
    const guardHeight = bladeWidth * 0.8;

    // 鍔のベース（青）
    ctx.beginPath();
    ctx.moveTo(-bladeWidth / 2, -guardHeight / 2);
    ctx.lineTo(-bladeWidth / 2 - guardWidth / 2, -guardHeight);
    ctx.lineTo(-bladeWidth / 2 - guardWidth / 2, guardHeight);
    ctx.lineTo(-bladeWidth / 2, guardHeight / 2);
    ctx.closePath();

    const guardGrad = ctx.createLinearGradient(0, -guardHeight, 0, guardHeight);
    guardGrad.addColorStop(0, "#223ea6");
    guardGrad.addColorStop(1, "#0f2a7f");
    ctx.fillStyle = guardGrad;
    ctx.fill();

    // 金の縁取り
    ctx.strokeStyle = "#f5d142";
    ctx.lineWidth = 2;
    ctx.stroke();

    // =====================
    // 🟦 グリップ部分（持ち手）
    // =====================
    const gripLength = bladeWidth * 1.5;
    const gripWidth = bladeWidth * 0.4;
    const gripGrad = ctx.createLinearGradient(-bladeLength / 2 - gripLength, 0, -bladeLength / 2, 0);
    gripGrad.addColorStop(0, "#1a2d7b");
    gripGrad.addColorStop(1, "#233fa9");
    ctx.fillStyle = gripGrad;
    ctx.fillRect(-bladeLength / 2 - gripLength, -gripWidth / 2, gripLength, gripWidth);

    // グリップ末端に金の宝石風エンド
    ctx.beginPath();
    ctx.arc(-bladeLength / 2 - gripLength - 2, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#f5d142";
    ctx.fill();

    ctx.restore();

    // パーティクル描画
    this.particles.forEach(p => p.draw(ctx));
  }

  isOutOfBounds() {
    return (
      this.x < -this.length ||
      this.x > this.canvas.width + this.length ||
      this.y < -this.length ||
      this.y > this.canvas.height + this.length
    );
  }

  // 💥 ヒット時パーティクル
  hitEffect() {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      this.particles.push(
        new Particle(
          this.x,
          this.y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          ["#f5d142", "#fff", "#9ddfff"][Math.floor(Math.random() * 3)]
        )
      );
    }
  }
}

// ✨ パーティクル
class Particle {
  constructor(x, y, dx, dy, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.life = 30;
    this.color = color;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.life--;
    this.dy += 0.05; // 重力
    this.dx *= 0.98; // 減速
  }

  draw(ctx) {
    ctx.globalAlpha = this.life / 30;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

