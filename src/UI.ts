import Player from './player';

class UI {
  game: any;
  player: Player;
  fontSize: number;
  fontFamily: string;
  fontColor: string;

  constructor(game: any, player: Player) {
    this.game = game;
    this.player = player;
    this.fontSize = 30;
    this.fontFamily = 'Helvetica';
    this.fontColor = 'black';
  }
  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = this.fontColor;
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    // score
    context.textAlign = 'left';
    context.fillText(`Score: ${this.game.score}`, 20, 50);
    // HP
    context.textAlign = 'right';
    context.fillText(`HP: ${this.player.HP}`, this.game.width - 20, 50);
  }
}
export default UI;
