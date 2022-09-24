import player from '../blocks/Player';
import Block from '../blocks/Block';
import Bonus from '../blocks/Bonus';
import End from '../pages/End';

type Fn = (stopedBlock: Block, block: Block) => boolean;

const BLOCK_TIME = 90;
const MOVE_SPEED = 10;
const MOVE_TIME = 4;

let animation: number;

export const startAnimation = () => {
  blockArray.splice(0);
  bonusArray.splice(0);
  timer = 0;
  timeScore = 0;
  pointScore = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(Frame);
};
const stopAnimation = () => {
  cancelAnimationFrame(animation);
};

const Collision = (pre: Bonus, cur: Bonus) => {
  const xCollision = Math.abs(pre.x - cur.x) < pre.width;
  const yCollision = pre.y - cur.y === pre.height;
  return xCollision && yCollision;
};

const LeftCollision = (pre: Bonus, cur: Bonus) => {
  const xCollision = pre.x - cur.x <= pre.width && pre.x - cur.x > 0;
  const yCollision = Math.abs(pre.y - cur.y) < pre.height;
  return xCollision && yCollision;
};

const RightCollision = (pre: Bonus, cur: Bonus) => {
  const xCollision = cur.x - pre.x <= pre.width && cur.x - pre.x > 0;
  const yCollision = Math.abs(pre.y - cur.y) < pre.height;
  return xCollision && yCollision;
};

const Frame = () => {
  animation = requestAnimationFrame(Frame);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  timer++;

  if (mode === 'time') {
    timer % 40 === 0 && timeScore++;
    timer % 900 === 0 && difficulty < 6 && difficulty++;
    ctx.fillText(String(timeScore), 50, 100);
  }
  if (mode === 'point') {
    ctx.fillText(String(pointScore), 50, 100);
  }

  // Make Block
  for (let i = 0; i < difficulty; i++) {
    if ((timer + Math.round(BLOCK_TIME / difficulty) * i) % BLOCK_TIME === 0) {
      const block = new Block(i);
      blockArray.push(block);
    }
  }
  // Block Algorithm
  blockArray.forEach((block, index, array) => {
    const CollisionCheck = (fn: Fn) =>
      array.findIndex((otherBlock) => fn(otherBlock, block));
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
      if (goLeft) {
        MoveLeft(block);
      }
      if (goRight) {
        MoveRight(block);
      }
    } else if (pushingLeft) {
      MoveLeft(block);
    } else if (pushingRight) {
      MoveRight(block);
    }

    if (block.y === 0) {
      stopAnimation();
      curStatus = 'end';
      End();
    }

    block.draw();
  });

  // Make Bonus
  if (timer % 900 === 0) {
    const bonus = new Bonus();
    bonusArray.push(bonus);
  }
  // Bonus Algorithm
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

  // Control Algorithm
  if (goLeft) {
    MoveLeft(player);
    leftTimer++;
  }
  if (goRight) {
    MoveRight(player);
    rightTimer++;
  }

  if (leftTimer === MOVE_TIME) {
    goLeft = false;
    leftTimer = 0;
  }
  if (rightTimer === MOVE_TIME) {
    goRight = false;
    rightTimer = 0;
  }

  player.draw();
};

function MoveLeft(thing: Block) {
  player.x > 0 && thing.moveLeft(MOVE_SPEED);
}
function MoveRight(thing: Block) {
  player.x + player.width < canvas.width && thing.moveRight(MOVE_SPEED);
}

export default Frame;
