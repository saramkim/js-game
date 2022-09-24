global.canvas = document.getElementById('canvas');
global.ctx = canvas.getContext('2d');

global.CANVAS_WIDTH = 610;

if (window.innerWidth < CANVAS_WIDTH) {
  canvas.width = CANVAS_WIDTH;
  while (canvas.width > window.innerWidth) {
    canvas.width -= 20;
  }
} else {
  canvas.width = CANVAS_WIDTH;
}

if (window.innerHeight < 800) {
  canvas.height = 750;
  while (canvas.height > window.innerHeight) {
    canvas.height -= 50;
  }
} else {
  canvas.height = 800;
}

canvas.style.boxShadow = '0 0 0 1px black inset';
canvas.style.position = 'fixed';
canvas.style.left = `calc(50% - ${canvas.width / 2}px)`;
canvas.style.top = `calc(50% - ${canvas.height / 2}px)`;

global.mode = 'point';
global.curStatus = 'intro';
global.difficulty = 3;
global.canUseItem = true;
global.blockArray = [];
global.bonusArray = [];
global.timer = 0;
global.leftTimer = 0;
global.rightTimer = 0;
global.pointScore = 0;
global.timeScore = 0;
global.goLeft = false;
global.goRight = false;
