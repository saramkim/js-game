// import { startAnimation } from './Animation';

let longTabTimer: NodeJS.Timeout;

export class InputHandler {
  keys: string[];
  game: any;
  touchX: number;
  touchY: number;
  touchTreshold: number;

  constructor(game: any) {
    this.keys = [];
    this.game = game;
    this.touchX = 0;
    this.touchY = 0;
    this.touchTreshold = 30;

    //  on PC
    window.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
        case 'ArrowRight':
        case 'KeyD':
        case 'ArrowUp':
        case 'KeyW':
        case 'ArrowDown':
        case 'KeyS':
        case 'Space':
        case 'Escape':
          if (this.keys.indexOf(e.code) === -1) this.keys.push(e.code);
          break;
        case 'Enter':
          if (this.game.gameOver) this.game.restart();
          break;
      }
    });
    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
        case 'ArrowRight':
        case 'KeyD':
        case 'ArrowUp':
        case 'KeyW':
        case 'ArrowDown':
        case 'KeyS':
        case 'Space':
        case 'Escape':
          this.keys.splice(this.keys.indexOf(e.code), 1);
          break;
      }
    });

    // on Mobile
    window.addEventListener('touchstart', (e) => {
      this.touchX = e.changedTouches[0].clientX;
      this.touchY = e.changedTouches[0].clientY;
      if (
        this.touchX < window.innerWidth / 3 &&
        this.keys.indexOf('touchLeft') === -1
      ) {
        this.keys.push('touchLeft');
      } else if (
        this.touchX > (window.innerWidth * 2) / 3 &&
        this.keys.indexOf('touchRight') === -1
      ) {
        this.keys.push('touchRight');
      } else {
        this.keys.push('touchCenterX');
      }
      if (
        this.touchY < (window.innerHeight * 4) / 6 &&
        this.touchY > window.innerHeight / 2 &&
        this.keys.indexOf('touchDown') === -1
      ) {
        this.keys.push('touchUp');
      } else if (
        this.touchY > (window.innerHeight * 5) / 6 &&
        this.keys.indexOf('touchDown') === -1
      ) {
        this.keys.push('touchDown');
      } else {
        this.keys.push('touchCenterY');
      }
    });
    window.addEventListener('touchmove', (e) => {
      this.touchX = e.changedTouches[0].clientX;
      this.touchY = e.changedTouches[0].clientY;
      if (
        this.touchX < window.innerWidth / 3 &&
        this.keys.indexOf('touchLeft') === -1
      ) {
        this.keys.splice(this.keys.indexOf('touchRight'), 1);
        this.keys.push('touchLeft');
      } else if (
        this.touchX > (window.innerWidth * 2) / 3 &&
        this.keys.indexOf('touchRight') === -1
      ) {
        this.keys.splice(this.keys.indexOf('touchLeft'), 1);
        this.keys.push('touchRight');
      }
      if (
        this.touchY < (window.innerHeight * 4) / 6 &&
        this.keys.indexOf('touchUp') === -1
      ) {
        this.keys.splice(this.keys.indexOf('touchDown'), 1);
        this.keys.push('touchUp');
      } else if (
        this.touchY > (window.innerHeight * 5) / 6 &&
        this.keys.indexOf('touchDown') === -1
      ) {
        this.keys.splice(this.keys.indexOf('touchUp'), 1);
        this.keys.push('touchDown');
      }
      console.log(this.keys);

      // const swipeXDistance = Math.abs(
      //   e.changedTouches[0].clientX - this.touchX
      // );
      // const swipeYDistance = Math.abs(
      //   e.changedTouches[0].clientY - this.touchY
      // );
      // if (
      //   (swipeXDistance > this.touchTreshold ||
      //     swipeYDistance > this.touchTreshold) &&
      //   this.keys.indexOf('swipe') === -1
      // ) {
      //   this.keys.push('swipe');
      // }
      // clearTimeout(longTabTimer);
    });
    window.addEventListener('touchend', () => {
      this.keys.splice(0);
    });
  }
}
