import { startAnimation } from './Animation';
import Intro from './Intro';

let longTabTimer: NodeJS.Timeout;

const startEvent = () => {
  if (curStatus === 'intro') {
    startAnimation();
    mode === 'time' && (difficulty = 1);
    curStatus = 'start';
  } else if (curStatus === 'end') {
    blockArray.splice(0);
    bonusArray.splice(0);
    timer = 0;
    pointScore = 0;
    timeScore = 0;
    canUseItem = true;
    mode === 'time' && (difficulty = 1);
    startAnimation();
    curStatus = 'start';
  }
};
const leftEvent = () => {
  if (curStatus === 'intro' && mode === 'point' && difficulty > 1) {
    difficulty--;
    ctx.clearRect(0, 250, 500, 50);
    ctx.fillText(`difficulty: ${String(difficulty)}`, 50, 300);
  }
};
const rightEvent = () => {
  if (curStatus === 'intro' && mode === 'point' && difficulty < 6) {
    difficulty++;
    ctx.clearRect(0, 250, 500, 50);
    ctx.fillText(`difficulty: ${String(difficulty)}`, 50, 300);
  }
};
const spaceEvent = () => {
  if (curStatus === 'intro') {
    ctx.clearRect(0, 200, 500, 130);
    if (mode === 'point') {
      mode = 'time';
    } else if (mode === 'time') {
      mode = 'point';
      ctx.fillText(`difficulty: ${String(difficulty)}`, 50, 300);
    }
    ctx.fillText(`Mode: ${mode.toUpperCase()}`, 50, 250);
  } else if (curStatus === 'start' && canUseItem) {
    blockArray.splice(0);
    canUseItem = false;
  }
};
const exitEvent = () => {
  if (curStatus === 'end') {
    curStatus = 'intro';
    Intro();
  }
};

//  on PC
document.addEventListener('keydown', (key) => {
  switch (key.code) {
    case 'Enter':
      startEvent();
      break;
    case 'ArrowLeft':
    case 'KeyA':
      leftEvent();
      curStatus === 'start' && (goLeft = true);
      break;
    case 'ArrowRight':
    case 'KeyD':
      rightEvent();
      curStatus === 'start' && (goRight = true);
      break;
    case 'Space':
      spaceEvent();
      break;
    case 'Escape':
      exitEvent();
      break;
  }
});

// on Mobile
canvas.addEventListener('touchstart', (event) => {
  const xTouch = event.changedTouches[0].clientX;
  const yTouch = event.changedTouches[0].clientY;

  if (yTouch < canvas.height / 2) {
    longTabTimer = setTimeout(() => {
      exitEvent();
    }, 1000);
  } else {
    longTabTimer = setTimeout(() => {
      startEvent();
    }, 1000);

    if (xTouch < canvas.width / 2) {
      curStatus === 'start' && (goLeft = true);
    } else if (xTouch > canvas.width / 2) {
      curStatus === 'start' && (goRight = true);
    }
  }
});
canvas.addEventListener('touchend', (event) => {
  const xTouch = event.changedTouches[0].clientX;
  const yTouch = event.changedTouches[0].clientY;

  clearTimeout(longTabTimer);
  if (yTouch < canvas.height / 2) {
    spaceEvent();
  } else {
    if (xTouch < canvas.width / 2) {
      leftEvent();
    } else if (xTouch > canvas.width / 2) {
      rightEvent();
    }
  }
});
canvas.addEventListener('touchmove', () => {
  clearTimeout(longTabTimer);
});
