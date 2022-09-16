import './global';
import './algorithms/Control';
import Main from './pages/Main';
import Intro from './pages/Intro';

Intro();

const goToMain = () => {
  curStatus = 'main';
  Main();
};

addEventListener('keydown', goToMain, { once: true });
addEventListener('touchend', goToMain, { once: true });
