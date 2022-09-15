class Block {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(location: number) {
    this.width = 50;
    this.height = 50;
    this.x =
      Math.random() * (canvas.width / difficulty - this.width) +
      location * (canvas.width / difficulty);
    this.y = 0;
  }
  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Block;
