"use strict";
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 16;
// const img1 = new Image();
// img1.src = "bear.png";
var user = {
    width: 50,
    height: 50,
    x: 100,
    y: 900,
    draw: function () {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // ctx.drawImage(img1, this.x, this.y, this.width, this.height);
    },
};
var Block = /** @class */ (function () {
    function Block() {
        this.width = 50;
        this.height = 50;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = 0;
    }
    Block.prototype.draw = function () {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    return Block;
}());
// class Bonus {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   constructor() {
//     this.x = canvas.width;
//     this.y = 200;
//     this.width = 50;
//     this.height = 50;
//   }
//   draw() {
//     ctx.fillStyle = "blue";
//     ctx.fillRect(this.x, this.y, this.width, this.height);
//   }
// }
var timer = 0;
var score = 0;
var cactusArray = [];
// const bonusArray: Bonus[] = [];
var goLeft = false;
var goRight = false;
var leftTimer = 0;
var rightTimer = 0;
var animation;
var MOVE_SPEED = 10;
var TIMER_TIME = 10;
function Collision(pre, cur) {
    var xCollision = Math.abs(pre.x - cur.x) < pre.width;
    var yCollision = Math.abs(pre.y - cur.y) === pre.height;
    return xCollision && yCollision;
}
function LeftCollision(pre, cur) {
    var xCollision = pre.x - cur.x <= pre.width && pre.x - cur.x > 0;
    var yCollision = Math.abs(pre.y - cur.y) < pre.height;
    return xCollision && yCollision;
}
function RightCollision(pre, cur) {
    var xCollision = cur.x - pre.x <= pre.width && cur.x - pre.x > 0;
    var yCollision = Math.abs(pre.y - cur.y) < pre.height;
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
        var block = new Block();
        cactusArray.push(block);
    }
    cactusArray.forEach(function (block, i, array) {
        var CollisionCheck = function (fn) {
            return array
                .filter(function (v) { return v !== block; })
                .findIndex(function (stopedBlock) { return fn(stopedBlock, block); });
        };
        var collisionEachOther = CollisionCheck(Collision);
        var LeftCollisionEachOther = CollisionCheck(LeftCollision);
        var RightCollisionEachOther = CollisionCheck(RightCollision);
        var stacking = collisionEachOther !== -1 || Collision(user, block);
        var pushingLeft = LeftCollisionEachOther !== -1 || LeftCollision(user, block);
        var pushingRight = RightCollisionEachOther !== -1 || RightCollision(user, block);
        block.y < 900 ? !stacking && (block.y += 1) : array.splice(i, 1);
        if (stacking) {
            goLeft && (block.x -= MOVE_SPEED);
            goRight && (block.x += MOVE_SPEED);
        }
        else if (pushingLeft) {
            goLeft && (block.x -= MOVE_SPEED);
        }
        else if (pushingRight) {
            goRight && (block.x += MOVE_SPEED);
        }
        block.draw();
    });
    // if (timer % 500 === 0) {
    //   const bonus = new Bonus();
    //   bonusArray.push(bonus);
    // }
    // bonusArray.map((a, i, array) => {
    //   a.x < -50 && array.splice(i, 1);
    //   a.x -= 10;
    //   Collision2(user, a);
    //   a.draw();
    // });
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
document.addEventListener("keydown", function (key) {
    if ((key.code === "ArrowLeft" || key.code === "KeyA") && user.x > 0) {
        goLeft = true;
    }
});
document.addEventListener("keydown", function (key) {
    if ((key.code === "ArrowRight" || key.code === "KeyD") &&
        user.x < canvas.width) {
        goRight = true;
    }
});
// document.addEventListener('keydown', (key) => {
//   if (key.code === 'Space') {
//   }
// });
document.addEventListener("keydown", function (key) {
    if (key.code === "Enter") {
        cancelAnimationFrame(animation);
        animation = requestAnimationFrame(Frame);
    }
});
// ctx.clearRect(0, 0, canvas.width, canvas.height);
