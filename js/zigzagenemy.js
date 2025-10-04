export class ZigZagEnemy extends Enemy {
    constructor(x, y, canvas, speed = 2, amplitude = 50, frequency = 0.05) {
      super(x, y, canvas);
      this.baseY = y;           // 基準Y座標
      this.amplitude = amplitude; // 振幅
      this.frequency = frequency; // 周波数
      this.speed = speed;
      this.time = 0;
    }
  
    update(targetX, targetY) {
      // 基本は下に向かう（例：y軸）
      this.y += this.speed;
  
      // 横方向にジグザグ
      this.x = this.baseY + Math.sin(this.time * this.frequency) * this.amplitude;
  
      this.time++;
  
      // 画面外に出たらリセット
      if (this.y > this.canvas.height + this.radius) {
        this.y = -this.radius;
        this.baseY = Math.random() * this.canvas.width;
      }
    }
  }
  