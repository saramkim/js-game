class Block {
  game: any;
  width: number;
  height: number;
  x: number;
  y: number;
  speed: number;
  fallSpeed: number;
  overScreen: boolean;
  HP: number;
  color: string;

  constructor(game: any, difficulty: number, location: number, timer: number) {
    this.game = game;
    this.width = 50;
    this.height = 50;
    this.x =
      Math.random() * (game.width / difficulty - this.width) +
      location * (game.width / difficulty);
    this.y = 0;
    this.speed = 0;
    this.fallSpeed = 1 + timer / 10000;
    this.overScreen = false;
    this.HP = Math.ceil(timer / 3000);
    this.color = 'black';
  }

  update() {
    this.x += this.speed;
    this.y += this.fallSpeed;

    if (this.HP === 9) this.color = 'rgb(0,0,0)';
    if (this.HP === 8) this.color = 'rgb(85,0,0)';
    if (this.HP === 7) this.color = 'rgb(170,0,0)';
    if (this.HP === 6) this.color = 'rgb(255,0,0)';
    if (this.HP === 5) this.color = 'rgb(255,0,85)';
    if (this.HP === 4) this.color = 'rgb(255,0,170)';
    if (this.HP === 3) this.color = 'rgb(255,0,255)';
    if (this.HP === 2) this.color = 'rgb(255,85,255)';
    if (this.HP === 1) this.color = 'rgb(255,170,255)';

    if (this.y > this.game.height) this.overScreen = true;
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
    // ctx.drawImage(img1, this.x, this.y, this.width, this.height);
  }
}

export default Block;
