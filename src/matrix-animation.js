/**
 * Matrix Rain Animation
 * Creates a falling red code rain effect on the background
 */

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('matrix-canvas');
container.appendChild(canvas);

let width, height;
let columns;
let drops = [];
const fontSize = 16;
const characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const charArray = characters.split('');

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  columns = Math.floor(width / fontSize);
  drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
  }
}

function draw() {
  // Semi-transparent black to create trail effect (slower fade for longer trails)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
  ctx.fillRect(0, 0, width, height);

  ctx.font = `${fontSize}px 'VT323', monospace`;
  
  for (let i = 0; i < drops.length; i++) {
    const text = charArray[Math.floor(Math.random() * charArray.length)];
    
    // Red color with varying opacity for depth
    const opacity = Math.random() * 0.5 + 0.5;
    ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
    ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    
    // Reset drop to top randomly (less frequent reset for slower effect)
    if (drops[i] * fontSize > height && Math.random() > 0.995) {
      drops[i] = 0;
    }
    
    // Increment drop position (slower fall speed)
    drops[i] += 0.5;
  }
}

// Initialize
resize();
window.addEventListener('resize', resize);

// Animation loop - runs continuously
let animationId;
function animate() {
  draw();
  animationId = requestAnimationFrame(animate);
}

// Start animation
animate();
