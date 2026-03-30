gsap.registerPlugin(ScrollTrigger);

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
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    document.getElementById('scrollProgress').style.width = progress + '%';
});

/* -- Ambient Cursor -- */
const cursor = document.querySelector('.ambient-cursor');
let cursorX = 0, cursorY = 0, currentX = 0, currentY = 0;
document.addEventListener('mousemove', e => { cursorX = e.clientX; cursorY = e.clientY; });
document.addEventListener('touchmove', e => { cursorX = e.touches[0].clientX; cursorY = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchstart', e => { cursorX = e.touches[0].clientX; cursorY = e.touches[0].clientY; }, { passive: true });
function animateCursor() {
    currentX += (cursorX - currentX) * 0.12;
    currentY += (cursorY - currentY) * 0.12;
    cursor.style.left = currentX + 'px';
    cursor.style.top = currentY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

/* -- Hero Entrance Timeline -- */
const heroTL = gsap.timeline({ defaults: { ease: "power3.out" } });
gsap.set("nav", { y: -30, opacity: 0 });
gsap.set(".gsap-name-line", { yPercent: 110 });
gsap.set(".gsap-hero", { opacity: 0, y: 25 });

heroTL
    .to("nav", { y: 0, opacity: 1, duration: 0.8 })
    .to(".gsap-name-line", { yPercent: 0, duration: 1.6, stagger: 0.15, ease: "expo.out" }, "-=0.3")
    .to(".gsap-hero", { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 }, "-=1");

/* -- Scroll Reveals -- */
gsap.utils.toArray('.gsap-el').forEach(el => {
    gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
            opacity: 1, y: 0, duration: 1, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 87%", toggleActions: "play none none reverse" }
        }
    );
});

/* -- Marginalia Side-slide -- */
gsap.utils.toArray('.gsap-el-delay').forEach(el => {
    gsap.fromTo(el,
        { opacity: 0, x: 30 },
        {
            opacity: 1, x: 0, duration: 1, ease: "power2.out", delay: 0.2,
            scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" }
        }
    );
});

/* -- System Card Stagger -- */
ScrollTrigger.batch('.gsap-card', {
    start: "top 88%",
    onEnter: batch => gsap.fromTo(batch,
        { opacity: 0, y: 50, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.12, ease: "power2.out" }
    ),
    onLeaveBack: batch => gsap.to(batch, { opacity: 0, y: 50, scale: 0.96, stagger: 0.05 })
});

/* -- Magnetic Hover on Nav Links -- */
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

/* -- Magnetic Hover on CTA -- */
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

/* -- Parallax on Hero Photo -- */
gsap.to('.hero-photo-wrap', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
});

/* -- Stat Number Count Up -- */
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

/* -- Smooth Scroll -- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

/* -- Details / Pillar Animation -- */
document.querySelectorAll('.pillar').forEach(details => {
    const summary = details.querySelector('summary');
    const body = details.querySelector('.pillar-body');

    summary.addEventListener('click', e => {
        e.preventDefault();

        if (details.open) {
            // Initiate close animation
            body.style.maxHeight = '0px';
            body.style.opacity = '0';
            body.style.paddingBottom = '0px';

            // Wait for transition before removing open attribute
            setTimeout(() => {
                details.open = false;
                body.style = '';
            }, 400); // matches the 0.4s transition
        } else {
            // Open actions
            details.open = true;

            // Force initial state instantly (bypassing transition because it just came from display:none)
            body.style.transition = 'none';
            body.style.maxHeight = '0px';
            body.style.opacity = '0';
            body.style.paddingBottom = '0px';

            // Trigger reflow to lock in the 0 values
            void body.offsetHeight;

            // Re-enable CSS transitions and trigger animation to target state
            body.style.transition = '';
            body.style.maxHeight = '300px';
            body.style.opacity = '1';
            body.style.paddingBottom = '1.5rem';

            // Clean up inline styles after animation finishes
            setTimeout(() => {
                body.style = '';
            }, 400);
        }
    });
});
