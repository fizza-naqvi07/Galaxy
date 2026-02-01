// ============================================
// CONFIGURATION
// ============================================

// TESTING: Set to 2 minutes from now
const now = new Date();

// ACTUAL DATE: Uncomment this when ready and comment out the testing lines above
const UNLOCK_DATE = new Date('2026-02-03T00:00:00'); // February 3rd, 2026

// Secret bypass code - only you know this!
const SECRET_BYPASS = 'universe2026'; // Change this to your own secret code

console.log('Current time:', now);
console.log('Unlock time:', UNLOCK_DATE);

// Memory data for each star
const memories = {
    1: {
        image: 'mem1.jpg', // Replace with your image paths
        text: 'I genuinely had the best time at Alpha with you. From physics classes to Sir Masroor’s sessions, from packwars to posting confessions about boys in college (crying), library sessions, and so much more—every memory feels incomplete without you. If I remember A Levels with even a hint of fondness, it’s because of you. I’ve always loved our rant sessions—crying over life, physics, and stupid men—because somehow everything felt lighter when we were together.'
    },
    2: {
        image: 'mem2.jpg',
        text: 'I miss college more than I can put into words, especially knowing that we won’t be sitting next to each other in a classroom forever. Life moves so fast and gets so busy that I don’t always get to check in and ask how you’re really doing, and it hurts that sometimes months—almost a year—pass before I get to see you. Still, I’m grateful that we do find our way back to each other, and I pray we always will, InshaAllah. No matter how much time passes, I know our bond will always stay the same.'
    },
    3: {
        image: 'mem3.jpg',
        text: 'I know we have so many problems, and we’re blessed with such God-gifted families that peace is sometimes hard to find (jk), but at least we get to share all this family drama with each other. I know it can be exhausting, but I truly believe Allah has something so beautiful planned for us that one day none of this will even matter anymore. I pray that Allah keeps us protected from the wrong men until we find the one. Ameen.'
    },
    4: {
        image: 'mem4.jpg',
        text: 'I can’t believe we’re university students now (I’m literally in my fourth semester), and life has suddenly gotten so serious. Still, we’ve worked so hard to get where we are, and I truly hope you ace every milestone ahead. I really want to see you as a doctor—Dr. Manahil honestly sounds unreal. I wish you nothing but the absolute best in your academic life, and I pray that it’s kinder and less exhausting than it feels right now.'
    },
    5: {
        image: 'mem5.jpg',
        text: 'I really want to confess that I used to be the most socially inactive person before meeting you. But after we met, I’ve seen you cherish every little moment, making it feel so big and precious—and now I do the same, capturing memories to hold onto forever. Thank you for teaching me how to make aesthetic stories on Instagram, and for Allah’s sake, please come back on Instagram, behn!'
    },
    6: {
        image: 'mem6.jpg',
        text: 'I feel so proud to have graduated alongside the girl I met on the very first day. My first impression of you was that you were so mean, but it turns out you’re one of the sweetest and purest people I know. It feels amazing to share this achievement with you, and I’ll always try my best to celebrate every milestone of yours—just as much as I can. Allah, I’m literally going to cry now.'
    },
    7: {
        image: 'mem7.jpg',
        text: 'I don’t think I’m very good at making or maintaining friendships, but you’re one of those people I truly make an effort for, straight from my heart. Words can’t describe how much I love you. Thank you for always standing by my side—during my lowest moments, for giving me reality checks, for offering the best advice, for showing me the other side of every story, and for giving me such a beautiful definition of friendship and sisterhood. I love you so, so much.'
    }
};

// ============================================
// STATE MANAGEMENT
// ============================================
let currentScreen = 'timer';
let openedStars = new Set();
let timerInterval = null;
let galaxyAnimationFrame = null;

// ============================================
// SCREEN MANAGEMENT
// ============================================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(`${screenId}-screen`).classList.add('active');
    currentScreen = screenId;
    
    if (screenId === 'title') {
        setTimeout(() => typeInstruction(), 500);
    } else if (screenId === 'galaxy') {
        initGalaxy();
    }
}

// ============================================
// TIMER SCREEN
// ============================================
function updateCountdown() {
    const now = new Date();
    const difference = UNLOCK_DATE - now;
    
    if (difference <= 0) {
        clearInterval(timerInterval);
        unlockUniverse();
        return;
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    animateNumberChange('days', days);
    animateNumberChange('hours', hours);
    animateNumberChange('minutes', minutes);
    animateNumberChange('seconds', seconds);
}

function animateNumberChange(id, value) {
    const element = document.getElementById(id);
    const formattedValue = String(value).padStart(2, '0');
    
    if (element.textContent !== formattedValue) {
        element.style.transform = 'scale(1.1)';
        element.style.boxShadow = '0 8px 40px rgba(168, 192, 255, 0.6)';
        
        setTimeout(() => {
            element.textContent = formattedValue;
            element.style.transform = 'scale(1)';
            element.style.boxShadow = '0 10px 50px rgba(168, 192, 255, 0.4)';
        }, 200);
    }
}

function unlockUniverse() {
    setTimeout(() => {
        showScreen('title');
    }, 1000);
}

// ============================================
// TITLE SCREEN - TYPING EFFECT
// ============================================
function typeInstruction() {
    const text = 'Explore our galaxy and discover the memories we\'ve created together. Each star holds a piece of our journey. Move your mouse to navigate through space and click on the glowing stars to relive our moments...';
    const element = document.getElementById('instruction-text');
    element.classList.add('typing');
    let index = 0;
    
    function typeChar() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(typeChar, 30);
        }
    }
    
    typeChar();
}

// ============================================
// GALAXY CANVAS - 3X LARGER WITH REALISTIC ELEMENTS
// ============================================
let galaxyCanvas, galaxyCtx;
let backgroundStars = [];
let planets = [];
let shootingStars = [];
let nebulas = [];
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let cameraOffset = { x: 0, y: 0 };
let targetOffset = { x: 0, y: 0 };

// Galaxy size (3x viewport)
const GALAXY_WIDTH = window.innerWidth * 3;
const GALAXY_HEIGHT = window.innerHeight * 3;

function initGalaxy() {
    galaxyCanvas = document.getElementById('galaxy-canvas');
    galaxyCtx = galaxyCanvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    galaxyCanvas.addEventListener('mousemove', handleMouseMove);
    
    generateBackgroundStars();
    //generatePlanets();
    generateNebulas();
    positionMemoryStars();
    
    animateGalaxy();
}

function resizeCanvas() {
    galaxyCanvas.width = window.innerWidth;
    galaxyCanvas.height = window.innerHeight;
}

function handleMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Calculate camera movement based on mouse position
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Map mouse position to camera offset
    const maxOffsetX = (GALAXY_WIDTH - window.innerWidth) / 2;
    const maxOffsetY = (GALAXY_HEIGHT - window.innerHeight) / 2;
    
    targetOffset.x = -((mouse.x - centerX) / centerX) * maxOffsetX;
    targetOffset.y = -((mouse.y - centerY) / centerY) * maxOffsetY;
}

function generateBackgroundStars() {
    backgroundStars = [];
    // Generate 500 stars spread across the 3x galaxy
    for (let i = 0; i < 500; i++) {
        const colors = ['#ffffff', '#ffe9c4', '#d4e4ff', '#ffd4e5', '#e4d4ff'];
        backgroundStars.push({
            x: Math.random() * GALAXY_WIDTH - GALAXY_WIDTH / 2,
            y: Math.random() * GALAXY_HEIGHT - GALAXY_HEIGHT / 2,
            radius: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.8 + 0.2,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinklePhase: Math.random() * Math.PI * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            layer: Math.random() * 0.5 + 0.5 // Parallax depth
        });
    }
}

function generatePlanets() {
    planets = [];
    const planetConfigs = [
        { color: '#ff6b6b', size: 60, rings: false },
        { color: '#4ecdc4', size: 45, rings: false },
        { color: '#ffe66d', size: 80, rings: true },
        { color: '#a8dadc', size: 50, rings: false },
        { color: '#e76f51', size: 35, rings: false },
        { color: '#8b5cf6', size: 55, rings: false },
    ];
    
    planetConfigs.forEach(config => {
        planets.push({
            x: (Math.random() - 0.5) * GALAXY_WIDTH,
            y: (Math.random() - 0.5) * GALAXY_HEIGHT,
            radius: config.size,
            color: config.color,
            rings: config.rings,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: Math.random() * 0.001,
            layer: Math.random() * 0.3 // Slower parallax for planets
        });
    });
}

function generateNebulas() {
    nebulas = [];
    const nebulaColors = [
        ['#ff006e', '#8338ec', '#3a86ff'],
        ['#06ffa5', '#00d9ff', '#7209b7'],
        ['#ff9e00', '#ff006e', '#8338ec']
    ];
    
    for (let i = 0; i < 3; i++) {
        nebulas.push({
            x: (Math.random() - 0.5) * GALAXY_WIDTH,
            y: (Math.random() - 0.5) * GALAXY_HEIGHT,
            size: Math.random() * 300 + 200,
            colors: nebulaColors[i],
            layer: 0.2 // Very slow parallax
        });
    }
}

function positionMemoryStars() {
    // Position the interactive memory stars across the galaxy
    const stars = document.querySelectorAll('.interactive-star');
    const positions = [
        { x: 20, y: 25 },  // Top-left quadrant
        { x: 75, y: 20 },  // Top-right quadrant
        { x: 15, y: 60 },  // Middle-left
        { x: 85, y: 45 },  // Middle-right
        { x: 30, y: 80 },  // Bottom-left
        { x: 65, y: 75 },  // Bottom-right
        { x: 45, y: 35 },  // Upper-middle
        { x: 50, y: 50 }   // Center (final star)
    ];
    
    stars.forEach((star, index) => {
        if (positions[index]) {
            star.style.left = positions[index].x + '%';
            star.style.top = positions[index].y + '%';
        }
    });
}

function spawnShootingStar() {
    if (Math.random() < 0.01) { // 1% chance per frame
        const side = Math.floor(Math.random() * 4);
        let x, y, angle;
        
        switch(side) {
            case 0: // Top
                x = Math.random() * window.innerWidth;
                y = -10;
                angle = Math.random() * Math.PI / 3 + Math.PI / 6;
                break;
            case 1: // Right
                x = window.innerWidth + 10;
                y = Math.random() * window.innerHeight;
                angle = Math.random() * Math.PI / 3 + Math.PI * 2/3;
                break;
            case 2: // Bottom
                x = Math.random() * window.innerWidth;
                y = window.innerHeight + 10;
                angle = Math.random() * Math.PI / 3 + Math.PI * 7/6;
                break;
            case 3: // Left
                x = -10;
                y = Math.random() * window.innerHeight;
                angle = Math.random() * Math.PI / 3 - Math.PI / 6;
                break;
        }
        
        shootingStars.push({
            x: x,
            y: y,
            speedX: Math.cos(angle) * (Math.random() * 3 + 4),
            speedY: Math.sin(angle) * (Math.random() * 3 + 4),
            length: Math.random() * 80 + 60,
            opacity: 1,
            thickness: Math.random() * 2 + 1
        });
    }
}

function animateGalaxy() {
    // Smooth camera easing
    cameraOffset.x += (targetOffset.x - cameraOffset.x) * 0.08;
    cameraOffset.y += (targetOffset.y - cameraOffset.y) * 0.08;
    
    // Clear with deep space gradient
    const gradient = galaxyCtx.createRadialGradient(
        galaxyCanvas.width / 2, galaxyCanvas.height / 2, 0,
        galaxyCanvas.width / 2, galaxyCanvas.height / 2, galaxyCanvas.width
    );
    gradient.addColorStop(0, '#0a0a1a');
    gradient.addColorStop(0.5, '#050510');
    gradient.addColorStop(1, '#000000');
    galaxyCtx.fillStyle = gradient;
    galaxyCtx.fillRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);
    
    // Draw nebulas (furthest back)
    nebulas.forEach(nebula => {
        const offsetX = cameraOffset.x * nebula.layer;
        const offsetY = cameraOffset.y * nebula.layer;
        const screenX = galaxyCanvas.width / 2 + nebula.x + offsetX;
        const screenY = galaxyCanvas.height / 2 + nebula.y + offsetY;
        
        // Skip if off screen
        if (screenX < -nebula.size || screenX > galaxyCanvas.width + nebula.size ||
            screenY < -nebula.size || screenY > galaxyCanvas.height + nebula.size) {
            return;
        }
        
        const nebulaGradient = galaxyCtx.createRadialGradient(
            screenX, screenY, 0,
            screenX, screenY, nebula.size
        );
        nebula.colors.forEach((color, i) => {
            nebulaGradient.addColorStop(i / nebula.colors.length, color + '15');
        });
        nebulaGradient.addColorStop(1, 'transparent');
        
        galaxyCtx.fillStyle = nebulaGradient;
        galaxyCtx.fillRect(
            screenX - nebula.size,
            screenY - nebula.size,
            nebula.size * 2,
            nebula.size * 2
        );
    });
    
    // Draw background stars
    backgroundStars.forEach(star => {
        const offsetX = cameraOffset.x * star.layer;
        const offsetY = cameraOffset.y * star.layer;
        const screenX = galaxyCanvas.width / 2 + star.x + offsetX;
        const screenY = galaxyCanvas.height / 2 + star.y + offsetY;
        
        // Skip if off screen
        if (screenX < -10 || screenX > galaxyCanvas.width + 10 ||
            screenY < -10 || screenY > galaxyCanvas.height + 10) {
            return;
        }
        
        // Twinkling effect
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = (Math.sin(star.twinklePhase) + 1) / 2;
        const currentOpacity = star.opacity * (0.3 + twinkle * 0.7);
        
        galaxyCtx.beginPath();
        galaxyCtx.arc(screenX, screenY, star.radius, 0, Math.PI * 2);
        galaxyCtx.fillStyle = star.color;
        galaxyCtx.globalAlpha = currentOpacity;
        galaxyCtx.fill();
        
        // Add glow for brighter stars
        if (star.radius > 1) {
            galaxyCtx.shadowBlur = 5;
            galaxyCtx.shadowColor = star.color;
            galaxyCtx.fill();
            galaxyCtx.shadowBlur = 0;
        }
        
        galaxyCtx.globalAlpha = 1;
    });
    
    // Draw planets
    planets.forEach(planet => {
        const offsetX = cameraOffset.x * planet.layer;
        const offsetY = cameraOffset.y * planet.layer;
        const screenX = galaxyCanvas.width / 2 + planet.x + offsetX;
        const screenY = galaxyCanvas.height / 2 + planet.y + offsetY;
        
        // Skip if off screen
        if (screenX < -planet.radius - 50 || screenX > galaxyCanvas.width + planet.radius + 50 ||
            screenY < -planet.radius - 50 || screenY > galaxyCanvas.height + planet.radius + 50) {
            return;
        }
        
        planet.rotation += planet.rotationSpeed;
        
        // Draw planet
        galaxyCtx.save();
        galaxyCtx.translate(screenX, screenY);
        galaxyCtx.rotate(planet.rotation);
        
        const planetGradient = galaxyCtx.createRadialGradient(
            -planet.radius * 0.3, -planet.radius * 0.3, 0,
            0, 0, planet.radius
        );
        planetGradient.addColorStop(0, planet.color);
        planetGradient.addColorStop(0.7, planet.color + 'dd');
        planetGradient.addColorStop(1, '#000000');
        
        galaxyCtx.beginPath();
        galaxyCtx.arc(0, 0, planet.radius, 0, Math.PI * 2);
        galaxyCtx.fillStyle = planetGradient;
        galaxyCtx.fill();
        
        // Draw rings if applicable
        if (planet.rings) {
            galaxyCtx.strokeStyle = planet.color + '80';
            galaxyCtx.lineWidth = 3;
            galaxyCtx.beginPath();
            galaxyCtx.ellipse(0, 0, planet.radius * 1.5, planet.radius * 0.3, 0, 0, Math.PI * 2);
            galaxyCtx.stroke();
            
            galaxyCtx.lineWidth = 2;
            galaxyCtx.strokeStyle = planet.color + '40';
            galaxyCtx.beginPath();
            galaxyCtx.ellipse(0, 0, planet.radius * 1.8, planet.radius * 0.4, 0, 0, Math.PI * 2);
            galaxyCtx.stroke();
        }
        
        // Planet glow
        galaxyCtx.shadowBlur = 20;
        galaxyCtx.shadowColor = planet.color;
        galaxyCtx.fill();
        galaxyCtx.shadowBlur = 0;
        
        galaxyCtx.restore();
    });
    
    // Spawn and draw shooting stars
    spawnShootingStar();
    shootingStars.forEach((star, index) => {
        star.x += star.speedX;
        star.y += star.speedY;
        star.opacity -= 0.008;
        
        if (star.opacity <= 0 || 
            star.x < -100 || star.x > galaxyCanvas.width + 100 ||
            star.y < -100 || star.y > galaxyCanvas.height + 100) {
            shootingStars.splice(index, 1);
            return;
        }
        
        const tailLength = star.length;
        const gradient = galaxyCtx.createLinearGradient(
            star.x, star.y,
            star.x - star.speedX * 10, star.y - star.speedY * 10
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(0.5, `rgba(168, 192, 255, ${star.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(168, 192, 255, 0)');
        
        galaxyCtx.beginPath();
        galaxyCtx.moveTo(star.x, star.y);
        galaxyCtx.lineTo(star.x - star.speedX * 10, star.y - star.speedY * 10);
        galaxyCtx.strokeStyle = gradient;
        galaxyCtx.lineWidth = star.thickness;
        galaxyCtx.lineCap = 'round';
        galaxyCtx.stroke();
        
        // Add glow
        galaxyCtx.shadowBlur = 10;
        galaxyCtx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        galaxyCtx.stroke();
        galaxyCtx.shadowBlur = 0;
    });
    
    // Update memory star positions based on camera
    updateMemoryStarPositions();
    
    galaxyAnimationFrame = requestAnimationFrame(animateGalaxy);
}

function updateMemoryStarPositions() {
    const stars = document.querySelectorAll('.interactive-star');
    stars.forEach(star => {
        const baseLeft = parseFloat(star.style.left);
        const baseTop = parseFloat(star.style.top);
        
        // Convert percentage to pixel offset
        const offsetX = (baseLeft - 50) * window.innerWidth * 2 / 100;
        const offsetY = (baseTop - 50) * window.innerHeight * 2 / 100;
        
        // Apply camera offset
        const screenX = window.innerWidth / 2 + offsetX + cameraOffset.x * 0.9;
        const screenY = window.innerHeight / 2 + offsetY + cameraOffset.y * 0.9;
        
        star.style.transform = `translate(${screenX - window.innerWidth * baseLeft / 100}px, ${screenY - window.innerHeight * baseTop / 100}px)`;
    });
}

// ============================================
// INTERACTIVE STARS
// ============================================
function setupInteractiveStars() {
    const interactiveStars = document.querySelectorAll('.interactive-star:not(#final-star)');
    
    interactiveStars.forEach(star => {
        star.addEventListener('click', () => {
            const starId = star.getAttribute('data-star');
            openMemory(starId);
            openedStars.add(starId);
            star.style.opacity = '0.5'; // Mark as visited
            checkFinalStarUnlock();
        });
    });
    
    // Final star
    const finalStar = document.getElementById('final-star');
    finalStar.addEventListener('click', handleFinalStarClick);
}

function openMemory(starId) {
    const modal = document.getElementById('memory-modal');
    const memory = memories[starId];
    
    document.getElementById('memory-image').src = memory.image;
    document.getElementById('memory-description').textContent = memory.text;
    
    modal.classList.add('active');
    
    // Blur and slow galaxy
    if (galaxyCanvas) {
        galaxyCanvas.style.filter = 'blur(10px)';
        galaxyCanvas.style.opacity = '0.3';
    }
}

function closeMemory() {
    const modal = document.getElementById('memory-modal');
    modal.classList.remove('active');
    
    // Restore galaxy
    if (galaxyCanvas) {
        galaxyCanvas.style.filter = 'none';
        galaxyCanvas.style.opacity = '1';
    }
}

function checkFinalStarUnlock() {
    if (openedStars.size >= 7) {
        const finalStar = document.getElementById('final-star');
        finalStar.classList.remove('locked');
        finalStar.classList.add('unlocked');
        finalStar.querySelector('.lock-icon').textContent = '🌟';
    }
}

function handleFinalStarClick() {
    const finalStar = document.getElementById('final-star');
    
    if (finalStar.classList.contains('locked')) {
        // Shake animation
        finalStar.classList.add('shake');
        setTimeout(() => finalStar.classList.remove('shake'), 500);
        
        // Show message
        alert('Explore all the other stars first to unlock this final memory! ✨');
    } else {
        // Transition to birthday screen
        setTimeout(() => {
            showScreen('birthday');
            if (galaxyAnimationFrame) {
                cancelAnimationFrame(galaxyAnimationFrame);
            }
        }, 500);
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Check for bypass code
    const urlParams = new URLSearchParams(window.location.search);
    const bypassCode = urlParams.get('unlock');
    
    // Check if already unlocked or bypass
    const now = new Date();
    if (bypassCode === SECRET_BYPASS) {
        console.log('🔓 Bypass code accepted - skipping timer');
        showScreen('title');
    } else if (now >= UNLOCK_DATE) {
        showScreen('title');
    } else {
        // Start countdown
        updateCountdown();
        timerInterval = setInterval(updateCountdown, 1000);
    }
    
    // Setup event listeners
    document.getElementById('start-button').addEventListener('click', () => {
        showScreen('galaxy');
    });
    
    document.getElementById('close-modal').addEventListener('click', closeMemory);
    
    document.getElementById('memory-modal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeMemory();
        }
    });
    
    setupInteractiveStars();
});