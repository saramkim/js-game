const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.width = window.innerWidth - 40;
canvas.height = window.innerHeight - 40;

const img1 = new Image();
img1.src = "bear.png";

const dino = {
  x: 100,
  y: 300,
  width: 50,
  height: 50,
  draw() {
    // ctx.fillStyle = "green";
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(img1, this.x, this.y, this.width, this.height);
  },
};

class Cactus {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor() {
    this.x = canvas.width;
    this.y = 300;
    this.width = 50;
    this.height = 50;
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
    this.x = canvas.width;
    this.y = 200;
    this.width = 50;
    this.height = 50;
  }
  draw() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

let timer = 0;
let score = 0;
const cactusArray: Cactus[] = [];
const bonusArray: Bonus[] = [];
let jumping = false;
let jumpTimer = 0;
let animation: number;

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
    const cactus = new Cactus();
    cactusArray.push(cactus);
  }
  cactusArray.map((a, i, o) => {
    a.x < -50 && o.splice(i, 1);
    a.x -= 6;

    Collision(dino, a);

    a.draw();
  });

  if (timer % 500 === 0) {
    const bonus = new Bonus();
    bonusArray.push(bonus);
  }
  bonusArray.map((a, i, o) => {
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
function Collision(dino: any, cactus: any) {
  let x축차이 = cactus.x - (dino.x + dino.width);
  let y축차이 = cactus.y - (dino.y + dino.height);

  if (x축차이 < 0 && x축차이 >= -100 && y축차이 < 0 && y축차이 >= -50) {
    cancelAnimationFrame(animation);
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function Collision2(dino: any, bonus: any) {
  let x축차이 = bonus.x - (dino.x + dino.width);
  let y축차이 = bonus.y - (dino.y + dino.height);

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
