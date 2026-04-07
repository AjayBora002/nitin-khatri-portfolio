/* ═══════════════════════════════════
   Nitin Khatri — Mugen Style Script
   ═══════════════════════════════════ */

/* ── Custom Cursor ── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
});

// Ring follows with smooth lag
(function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    requestAnimationFrame(animateRing);
})();

// Expand ring on hoverable elements
document.querySelectorAll('a, button, .service-row, .exp-item, .tool-tile, .ai-tile, .brand-cell').forEach(el => {
    el.addEventListener('mouseenter', () => {
        ring.style.width  = '64px';
        ring.style.height = '64px';
        ring.style.opacity = '0.5';
        cursor.style.opacity = '0';
    });
    el.addEventListener('mouseleave', () => {
        ring.style.width  = '36px';
        ring.style.height = '36px';
        ring.style.opacity = '1';
        cursor.style.opacity = '1';
    });
});

// Hide cursor when it leaves window
document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; ring.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; ring.style.opacity = '1'; });

/* ── Reveal on Scroll ── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        // Stagger children inside the same parent
        const delay = parseFloat(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObs.unobserve(entry.target);
    });
}, { threshold: 0.1 });

revealEls.forEach((el, i) => revealObs.observe(el));

/* ── Counter Animation ── */
const counters = document.querySelectorAll('[data-target]');
const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const dur    = 1600;
        const start  = performance.now();

        const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            // Ease out expo
            const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
            el.textContent = Math.floor(eased * target) + '+';
            if (p < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        counterObs.unobserve(el);
    });
}, { threshold: 0.5 });

counters.forEach(el => counterObs.observe(el));

/* ── Navbar scroll state ── */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        nav.style.borderBottomColor = 'rgba(255,255,255,0.1)';
    } else {
        nav.style.borderBottomColor = 'rgba(255,255,255,0.07)';
    }
}, { passive: true });

/* ── Active nav links ── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
const navObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(l => l.style.color = '');
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.style.color = '#fff';
    });
}, { threshold: 0.5 });
sections.forEach(s => navObs.observe(s));

/* ── Smooth anchor scroll with nav offset ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    });
});

/* ── Service row hover arrow ── */
document.querySelectorAll('.service-row').forEach(row => {
    row.addEventListener('mouseenter', () => row.style.paddingLeft = '16px');
    row.addEventListener('mouseleave', () => row.style.paddingLeft = '0');
});

/* ── Stagger reveal for grid children ── */
document.querySelectorAll('.stats-grid, .tools-grid, .ai-grid, .brands-grid, .exp-list').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
        child.style.transitionDelay = (i * 0.06) + 's';
        child.style.opacity = '0';
        child.style.transform = 'translateY(20px)';
        child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const gridObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            Array.from(entry.target.children).forEach(child => {
                child.style.opacity = '1';
                child.style.transform = 'none';
            });
            gridObs.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    gridObs.observe(grid);
});
