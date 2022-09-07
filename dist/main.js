"use strict";
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 800;
canvas.style.border = "1px solid black";
while (window.innerWidth < canvas.width) {
    canvas.width -= 100;
}
while (window.innerHeight < canvas.height) {
    canvas.height -= 100;
}
// const img1 = new Image();
// img1.src = "bear.png";
var user = {
    width: 50,
    height: 50,
    x: 100,
    y: canvas.height - 50,
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
        this.x =
            Math.random() * (canvas.width / DIFFICULTY - this.width) +
                location * (canvas.width / DIFFICULTY);
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
var goLeft = false;
var goRight = false;
var leftTimer = 0;
var rightTimer = 0;
var canUseItem = true;
var isStart = false;
var animation;
var BLOCK_TIME = 60;
var MOVE_SPEED = 10;
var TIMER_TIME = 3;
var DIFFICULTY = 4;
var blockArray = [];
var bonusArray = [];
function Frame() {
    animation = requestAnimationFrame(Frame);
    timer++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 48px san-serif";
    ctx.strokeText(String(score), 100, 100);
    for (var i = 0; i < DIFFICULTY; i++) {
        if ((timer + (BLOCK_TIME / DIFFICULTY) * i) % BLOCK_TIME === 0) {
            var block = new Block(i);
            blockArray.push(block);
        }
    }
    blockArray.forEach(function (block, index, array) {
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
        if (block.y < canvas.height) {
            !stacking && (block.y += 1);
        }
        else {
            array.splice(index, 1);
            score++;
        }
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
            window.cancelAnimationFrame(animation);
            isStart = false;
        }
        block.draw();
    });
    // bonus ------------
    if (timer % 1000 === 0) {
        var bonus = new Bonus();
        bonusArray.push(bonus);
    }
    bonusArray.forEach(function (bonus, index, array) {
        var collide = Collision(user, bonus) ||
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
document.addEventListener("keydown", function (key) {
    switch (key.code) {
        case "Enter":
            if (isStart === false) {
                blockArray.splice(0);
                bonusArray.splice(0);
                timer = 0;
                score = 0;
                canUseItem = true;
                animation = requestAnimationFrame(Frame);
                isStart = true;
            }
            break;
        case "ArrowLeft":
        case "KeyA":
            goLeft = true;
            break;
        case "ArrowRight":
        case "KeyD":
            goRight = true;
            break;
        case "Space":
            if (canUseItem === true) {
                blockArray.splice(0);
                canUseItem = false;
            }
            break;
    }
});
