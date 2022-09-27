// import { startAnimation } from './Animation';

let longTabTimer: NodeJS.Timeout;

export class InputHandler {
  keys: string[];

  constructor() {
    this.keys = [];
    //  on PC
    window.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'Enter':
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
      }
    });
    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'Enter':
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

    // // on Mobile
    // canvas.addEventListener('touchstart', (e) => {
    //   const xTouch = e.changedTouches[0].clientX;
    //   const yTouch = e.changedTouches[0].clientY;

    //   if (yTouch < canvas.height / 2) {
    //     longTabTimer = setTimeout(() => {
    //       exitEvent();
    //     }, 500);
    //   } else {
    //     longTabTimer = setTimeout(() => {
    //       startEvent();
    //     }, 500);

    //     if (xTouch < canvas.width / 2) {
    //       curStatus === 'start' && (goLeft = true);
    //     } else if (xTouch > canvas.width / 2) {
    //       curStatus === 'start' && (goRight = true);
    //     }
    //   }
    // });
    // canvas.addEventListener('touchend', (e) => {
    //   const xTouch = e.changedTouches[0].clientX;
    //   const yTouch = e.changedTouches[0].clientY;

    //   clearTimeout(longTabTimer);
    //   if (yTouch < canvas.height / 2) {
    //     spaceEvent();
    //   } else {
    //     if (xTouch < canvas.width / 2) {
    //       leftEvent();
    //     } else if (xTouch > canvas.width / 2) {
    //       rightEvent();
    //     }
    //   }
    // });
    // canvas.addEventListener('touchmove', () => {
    //   clearTimeout(longTabTimer);
    // });
  }
}

// const startEvent = () => {
//   if (curStatus === 'main') {
//     startAnimation();
//     mode === 'time' && (difficulty = 1);
//     curStatus = 'start';
//   } else if (curStatus === 'end') {
//     blockArray.splice(0);
//     bonusArray.splice(0);
//     timer = 0;
//     pointScore = 0;
//     timeScore = 0;
//     canUseItem = true;
//     mode === 'time' && (difficulty = 1);
//     startAnimation();
//     curStatus = 'start';
//   }
// };
// const leftEvent = () => {
//   if (curStatus === 'main' && mode === 'point' && difficulty > 1) {
//     difficulty--;
//     ctx.clearRect(0, 250, 500, 50);
//     ctx.fillText(`difficulty: ${String(difficulty)}`, 50, 300);
//   }
// };
// const rightEvent = () => {
//   if (curStatus === 'main' && mode === 'point' && difficulty < 6) {
//     difficulty++;
//     ctx.clearRect(0, 250, 500, 50);
//     ctx.fillText(`difficulty: ${String(difficulty)}`, 50, 300);
//   }
// };
// const spaceEvent = () => {
//   if (curStatus === 'main') {
//     ctx.clearRect(0, 200, 500, 130);
//     if (mode === 'point') {
//       mode = 'time';
//     } else if (mode === 'time') {
//       mode = 'point';
//       ctx.fillText(`difficulty: ${String(difficulty)}`, 50, 300);
//     }
//     ctx.fillText(`Mode: ${mode.toUpperCase()}`, 50, 250);
//   } else if (curStatus === 'start' && canUseItem) {
//     blockArray.splice(0);
//     canUseItem = false;
//   }
// };
// const exitEvent = () => {
//   if (curStatus === 'end') {
//     curStatus = 'main';
//     Main();
//   }
// };
