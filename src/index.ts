const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

canvas.width = 600;
canvas.height = 800;
canvas.style.border = '1px solid black';
canvas.style.position = 'fixed';
canvas.style.top = `calc(50% - ${canvas.height / 2}px)`;
canvas.style.left = `calc(50% - ${canvas.width / 2}px)`;

while (window.innerWidth < canvas.width) {
  canvas.width -= 100;
}
while (window.innerHeight < canvas.height) {
  canvas.height -= 100;
}

type Fn = (stopedBlock: Block, block: Block) => boolean;

// const img1 = new Image();
// img1.src = "bear.png";

const user = {
  width: 50,
  height: 50,
  x: 100,
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
      Math.random() * (canvas.width / DIFFICULTY - this.width) +
      location * (canvas.width / DIFFICULTY);
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
let score = 0;
let goLeft = false;
let goRight = false;
let leftTimer = 0;
let rightTimer = 0;
let canUseItem = true;
let curStatus: 'intro' | 'start' | 'end' = 'intro';
let animation: number;

var BLOCK_TIME = 60;
var MOVE_SPEED = 10;
var TIMER_TIME = 3;
var DIFFICULTY = 4;

const blockArray: Block[] = [];
const bonusArray: Bonus[] = [];

if (curStatus === 'intro') {
  ctx.font = 'bold 48px san-serif';
  ctx.fillText("Press 'Enter' to start!", 50, 400);
}

function Frame() {
  animation = requestAnimationFrame(Frame);
  timer++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 48px san-serif';
  ctx.fillText(String(score), 100, 100);

  for (let i = 0; i < DIFFICULTY; i++) {
    if ((timer + (BLOCK_TIME / DIFFICULTY) * i) % BLOCK_TIME === 0) {
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
    const stacking = collisionEachOther !== -1 || Collision(user, block);
    const pushingLeft =
      LeftCollisionEachOther !== -1 || LeftCollision(user, block);
    const pushingRight =
      RightCollisionEachOther !== -1 || RightCollision(user, block);

    if (block.y < canvas.height) {
      !stacking && (block.y += 1);
    } else {
      array.splice(index, 1);
      score++;
    }

    if (stacking) {
      GoLeft(block);
      GoRight(block);
    } else if (pushingLeft) {
      GoLeft(block);
    } else if (pushingRight) {
      GoRight(block);
    }

    if (block.y === 0) {
      window.cancelAnimationFrame(animation);
      curStatus = 'end';
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
      Collision(user, bonus) ||
      LeftCollision(user, bonus) ||
      RightCollision(user, bonus);

    collide && (score += 10);

    bonus.y < 900 && !collide ? (bonus.y += 5) : array.splice(index, 1);

    bonus.draw();
  });

  // control ------------
  GoLeft(user);
  GoRight(user);
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

  user.draw();
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
  user.x > 0 && goLeft && (thing.x -= MOVE_SPEED);
}
function GoRight(thing: Block) {
  user.x + user.width < canvas.width && goRight && (thing.x += MOVE_SPEED);
}

document.addEventListener('keydown', (key) => {
  switch (key.code) {
    case 'Enter':
      if (curStatus === 'intro') {
        animation = requestAnimationFrame(Frame);
        curStatus = 'start';
      } else if (curStatus === 'end') {
        blockArray.splice(0);
        bonusArray.splice(0);
        timer = 0;
        score = 0;
        canUseItem = true;
        animation = requestAnimationFrame(Frame);
        curStatus = 'start';
      }
      break;
    case 'ArrowLeft':
    case 'KeyA':
      goLeft = true;
      break;
    case 'ArrowRight':
    case 'KeyD':
      goRight = true;
      break;
    case 'Space':
      if (canUseItem === true) {
        blockArray.splice(0);
        canUseItem = false;
      }
      break;
    case 'Escape':
      if (curStatus === 'end') {
        curStatus = 'intro';
      }
  }
});
