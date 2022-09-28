import './style.css';
import { InputHandler } from './input';
import Player from './player';
import Block from './block';
import Beam from './beam';
import Item from './item';
import UI from './UI';

function MainEvent() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  canvas.width = 600;
  canvas.height = 900;

  class Game {
    width: number;
    height: number;
    input: InputHandler;
    UI: UI;
    player: Player;
    blocks: Block[];
    beams: Beam[];
    items: Item[];
    timer: number;
    score: number;
    blockInterval: number;
    beamInterval: number;
    difficulty: number;
    beamCount: number;

    constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
      this.input = new InputHandler();
      this.player = new Player(this);
      this.UI = new UI(this, this.player);
      this.blocks = [];
      this.beams = [];
      this.items = [];
      this.timer = 0;
      this.score = 0;
      this.blockInterval = 90;
      this.beamInterval = 50;
      this.difficulty = 6;
      this.beamCount = 1;
    }
    update(animation: number) {
      this.timer++;

      // player
      this.player.update(this.input.keys);

      // block
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
        if (Collision(this.player, block)) {
          if (this.player.HP === 1) cancelAnimationFrame(animation);
          this.player.HP--;
          blocks.splice(index, 1);
        }

        this.beams.forEach((beam, i, beams) => {
          if (Collision(block, beam)) {
            block.HP--;
            beams.splice(i, 1);
            if (block.HP <= 0) {
              blocks.splice(index, 1);
              this.score++;
            }
          }
        });

        block.update();
        if (block.overScreen) {
          blocks.splice(index, 1);
        }
      });

      // beam
      if (this.timer % this.beamInterval === 0) this.addBeam();
      this.beams.forEach((beam, index, beams) => {
        beam.update();
        if (beam.overScreen) {
          beams.splice(index, 1);
        }
      });

      // item
      if (this.timer % 500 === 0) this.addItem('beamSpeed');
      if (this.timer % 1000 === 0) this.addItem('beamCount');
      this.items.forEach((item, index, items) => {
        item.update();

        if (Collision(this.player, item)) {
          items.splice(index, 1);

          if (item.type === 'beamSpeed') {
            if (this.beamInterval > 10) this.beamInterval -= 10;
            else if (this.beamInterval <= 10) this.beamInterval -= 1;
            else if (this.beamInterval === 1) return;
          } else if (item.type === 'beamCount') {
            if (this.beamCount !== 6) this.beamCount++;
          }
        }

        if (item.overScreen) {
          items.splice(index, 1);
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
      this.items.forEach((item) => {
        item.draw(context);
      });
      this.UI.draw(context);
    }

    addBlock(location: number) {
      this.blocks.push(new Block(this, this.difficulty, location, this.timer));
    }

    addBeam() {
      for (let i = 0; i < this.beamCount; i++) {
        this.beams.push(new Beam(this.player, this.beamCount, i));
      }
    }

    addItem(type: string) {
      this.items.push(new Item(this, type));
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

  function Collision(one: any, another: any) {
    const xCollision =
      Math.abs(one.x - another.x) < one.width &&
      Math.abs(one.x + one.width - (another.x + another.width)) < one.width;
    const yCollision =
      Math.abs(one.y - another.y) <= one.height &&
      Math.abs(one.y + one.height - (another.y + another.height)) <= one.height;
    return xCollision && yCollision;
  }
}

window.addEventListener('load', MainEvent);
