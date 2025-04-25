// constellation.js
document.addEventListener('DOMContentLoaded', function() {
    // Set up PixiJS canvas
    const bgContainer = document.getElementById('constellation-bg');
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      transparent: true,
      antialias: true
    });
    bgContainer.appendChild(app.view);
  
    // Constellation settings
    const STAR_COUNT = window.innerWidth < 768 ? 100 : 200;
    const stars = [];
  
    // Create stars
    for (let i = 0; i < STAR_COUNT; i++) {
      const star = new PIXI.Graphics();
      const alpha = Math.max(0.1, Math.random() * 0.8);
      star.beginFill(0xFFFFFF, alpha);
      star.drawCircle(0, 0, Math.random() * 1.5);
      star.endFill();
      
      star.x = Math.random() * app.screen.width;
      star.y = Math.random() * app.screen.height;
      star.vx = Math.random() * 0.5 - 0.25;
      star.vy = Math.random() * 0.5 - 0.25;
      
      app.stage.addChild(star);
      stars.push(star);
    }
  
    // Animation loop
    app.ticker.add(() => {
      // Update star positions
      stars.forEach(star => {
        star.x += star.vx;
        star.y += star.vy;
        
        // Wrap around screen edges
        if (star.x < 0) star.x = app.screen.width;
        if (star.x > app.screen.width) star.x = 0;
        if (star.y < 0) star.y = app.screen.height;
        if (star.y > app.screen.height) star.y = 0;
      });
  
      // Draw connections
      const connections = new PIXI.Graphics();
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const alpha = 1 - distance/150;
            connections.lineStyle(0.3, 0xFFFFFF, alpha);
            connections.moveTo(stars[i].x, stars[i].y);
            connections.lineTo(stars[j].x, stars[j].y);
          }
        }
      }
      
      // Update display
      app.stage.removeChild(app.stage.getChildByName('connections'));
      app.stage.addChildAt(connections, 0);
      connections.name = 'connections';
    });
  
    // Handle window resize
    window.addEventListener('resize', () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
    });
  });