// const img1 = new Image();
// img1.src = "image.jpg";

const player = {
  width: 50,
  height: 50,
  x: (canvas.width - 50) / 2,
  y: canvas.height - 50,
  draw() {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // ctx.drawImage(img1, this.x, this.y, this.width, this.height);
  },
  moveLeft(speed: number) {
    this.x -= speed;
  },
  moveRight(speed: number) {
    this.x += speed;
  },
};

export default player;
