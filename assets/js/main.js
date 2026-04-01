/* ============================================
   MAIN.JS — Portfolio Interactions
   ============================================ */

/* Wait for GSAP to load (deferred scripts) */
window.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure deferred GSAP scripts have executed
    requestAnimationFrame(initPortfolio);
});

function initPortfolio() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        // Retry if GSAP hasn't loaded yet
        setTimeout(initPortfolio, 50);
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    initScrollProgress();
    initAmbientCursor();
    initSpaceGrid();
    initHeroAnimations();
    initScrollReveals();
    initMagneticHovers();
    initParallax();
    initStatCounters();
    initSmoothScroll();
    initActiveNavTracking();
    initVideoLazyLoad();
}

/* -- Mobile Nav -- */
function toggleMobileNav() {
    document.getElementById('hamburger').classList.toggle('active');
    document.getElementById('mobileNav').classList.toggle('active');
    document.body.style.overflow = document.getElementById('mobileNav').classList.contains('active') ? 'hidden' : '';
}
function closeMobileNav() {
    document.getElementById('hamburger').classList.remove('active');
    document.getElementById('mobileNav').classList.remove('active');
    document.body.style.overflow = '';
}

/* -- Scroll Progress -- */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (scrollHeight > 0) {
            progressBar.style.width = ((scrollTop / scrollHeight) * 100) + '%';
        }
    }, { passive: true });
}

/* -- Ambient Cursor (disabled on touch devices) -- */
function initAmbientCursor() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const cursor = document.querySelector('.ambient-cursor');

    if (!cursor) return;

    if (isTouchDevice) {
        cursor.style.display = 'none';
        return;
    }

    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

    document.addEventListener('mousemove', e => {
        targetX = e.clientX;
        targetY = e.clientY;
    }, { passive: true });

    function animate() {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;
        requestAnimationFrame(animate);
    }
    animate();
}

/* -- Dynamic Space-Time Grid -- */
function initSpaceGrid() {
    const canvas = document.getElementById('spaceGrid');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height, cols, rows;
    const cellSize = 48;
    let points = [];
    
    let targetX = -1000, targetY = -1000;
    let currentX = -1000, currentY = -1000;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);
        
        cols = Math.ceil(width / cellSize) + 2;
        rows = Math.ceil(height / cellSize) + 2;
        
        points = [];
        for (let i = 0; i <= rows; i++) {
            let row = [];
            for (let j = 0; j <= cols; j++) {
                row.push({ baseX: (j - 1) * cellSize, baseY: (i - 1) * cellSize, x: 0, y: 0 });
            }
            points.push(row);
        }
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    if (!isTouchDevice) {
        document.addEventListener('mousemove', e => {
            targetX = e.clientX;
            targetY = e.clientY;
        }, { passive: true });
    }
    
    function render() {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        
        ctx.clearRect(0, 0, width, height);
        
        const gravityRadius = 400;
        const gravityStrength = 0.6;
        
        // Displace points
        for (let i = 0; i <= rows; i++) {
            for (let j = 0; j <= cols; j++) {
                let pt = points[i][j];
                let dx = currentX - pt.baseX;
                let dy = currentY - pt.baseY;
                let dist = Math.sqrt(dx * dx + dy * dy);
                
                pt.x = pt.baseX;
                pt.y = pt.baseY;
                
                if (dist < gravityRadius && !isTouchDevice) {
                    let pull = Math.pow((gravityRadius - dist) / gravityRadius, 2) * gravityStrength;
                    pt.x += dx * pull;
                    pt.y += dy * pull;
                }
            }
        }
        
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
        ctx.lineWidth = 1;
        
        // Draw horizontals
        for (let i = 0; i <= rows; i++) {
            ctx.moveTo(points[i][0].x, points[i][0].y);
            for (let j = 1; j <= cols; j++) {
                ctx.lineTo(points[i][j].x, points[i][j].y);
            }
        }
        
        // Draw verticals
        for (let j = 0; j <= cols; j++) {
            ctx.moveTo(points[0][j].x, points[0][j].y);
            for (let i = 1; i <= rows; i++) {
                ctx.lineTo(points[i][j].x, points[i][j].y);
            }
        }
        
        ctx.stroke();
        requestAnimationFrame(render);
    }
    
    render();
}


/* -- Hero Entrance Timeline -- */
function initHeroAnimations() {
    const heroTL = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set("nav", { y: -30, opacity: 0 });
    gsap.set(".gsap-name-line", { yPercent: 110 });
    gsap.set(".gsap-hero", { opacity: 0, y: 25 });

    heroTL
        .to("nav", { y: 0, opacity: 1, duration: 0.8 })
        .to(".gsap-name-line", { yPercent: 0, duration: 1.6, stagger: 0.15, ease: "expo.out" }, "-=0.3")
        .to(".gsap-hero", { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 }, "-=1");
}

/* -- Scroll Reveals -- */
function initScrollReveals() {
    gsap.utils.toArray('.gsap-el').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 1, ease: "power2.out",
                scrollTrigger: { trigger: el, start: "top 87%", toggleActions: "play none none reverse" }
            }
        );
    });

    /* Marginalia Side-slide */
    gsap.utils.toArray('.gsap-el-delay').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, x: 30 },
            {
                opacity: 1, x: 0, duration: 1, ease: "power2.out", delay: 0.2,
                scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" }
            }
        );
    });

    /* System Card Stagger */
    ScrollTrigger.batch('.gsap-card', {
        start: "top 88%",
        onEnter: batch => gsap.fromTo(batch,
            { opacity: 0, y: 50, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.12, ease: "power2.out" }
        ),
        onLeaveBack: batch => gsap.to(batch, { opacity: 0, y: 50, scale: 0.96, stagger: 0.05 })
    });
}

/* -- Magnetic Hover on Nav Links & CTA -- */
function initMagneticHovers() {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('mousemove', e => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            link.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = '';
            link.style.transition = 'transform 0.4s var(--ease-out-expo)';
            setTimeout(() => { link.style.transition = ''; }, 400);
        });
    });

    const cta = document.querySelector('.hero-cta');
    if (cta) {
        cta.addEventListener('mousemove', e => {
            const rect = cta.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            cta.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        cta.addEventListener('mouseleave', () => {
            cta.style.transform = '';
            cta.style.transition = 'transform 0.5s var(--ease-out-expo)';
            setTimeout(() => { cta.style.transition = ''; }, 500);
        });
    }
}

/* -- Parallax on Hero Photo -- */
function initParallax() {
    const photoWrap = document.querySelector('.hero-photo-wrap');
    if (!photoWrap) return;

    gsap.to('.hero-photo-wrap', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });
}

/* -- Stat Number Count Up -- */
function initStatCounters() {
    gsap.utils.toArray('.stat-value').forEach(el => {
        const target = el.textContent;
        const numMatch = target.match(/[\d.]+/);
        if (numMatch) {
            const num = parseFloat(numMatch[0]);
            const suffix = target.replace(numMatch[0], '');
            const isFloat = target.includes('.');
            el.textContent = '0' + suffix;
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    gsap.to({ val: 0 }, {
                        val: num, duration: 1.5, ease: 'power2.out',
                        onUpdate: function () {
                            el.textContent = (isFloat ? this.targets()[0].val.toFixed(2) : Math.floor(this.targets()[0].val)) + suffix;
                        }
                    });
                }
            });
        }
    });
}

/* -- Smooth Scroll (handles all anchor links) -- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* -- Active Nav Link Tracking -- */
function initActiveNavTracking() {
    const sections = document.querySelectorAll('section, footer');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === '#' + id) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(section => {
        if (section.id) observer.observe(section);
    });
}

/* -- Video Lazy Loading with IntersectionObserver -- */
function initVideoLazyLoad() {
    const videos = document.querySelectorAll('video[preload="none"]');
    if (videos.length === 0) return;

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Start loading and playing when visible
                if (video.getAttribute('data-loaded') !== 'true') {
                    video.load();
                    video.setAttribute('data-loaded', 'true');
                }
                video.play().catch(() => { /* autoplay may be blocked */ });
            } else {
                // Pause when out of view to save resources
                video.pause();
            }
        });
    }, {
        rootMargin: '100px',
        threshold: 0.1
    });

    videos.forEach(video => videoObserver.observe(video));
}
