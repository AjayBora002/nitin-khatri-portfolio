/* ═══════════════════════════════════
   Nitin Khatri — Master Portfolio Script
   ═══════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    /* ── REGISTER GSAP PLUGINS ── */
    gsap.registerPlugin(ScrollTrigger);

    /* ── Cinematic Loader Logic ── */
    const loader = document.getElementById('loader');
    const isFirstVisit = !sessionStorage.getItem('visited');

    if (isFirstVisit) {
        document.body.classList.add('loading');
        setTimeout(() => {
            const loaderLine = document.querySelector('.loader-line');
            if (loaderLine) loaderLine.style.width = '300px';
        }, 500);

        setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
            sessionStorage.setItem('visited', 'true');
            // Re-trigger reveal animations for hero specifically
            startHeroAnimations();
        }, 2200);
    } else {
        loader.style.display = 'none';
        document.body.classList.add('loaded');
        startHeroAnimations();
    }

    /* ── Reveal Elements on Scroll ── */
    /* ── Reliable Reveal Elements ── */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealEls.forEach(el => revealObs.observe(el));

    /* ── Cinematic Scanline / Wipe Logic ── */
    // Handled via CSS reveal.visible ~ .scanline logic, 
    // but ensures tags and subtitles trigger them correctly.

    /* ── Skill Progress Animation ── */
    const skillsSection = document.querySelector('#toolkit');
    
    const skillObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = document.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    const percent = bar.style.getPropertyValue('--percent');
                    bar.style.width = percent;
                });
                skillObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    if (skillsSection) skillObs.observe(skillsSection);

    /* ── Advanced Counter Animation ── */
    const counters = document.querySelectorAll('[data-target]');
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (el.classList.contains('odometer-digit')) {
                    animateOdometer(el);
                } else {
                    setTimeout(() => animateCounter(el), index * 200);
                }
                counterObs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    const animateOdometer = (el) => {
        const target = el.getAttribute('data-value');
        // If it's a number, roll 0-9. If text, roll through symbols.
        const isNumeric = !isNaN(target);
        const digits = isNumeric ? "0123456789".split('') : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
        
        el.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'odometer-digit-wrapper';
        
        digits.forEach(d => {
            const dDiv = document.createElement('div');
            dDiv.textContent = d;
            wrapper.appendChild(dDiv);
        });
        el.appendChild(wrapper);

        const targetIndex = digits.indexOf(target);
        const height = el.getBoundingClientRect().height;
        
        setTimeout(() => {
            wrapper.style.transition = `transform ${1.5 + Math.random()}s cubic-bezier(0.19, 1, 0.22, 1)`;
            wrapper.style.transform = `translateY(-${targetIndex * height}px)`;
        }, 100);
    };

    const animateCounter = (el) => {
        const targetVal = parseFloat(el.getAttribute('data-target'));
        const duration = 2500;
        let startTime = null;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Easing function for smoother finish
            const easeOutQuad = t => t * (2 - t);
            const easedProgress = easeOutQuad(progress);
            
            let currentCount = easedProgress * targetVal;
            
            const labelEl = el.parentElement.querySelector('p');
            const label = labelEl ? labelEl.textContent.toLowerCase() : '';
            let suffix = '';
            let displayVal = '';

            if (label.includes('reached')) {
                suffix = 'M';
                displayVal = currentCount.toFixed(2);
            } else if (label.includes('shares')) {
                suffix = 'K';
                displayVal = currentCount.toFixed(1);
            } else if (label.includes('likes') || label.includes('impressions')) {
                suffix = (targetVal >= 1000) ? 'K' : (label.includes('impressions') ? 'M+' : '');
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
            el.classList.add('glow-animation');

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                el.textContent = (displayVal === Math.floor(targetVal).toString() ? targetVal : displayVal) + suffix;
                setTimeout(() => el.classList.remove('glow-animation'), 1000);
            }
        };

        requestAnimationFrame(animate);
    };

    counters.forEach(el => counterObs.observe(el));

    /* ── Hero Particles (Canvas API) ── */
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 60;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            constructor() {
                this.init();
            }
            init() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.alpha = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) particles.push(new Particle());

        let mouseX = 0, mouseY = 0;
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
        });

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                // Apply parallax
                const px = p.x + mouseX;
                const py = p.y + mouseY;
                
                ctx.beginPath();
                ctx.arc(px, py, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
                ctx.fill();
            });
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    /* ── Selected Work Reveal Transitions ── */
    // Bento cards are revealed via the standard revealObs already defined.

    /* ── Scroll Tracking & Navigation ── */
    const scrollBar = document.getElementById('scroll-bar');
    const sections = document.querySelectorAll('section[id]');
    const navDots = document.querySelectorAll('.dot-nav');

    window.addEventListener('scroll', () => {
        // Progress Bar
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollStatus = (window.pageYOffset / totalScroll) * 100;
        if (scrollBar) scrollBar.style.width = `${scrollStatus}%`;

        // Active Section Tracking
        let currentSection = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });

        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('href').slice(1) === currentSection) {
                dot.classList.add('active');
            }
        });

        // Navbar Transformation
        const nav = document.querySelector('.nav');
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

/* ─── Social Stat Bars Animation ─── */
    const impactSection = document.querySelector('#impact');
    const statFills = document.querySelectorAll('.stat-fill');
    
    const impactObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statFills.forEach(fill => {
                    const percent = fill.style.getPropertyValue('--percent');
                    fill.style.width = percent;
                });
                impactObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    if (impactSection) impactObs.observe(impactSection);

    /* ─── 3D Tilt Effect ─── */
    const cards = document.querySelectorAll('.toolkit-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    /* ── Magnetic Buttons & Gravity Tags ── */
    const magneticItems = document.querySelectorAll('.magnetic, .section-tag');
    magneticItems.forEach(item => {
        const pullFactor = item.classList.contains('section-tag') ? 0.5 : 0.3;
        const range = item.classList.contains('section-tag') ? 80 : 50;

        document.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < range) {
                item.style.transform = `translate(${dx * pullFactor}px, ${dy * pullFactor}px)`;
            } else {
                item.style.transform = 'translate(0, 0)';
            }
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translate(0, 0)';
        });
    });

    /* ── Hero Scramble Text & Start Sequence ── */
    function startHeroAnimations() {
        const scrambleEl = document.querySelector('.scramble-text');
        if (scrambleEl) {
            const finalContent = "Graphic Designer & VFX Artist";
            const symbols = "!@#$%^&*()_+{}:<>?|~/\\";
            let iteration = 0;
            
            const interval = setInterval(() => {
                scrambleEl.textContent = finalContent.split("")
                    .map((char, index) => {
                        if (index < iteration) return finalContent[index];
                        if (char === " ") return " ";
                        return symbols[Math.floor(Math.random() * symbols.length)];
                    })
                    .join("");
                
                if (iteration >= finalContent.length) {
                    clearInterval(interval);
                    scrambleEl.textContent = finalContent;
                }
                iteration += 1/2;
            }, 40);
        }
    }

    /* ─── Copy to Clipboard Logic ─── */
    const toast = document.getElementById('toast');
    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 3000);
    };

    document.querySelector('.copy-email')?.addEventListener('click', function() {
        const email = this.getAttribute('data-email');
        navigator.clipboard.writeText(email).then(() => showToast('Email copied to clipboard!'));
    });

    document.querySelector('.copy-phone')?.addEventListener('click', function() {
        const phone = this.getAttribute('data-phone');
        navigator.clipboard.writeText(phone).then(() => showToast('Phone number copied!'));
    });

    /* ─── Skill Filtering Logic ─── */
    const toolkitSection = document.getElementById('toolkit');
    const filterBtns = document.querySelectorAll('.skill-tab');
    
    // Only target cards within the toolkit section to avoid hiding AI tools
    const skillCards = toolkitSection ? toolkitSection.querySelectorAll('.toolkit-card') : [];

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter cards
            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400);
                }
            });
        });
    });

    /* ─── Image Lazy Loading Blur-Up ─── */
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.classList.add('loading');
        img.addEventListener('load', () => {
            img.classList.remove('loading');
        });
        // Handle cached images
        if (img.complete) img.classList.remove('loading');
    });

    /* ── Custom Cinematic Cursor & Sparks ── */
    const cursor = document.getElementById('cursor');
    const cursorBlur = document.getElementById('cursor-blur');
    let cursorX = 0, cursorY = 0;
    let blurX = 0, blurY = 0;
    let targetX = 0, targetY = 0;
    let lastX = 0, lastY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        
        // Velocity for Sparks
        const dx = Math.abs(targetX - lastX);
        const dy = Math.abs(targetY - lastY);
        if (dx + dy > 25) createSpark(targetX, targetY);
        
        lastX = targetX;
        lastY = targetY;

        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    });

    const createSpark = (x, y) => {
        const count = 5;
        for (let i = 0; i < count; i++) {
            const spark = document.createElement('div');
            spark.className = 'cursor-spark';
            spark.style.left = `${x}px`;
            spark.style.top = `${y}px`;
            
            const size = Math.random() * 3 + 1;
            spark.style.width = `${size}px`;
            spark.style.height = `${size}px`;
            
            document.body.appendChild(spark);
            
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 50 + 20;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist;
            
            setTimeout(() => {
                spark.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
                spark.style.opacity = '0';
            }, 10);
            
            setTimeout(() => spark.remove(), 400);
        }
    };

    const animateCursor = () => {
        // Elastic/Lazy follow logic
        cursorX += (targetX - cursorX) * 0.15;
        cursorY += (targetY - cursorY) * 0.15;
        
        blurX += (targetX - blurX) * 0.08;
        blurY += (targetY - blurY) * 0.08;
        
        if (cursor) {
            cursor.style.transform = `translate(${cursorX - 6}px, ${cursorY - 6}px)`;
        }
        if (cursorBlur) {
            cursorBlur.style.transform = `translate(${blurX - 30}px, ${blurY - 30}px)`;
        }
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const interactiveEls = document.querySelectorAll('a, button, .toolkit-card-3d, .project-reel-item, .magnetic');
    interactiveEls.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    /* ── Parallax Depth (About Section) ── */
    const meetImage = document.querySelector('.meet-image');
    const meetBg = document.querySelector('.meet-section');
    window.addEventListener('scroll', () => {
        if (meetImage) {
            const rect = meetImage.parentElement.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const offset = (window.innerHeight / 2 - rect.top) * 0.15;
                meetImage.style.transform = `translateY(${offset}px) scale(1.1)`;
                
                if (meetBg) {
                    const bgOffset = (window.innerHeight / 2 - rect.top) * 0.05;
                    meetBg.style.backgroundPosition = `center ${50 + bgOffset}%`;
                }
            }
        }
    });

    /* ── Audio Ambience Logic ── */
    const audioBtn = document.getElementById('audio-toggle');
    const audio = document.getElementById('ambient-drone');
    let isPlaying = false;

    if (audioBtn && audio) {
        audio.volume = 0.2;
        audioBtn.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                audioBtn.querySelector('.audio-icon').textContent = '🔇';
            } else {
                audio.play().catch(() => console.log("User interaction required for audio"));
                audioBtn.querySelector('.audio-icon').textContent = '🔊';
            }
            isPlaying = !isPlaying;
        });
    }

    /* ─── Paragraph/Heading Word Reveal ─── */
    const splitText = (el) => {
        const text = el.innerText.replace(/\n/g, ' <br> '); // Preserve line breaks
        el.innerHTML = '';
        text.split(' ').forEach(word => {
            if (word === '<br>') {
                el.appendChild(document.createElement('br'));
            } else if (word.trim() !== '') {
                const span = document.createElement('span');
                span.className = 'word-reveal';
                const inner = document.createElement('span');
                inner.className = 'word-inner';
                inner.textContent = word + '\u00A0';
                span.appendChild(inner);
                el.appendChild(span);
            }
        });
    };

    const revealTitles = document.querySelectorAll('.section-title, .hero-title');
    revealTitles.forEach(title => {
        splitText(title);
        const words = title.querySelectorAll('.word-inner');
        
        // Immediate reveal for Hero Title, Scroll-reveal for others
        if (title.classList.contains('hero-title')) {
            words.forEach((word, i) => {
                setTimeout(() => word.classList.add('visible'), 400 + (i * 100));
            });
        } else {
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        words.forEach((word, i) => {
                            setTimeout(() => word.classList.add('visible'), i * 80);
                        });
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 }); // Lower threshold for reliability
            obs.observe(title);
        }
    });

    /* ── Smooth Anchor Scrolling ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offset = 80;
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
