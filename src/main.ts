const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.width = 600;
canvas.height = 800;
canvas.style.border = "1px solid black";

if (window.innerWidth < 600) {
  canvas.width = window.innerWidth;
}
if (window.innerHeight < 800) {
  canvas.height = window.innerHeight - 16;
}
type Fn = (stopedBlock: Block, block: Block) => boolean;

// const img1 = new Image();
// img1.src = "bear.png";

const user = {
  width: 50,
  height: 50,
  x: 100,
  y: 700,
  draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // ctx.drawImage(img1, this.x, this.y, this.width, this.height);
  },
};

class Block {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(location: string) {
    this.width = 50;
    this.height = 50;
    const randomLocation = Math.random() * (canvas.width - this.width);
    this.x =
      location === "left"
        ? randomLocation / 2
        : (randomLocation + canvas.width) / 2;
    this.y = 0;
  }
  draw() {
    ctx.fillStyle = "red";
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
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

let timer = 0;
let score = 0;
const cactusArray: Block[] = [];
const bonusArray: Bonus[] = [];

// 하나로 합치기
let goLeft = false;
let goRight = false;
let leftTimer = 0;
let rightTimer = 0;
let animation: number;
const BLOCK_TIME = 60;
const MOVE_SPEED = 10;
const TIMER_TIME = 3;

function Frame() {
  animation = requestAnimationFrame(Frame);
  timer++;
  score++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 48px san-serif";
  ctx.strokeText(String(score), 100, 100);

  if (timer % BLOCK_TIME === 0) {
    const block = new Block("left");
    cactusArray.push(block);
  }
  if ((timer + BLOCK_TIME / 2) % BLOCK_TIME === 0) {
    const block2 = new Block("right");
    cactusArray.push(block2);
  }

  cactusArray.forEach((block, i, array) => {
    function CollisionCheck(fn: Fn) {
      return array
        .filter((v) => v !== block)
        .findIndex((stopedBlock) => fn(stopedBlock, block));
    }
    const collisionEachOther = CollisionCheck(Collision);
    const LeftCollisionEachOther = CollisionCheck(LeftCollision);
    const RightCollisionEachOther = CollisionCheck(RightCollision);
    const stacking = collisionEachOther !== -1 || Collision(user, block);
    const pushingLeft =
      LeftCollisionEachOther !== -1 || LeftCollision(user, block);
    const pushingRight =
      RightCollisionEachOther !== -1 || RightCollision(user, block);

    block.y < 900 ? !stacking && (block.y += 1) : array.splice(i, 1);

    if (stacking) {
      GoLeft(block);
      GoRight(block);
    } else if (pushingLeft) {
      GoLeft(block);
    } else if (pushingRight) {
      GoRight(block);
    }

    if (block.y === 0) {
      cancelAnimationFrame(animation);
    }

    block.draw();
  });

  // bonus ------------
  if (timer % 1000 === 0) {
    const bonus = new Bonus();
    bonusArray.push(bonus);
  }
  bonusArray.forEach((bonus, i, array) => {
    const collide =
      Collision(user, bonus) ||
      LeftCollision(user, bonus) ||
      RightCollision(user, bonus);

    collide && (score += 1000);

    bonus.y < 900 && !collide ? (bonus.y += 5) : array.splice(i, 1);

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

// ---

document.addEventListener("keydown", (key) => {
  if (key.code === "ArrowLeft" || key.code === "KeyA") {
    goLeft = true;
  }
});
document.addEventListener("keydown", (key) => {
  if (key.code === "ArrowRight" || key.code === "KeyD") {
    goRight = true;
  }
});

// document.addEventListener('keydown', (key) => {
//   if (key.code === 'Space') {

//   }
// });

document.addEventListener("keydown", (key) => {
  if (key.code === "Enter") {
    cancelAnimationFrame(animation);
    animation = requestAnimationFrame(Frame);
  }
});

// ctx.clearRect(0, 0, canvas.width, canvas.height);
