"use strict";
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 40;
canvas.height = window.innerHeight - 40;
var img1 = new Image();
img1.src = "bear.png";
var dino = {
    x: 100,
    y: 300,
    width: 50,
    height: 50,
    draw: function () {
        // ctx.fillStyle = "green";
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(img1, this.x, this.y, this.width, this.height);
    },
};
var Cactus = /** @class */ (function () {
    function Cactus() {
        this.x = canvas.width;
        this.y = 300;
        this.width = 50;
        this.height = 50;
    }
    Cactus.prototype.draw = function () {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    return Cactus;
}());
var Bonus = /** @class */ (function () {
    function Bonus() {
        this.x = canvas.width;
        this.y = 200;
        this.width = 50;
        this.height = 50;
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
var jumping = false;
var jumpTimer = 0;
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
    if (timer % 120 === 0) {
        var cactus = new Cactus();
        cactusArray.push(cactus);
    }
    cactusArray.map(function (a, i, o) {
        a.x < -50 && o.splice(i, 1);
        a.x -= 6;
        Collision(dino, a);
        a.draw();
    });
    if (timer % 500 === 0) {
        var bonus = new Bonus();
        bonusArray.push(bonus);
    }
    bonusArray.map(function (a, i, o) {
        a.x < -50 && o.splice(i, 1);
        a.x -= 10;
        Collision2(dino, a);
        a.draw();
    });
    if (jumping == true) {
        dino.y -= 6;
        jumpTimer++;
    }
    if (jumping == false) {
        if (dino.y < 300) {
            dino.y += 6;
        }
    }
    if (jumpTimer > 30) {
        jumping = false;
        jumpTimer = 0;
    }
    dino.draw();
}
// 충돌확인
function Collision(dino, cactus) {
    var x축차이 = cactus.x - (dino.x + dino.width);
    var y축차이 = cactus.y - (dino.y + dino.height);
    if (x축차이 < 0 && x축차이 >= -100 && y축차이 < 0 && y축차이 >= -50) {
        cancelAnimationFrame(animation);
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}
function Collision2(dino, bonus) {
    var x축차이 = bonus.x - (dino.x + dino.width);
    var y축차이 = bonus.y - (dino.y + dino.height);
    if (x축차이 < 0 && x축차이 >= -100 && y축차이 < 0 && y축차이 >= -50) {
        score += 1000;
    }
}
document.addEventListener("keydown", function (a) {
    if (a.code === "Space" && dino.y == 300) {
        jumping = true;
    }
});
document.addEventListener("keydown", function (a) {
    if (a.code === "Enter") {
        animation = requestAnimationFrame(Frame);
    }
});
