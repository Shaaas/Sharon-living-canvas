let dots = [];

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent(document.body);

  for (let i = 0; i < 140; i++) {
    dots.push({
      x: random(width),
      y: random(height),
      r: random(1, 3),
      dx: random(-0.25, 0.25),
      dy: random(-0.25, 0.25)
    });
  }
}

function draw() {
  clear();

  dots.forEach(dot => {
    dot.x += dot.dx;
    dot.y += dot.dy;

    if (dot.x < 0 || dot.x > width) dot.dx *= -1;
    if (dot.y < 0 || dot.y > height) dot.dy *= -1;

    const d = dist(mouseX, mouseY, dot.x, dot.y);
    const alpha = d < 120 ? 200 : 120;

    noStroke();
    fill(255, 255, 255, alpha);
    circle(dot.x, dot.y, dot.r);
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

