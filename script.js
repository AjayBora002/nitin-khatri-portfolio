/* ═══════════════════════════════════
   Nitin Khatri — Master Portfolio Script
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

    /* ── Advanced Counter Animation ── */
    const counters = document.querySelectorAll('[data-target]');
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const targetVal = parseFloat(el.getAttribute('data-target'));
                const duration = 2000;
                let startTime = null;

                const animate = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    
                    // Calculation for decimals or integers
                    let currentCount = progress * targetVal;
                    
                    // Suffix detection based on text content
                    const label = el.parentElement.querySelector('p').textContent.toLowerCase();
                    let suffix = '';
                    let displayVal = '';

                    if (label.includes('reached')) {
                        suffix = 'M';
                        displayVal = currentCount.toFixed(2);
                    } else if (label.includes('shares')) {
                        suffix = 'K';
                        displayVal = currentCount.toFixed(1);
                    } else if (label.includes('likes') || label.includes('impressions')) {
                        suffix = 'K';
                        displayVal = Math.floor(currentCount);
                    } else if (label.includes('views')) {
                        suffix = 'M+';
                        displayVal = Math.floor(currentCount);
                    } else if (label.includes('%')) {
                        suffix = '%';
                        displayVal = Math.floor(currentCount);
                    } else if (label.includes('years') || label.includes('completed') || label.includes('works') || label.includes('projects') || label.includes('videos')) {
                        suffix = '+';
                        displayVal = Math.floor(currentCount);
                    } else {
                        displayVal = Math.floor(currentCount);
                    }

                    el.textContent = displayVal + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        // Ensure final value is exact
                        if (suffix === 'M') el.textContent = targetVal.toFixed(2) + suffix;
                        else if (suffix === 'K' && label.includes('shares')) el.textContent = targetVal.toFixed(1) + suffix;
                        else el.textContent = targetVal + suffix;
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
            nav.style.background = 'rgba(10, 10, 10, 0.9)';
            nav.style.height = '60px';
            nav.style.top = '1rem';
            nav.style.padding = '0 1.5rem';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.4)';
            nav.style.height = '70px';
            nav.style.top = '2rem';
            nav.style.padding = '0 2rem';
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
                const offset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ── Fade-in Stagger for Grid Children ── */
    document.querySelectorAll('.toolkit-grid, .services-grid').forEach(grid => {
        const children = grid.children;
        Array.from(children).forEach((child, i) => {
            child.classList.add('reveal');
            child.style.transitionDelay = `${i * 0.1}s`;
        });
    });

});
