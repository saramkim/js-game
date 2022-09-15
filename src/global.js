global.canvas = document.getElementById('canvas');
global.ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 800;
canvas.style.border = '1px solid black';
canvas.style.position = 'fixed';
canvas.style.left = `calc(50% - ${canvas.width / 2}px)`;
canvas.style.top = `calc(50% - ${canvas.height / 2}px)`;

while (window.innerWidth < canvas.width) {
  canvas.width -= 6;
  canvas.style.left = `calc(50% - ${canvas.width / 2}px)`;
}
while (window.innerHeight < canvas.height) {
  canvas.height -= 50;
  canvas.style.top = `calc(50% - ${canvas.height / 2}px)`;
}

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
