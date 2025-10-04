import { Player } from "./player.js";
import { Bullet } from "./bullet.js";

export class Cheat extends player {
  constructor(x, y, canvas) {
    super(x, y, canvas);
    this.cheatActive = false;   // チートON/OFFを管理するフラグ
    this.lastCKey = false;      // Cキーの前回の状態を記録（連打判定防止用）
  }

  toggleCheat(keys) {
    // 今フレーム C が押されているか？
    const isCPressed = keys["c"] || keys["C"];

    // 前回押されていなくて、今回押されたならトグル切り替え
    if (isCPressed && !this.lastCKey) {
      this.cheatActive = !this.cheatActive;
      console.log("Cheat Active:", this.cheatActive);
    }

    // 状態を記録
    this.lastCKey = isCPressed;
  }

  cheatShoot() {
    const bulletCount = 12; // 撃つ弾の数
    for (let i = 0; i < bulletCount; i++) {
      const angle = (Math.PI * 2 / bulletCount) * i;
      this.bullets.push(new Bullet(this.x, this.y, angle, this.canvas));
    }
  }

  update(keys) {
    // 通常のPlayerの動き
    super.update(keys);

    // チートON/OFF切り替え処理
    this.toggleCheat(keys);

    // チート中なら自動で全方向弾を発射
    if (this.cheatActive) {
      this.cheatShoot();
    }
  }
}
