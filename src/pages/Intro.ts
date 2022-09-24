function Intro() {
  if (canvas.width === CANVAS_WIDTH) {
    // on PC
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    ctx.font = 'bold 48px san-serif';
    ctx.fillText('Introduction', 50, 100);
    ctx.font = 'bold 30px san-serif';
    ctx.fillText(`Don't let the blocks pile up!`, 50, 200);
    ctx.fillText('← / a : Move to the Left', 50, 300);
    ctx.fillText('Decrease the Difficulty', 160, 350);
    ctx.fillText('→ / d : Move to the Right', 50, 430);
    ctx.fillText('Increase the Difficulty', 160, 480);
    ctx.fillText('Space : Use Skill (1time)', 50, 560);
    ctx.fillText('Change Mode', 160, CANVAS_WIDTH);
    ctx.fillStyle = 'red';
    ctx.fillText('Press any key to continue!', 50, 720);
  } else {
    // on Mobile
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    ctx.font = 'bold 48px san-serif';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.font = 'bold 30px san-serif';
    ctx.fillText(`Use Skill (1time)`, canvas.width / 5, 200);
    ctx.fillText(`Change Mode`, canvas.width / 5, 250);
    ctx.font = 'bold 50px san-serif';
    ctx.fillText(`←`, canvas.width / 5, 620);
    ctx.fillText(`→`, (canvas.width / 3) * 2, 620);
  }
}

export default Intro;
