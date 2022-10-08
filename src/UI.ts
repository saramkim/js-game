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
    this.fontFamily = 'san-serif';
    this.fontColor = 'green';
  }
  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = this.fontColor;
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.lineWidth = 3;
    context.strokeRect(0, 0, this.game.width, this.game.height);

    // score
    context.textAlign = 'left';
    context.fillText(`Score: ${this.game.score}`, 20, 50);
    // HP
    context.textAlign = 'left';
    context.fillText('♥'.repeat(this.player.HP), 20, 90);
    // skill
    context.textAlign = 'left';
    context.fillText(`${this.game.skill === 1 ? '●' : '○'}`, 20, 130);
    // game over
    if (this.game.gameOver) {
      this.fontColor = 'green';
      context.textAlign = 'center';
      context.fillText('Game Over', this.game.width / 2, this.game.height / 2);
      context.fillText(
        'press Enter to restart!',
        this.game.width / 2,
        this.game.height / 2 + 40
      );
    }
  }
}
export default UI;
