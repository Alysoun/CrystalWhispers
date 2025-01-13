export default class RoomRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hoveredItem = null;
    
    // Add mouse move listener
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    
    // Define standard positions for items
    this.itemPositions = {
      mirror: { x: 50, y: 50, width: 80, height: 120 },
      table: { x: 150, y: 150, width: 120, height: 80 },
      clock: { x: 300, y: 50, width: 60, height: 60 },
      window: { x: 200, y: 30, width: 100, height: 80 },
      portraits: { x: 100, y: 40, width: 80, height: 100 },
      flowers: { x: 180, y: 140, width: 40, height: 60 },
      'music box': { x: 240, y: 140, width: 40, height: 30 },
      'rocking chair': { x: 280, y: 160, width: 60, height: 80 },
      toy: { x: 120, y: 180, width: 30, height: 30 },
      bookshelf: { x: 20, y: 40, width: 60, height: 120 },
      fireplace: { x: 320, y: 140, width: 80, height: 100 },
      'chess set': { x: 200, y: 180, width: 60, height: 60 },
      'tea set': { x: 140, y: 160, width: 40, height: 20 },
      chandelier: { x: 180, y: 20, width: 100, height: 40 },
      piano: { x: 260, y: 100, width: 100, height: 60 },
      tapestry: { x: 80, y: 30, width: 60, height: 100 },
      fountain: { x: 160, y: 120, width: 60, height: 80 },
      kaleidoscope: { x: 220, y: 170, width: 20, height: 40 },
      'snow globe': { x: 250, y: 160, width: 30, height: 40 },
      hourglass: { x: 290, y: 150, width: 20, height: 40 },
      sundial: { x: 270, y: 170, width: 50, height: 50 }
    };
  }

  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if mouse is over any item
    let foundItem = null;
    if (this.currentRoom && this.currentRoom.items) {
      for (const item of this.currentRoom.items) {
        const pos = this.getItemPosition(item.id);
        if (this.isPointInItem(x, y, pos)) {
          foundItem = item;
          break;
        }
      }
    }
    
    if (this.hoveredItem !== foundItem) {
      this.hoveredItem = foundItem;
      this.canvas.style.cursor = foundItem ? 'pointer' : 'default';
      // Redraw to show hover effect
      this.renderRoom(this.currentRoom);
    }
  }
  
  isPointInItem(x, y, pos) {
    return x >= pos.x && x <= pos.x + pos.width &&
           y >= pos.y && y <= pos.y + pos.height;
  }

  drawBackground() {
    // Set up glowing effect for the room
    this.ctx.shadowColor = '#00ff00';
    this.ctx.shadowBlur = 20;
    this.ctx.strokeStyle = '#00ff00';
    this.ctx.lineWidth = 2;
    
    // Outer glow border
    this.ctx.beginPath();
    this.ctx.rect(10, 10, 380, 280);
    this.ctx.stroke();
    
    // Inner room outline
    this.ctx.beginPath();
    this.ctx.rect(20, 20, 360, 260);
    this.ctx.stroke();
    
    // Floor line
    this.ctx.beginPath();
    this.ctx.moveTo(20, 220);
    this.ctx.lineTo(380, 220);
    this.ctx.stroke();
    
    // Add subtle grid pattern
    this.ctx.globalAlpha = 0.2;
    for (let x = 50; x < 380; x += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 220);
      this.ctx.lineTo(x, 280);
      this.ctx.stroke();
    }
    this.ctx.globalAlpha = 1.0;
  }

  drawMirror(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Mirror frame
    this.ctx.strokeRect(x, y, width, height);
    
    // Reflection effect
    this.ctx.globalAlpha = 0.3;
    this.ctx.strokeRect(x + 5, y + 5, width - 10, height - 10);
    this.ctx.globalAlpha = 1.0;
  }

  drawTable(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Table top
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height / 2);
    this.ctx.stroke();
    
    // Table legs
    this.ctx.beginPath();
    this.ctx.moveTo(x + 10, y + height / 2);
    this.ctx.lineTo(x + 10, y + height);
    this.ctx.moveTo(x + width - 10, y + height / 2);
    this.ctx.lineTo(x + width - 10, y + height);
    this.ctx.stroke();
  }

  drawClock(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Clock face
    this.ctx.beginPath();
    this.ctx.arc(x + width/2, y + height/2, width/2, 0, Math.PI * 2);
    this.ctx.stroke();
    
    // Clock hands (frozen)
    this.ctx.beginPath();
    this.ctx.moveTo(x + width/2, y + height/2);
    this.ctx.lineTo(x + width/2, y + height/4);
    this.ctx.moveTo(x + width/2, y + height/2);
    this.ctx.lineTo(x + width * 0.75, y + height/2);
    this.ctx.stroke();
  }

  drawWindow(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Window frame
    this.ctx.strokeRect(x, y, width, height);
    
    // Window panes
    this.ctx.beginPath();
    this.ctx.moveTo(x + width/2, y);
    this.ctx.lineTo(x + width/2, y + height);
    this.ctx.moveTo(x, y + height/2);
    this.ctx.lineTo(x + width, y + height/2);
    this.ctx.stroke();
  }

  drawPortraits(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Multiple frames
    for (let i = 0; i < 3; i++) {
      this.ctx.strokeRect(x + (i * 30), y, width/3 - 5, height);
      
      // Simple face outline in each frame
      this.ctx.beginPath();
      this.ctx.arc(x + (i * 30) + width/6 - 2.5, y + height/2, 10, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  drawFlowers(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Vase
    this.ctx.beginPath();
    this.ctx.moveTo(x + width/4, y + height);
    this.ctx.lineTo(x + width/2, y + height/3);
    this.ctx.lineTo(x + width * 0.75, y + height);
    this.ctx.closePath();
    this.ctx.stroke();
    
    // Flowers
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.arc(x + width/2 + (i-1)*10, y + height/4, 5, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  drawMusicBox(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Box
    this.ctx.strokeRect(x, y, width, height);
    // Decorative lid pattern
    this.ctx.beginPath();
    this.ctx.moveTo(x + 5, y + 5);
    this.ctx.lineTo(x + width - 5, y + 5);
    this.ctx.stroke();
  }

  drawRockingChair(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Chair back
    this.ctx.beginPath();
    this.ctx.moveTo(x + 10, y + 10);
    this.ctx.lineTo(x + 10, y + height - 20);
    this.ctx.lineTo(x + width - 10, y + height - 20);
    this.ctx.lineTo(x + width - 10, y + 10);
    this.ctx.stroke();
    // Rockers
    this.ctx.beginPath();
    this.ctx.arc(x + width/2, y + height, width/2, Math.PI, 0);
    this.ctx.stroke();
  }

  drawToy(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Simple wind-up toy
    this.ctx.strokeRect(x, y, width, height);
    // Wind-up key
    this.ctx.beginPath();
    this.ctx.moveTo(x + width/2, y + height);
    this.ctx.lineTo(x + width/2, y + height + 10);
    this.ctx.stroke();
  }

  drawBookshelf(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Shelf frame
    this.ctx.strokeRect(x, y, width, height);
    // Shelves
    for (let i = 1; i < 4; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y + (height * i/4));
      this.ctx.lineTo(x + width, y + (height * i/4));
      this.ctx.stroke();
    }
    // Books (simplified)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.ctx.strokeRect(
          x + 5 + (j * width/3),
          y + 5 + (i * height/4),
          width/4,
          height/5
        );
      }
    }
  }

  drawFireplace(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Fireplace opening
    this.ctx.strokeRect(x, y + height/3, width, height * 2/3);
    // Mantel
    this.ctx.strokeRect(x - 10, y + height/3, width + 20, 5);
    // Flames (simplified)
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + 10 + (i * width/3), y + height);
      this.ctx.quadraticCurveTo(
        x + 20 + (i * width/3),
        y + height/2,
        x + 30 + (i * width/3),
        y + height
      );
      this.ctx.stroke();
    }
  }

  drawChessSet(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Board
    this.ctx.strokeRect(x, y, width, height);
    // Grid (4x4 simplified)
    for (let i = 1; i < 4; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + (width * i/4), y);
      this.ctx.lineTo(x + (width * i/4), y + height);
      this.ctx.moveTo(x, y + (height * i/4));
      this.ctx.lineTo(x + width, y + (height * i/4));
      this.ctx.stroke();
    }
    // Pieces (simplified)
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.arc(x + 15 + (i * 20), y + height/2, 5, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  drawTeaSet(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Teapot
    this.ctx.beginPath();
    this.ctx.ellipse(x + width/2, y + height/2, width/3, height/2, 0, 0, Math.PI * 2);
    this.ctx.stroke();
    // Spout
    this.ctx.beginPath();
    this.ctx.moveTo(x + width/3, y + height/2);
    this.ctx.lineTo(x, y + height/3);
    this.ctx.stroke();
    // Steam
    this.ctx.beginPath();
    this.ctx.moveTo(x + width/2, y);
    this.ctx.quadraticCurveTo(x + width/2 + 10, y - 5, x + width/2, y - 10);
    this.ctx.stroke();
  }

  drawChandelier(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Central fixture
    this.ctx.beginPath();
    this.ctx.moveTo(x + width/2, y);
    this.ctx.lineTo(x + width/2, y + height/2);
    this.ctx.stroke();
    // Arms
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI/2);
      this.ctx.beginPath();
      this.ctx.moveTo(x + width/2, y + height/2);
      this.ctx.lineTo(
        x + width/2 + Math.cos(angle) * width/3,
        y + height/2 + Math.sin(angle) * height/3
      );
      this.ctx.stroke();
    }
  }

  drawPiano(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Piano body
    this.ctx.strokeRect(x, y, width, height);
    // Keys
    for (let i = 0; i < 12; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + 5 + (i * width/12), y + height - 20);
      this.ctx.lineTo(x + 5 + (i * width/12), y + height - 5);
      this.ctx.stroke();
    }
  }

  drawTapestry(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Frame
    this.ctx.strokeRect(x, y, width, height);
    // Pattern
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y + (height * i/3));
      this.ctx.quadraticCurveTo(
        x + width/2, y + (height * (i+0.5)/3),
        x + width, y + (height * i/3)
      );
      this.ctx.stroke();
    }
  }

  drawFountain(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Basin
    this.ctx.beginPath();
    this.ctx.ellipse(x + width/2, y + height * 0.7, width/2, height/4, 0, 0, Math.PI * 2);
    this.ctx.stroke();
    // Water streams
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + width/2, y + height * 0.7);
      this.ctx.quadraticCurveTo(
        x + width/2 + (i-1) * 15, y + height/3,
        x + width/2 + (i-1) * 20, y
      );
      this.ctx.stroke();
    }
  }

  drawKaleidoscope(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Tube
    this.ctx.strokeRect(x, y, width, height);
    // Pattern
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.arc(x + width/2, y + height/2, (i+1) * 5, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  drawSnowGlobe(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Globe
    this.ctx.beginPath();
    this.ctx.arc(x + width/2, y + height/2, width/2, 0, Math.PI * 2);
    this.ctx.stroke();
    // Base
    this.ctx.strokeRect(x + width/4, y + height - 10, width/2, 10);
    // Snow (dots)
    for (let i = 0; i < 5; i++) {
      this.ctx.beginPath();
      this.ctx.arc(
        x + width/2 + Math.random() * 20 - 10,
        y + height/2 + Math.random() * 20 - 10,
        1, 0, Math.PI * 2
      );
      this.ctx.stroke();
    }
  }

  drawHourglass(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Top triangle
    this.ctx.beginPath();
    this.ctx.moveTo(x + width/2, y);
    this.ctx.lineTo(x + width, y + height/2);
    this.ctx.lineTo(x, y + height/2);
    this.ctx.closePath();
    this.ctx.stroke();
    // Bottom triangle
    this.ctx.beginPath();
    this.ctx.moveTo(x + width/2, y + height);
    this.ctx.lineTo(x + width, y + height/2);
    this.ctx.lineTo(x, y + height/2);
    this.ctx.closePath();
    this.ctx.stroke();
    // Sand particles
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.arc(
        x + width/2,
        y + height/2 + (i * 5),
        1, 0, Math.PI * 2
      );
      this.ctx.stroke();
    }
  }

  drawSundial(x, y, width, height) {
    this.ctx.strokeStyle = '#00ff00';
    // Base
    this.ctx.beginPath();
    this.ctx.rect(x + width/4, y + height - 10, width/2, 10);
    this.ctx.stroke();
    // Dial face
    this.ctx.beginPath();
    this.ctx.arc(x + width/2, y + height - 10, width/3, 0, Math.PI, true);
    this.ctx.stroke();
    // Gnomon (shadow caster)
    this.ctx.beginPath();
    this.ctx.moveTo(x + width/2, y + height - 10);
    this.ctx.lineTo(x + width/2, y + height/3);
    this.ctx.stroke();
    // Multiple shadows
    for (let i = -1; i <= 1; i += 0.5) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + width/2, y + height - 10);
      this.ctx.lineTo(x + width/2 + (width/3 * i), y + height - 5);
      this.ctx.stroke();
    }
  }

  getItemPosition(itemId) {
    return this.itemPositions[itemId] || { x: 0, y: 0, width: 50, height: 50 };
  }

  renderRoom(room) {
    this.currentRoom = room;
    if (!room || !room.items) return;
    console.log('Room items:', room.items);  // Debug log

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Set global shadow properties
    this.ctx.shadowColor = '#00ff00';
    this.ctx.shadowBlur = 15;
    this.ctx.strokeStyle = '#00ff00';
    this.ctx.lineWidth = 2;
    
    // Draw room background
    this.drawBackground();
    
    // Draw each object in the room
    room.items.forEach(item => {
      console.log('Drawing item:', item.id);  // Debug log
      const position = this.getItemPosition(item.id);
      
      // Apply hover effect if this is the hovered item
      if (this.hoveredItem === item) {
        this.ctx.shadowColor = '#00ff00';
        this.ctx.shadowBlur = 30;
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 3;
      } else {
        this.ctx.shadowColor = '#00ff00';
        this.ctx.shadowBlur = 15;
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;
      }

      switch(item.id) {
        case 'mirror':
          this.drawMirror(position.x, position.y, position.width, position.height);
          break;
        case 'table':
          this.drawTable(position.x, position.y, position.width, position.height);
          break;
        case 'clock':
          this.drawClock(position.x, position.y, position.width, position.height);
          break;
        case 'window':
          this.drawWindow(position.x, position.y, position.width, position.height);
          break;
        case 'portraits':
          this.drawPortraits(position.x, position.y, position.width, position.height);
          break;
        case 'flowers':
          this.drawFlowers(position.x, position.y, position.width, position.height);
          break;
        case 'music box':
          this.drawMusicBox(position.x, position.y, position.width, position.height);
          break;
        case 'rocking chair':
          this.drawRockingChair(position.x, position.y, position.width, position.height);
          break;
        case 'toy':
          this.drawToy(position.x, position.y, position.width, position.height);
          break;
        case 'bookshelf':
          this.drawBookshelf(position.x, position.y, position.width, position.height);
          break;
        case 'fireplace':
          this.drawFireplace(position.x, position.y, position.width, position.height);
          break;
        case 'chess set':
          this.drawChessSet(position.x, position.y, position.width, position.height);
          break;
        case 'tea set':
          this.drawTeaSet(position.x, position.y, position.width, position.height);
          break;
        case 'chandelier':
          this.drawChandelier(position.x, position.y, position.width, position.height);
          break;
        case 'piano':
          this.drawPiano(position.x, position.y, position.width, position.height);
          break;
        case 'tapestry':
          this.drawTapestry(position.x, position.y, position.width, position.height);
          break;
        case 'fountain':
          this.drawFountain(position.x, position.y, position.width, position.height);
          break;
        case 'kaleidoscope':
          this.drawKaleidoscope(position.x, position.y, position.width, position.height);
          break;
        case 'snow globe':
          this.drawSnowGlobe(position.x, position.y, position.width, position.height);
          break;
        case 'hourglass':
          this.drawHourglass(position.x, position.y, position.width, position.height);
          break;
        case 'sundial':
          this.drawSundial(position.x, position.y, position.width, position.height);
          break;
      }
      
      // Draw item name on hover
      if (this.hoveredItem === item) {
        this.ctx.save();
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '14px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
          item.name,
          position.x + position.width/2,
          position.y - 10
        );
        this.ctx.restore();
      }

      this.applyDreamyEffect(position);
    });
  }

  applyDreamyEffect(area) {
    this.ctx.save();
    const now = Date.now();
    const pulse = Math.sin(now / 1000) * 0.1 + 0.9;
    
    this.ctx.globalAlpha = pulse;
    this.ctx.strokeStyle = '#00ff00';
    this.ctx.lineWidth = 0.5;
    this.ctx.shadowColor = '#00ff00';
    this.ctx.shadowBlur = 5;
    
    this.ctx.strokeRect(
      area.x - 2,
      area.y - 2,
      area.width + 4,
      area.height + 4
    );
    
    this.ctx.restore();
  }

  cleanup() {
    // Remove event listener when component unmounts
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
  }
} 