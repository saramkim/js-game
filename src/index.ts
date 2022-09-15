import './global';
import './Control';
import Main from './pages/Main';
import Intro from './pages/Intro';

Intro();

addEventListener(
  'keydown',
  () => {
    curStatus = 'main';
    Main();
  },
  { once: true }
);
