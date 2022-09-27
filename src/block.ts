class Block {
  game: any;
  width: number;
  height: number;
  x: number;
  y: number;
  speed: number;
  fallSpeed: number;
  moveSpeed: number;
  overScreen: boolean;

  constructor(game: any, difficulty: number, location: number) {
    this.game = game;
    this.width = 50;
    this.height = 50;
    this.x =
      Math.random() * (game.width / difficulty - this.width) +
      location * (game.width / difficulty);
    this.y = 0;
    this.speed = 0;
    this.fallSpeed = 1;
    this.moveSpeed = 10;
    this.overScreen = false;
  }

  update() {
    this.x += this.speed;
    this.y += this.fallSpeed;

    if (this.y > this.game.height) this.overScreen = true;
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = 'red';
    context.fillRect(this.x, this.y, this.width, this.height);
    // ctx.drawImage(img1, this.x, this.y, this.width, this.height);
  }
}

export default Block;
