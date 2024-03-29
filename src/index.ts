import './style.css';
import { InputHandler } from './input';
import Player from './player';
import Block from './block';
import Beam from './beam';
import Item from './item';
import UI from './UI';

declare type Object = Block | Player | Beam | Item;

function MainEvent() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  const startBtn = document.getElementById('start-btn') as HTMLElement;
  const introduction = document.getElementById('introduction') as HTMLElement;
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
    skill: number;
    gameOver: boolean;

    constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
      this.input = new InputHandler(this);
      this.player = new Player(this);
      this.UI = new UI(this, this.player);
      this.blocks = [];
      this.beams = [];
      this.items = [];
      this.timer = 0;
      this.score = 0;
      this.blockInterval = 140;
      this.beamInterval = 50;
      this.difficulty = 2;
      this.beamCount = 1;
      this.skill = 1;
      this.gameOver = false;
    }

    update() {
      this.timer++;

      // player
      this.player.update(this.input.keys);

      // block
      if (this.timer % 1500 === 0) {
        this.difficulty++;
        this.blockInterval -= 2;
      }
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
          if (this.player.HP === 1) {
            this.gameOver = true;
          }
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
      if (this.timer % 1500 === 0) this.addItem('beamSpeed');
      if (this.timer % 3000 === 0) this.addItem('life');
      if (this.timer % 4000 === 0) this.addItem('beamCount');
      if (this.timer % 6666 === 0) this.addItem('skill');
      this.items.forEach((item, index, items) => {
        item.update();

        if (Collision(this.player, item)) {
          items.splice(index, 1);

          switch (item.type) {
            case 'beamSpeed':
              if (this.beamInterval > 20) this.beamInterval -= 10;
              else if (this.beamInterval > 10) this.beamInterval -= 2;
              else if (this.beamInterval > 1) this.beamInterval -= 1;
              break;
            case 'life':
              this.player.HP++;
              break;
            case 'beamCount':
              if (this.beamCount < 10) this.beamCount++;
              break;
            case 'skill':
              this.skill = 1;
              break;
          }
        }

        if (item.overScreen) {
          items.splice(index, 1);
        }
      });

      // skill
      if (
        (this.input.keys.includes('Space') ||
          (this.input.keys.includes('touchCenterX') &&
            this.input.keys.includes('touchCenterY'))) &&
        this.skill !== 0
      )
        // 한 번만 인식되게
        this.uesSkill();
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

    uesSkill() {
      this.blocks.splice(0);
      this.skill--;
    }

    restart() {
      this.player.restart();
      this.blocks = [];
      this.beams = [];
      this.items = [];
      this.timer = 0;
      this.score = 0;
      this.blockInterval = 140;
      this.beamInterval = 50;
      this.difficulty = 2;
      this.beamCount = 1;
      this.skill = 1;
      this.gameOver = false;
      animate(makeCallback(60));
    }
  }

  const game = new Game(canvas.width, canvas.height);

  const animate = (callback: (timestamp: number) => void) => {
    requestAnimationFrame(callback);
  };

  const makeCallback = (fps: number) => {
    const fpsInterval = 1000 / fps;
    let start: number;
    let then: number;

    return function callback(timestamp: number) {
      if (start === undefined && then === undefined) {
        start = window.performance.now();
        then = window.performance.now();
      }
      const elapsed = timestamp - then;
      if (elapsed >= fpsInterval) {
        then = timestamp - (elapsed % fpsInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx);
      }
      if (!game.gameOver) requestAnimationFrame(callback);
    };
  };

  function gameStart() {
    animate(makeCallback(60));
    introduction.style.display = 'none';
    startBtn.style.display = 'none';
    if (!document.fullscreenElement) {
      canvas.requestFullscreen().catch((err) => {
        alert(`${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }
  startBtn.addEventListener('click', gameStart);

  function Collision(one: Object, another: Object) {
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
