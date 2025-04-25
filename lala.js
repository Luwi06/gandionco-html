// Helper math function
const TAU = Math.PI * 2;
const HALF_PI = Math.PI / 2;

Math.SineInOut = function(percent, amp) {
    return amp * (Math.sin(percent * TAU - HALF_PI) + 1) * 0.5;
};

let app, graphics, space;
let total_vertices = 10;
let amplitud = 20;
let width, height, halfHeight;
let gradientTexture;

function init() {
    app = new PIXI.Application({ 
        antialias: true, 
        resolution: window.devicePixelRatio, 
        transparent: true,
        width: window.innerWidth,
        height: 200 // Fixed height for wave
    });
    
    // Append to container
    document.getElementById('wave-container').appendChild(app.view);
    
    graphics = new PIXI.Graphics();
    app.stage.addChild(graphics);
    
    resize();
    window.addEventListener("resize", resize, false);
    
    // Create gradient texture once
    gradientTexture = createGradientTexture();
}

function createGradientTexture() {
    // Create a canvas for the gradient
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = 1; // Short height for horizontal gradient
    const ctx = canvas.getContext('2d');
    
    // Create horizontal gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#04ffee');   // Green (left)
    gradient.addColorStop(0.25, '#ffbc04'); // Orange (middle)
    gradient.addColorStop(.75, '#ff048a');   // Pink (right)
    
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, 1);
    
    // Create texture from canvas
    return PIXI.Texture.from(canvas);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function bezier(points) {
    let size = points.length;
    let last = size - 4;
    graphics.moveTo(points[0], points[1]);
    for (let i = 0; i < size - 2; i += 2) {
        let x0 = i ? points[i - 2] : points[0];
        let y0 = i ? points[i - 1] : points[1];
        let x1 = points[i + 0];
        let y1 = points[i + 1];
        let x2 = points[i + 2];
        let y2 = points[i + 3];
        let x3 = i !== last ? points[i + 4] : x2;
        let y3 = i !== last ? points[i + 5] : y2;
        let cp1x = x1 + (x2 - x0) / 6;
        let cp1y = y1 + (y2 - y0) / 6;
        let cp2x = x2 - (x3 - x1) / 6;
        let cp2y = y2 - (y3 - y1) / 6;
        graphics.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
    }
}

function render() {
    let time = new Date().getTime() * 0.001;
    graphics.clear();
    
    // Create wave points
    let points = [];
    for (let i = 0; i <= total_vertices; i++) {
        let x = space * i;
        let amp = Math.sin(time - i) * amplitud;
        let y = Math.SineInOut(i / total_vertices, amp);
        points.push(x, halfHeight + y);
    }
    
    // Draw wave with horizontal gradient fill
    graphics.beginTextureFill({
        texture: gradientTexture
    });
    bezier(points);
    graphics.lineTo(width, height);
    graphics.lineTo(0, height);
    graphics.lineTo(0, halfHeight);
    graphics.endFill();
}

function resize() {
    width = window.innerWidth;
    height = 200; // Fixed height
    halfHeight = height / 3.5;
    space = width / total_vertices;
    app.renderer.resize(width, height);
    
    // Recreate gradient texture when resizing
    gradientTexture = createGradientTexture();
}

// Start the animation
init();
animate();


// Add this to your JavaScript (lala.js or a new script)
document.addEventListener('DOMContentLoaded', function() {
    // Apply to all animated headings
    const headings = document.querySelectorAll('.animated-heading');
    
    headings.forEach(heading => {
        // Split into letters
        heading.innerHTML = heading.textContent.split('').map(letter => 
            `<span>${letter === ' ' ? '&nbsp;' : letter}</span>`
        ).join('');
        
        // Add hover animation reset
        heading.addEventListener('mouseenter', function() {
            const spans = this.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.animation = 'none';
                setTimeout(() => {
                    span.style.animation = `textReveal 0.6s forwards ${index * 0.05}s`;
                }, 10);
            });
        });
    });
});