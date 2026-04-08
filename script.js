/* ═══════════════════════════════════
   Nitin Khatri — Premium Portfolio Script
   ═══════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Intersection Observer for Reveal Animations ── */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObs.observe(el));

    /* ── Counter Animation ── */
    const counters = document.querySelectorAll('[data-target]');
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                const duration = 2000;
                let startTime = null;

                const animate = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    const currentCount = Math.floor(progress * target);
                    
                    // Add suffix based on context if needed
                    let suffix = '';
                    if (el.parentElement.querySelector('p').textContent.includes('Satisfaction')) suffix = '%';
                    if (el.parentElement.querySelector('p').textContent.includes('Views')) suffix = 'M+';
                    if (el.parentElement.querySelector('p').textContent.includes('Years')) suffix = '+';
                    if (el.parentElement.querySelector('p').textContent.includes('Completed')) suffix = '+';

                    el.textContent = currentCount + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        el.textContent = target + suffix;
                    }
                };

                requestAnimationFrame(animate);
                counterObs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObs.observe(el));

    /* ── Navbar Scroll Effect ── */
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(10, 10, 10, 0.8)';
            nav.style.height = '60px';
            nav.style.top = '1rem';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.4)';
            nav.style.height = '70px';
            nav.style.top = '2rem';
        }
    }, { passive: true });

    /* ── Smooth Anchor Scrolling ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offset = 100; // Adjust for sticky nav
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ── Optional: Mouse Hover Parallax for Hero ── */
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 20;
            const yPos = (clientY / window.innerHeight - 0.5) * 20;
            
            const title = hero.querySelector('.hero-title');
            if (title) {
                title.style.transform = `translate(${xPos}px, ${yPos}px)`;
            }
        });
    }

});
