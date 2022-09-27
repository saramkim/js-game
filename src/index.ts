import './style.css';
import { InputHandler } from './input';
import Player from './player';
import Block from './block';
import Beam from './beam';

function MainEvent() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  canvas.width = 600;
  canvas.height = 900;

  class Game {
    width: number;
    height: number;
    input: InputHandler;
    player: Player;
    blocks: Block[];
    beams: Beam[];
    timer: number;
    blockInterval: number;
    difficulty: number;

    constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
      this.input = new InputHandler();
      this.player = new Player(this);
      this.blocks = [];
      this.beams = [];
      this.timer = 0;
      this.blockInterval = 90;
      this.difficulty = 6;
    }
    update(animation: number) {
      this.timer++;
      this.player.update(this.input.keys);
      for (let i = 0; i < this.difficulty; i++) {
        if (
          (this.timer + Math.round(this.blockInterval / this.difficulty) * i) %
            this.blockInterval ===
          0
        ) {
          this.addBlock(i);
        }
      }
      this.blocks.forEach((block, index, blocks) => {
        if (Collision(this.player, block)) cancelAnimationFrame(animation);

        this.beams.forEach((beam, i, beams) => {
          if (Collision(block, beam)) {
            blocks.splice(index, 1);
            beams.splice(i, 1);
          }
        });

        block.update();
        if (block.overScreen) {
          blocks.splice(index, 1);
        }
      });

      if (this.timer % 50 === 0) this.addBeam();

      this.beams.forEach((beam, index, beams) => {
        beam.update();
        if (beam.overScreen) {
          beams.splice(index, 1);
        }
      });
    }

    draw(context: CanvasRenderingContext2D) {
      this.player.draw(context);
      this.blocks.forEach((block) => {
        block.draw(context);
      });
      this.beams.forEach((beam) => {
        beam.draw(context);
      });
    }

    addBlock(location: number) {
      this.blocks.push(new Block(this, this.difficulty, location));
    }

    addBeam() {
      this.beams.push(new Beam(this.player));
    }
  }

  const game = new Game(canvas.width, canvas.height);

  function animate() {
    const animation = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(animation);
    game.draw(ctx);
  }
  animate();

  function Collision(pre: any, cur: any) {
    const xCollision = Math.abs(pre.x - cur.x) < pre.width;
    const yCollision = Math.abs(pre.y - cur.y) < pre.height;
    return xCollision && yCollision;
  }
}

window.addEventListener('load', MainEvent);
