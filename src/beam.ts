import Player from './player';

class Beam {
  game: any;
  width: number;
  height: number;
  x: number;
  y: number;
  speed: number;
  overScreen: boolean;

  constructor(player: Player) {
    this.width = 10;
    this.height = 30;
    this.x = player.x + (player.width - this.width) / 2;
    this.y = player.y;
    this.speed = 10;
    this.overScreen = false;
  }

  update() {
    this.y -= this.speed;

    if (this.y < 0) this.overScreen = true;
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = 'green';
    context.fillRect(this.x, this.y, this.width, this.height);
    // ctx.drawImage(img1, this.x, this.y, this.width, this.height);
  }
}

export default Beam;
