/* ============================
   CHARM'S BIRTHDAY WEBSITE
   ============================ */

const ALL_IMAGES = [
    'img/aim.png',
    'img/black.png',
    'img/charm.png',
    'img/enjoy.png',
    'img/inspire.png',
    'img/petals.png',
    'img/priya 2.png',
    'img/priya 3.png',
    'img/priya 6.png',
    'img/priya dream.png',
    'img/priya nurse .png',
    'img/priya police.png',
    'img/priya3.png',
    'img/to be.png'
];

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initFloatingHearts();
    initScrollReveal();
    initDotNav();
    initFloatingGallery();
    initSurpriseButton();
    initHeartPhotoGrid();
    initFinalHearts();
    initMusic();
});

/* ============================
   PARTICLE SYSTEM
   ============================ */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const COLORS = ['#ff2d95', '#a855f7', '#fbbf24', '#e040fb', '#22d3ee'];

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.alpha = Math.random() * 0.5 + 0.1;
            this.pulse = Math.random() * Math.PI * 2;
        }
        update() {
            this.x += this.speedX; this.y += this.speedY;
            this.pulse += 0.02;
            this.alpha = (Math.sin(this.pulse) + 1) * 0.2 + 0.05;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 15; ctx.shadowColor = this.color;
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        }
    }

    const count = Math.min(70, Math.floor(window.innerWidth * window.innerHeight / 18000));
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) {
                    ctx.save();
                    ctx.globalAlpha = (1 - dist / 110) * 0.07;
                    ctx.strokeStyle = particles[i].color;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

/* ============================
   FLOATING HEARTS (Hero)
   ============================ */
function initFloatingHearts() {
    const hero = document.getElementById('hero');
    const hearts = ['💖', '💗', '💕', '💝', '✨', '🌸', '💜'];

    function createHeart() {
        const heart = document.createElement('span');
        heart.classList.add('floating-heart');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.bottom = '-30px';
        heart.style.fontSize = (Math.random() * 16 + 12) + 'px';
        heart.style.animationDuration = (Math.random() * 5 + 6) + 's';
        heart.style.animationDelay = (Math.random() * 2) + 's';
        hero.appendChild(heart);
        setTimeout(() => heart.remove(), 12000);
    }
    for (let i = 0; i < 6; i++) setTimeout(createHeart, i * 800);
    setInterval(createHeart, 2000);
}

/* ============================
   SCROLL REVEAL
   ============================ */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ============================
   DOT NAV
   ============================ */
function initDotNav() {
    const dots = document.querySelectorAll('.dot');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                dots.forEach(d => d.classList.remove('active'));
                const dot = document.querySelector(`.dot[data-section="${entry.target.id}"]`);
                if (dot) dot.classList.add('active');
            }
        });
    }, { threshold: 0.35 });
    document.querySelectorAll('.section').forEach(s => observer.observe(s));
}

/* ============================
   FLOATING PHOTO GALLERY + LIGHTBOX
   ============================ */
function initFloatingGallery() {
    const container = document.getElementById('floating-photos');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    let currentIndex = 0;

    const captions = [
        'A beautiful soul 💖', 'Precious moments 💗', 'Radiant smile 🌸',
        'Forever treasured ✨', 'Strength and grace 👑', 'Classroom memories 📚',
        'Beautiful bond 💝', 'Together with friends 🤗', 'Team spirit 🌟',
        'Happy times 💫', 'Sweet snap 📸', 'Special bond 💜',
        'Determined dreams 🎯', 'Identity of a fighter 🪪'
    ];

    // 14 balanced positions (% left, % top, px width, px height)
    const positions = [
        { x: 1, y: 2, w: 130, h: 150 },
        { x: 18, y: 0, w: 120, h: 140 },
        { x: 35, y: 5, w: 125, h: 145 },
        { x: 54, y: 1, w: 130, h: 150 },
        { x: 73, y: 4, w: 120, h: 140 },
        { x: 5, y: 30, w: 135, h: 155 },
        { x: 22, y: 33, w: 120, h: 140 },
        { x: 42, y: 28, w: 130, h: 150 },
        { x: 62, y: 32, w: 125, h: 145 },
        { x: 78, y: 29, w: 120, h: 140 },
        { x: 8, y: 60, w: 125, h: 145 },
        { x: 28, y: 63, w: 130, h: 150 },
        { x: 50, y: 58, w: 120, h: 140 },
        { x: 70, y: 62, w: 130, h: 150 },
    ];

    // Responsive size scaling
    const isMobile = window.innerWidth <= 768;
    const isSmall = window.innerWidth <= 480;
    const scale = isSmall ? 0.5 : isMobile ? 0.65 : 1;

    const shuffled = [...ALL_IMAGES].sort(() => Math.random() - 0.5);
    const galleryData = [];

    shuffled.forEach((src, i) => {
        if (i >= 14) return;
        const pos = positions[i];
        const div = document.createElement('div');
        div.className = 'float-photo';
        div.dataset.index = i;

        // Position (percentage-based for responsiveness)
        div.style.left = pos.x + '%';
        div.style.top = pos.y + '%';
        div.style.width = Math.round(pos.w * scale) + 'px';
        div.style.height = Math.round(pos.h * scale) + 'px';

        // Randomized drift animation properties
        const rot = (Math.random() - 0.5) * 8;
        const dx = (Math.random() - 0.5) * 18;
        const dy = (Math.random() - 0.5) * 16;
        const drot = (Math.random() - 0.5) * 4;
        div.style.setProperty('--rot', rot + 'deg');
        div.style.setProperty('--dx', dx + 'px');
        div.style.setProperty('--dy', dy + 'px');
        div.style.setProperty('--drot', drot + 'deg');
        div.style.setProperty('--drift-dur', (5 + Math.random() * 5) + 's');
        div.style.setProperty('--drift-delay', (Math.random() * 4) + 's');
        div.style.zIndex = Math.floor(Math.random() * 5) + 1;

        div.innerHTML = `<img src="${src}" alt="Memory" loading="lazy">`;
        container.appendChild(div);

        galleryData.push({ src, caption: captions[i] || 'Beautiful moment' });
    });

    // Lightbox functions
    function openLightbox(i) {
        currentIndex = i;
        lightboxImg.src = galleryData[i].src;
        lightboxCaption.textContent = galleryData[i].caption;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    function nav(dir) {
        currentIndex = (currentIndex + dir + galleryData.length) % galleryData.length;
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = galleryData[currentIndex].src;
            lightboxCaption.textContent = galleryData[currentIndex].caption;
            lightboxImg.style.opacity = '1';
        }, 200);
    }

    // Wire clicks
    container.querySelectorAll('.float-photo').forEach(ph => {
        ph.addEventListener('click', () => openLightbox(parseInt(ph.dataset.index)));
    });
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', () => nav(-1));
    document.querySelector('.lightbox-next').addEventListener('click', () => nav(1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') nav(-1);
        if (e.key === 'ArrowRight') nav(1);
    });
}



/* ============================
   SURPRISE + CONFETTI
   ============================ */
function initSurpriseButton() {
    const btn = document.getElementById('surprise-btn');
    const reveal = document.getElementById('surprise-reveal');
    btn.addEventListener('click', () => {
        btn.style.display = 'none';
        reveal.classList.remove('hidden');
        triggerConfetti();
    });
}

function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.add('active');

    const confetti = [];
    const COLORS = ['#ff2d95', '#a855f7', '#fbbf24', '#e040fb', '#22d3ee', '#ff6b6b', '#fff'];

    for (let i = 0; i < 250; i++) {
        confetti.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 200,
            y: canvas.height / 2,
            size: Math.random() * 8 + 4,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            shape: ['circle', 'rect', 'heart'][Math.floor(Math.random() * 3)],
            speedX: (Math.random() - 0.5) * 20,
            speedY: (Math.random() - 0.5) * 20 - 10,
            gravity: 0.14,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 12,
            alpha: 1,
            decay: Math.random() * 0.004 + 0.002
        });
    }

    function drawHeart(ctx, s) {
        ctx.beginPath();
        const h = s * 0.3;
        ctx.moveTo(0, h);
        ctx.bezierCurveTo(0, 0, -s / 2, 0, -s / 2, h);
        ctx.bezierCurveTo(-s / 2, (s + h) / 2, 0, (s + h) / 1.2, 0, s);
        ctx.bezierCurveTo(0, (s + h) / 1.2, s / 2, (s + h) / 2, s / 2, h);
        ctx.bezierCurveTo(s / 2, 0, 0, 0, 0, h);
        ctx.fill();
    }

    let frame = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        confetti.forEach(c => {
            if (c.alpha <= 0) return;
            alive = true;
            c.speedY += c.gravity; c.x += c.speedX; c.y += c.speedY;
            c.rotation += c.rotationSpeed; c.speedX *= 0.99; c.alpha -= c.decay;

            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate((c.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, c.alpha);
            ctx.fillStyle = c.color;

            if (c.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, c.size, 0, Math.PI * 2); ctx.fill(); }
            else if (c.shape === 'rect') { ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6); }
            else { drawHeart(ctx, c.size); }
            ctx.restore();
        });
        frame++;
        if (alive && frame < 400) requestAnimationFrame(animate);
        else canvas.classList.remove('active');
    }
    animate();
}

/* ============================
   HEART-SHAPED PHOTO GRID
   ============================ */
function initHeartPhotoGrid() {
    const grid = document.getElementById('heart-photo-grid');
    const shuffled = [...ALL_IMAGES].sort(() => Math.random() - 0.5);

    // 14 positions forming a heart shape (% coordinates)
    const P = [
        // Top-left lobe
        { x: 15, y: 5, w: 15, h: 15 },
        { x: 3, y: 20, w: 15, h: 15 },
        { x: 19, y: 20, w: 15, h: 15 },
        // Top-right lobe
        { x: 67, y: 5, w: 15, h: 15 },
        { x: 64, y: 20, w: 15, h: 15 },
        { x: 80, y: 20, w: 15, h: 15 },
        // Center bridge
        { x: 35, y: 10, w: 15, h: 15 },
        { x: 50, y: 10, w: 15, h: 15 },
        // Middle row
        { x: 5, y: 38, w: 15, h: 15 },
        { x: 80, y: 38, w: 15, h: 15 },
        // Lower converge
        { x: 18, y: 55, w: 15, h: 15 },
        { x: 66, y: 55, w: 15, h: 15 },
        // Bottom point
        { x: 32, y: 70, w: 15, h: 15 },
        { x: 52, y: 70, w: 15, h: 15 },
    ];

    shuffled.forEach((src, i) => {
        if (i >= 14) return;
        const pos = P[i];
        const cell = document.createElement('div');
        cell.className = 'heart-photo-cell';
        cell.style.left = pos.x + '%';
        cell.style.top = pos.y + '%';
        cell.style.width = pos.w + '%';
        cell.style.height = pos.h + '%';
        cell.innerHTML = `<img src="${src}" alt="Memory">`;
        grid.appendChild(cell);
    });
}

/* ============================
   FINAL HEARTS
   ============================ */
function initFinalHearts() {
    const container = document.getElementById('final-hearts');
    const hearts = ['💖', '💗', '💕', '💝', '❤️', '💜', '🩷'];

    function createHeart() {
        const heart = document.createElement('span');
        heart.classList.add('floating-heart');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.bottom = '-30px';
        heart.style.fontSize = (Math.random() * 20 + 14) + 'px';
        heart.style.animationDuration = (Math.random() * 4 + 5) + 's';
        heart.style.animationDelay = '0s';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 10000);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                for (let i = 0; i < 5; i++) setTimeout(createHeart, i * 600);
                const interval = setInterval(createHeart, 1500);
                const cleanup = new IntersectionObserver((e) => {
                    if (!e[0].isIntersecting) { clearInterval(interval); cleanup.disconnect(); }
                });
                cleanup.observe(entry.target);
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });
    observer.observe(container.closest('.final-section'));
}

/* ============================
   MUSIC
   ============================ */
function initMusic() {
    const btn = document.getElementById('music-toggle');
    let audio = null, playing = false;
    const url = 'https://cdn.pixabay.com/audio/2024/11/29/audio_d3e552ad22.mp3';

    btn.addEventListener('click', () => {
        if (!audio) { audio = new Audio(url); audio.loop = true; audio.volume = 0.3; }
        if (playing) {
            audio.pause(); btn.classList.remove('playing');
            btn.querySelector('.icon').textContent = '🎵';
        } else {
            audio.play().catch(() => { });
            btn.classList.add('playing');
            btn.querySelector('.icon').textContent = '🔊';
        }
        playing = !playing;
    });
}
