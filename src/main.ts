const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 16;

type Fn = (stopedBlock: Block, block: Block) => boolean;

// const img1 = new Image();
// img1.src = "bear.png";

const user = {
  width: 50,
  height: 50,
  x: 100,
  y: 900,
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

  constructor() {
    this.width = 50;
    this.height = 50;
    this.x = Math.random() * (canvas.width - this.width);
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
let goLeft = false;
let goRight = false;
let leftTimer = 0;
let rightTimer = 0;
let animation: number;
const MOVE_SPEED = 10;
const TIMER_TIME = 10;

function Collision(pre: Block, cur: Block) {
  const xCollision = Math.abs(pre.x - cur.x) < pre.width;
  const yCollision = Math.abs(pre.y - cur.y) === pre.height;
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

function Frame() {
  animation = requestAnimationFrame(Frame);
  timer++;
  score++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 48px san-serif";
  ctx.strokeText(String(score), 100, 100);

  if (timer % 100 === 0) {
    const block = new Block();
    cactusArray.push(block);
  }

  cactusArray.forEach((block, i, array) => {
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

    block.y < 900 ? !stacking && (block.y += 1) : array.splice(i, 1);

    if (stacking) {
      goLeft && (block.x -= MOVE_SPEED);
      goRight && (block.x += MOVE_SPEED);
    } else if (pushingLeft) {
      goLeft && (block.x -= MOVE_SPEED);
    } else if (pushingRight) {
      goRight && (block.x += MOVE_SPEED);
    }

    block.draw();
  });

  // bonus ------------
  if (timer % 1000 === 0) {
    const bonus = new Bonus();
    bonusArray.push(bonus);
  }
  bonusArray.forEach((bonus, i, array) => {
    Collision(user, bonus) && (score += 1000);

    bonus.y < 900 && !Collision(user, bonus)
      ? (bonus.y += 5)
      : array.splice(i, 1);

    bonus.draw();
  });

  // control ------------
  if (goLeft == true) {
    user.x -= MOVE_SPEED;
    leftTimer++;
  }
  if (leftTimer > TIMER_TIME) {
    goLeft = false;
    leftTimer = 0;
  }
  if (goRight == true) {
    user.x += MOVE_SPEED;
    rightTimer++;
  }
  if (rightTimer > TIMER_TIME) {
    goRight = false;
    rightTimer = 0;
  }

  user.draw();
}

document.addEventListener("keydown", (key) => {
  if ((key.code === "ArrowLeft" || key.code === "KeyA") && user.x > 0) {
    goLeft = true;
  }
});
document.addEventListener("keydown", (key) => {
  if (
    (key.code === "ArrowRight" || key.code === "KeyD") &&
    user.x < canvas.width
  ) {
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
