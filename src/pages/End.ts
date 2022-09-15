function End() {
  ctx.clearRect(0, 200, canvas.width, 400);
  ctx.fillStyle = 'green';
  ctx.font = 'bold 48px san-serif';
  mode === 'point' && ctx.fillText(String(pointScore), 50, 300);
  mode === 'time' && ctx.fillText(String(timeScore), 50, 300);
  ctx.fillText('Game Over', 50, 400);
  ctx.font = 'bold 30px san-serif';
  ctx.fillStyle = 'red';
  ctx.fillText('Enter : Restart  /  ESC : Go to Main', 50, 500);
}
export default End;
