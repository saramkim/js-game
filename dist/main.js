"use strict";
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 16;
// const img1 = new Image();
// img1.src = "bear.png";
var user = {
    x: 100,
    y: 900,
    width: 50,
    height: 50,
    draw: function () {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // ctx.drawImage(img1, this.x, this.y, this.width, this.height);
    },
};
var Cactus = /** @class */ (function () {
    function Cactus() {
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.width = 50;
        this.height = 50;
    }
    Cactus.prototype.draw = function () {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    return Cactus;
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
function Frame() {
    animation = requestAnimationFrame(Frame);
    timer++;
    score++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 그림자 효과
    // ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 48px san-serif";
    ctx.strokeText(String(score), 100, 100);
    var stopMove = false;
    if (timer % 300 === 0) {
        var cactus = new Cactus();
        cactusArray.push(cactus);
    }
    cactusArray.forEach(function (cactus, i, o) {
        var x축차이 = user.x - cactus.x;
        var y축차이 = user.y - (cactus.y + user.height);
        var index = o.findIndex(function (cactus) { return cactus.y >= 900; });
        var index2 = o.findIndex(function (cactus) {
            var x축차이 = user.x - cactus.x;
            var y축차이 = user.y - (cactus.y + user.height);
            return x축차이 > -50 && x축차이 <= 50 && y축차이 === 0;
        });
        cactus.y < 900 ? (cactus.y += 5) : o.splice(index, 1);
        if (x축차이 > -50 && x축차이 <= 50 && y축차이 === 0) {
            o[index2].y -= 5;
        }
        // Collision(user, cactus);
        cactus.draw();
    });
    // if (timer % 500 === 0) {
    //   const bonus = new Bonus();
    //   bonusArray.push(bonus);
    // }
    // bonusArray.map((a, i, o) => {
    //   a.x < -50 && o.splice(i, 1);
    //   a.x -= 10;
    //   Collision2(user, a);
    //   a.draw();
    // });
    if (goLeft == true) {
        user.x -= 6;
        leftTimer++;
    }
    if (leftTimer > 20) {
        goLeft = false;
        leftTimer = 0;
    }
    if (goRight == true) {
        user.x += 6;
        rightTimer++;
    }
    if (rightTimer > 20) {
        goRight = false;
        rightTimer = 0;
    }
    user.draw();
}
// 충돌확인
// function Collision(user: any, cactus: any, stopMove: any) {
//   const x축차이 = user.x - cactus.x;
//   const y축차이 = user.y - (cactus.y + user.height);
//   if (x축차이 > -100 && x축차이 <= 100 && y축차이 === 0) {
//   }
// }
// function Collision2(user: any, bonus: any) {
//   const x축차이 = bonus.x - (user.x + user.width);
//   const y축차이 = bonus.y - (user.y + user.height);
//   if (x축차이 < 0 && x축차이 >= -100 && y축차이 < 0 && y축차이 >= -50) {
//     score += 1000;
//   }
// }
document.addEventListener("keydown", function (a) {
    if (a.code === "ArrowLeft" && user.x !== 0) {
        goLeft = true;
    }
});
document.addEventListener("keydown", function (a) {
    if (a.code === "ArrowRight" && user.x !== canvas.width) {
        goRight = true;
    }
});
document.addEventListener("keydown", function (a) {
    if (a.code === "Enter") {
        animation = requestAnimationFrame(Frame);
    }
});
// cancelAnimationFrame(animation);
// ctx.clearRect(0, 0, canvas.width, canvas.height);
