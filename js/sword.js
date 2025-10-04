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
    this.rotationSpeed = options.rotationSpeed ?? 0.3; // 回転速度

    // 🔥 ホーミング機能（オプション）
    this.homing = options.homing || false; // 追尾ON/OFF
    this.turnSpeed = options.turnSpeed || 0.05; // 旋回速度
  }

  /**
   * @param {Array} enemies - 敵の配列を受け取る（gameLoopから渡す）
   */
  update(enemies = []) {
    // 💡ホーミングONの場合、最寄りの敵の方向に徐々に角度を変える
    if (this.homing && enemies.length > 0) {
      let target = null;
      let minDist = Infinity;

      // 最も近い敵を探す
      for (const e of enemies) {
        const dist = Math.hypot(e.x - this.x, e.y - this.y);
        if (dist < minDist) {
          minDist = dist;
          target = e;
        }
      }

      // 目標方向を計算して徐々に回転
      if (target) {
        const targetAngle = Math.atan2(target.y - this.y, target.x - this.x);
        let angleDiff = targetAngle - this.angle;

        // [-PI, PI] の範囲に補正
        angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));

        // 角度を少しずつ修正
        const delta = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), this.turnSpeed);
        this.angle += delta;
      }
    }

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
