"use strict";
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 800;
canvas.style.border = "1px solid black";
if (window.innerWidth < 600) {
    canvas.width = window.innerWidth;
}
if (window.innerHeight < 800) {
    canvas.height = window.innerHeight - 16;
}
// const img1 = new Image();
// img1.src = "bear.png";
var user = {
    width: 50,
    height: 50,
    x: 100,
    y: 700,
    draw: function () {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // ctx.drawImage(img1, this.x, this.y, this.width, this.height);
    },
};
var Block = /** @class */ (function () {
    function Block(location) {
        this.width = 50;
        this.height = 50;
        var randomLocation = Math.random() * (canvas.width - this.width);
        this.x =
            location === "left"
                ? randomLocation / 2
                : (randomLocation + canvas.width) / 2;
        this.y = 0;
    }
    Block.prototype.draw = function () {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    return Block;
}());
var Bonus = /** @class */ (function () {
    function Bonus() {
        this.width = 50;
        this.height = 50;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = 0;
    }
    Bonus.prototype.draw = function () {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    return Bonus;
}());
var timer = 0;
var score = 0;
var cactusArray = [];
var bonusArray = [];
// 하나로 합치기
var goLeft = false;
var goRight = false;
var leftTimer = 0;
var rightTimer = 0;
var animation;
var BLOCK_TIME = 60;
var MOVE_SPEED = 10;
var TIMER_TIME = 3;
function Frame() {
    animation = requestAnimationFrame(Frame);
    timer++;
    score++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 48px san-serif";
    ctx.strokeText(String(score), 100, 100);
    if (timer % BLOCK_TIME === 0) {
        var block = new Block("left");
        cactusArray.push(block);
    }
    if ((timer + BLOCK_TIME / 2) % BLOCK_TIME === 0) {
        var block2 = new Block("right");
        cactusArray.push(block2);
    }
    cactusArray.forEach(function (block, i, array) {
        function CollisionCheck(fn) {
            return array
                .filter(function (v) { return v !== block; })
                .findIndex(function (stopedBlock) { return fn(stopedBlock, block); });
        }
        var collisionEachOther = CollisionCheck(Collision);
        var LeftCollisionEachOther = CollisionCheck(LeftCollision);
        var RightCollisionEachOther = CollisionCheck(RightCollision);
        var stacking = collisionEachOther !== -1 || Collision(user, block);
        var pushingLeft = LeftCollisionEachOther !== -1 || LeftCollision(user, block);
        var pushingRight = RightCollisionEachOther !== -1 || RightCollision(user, block);
        block.y < 900 ? !stacking && (block.y += 1) : array.splice(i, 1);
        if (stacking) {
            GoLeft(block);
            GoRight(block);
        }
        else if (pushingLeft) {
            GoLeft(block);
        }
        else if (pushingRight) {
            GoRight(block);
        }
        if (block.y === 0) {
            cancelAnimationFrame(animation);
        }
        block.draw();
    });
    // bonus ------------
    if (timer % 1000 === 0) {
        var bonus = new Bonus();
        bonusArray.push(bonus);
    }
    bonusArray.forEach(function (bonus, i, array) {
        var collide = Collision(user, bonus) ||
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
function Collision(pre, cur) {
    var xCollision = Math.abs(pre.x - cur.x) < pre.width;
    var yCollision = pre.y - cur.y === pre.height;
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
function GoLeft(thing) {
    user.x > 0 && goLeft && (thing.x -= MOVE_SPEED);
}
function GoRight(thing) {
    user.x + user.width < canvas.width && goRight && (thing.x += MOVE_SPEED);
}
// ---
document.addEventListener("keydown", function (key) {
    if (key.code === "ArrowLeft" || key.code === "KeyA") {
        goLeft = true;
    }
});
document.addEventListener("keydown", function (key) {
    if (key.code === "ArrowRight" || key.code === "KeyD") {
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
