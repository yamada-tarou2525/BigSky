export class ZigZagEnemy extends Enemy {
    constructor(x, y, canvas, speed = 2, amplitude = 50, frequency = 0.05) {
      super(x, y, canvas);
      this.startX = x;           // 横の基準位置
      this.speed = speed;        // 縦の速度
      this.amplitude = amplitude;
      this.frequency = frequency;
      this.time = 0;
    }
  
    update(targetX, targetY) {
      // 縦は通常通り下方向
      this.y += this.speed;
  
      // 横はジグザグ
      this.x = this.startX + Math.sin(this.time * this.frequency) * this.amplitude;
  
      this.time++;
  
      // 画面外に出たらリセット
      if (this.y > this.canvas.height + this.radius) {
        this.y = -this.radius;
        this.startX = Math.random() * this.canvas.width;
      }
    }
  }
  