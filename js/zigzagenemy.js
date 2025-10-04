export class ZigZagEnemy extends Enemy {
    constructor(x, y, canvas, speed = 2, amplitude = 50, period = 120) {
      super(x, y, canvas);
      this.startX = x;        // 横の基準
      this.speed = speed;     // 縦速度
      this.amplitude = amplitude;
      this.period = period;   // サイクルにかかるフレーム数
      this.frameCount = 0;
    }
  
    update(targetX, targetY) {
      // 縦は通常通りターゲットに向かう
      let angle = Math.atan2(targetY - this.y, targetX - this.x);
      this.y += Math.sin(angle) * this.speed;
      
      // 横はジグザグ
      this.x = this.startX + Math.sin((2 * Math.PI / this.period) * this.frameCount) * this.amplitude;
  
      this.frameCount++;
  
      // 画面外チェック（オプション）
      if (this.y > this.canvas.height + this.radius) {
        this.y = -this.radius;
        this.startX = Math.random() * this.canvas.width;
      }
    }
  }
  
  