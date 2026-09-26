/* ============================================
   MAIN.JS - Portfolio Interactions
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

    initHeroAnimations();
    initScrollReveals();
    initParallax();
    initStatCounters();
    initSmoothScroll();
    initActiveNavTracking();
    initVideoLazyLoad();
    initCardToggles();
    initLightbox();
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



/* -- Hero Entrance Timeline -- */
function initHeroAnimations() {
    const heroTL = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set("nav", { y: -20, opacity: 0 });
    gsap.set(".gsap-name-line", { yPercent: 110 });
    gsap.set(".gsap-hero", { opacity: 0, y: 15 });

    heroTL
        .to("nav", { y: 0, opacity: 1, duration: 0.4 })
        .to(".gsap-name-line", { yPercent: 0, duration: 0.8, stagger: 0.08, ease: "expo.out" }, "-=0.1")
        .to(".gsap-hero", { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, "-=0.5");
}

/* -- Scroll Reveals -- */
function initScrollReveals() {
    gsap.utils.toArray('.gsap-el').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 20 },
            {
                opacity: 1, y: 0, duration: 0.5, ease: "power2.out",
                scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" }
            }
        );
    });

    /* Marginalia Side-slide */
    gsap.utils.toArray('.gsap-el-delay').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, x: 15 },
            {
                opacity: 1, x: 0, duration: 0.5, ease: "power2.out", delay: 0.1,
                scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" }
            }
        );
    });

    /* System Card Stagger */
    ScrollTrigger.batch('.gsap-card', {
        start: "top 90%",
        onEnter: batch => gsap.fromTo(batch,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" }
        ),
    });
}



/* -- Parallax removed - unnecessary effect */
function initParallax() {}

/* -- Stat counters removed - numbers show as-is */
function initStatCounters() {}

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

/* -- Project Card Views Toggle -- */
function initCardToggles() {
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            
            const card = btn.closest('.sys-card');
            const target = btn.dataset.target;
            
            // Toggle active class on buttons
            card.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const detailsView = card.querySelector('.card-details-view');
            const mediaView = card.querySelector('.card-media-view');
            
            if (target === 'details') {
                if (mediaView) mediaView.style.display = 'none';
                if (detailsView) {
                    detailsView.style.display = 'flex';
                }
            } else {
                if (detailsView) detailsView.style.display = 'none';
                if (mediaView) {
                    mediaView.style.display = 'block';
                }
            }
            
            // Refresh ScrollTrigger as elements size might adjust
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        });
    });
    
    document.querySelectorAll('.sys-card-screenshot').forEach(screenshot => {
        screenshot.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            
            const img = screenshot.querySelector('img');
            const src = img.getAttribute('src');
            const alt = img.getAttribute('alt') || "Project Screenshot";
            
            if (window.openLightbox) {
                window.openLightbox(src, alt);
            }
        });
    });
}

/* -- Lightbox Modal functions -- */
function initLightbox() {
    const modal = document.getElementById('lightboxModal');
    const closeBtn = document.getElementById('lightboxClose');
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    
    if (!modal || !closeBtn || !img || !caption) return;
    
    window.openLightbox = function(src, alt) {
        img.src = src;
        img.alt = alt;
        caption.textContent = alt;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };
    
    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        setTimeout(() => {
            img.src = '';
        }, 400); // clear source after transition
    }
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}
