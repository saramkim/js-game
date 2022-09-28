class Item {
  game: any;
  width: number;
  height: number;
  x: number;
  y: number;
  speed: number;
  overScreen: boolean;
  type: string;
  color: any;

  constructor(game: any, type: string) {
    this.width = 50;
    this.height = 50;
    this.x = Math.random() * (game.width - this.width);
    this.y = 0;
    this.speed = 10;
    this.overScreen = false;
    this.type = type;
    this.color = { beamSpeed: 'blue', beamCount: 'gold' }[this.type];
  }

  update() {
    this.y += this.speed;

    if (this.y < 0) this.overScreen = true;
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
    // ctx.drawImage(img1, this.x, this.y, this.width, this.height);
  }
}

export default Item;
