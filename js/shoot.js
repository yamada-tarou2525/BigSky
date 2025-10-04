import { Bullet } from "./js/Bullet.js";

export const bullets = [];

export function shootSpread(x, y, angle, canvas) {
  const spreadCount = 5;
  const spreadAngle = 30 * (Math.PI / 180);

  for (let i = 0; i < spreadCount; i++) {
    const offset = (i - (spreadCount - 1) / 2) * (spreadAngle / (spreadCount - 1));
    const bulletAngle = angle + offset;
    bullets.push(new Bullet(x, y, bulletAngle, canvas));
  }
}

export function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    if (bullets[i].isOutOfBounds()) {
      bullets.splice(i, 1);
    }
  }
}

export function drawBullets(ctx) {
  bullets.forEach(b => b.draw(ctx));
}
