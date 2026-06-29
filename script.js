// ============ PASSWORD VERIFICATION ============
const correctPassword = '28/08/2006';
const passwordInput = document.getElementById('passwordInput');
const submitBtn = document.getElementById('submitBtn');
const errorMsg = document.getElementById('errorMsg');

submitBtn.addEventListener('click', verifyPassword);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') verifyPassword();
});

function verifyPassword() {
    const entered = passwordInput.value.trim();
    
    if (entered === correctPassword) {
        errorMsg.textContent = '';
        playSound('success');
        switchScreen('passwordScreen', 'heartScreen');
    } else {
        errorMsg.textContent = '❌ Please enter the correct password';
        passwordInput.value = '';
        passwordInput.focus();
        playSound('click');
    }
}

// ============ SCREEN MANAGEMENT ============
function switchScreen(fromScreen, toScreen) {
    const from = document.getElementById(fromScreen);
    const to = document.getElementById(toScreen);
    
    from.classList.remove('active');
    setTimeout(() => {
        to.classList.add('active');
    }, 100);
}

// ============ HEART CLICK ============
const clickHeart = document.getElementById('clickHeart');
clickHeart.addEventListener('click', () => {
    playSound('click');
    clickHeart.style.animation = 'none';
    setTimeout(() => {
        clickHeart.style.animation = '';
    }, 10);
    
    switchScreen('heartScreen', 'loadingScreen');
    
    // Show loading for 3 seconds
    setTimeout(() => {
        createFireworks();
        setTimeout(() => {
            switchScreen('loadingScreen', 'wishesScreen');
            createConfetti();
        }, 1500);
    }, 1500);
});

// ============ OPEN HEART BUTTON ============
const openHeartBtn = document.getElementById('openHeartBtn');
openHeartBtn.addEventListener('click', () => {
    playSound('click');
    switchScreen('wishesScreen', 'cardScreen');
});

// ============ CARD FLIP ============
const card3d = document.getElementById('card3d');
card3d.addEventListener('click', () => {
    card3d.classList.toggle('flipped');
    playSound('click');
});

// ============ AUDIO FUNCTIONS ============
function playSound(type) {
    const audioElement = document.getElementById(type === 'click' ? 'clickSound' : 'successSound');
    
    if (type === 'click') {
        // Click sound - short beep
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'success') {
        // Success sound - ding
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        
        for (let i = 0; i < 3; i++) {
            const osc = audioContext.createOscillator();
            const g = audioContext.createGain();
            
            osc.connect(g);
            g.connect(audioContext.destination);
            
            osc.frequency.setValueAtTime(1000 + (i * 200), now);
            osc.type = 'sine';
            
            g.gain.setValueAtTime(0.2, now + (i * 0.1));
            g.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.1) + 0.2);
            
            osc.start(now + (i * 0.1));
            osc.stop(now + (i * 0.1) + 0.2);
        }
    }
}

// ============ CONFETTI ANIMATION ============
function createConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const ctx = canvas.getContext('2d');
    const confetti = [];
    
    class Confetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = Math.random() * 5 + 5;
            this.size = Math.random() * 8 + 4;
            this.color = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8B94', '#FFB6C1', '#FF69B4'][Math.floor(Math.random() * 7)];
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.2; // gravity
            this.rotation += this.rotationSpeed;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
        
        isOffScreen() {
            return this.y > canvas.height;
        }
    }
    
    // Create confetti
    for (let i = 0; i < 100; i++) {
        confetti.push(new Confetti());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach((p, index) => {
            p.update();
            p.draw();
            
            if (p.isOffScreen()) {
                confetti.splice(index, 1);
            }
        });
        
        if (confetti.length > 0) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// ============ FIREWORKS ANIMATION ============
function createFireworks() {
    const canvas = document.getElementById('fireworksCanvas');
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const ctx = canvas.getContext('2d');
    const fireworks = [];
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 10;
            this.vy = (Math.random() - 0.5) * 10;
            this.life = 1;
            this.decay = Math.random() * 0.015 + 0.015;
            this.color = ['#FF6B6B', '#FFD700', '#FF69B4', '#00CED1'][Math.floor(Math.random() * 4)];
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.1;
            this.life -= this.decay;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Create fireworks at multiple points
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < 200; i++) {
        fireworks.push(new Particle(centerX, centerY));
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        fireworks.forEach((p, index) => {
            p.update();
            p.draw();
            
            if (p.life <= 0) {
                fireworks.splice(index, 1);
            }
        });
        
        if (fireworks.length > 0) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// ============ RESPONSIVE ============
window.addEventListener('resize', () => {
    const confettiCanvas = document.getElementById('confettiCanvas');
    const fireworksCanvas = document.getElementById('fireworksCanvas');
    
    if (confettiCanvas) {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    if (fireworksCanvas) {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
    }
});

// Initialize on load
window.addEventListener('load', () => {
    passwordInput.focus();
});