// zigzagenemy.js
export class ZigZagEnemy {
    constructor(x, y, canvas) {
      this.x = x;
      this.y = y;
      this.canvas = canvas;
      this.radius = 15;
      this.speed = 2;
      
      // ジグザグ用
      this.angle = 0;          // 移動方向
      this.zigzagAmplitude = 100; // ジグザグ幅 50
      this.zigzagFrequency = 5; // ジグザグの速さ 0.05
      this.startX = x;         // 初期x座標
      this.t = 0;              // 時間パラメータ
    }
  
    update(playerX, playerY) {
      this.t += 1;
  
      // プレイヤー方向に向かう角度
      const dx = playerX - this.x;
      const dy = playerY - this.y;
      const angleToPlayer = Math.atan2(dy, dx);
  
      // ジグザグオフセット（正弦波）
      const offset = Math.sin(this.t * this.zigzagFrequency) * this.zigzagAmplitude;
  
      // x, y の移動
      this.x += Math.cos(angleToPlayer) * this.speed - Math.sin(angleToPlayer) * (offset * 0.02);
      this.y += Math.sin(angleToPlayer) * this.speed + Math.cos(angleToPlayer) * (offset * 0.02);
  
      // 画面内制限
      this.x = Math.min(Math.max(this.x, this.radius), this.canvas.width - this.radius);
      this.y = Math.min(Math.max(this.y, this.radius), this.canvas.height - this.radius);
    }
  
    draw(ctx) {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
  
      // ジグザグの向き表示（線）
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x + Math.cos(this.angle) * this.radius * 2,
        this.y + Math.sin(this.angle) * this.radius * 2
      );
      ctx.stroke();
    }
  }
  