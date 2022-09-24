import Block from '../blocks/Block';
import Bonus from '../blocks/Bonus';

declare global {
  var canvas: HTMLCanvasElement;
  var ctx: CanvasRenderingContext2D;

  var mode: 'point' | 'time';
  var difficulty: 1 | 2 | 3 | 4 | 5 | 6;
  var curStatus: 'intro' | 'main' | 'start' | 'end';
  var timer: number;
  var leftTimer: number;
  var rightTimer: number;
  var pointScore: number;
  var timeScore: number;
  var goLeft: boolean;
  var goRight: boolean;
  var canUseItem: boolean;

  var CANVAS_WIDTH: number;

  var blockArray: Block[];
  var bonusArray: Bonus[];
}
