const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

canvas.width = 600;
canvas.height = 800;
canvas.style.border = '1px solid black';
canvas.style.position = 'fixed';
canvas.style.left = `calc(50% - ${canvas.width / 2}px)`;
canvas.style.top = `calc(50% - ${canvas.height / 2}px)`;

while (window.innerWidth < canvas.width) {
  canvas.width -= 20;
  canvas.style.left = `calc(50% - ${canvas.width / 2}px)`;
}
while (window.innerHeight < canvas.height) {
  canvas.height -= 50;
  canvas.style.top = `calc(50% - ${canvas.height / 2}px)`;
}

type Fn = (stopedBlock: Block, block: Block) => boolean;

// const img1 = new Image();
// img1.src = "bear.png";

const player = {
  width: 50,
  height: 50,
  x: (canvas.width - 50) / 2,
  y: canvas.height - 50,
  draw() {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // ctx.drawImage(img1, this.x, this.y, this.width, this.height);
  },
};

class Block {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(location: number) {
    this.width = 50;
    this.height = 50;
    this.x =
      Math.random() * (canvas.width / difficulty - this.width) +
      location * (canvas.width / difficulty);
    this.y = 0;
  }
  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Bonus {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor() {
    this.width = 50;
    this.height = 50;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = 0;
  }
  draw() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

let timer = 0;
let pointScore = 0;
let timeScore = 0;
let goLeft = false;
let goRight = false;
let leftTimer = 0;
let rightTimer = 0;
let mode: 'point' | 'time' = 'point';
let difficulty: 1 | 2 | 3 | 4 | 5 | 6 = 3;
let canUseItem = true;
let curStatus: 'intro' | 'start' | 'end' = 'intro';
let animation: number;
let longTabTimer: NodeJS.Timeout;

var BLOCK_TIME = 90;
var MOVE_SPEED = 10;
var TIMER_TIME = 3;

const blockArray: Block[] = [];
const bonusArray: Bonus[] = [];

function IntroEvent() {
  ctx.fillStyle = 'green';
  ctx.font = 'bold 48px san-serif';
  ctx.fillText('Block a Block', 50, 400);
  ctx.font = 'bold 30px san-serif';
  ctx.fillText(`Mode: ${mode.toUpperCase()}`, 50, 250);
  mode === 'point' &&
    ctx.fillText(`difficulty: ${String(difficulty)}`, 50, 300);
  ctx.fillText("Press 'Enter' to start!", 50, 500);
}

if (curStatus === 'intro') {
  IntroEvent();
}
function Frame() {
  animation = requestAnimationFrame(Frame);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  timer++;
  if (mode === 'time') {
    timer % 40 === 0 && timeScore++;
    timer % 1000 === 0 && difficulty < 6 && difficulty++;
    ctx.fillText(String(timeScore), 50, 100);
  }
  if (mode === 'point') {
    ctx.fillText(String(pointScore), 50, 100);
  }

  for (let i = 0; i < difficulty; i++) {
    if ((timer + (BLOCK_TIME / difficulty) * i) % BLOCK_TIME === 0) {
      const block = new Block(i);
      blockArray.push(block);
    }
  }

  blockArray.forEach((block, index, array) => {
    const CollisionCheck = (fn: Fn) =>
      array
        .filter((v) => v !== block)
        .findIndex((stopedBlock) => fn(stopedBlock, block));
    const collisionEachOther = CollisionCheck(Collision);
    const LeftCollisionEachOther = CollisionCheck(LeftCollision);
    const RightCollisionEachOther = CollisionCheck(RightCollision);
    const stacking = collisionEachOther !== -1 || Collision(player, block);
    const pushingLeft =
      LeftCollisionEachOther !== -1 || LeftCollision(player, block);
    const pushingRight =
      RightCollisionEachOther !== -1 || RightCollision(player, block);

    if (block.y < canvas.height) {
      !stacking && (block.y += 1);
    } else {
      array.splice(index, 1);
      pointScore++;
    }

    if (stacking) {
      GoLeft(block);
      GoRight(block);
    } else if (pushingLeft) {
      GoLeft(block);
    } else if (pushingRight) {
      GoRight(block);
    }

    if (block.y <= 0) {
      window.cancelAnimationFrame(animation);
      curStatus = 'end';
      ctx.clearRect(0, 200, canvas.width, 350);
      ctx.fillStyle = 'green';
      ctx.font = 'bold 48px san-serif';
      mode === 'point' && ctx.fillText(String(pointScore), 50, 300);
      mode === 'time' && ctx.fillText(String(timeScore), 50, 300);
      ctx.fillText('Game Over', 50, 400);
      ctx.font = 'bold 30px san-serif';
      ctx.fillText("Press 'Enter' to start!", 50, 500);
    }

    block.draw();
  });

  // bonus ------------
  if (timer % 1000 === 0) {
    const bonus = new Bonus();
    bonusArray.push(bonus);
  }
  bonusArray.forEach((bonus, index, array) => {
    const collide =
      Collision(player, bonus) ||
      LeftCollision(player, bonus) ||
      RightCollision(player, bonus);

    mode === 'point' && collide && (pointScore += 10);
    mode === 'time' && collide && (timeScore += 10);

    bonus.y < canvas.height && !collide
      ? (bonus.y += 5)
      : array.splice(index, 1);

    bonus.draw();
  });

  // control ------------
  GoLeft(player);
  GoRight(player);
  goLeft && leftTimer++;
  goRight && rightTimer++;
  if (leftTimer > TIMER_TIME) {
    goLeft = false;
    leftTimer = 0;
  }
  if (rightTimer > TIMER_TIME) {
    goRight = false;
    rightTimer = 0;
  }

  player.draw();
}

function Collision(pre: Block, cur: Block) {
  const xCollision = Math.abs(pre.x - cur.x) < pre.width;
  const yCollision = pre.y - cur.y === pre.height;
  return xCollision && yCollision;
}

function LeftCollision(pre: Block, cur: Block) {
  const xCollision = pre.x - cur.x <= pre.width && pre.x - cur.x > 0;
  const yCollision = Math.abs(pre.y - cur.y) < pre.height;
  return xCollision && yCollision;
}

function RightCollision(pre: Block, cur: Block) {
  const xCollision = cur.x - pre.x <= pre.width && cur.x - pre.x > 0;
  const yCollision = Math.abs(pre.y - cur.y) < pre.height;
  return xCollision && yCollision;
}

function GoLeft(thing: Block) {
  player.x > 0 && goLeft && (thing.x -= MOVE_SPEED);
}
function GoRight(thing: Block) {
  player.x + player.width < canvas.width && goRight && (thing.x += MOVE_SPEED);
}

function handleLeftEvent() {
  if (curStatus === 'intro' && mode === 'point' && difficulty > 1) {
    difficulty--;
    ctx.clearRect(0, 250, 500, 50);
    ctx.fillText(`difficulty: ${String(difficulty)}`, 50, 300);
  }
}
function handleRightEvent() {
  if (curStatus === 'intro' && mode === 'point' && difficulty < 6) {
    difficulty++;
    ctx.clearRect(0, 250, 500, 50);
    ctx.fillText(`difficulty: ${String(difficulty)}`, 50, 300);
  }
}
function handleSpaceEvent() {
  if (curStatus === 'intro') {
    ctx.clearRect(0, 200, 500, 130);
    if (mode === 'point') {
      mode = 'time';
    } else if (mode === 'time') {
      mode = 'point';
      ctx.fillText(`difficulty: ${String(difficulty)}`, 50, 300);
    }
    ctx.fillText(`Mode: ${mode.toUpperCase()}`, 50, 250);
  } else if (curStatus === 'start' && canUseItem === true) {
    blockArray.splice(0);
    canUseItem = false;
  }
}
function startEvent() {
  if (curStatus === 'intro') {
    animation = requestAnimationFrame(Frame);
    mode === 'time' && (difficulty = 1);
    curStatus = 'start';
  } else if (curStatus === 'end') {
    blockArray.splice(0);
    bonusArray.splice(0);
    timer = 0;
    pointScore = 0;
    canUseItem = true;
    animation = requestAnimationFrame(Frame);
    curStatus = 'start';
  }
}

document.addEventListener('keydown', (key) => {
  switch (key.code) {
    case 'Enter':
      startEvent();
      break;
    case 'ArrowLeft':
    case 'KeyA':
      handleLeftEvent();
      goLeft = true;
      break;
    case 'ArrowRight':
    case 'KeyD':
      handleRightEvent();
      goRight = true;
      break;
    case 'Space':
      handleSpaceEvent();
      break;
    // case 'Escape':
    //   if (curStatus === 'end') {
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     IntroEvent();
    //     curStatus = 'intro';
    //   }
  }
});

canvas.addEventListener('touchstart', (event) => {
  const xTouch = event.changedTouches[0].clientX;
  const yTouch = event.changedTouches[0].clientY;

  longTabTimer = setTimeout(() => {
    startEvent();
  }, 1000);

  if (yTouch < 300) {
    handleSpaceEvent();
  }
  if (xTouch < canvas.width / 2) {
    goLeft = true;
  } else if (xTouch > canvas.width / 2) {
    goRight = true;
  }
});
canvas.addEventListener('touchend', (event) => {
  const xTouch = event.changedTouches[0].clientX;
  const yTouch = event.changedTouches[0].clientY;
  clearTimeout(longTabTimer);
  if (xTouch < canvas.width / 2) {
    handleLeftEvent();
  } else if (xTouch > canvas.width / 2) {
    handleRightEvent();
  }
});
canvas.addEventListener('touchmove', () => {
  clearTimeout(longTabTimer);
});
