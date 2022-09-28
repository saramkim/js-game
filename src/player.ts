// const img1 = new Image();
// img1.src = "image.jpg";

class Player {
  game: any;
  width: number;
  height: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  moveSpeed: number;
  HP: number;

  constructor(game: any) {
    this.game = game;
    this.width = 50;
    this.height = 50;
    this.x = (this.game.width - 50) / 2;
    this.y = this.game.height - 200;
    this.vx = 0;
    this.vy = 0;
    this.moveSpeed = 10;
    this.HP = 3;
  }
  update(input: string[]) {
    this.x += this.vx;
    if (input.includes('ArrowLeft') || input.includes('KeyA'))
      this.vx = -this.moveSpeed;
    else if (input.includes('ArrowRight') || input.includes('KeyD'))
      this.vx = this.moveSpeed;
    else this.vx = 0;
    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;

    this.y += this.vy;
    if (input.includes('ArrowUp') || input.includes('KeyW'))
      this.vy = -this.moveSpeed;
    else if (input.includes('ArrowDown') || input.includes('KeyS'))
      this.vy = this.moveSpeed;
    else this.vy = 0;

    if (this.y < this.game.height / 2 - this.height)
      this.y = this.game.height / 2 - this.height;
    if (this.y > this.game.height - this.height)
      this.y = this.game.height - this.height;
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = 'green';
    context.fillRect(this.x, this.y, this.width, this.height);
    // ctx.drawImage(img1, this.x, this.y, this.width, this.height);
  }

  onBottom() {
    return;
  }
}

export default Player;
