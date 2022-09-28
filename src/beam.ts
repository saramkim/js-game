import Player from './player';

class Beam {
  game: any;
  width: number;
  height: number;
  x: number;
  y: number;
  speed: number;
  overScreen: boolean;

  constructor(player: Player, count: number, index: number) {
    this.width = 10;
    this.height = 30;
    this.x =
      player.x + ((player.width - this.width) / (count + 1)) * (index + 1);
    this.y = player.y;
    this.speed = 10;
    this.overScreen = false;
  }

  update() {
    this.y -= this.speed;

    if (this.y < 0) this.overScreen = true;
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = 'rgb(0,255,0)';
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Beam;
