document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landing-page');
    const surprisePage = document.getElementById('surprise-page');
    const giftBox = document.getElementById('gift-box');
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');

    // Action to open the gift
    function openGift() {
        // Haptic feedback pattern (if supported, purely decorative for web)
        if (navigator.vibrate) navigator.vibrate(50);

        // Animation for opening
        landingPage.style.opacity = '0';
        landingPage.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            landingPage.classList.add('hidden');
            surprisePage.classList.remove('hidden');
            
            // Trigger reflow for transition
            void surprisePage.offsetWidth; 
            
            surprisePage.classList.add('active');
            
            // Start Confetti
            startConfetti();
        }, 400); 
    }

    giftBox.addEventListener('click', openGift);

    // Confetti Logic
    let confetti = [];
    const colors = ['#FF69B4', '#FFB7B2', '#FFD1DC', '#FFF9C4', '#B2EBF2'];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Confetto {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 8 + 4;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.speedY = Math.random() * 2 + 1; // Slower, driftier
            this.speedX = Math.random() * 2 - 1;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 2 - 1;
            this.opacity = 1;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y > canvas.height) {
                // Recycle
                this.y = -20;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            
            // Draw circle for softer look
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }

    function initConfetti() {
        confetti = [];
        for (let i = 0; i < 100; i++) {
            confetti.push(new Confetto());
        }
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach(c => {
            c.update();
            c.draw();
        });
        requestAnimationFrame(animateConfetti);
    }

    function startConfetti() {
        if (confetti.length === 0) {
            initConfetti();
            animateConfetti();
        }
    }
});

// YouTube Player Logic
// YouTube Player Logic
var player;
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: '6_LsCe4jUF8',
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'mute': 1, // Start muted to allow autoplay
            'loop': 1,
            'playlist': '6_LsCe4jUF8',
            'origin': window.location.origin
        },
        events: {
            'onReady': onPlayerReady
        }
    });
};

function onPlayerReady(event) {
    // 1. Muted autoplay is usually allowed by browsers
    event.target.mute();
    event.target.playVideo();
    
    // 2. Unmute on first interaction
    function unlockAudio() {
        if (player) {
            player.unMute();
            player.setVolume(100);
            if (player.getPlayerState() !== 1) {
                player.playVideo();
            }
        }
        // Remove listeners once done
        document.body.removeEventListener('click', unlockAudio);
        document.body.removeEventListener('touchstart', unlockAudio);
        document.body.removeEventListener('keydown', unlockAudio);
    }
    
    document.body.addEventListener('click', unlockAudio);
    document.body.addEventListener('touchstart', unlockAudio);
    document.body.addEventListener('keydown', unlockAudio);
}
