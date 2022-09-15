function Intro() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'green';
  ctx.font = 'bold 48px san-serif';
  ctx.fillText('Block a Block', 50, 400);
  ctx.font = 'bold 30px san-serif';
  ctx.fillText(`Mode: ${mode.toUpperCase()}`, 50, 250);
  mode === 'point' &&
    ctx.fillText(`difficulty: ${String(difficulty)}`, 50, 300);
  ctx.fillText("Press 'Enter' to start!", 50, 500);
}

export default Intro;
