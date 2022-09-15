function Intro() {
  if ((canvas.width = 600)) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    ctx.font = 'bold 48px san-serif';
    ctx.fillText('Introduction', 50, 100);
    ctx.font = 'bold 30px san-serif';
    ctx.fillText(`Don't let the blocks pile up!`, 50, 200);
    ctx.fillText('← / a : Move to the left', 50, 300);
    ctx.fillText('Decrease the difficulty', 160, 350);
    ctx.fillText('→ / d : Move to the right', 50, 430);
    ctx.fillText('Increase the difficulty', 160, 480);
    ctx.fillText('Space : Remove all the blocks (1time)', 50, 560);
    ctx.fillText('Change Mode', 160, 610);
    ctx.fillStyle = 'red';
    ctx.fillText('Press any key to continue!', 50, 720);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    ctx.font = 'bold 48px san-serif';
  }
}

export default Intro;
