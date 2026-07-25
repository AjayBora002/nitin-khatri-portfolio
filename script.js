/* ═══════════════════════════════════
   Nitin Khatri — Master Portfolio Script
   ═══════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    /* ── MOBILE NAVBAR LOGIC ── */
    const initMobileNav = () => {
        const toggle = document.getElementById('nav-toggle');
        const overlay = document.getElementById('nav-overlay');
        const overlayLinks = document.querySelectorAll('.nav-overlay-links a');

        if (!toggle || !overlay) return;

        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('nav-active');
        });

        overlayLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                overlay.classList.remove('active');
                document.body.classList.remove('nav-active');
            });
        });
    };
    initMobileNav();

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

    /* ── Shared mouse-position state (written by ONE lightweight listener) ── */
    let rawMouseX = window.innerWidth / 2;
    let rawMouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        rawMouseX = e.clientX;
        rawMouseY = e.clientY;
    }, { passive: true });

    /* ── Hero Particles (Canvas API) ── */
    const canvas = document.getElementById('hero-particles');
    let heroAnimId = null; // rAF handle so we can cancel it
    let heroVisible = true; // tracked by IntersectionObserver

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 60;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            constructor() { this.init(); }
            init() {
                this.x  = Math.random() * canvas.width;
                this.y  = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size  = Math.random() * 2 + 1;
                this.alpha = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
        }

        for (let i = 0; i < particleCount; i++) particles.push(new Particle());

        // Particle mouse-parallax reads from the shared global below
        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                // shared rawMouseX/rawMouseY are updated by the single mousemove listener
                const px = p.x + (rawMouseX - window.innerWidth  / 2) * 0.05;
                const py = p.y + (rawMouseY - window.innerHeight / 2) * 0.05;
                ctx.beginPath();
                ctx.arc(px, py, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
                ctx.fill();
            });
        };

        const heroAnimate = () => {
            drawParticles();
            heroAnimId = requestAnimationFrame(heroAnimate);
        };

        // Pause/resume hero canvas when hero scrolls out of view
        const heroSection = document.querySelector('#hero') || canvas.closest('section');
        if (heroSection) {
            const heroPauseObs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    heroVisible = entry.isIntersecting;
                    if (heroVisible && heroAnimId === null) {
                        heroAnimate(); // resume
                    } else if (!heroVisible && heroAnimId !== null) {
                        cancelAnimationFrame(heroAnimId);
                        heroAnimId = null; // pause
                    }
                });
            }, { threshold: 0 });
            heroPauseObs.observe(heroSection);
        }

        window.addEventListener('resize', resize);
        resize();
        heroAnimate(); // initial start
    }

    /* ── Selected Work Reveal Transitions ── */
    // Bento cards are revealed via the standard revealObs already defined.

    /* ── Consolidated Scroll Handler (Throttled & Batched) ── */
    const scrollBar = document.getElementById('scroll-bar');
    const sections = document.querySelectorAll('section[id]');
    const navDots = document.querySelectorAll('.dot-nav');
    const nav = document.querySelector('.nav');
    const meetImage = document.querySelector('.meet-image');
    const meetBg = document.querySelector('.meet-section');
    
    // Cache section offset tops since they rarely change unless resizing
    let sectionCache = [];
    const updateSectionCache = () => {
        sectionCache = Array.from(sections).map(sec => ({
            id: sec.getAttribute('id'),
            top: sec.offsetTop
        }));
    };
    updateSectionCache();
    window.addEventListener('resize', updateSectionCache);

    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                /* --- 1. BATCH READS --- */
                const scrollY = window.pageYOffset;
                const innerHeight = window.innerHeight;
                const scrollHeight = document.documentElement.scrollHeight;
                
                // Parallax reads
                let meetRect = null;
                if (meetImage && meetImage.parentElement) {
                    meetRect = meetImage.parentElement.getBoundingClientRect();
                }

                /* --- 2. BATCH WRITES --- */
                
                // Progress Bar
                if (scrollBar) {
                    const totalScroll = scrollHeight - innerHeight;
                    const scrollStatus = (scrollY / totalScroll) * 100;
                    scrollBar.style.width = `${scrollStatus}%`;
                }

                // Active Section Tracking
                let currentSection = "";
                sectionCache.forEach(rect => {
                    if (scrollY >= (rect.top - 200)) {
                        currentSection = rect.id;
                    }
                });
                navDots.forEach(dot => {
                    if (dot.getAttribute('href').slice(1) === currentSection) {
                        if (!dot.classList.contains('active')) dot.classList.add('active');
                    } else {
                        if (dot.classList.contains('active')) dot.classList.remove('active');
                    }
                });

                // Navbar Transformation
                if (nav) {
                    if (scrollY > 50) {
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
                }

                // Parallax Depth (About Section)
                if (meetImage && meetRect) {
                    if (meetRect.top < innerHeight && meetRect.bottom > 0) {
                        const offset = (innerHeight / 2 - meetRect.top) * 0.15;
                        meetImage.style.transform = `translateY(${offset}px) scale(1.1)`;
                        
                        if (meetBg) {
                            const bgOffset = (innerHeight / 2 - meetRect.top) * 0.05;
                            meetBg.style.backgroundPosition = `center ${50 + bgOffset}%`;
                        }
                    }
                }

                isScrolling = false;
            });
            isScrolling = true;
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
        // 1. Scramble the tag line
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
                iteration += 1 / 2;
            }, 40);
        }

        // 2. Split and animate the hero title.
        //    splitText runs HERE (not in a rAF at page load) so it fires
        //    in the same guaranteed moment as the word-reveal triggers —
        //    after the loader curtain has fully opened.
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            splitText(heroTitle);
            // One rAF after splitText so the browser has painted the
            // new span structure before we start animating it.
            requestAnimationFrame(() => {
                heroTitle.querySelectorAll('.word-inner').forEach((word, i) => {
                    setTimeout(() => word.classList.add('visible'), i * 120);
                });
            });
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

    /* ─── Skill Filtering Logic (Ticker Pills) ─── */
    const filterBtns = document.querySelectorAll('.skill-tab');
    const allPills   = document.querySelectorAll('.skill-pill');
    const detailPanel = document.getElementById('skill-detail-panel');
    const closeBtn    = document.getElementById('panel-close-btn');

    // Panel element refs
    const panelEmoji    = document.getElementById('panel-emoji');
    const panelName     = document.getElementById('panel-tool-name');
    const panelBadge    = document.getElementById('panel-level-badge');
    const panelDesc     = document.getElementById('panel-desc');
    const panelPercent  = document.getElementById('panel-percent-value');
    const panelFill     = document.getElementById('panel-progress-fill');

    let selectedPill = null;

    /* --- Helper: close detail panel --- */
    const closePanel = () => {
        if (detailPanel) detailPanel.classList.remove('open');
        if (panelFill)   panelFill.style.width = '0';
        if (selectedPill) {
            selectedPill.classList.remove('selected');
            selectedPill = null;
        }
    };

    /* --- Helper: open detail panel with pill data --- */
    const openPanel = (pill) => {
        const cat     = pill.getAttribute('data-category') || '';
        const name    = pill.getAttribute('data-name') || '';
        const percent = pill.getAttribute('data-percent') || '0%';
        const level   = pill.getAttribute('data-level') || '';
        const desc    = pill.getAttribute('data-desc') || '';
        const emoji   = pill.getAttribute('data-emoji') || '🛠️';

        if (panelEmoji)   panelEmoji.textContent   = emoji;
        if (panelName)    panelName.textContent     = name;
        if (panelBadge)   panelBadge.textContent    = level;
        if (panelDesc)    panelDesc.textContent     = desc;
        if (panelPercent) panelPercent.textContent  = percent;

        // Colour the progress fill by category
        if (panelFill) {
            panelFill.className = 'panel-progress-fill ' + cat;
            // Trigger the width transition on next frame
            panelFill.style.width = '0';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => { panelFill.style.width = percent; });
            });
        }

        if (detailPanel) detailPanel.classList.add('open');
    };

    /* --- Tab filter buttons: toggle .dimmed on pills, close panel --- */
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Close panel when switching tabs
            closePanel();

            // Dim pills that don't match the active filter
            allPills.forEach(pill => {
                const cat = pill.getAttribute('data-category');
                if (filter === 'all' || cat === filter) {
                    pill.classList.remove('dimmed');
                } else {
                    pill.classList.add('dimmed');
                }
            });
        });
    });

    /* --- Pill click: toggle detail panel --- */
    allPills.forEach(pill => {
        pill.addEventListener('click', () => {
            if (pill.classList.contains('dimmed')) return;

            if (selectedPill === pill) {
                // Clicking the same pill closes the panel
                closePanel();
                return;
            }

            // Deselect previous
            if (selectedPill) selectedPill.classList.remove('selected');

            selectedPill = pill;
            pill.classList.add('selected');
            openPanel(pill);

            // Smooth-scroll the panel into view on mobile
            if (detailPanel && window.innerWidth < 768) {
                setTimeout(() => {
                    detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 80);
            }
        });
    });

    /* --- Close button --- */
    if (closeBtn) closeBtn.addEventListener('click', closePanel);

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

    /* ── Unified rAF loop: cursor dot (instant), blur ring (lerped), CSS vars ── */
    const cursor     = document.getElementById('cursor');
    const cursorBlur = document.getElementById('cursor-blur');


    // Half-sizes for centering via translate3d (matches CSS width/height)
    const DOT_HALF  = 4;  // #cursor is 8px
    const RING_HALF = 18; // #cursor-blur is 36px

    let blurX = rawMouseX, blurY = rawMouseY;

    let rafId = null;
    const masterRAF = () => {
        // 1. Cursor dot — zero lerp, instant tracking
        if (cursor) {
            cursor.style.transform =
                `translate3d(${rawMouseX - DOT_HALF}px, ${rawMouseY - DOT_HALF}px, 0)`;
        }

        // 2. Blur ring — trailing lerp only on the ring
        blurX += (rawMouseX - blurX) * 0.12;
        blurY += (rawMouseY - blurY) * 0.12;
        if (cursorBlur) {
            cursorBlur.style.transform =
                `translate3d(${blurX - RING_HALF}px, ${blurY - RING_HALF}px, 0)`;
        }

        // 3. CSS variables — batched once per frame (not per mousemove pixel)
        document.documentElement.style.setProperty('--mouse-x', `${rawMouseX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${rawMouseY}px`);

        rafId = requestAnimationFrame(masterRAF);
    };
    masterRAF();

    const interactiveEls = document.querySelectorAll('a, button, .toolkit-card-3d, .project-reel-item, .magnetic');
    interactiveEls.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    /* ─── Brand Carousel ─── */
    const brandTrack    = document.getElementById('brandTrack');
    const brandPrev     = document.getElementById('brandPrev');
    const brandNext     = document.getElementById('brandNext');
    const brandDots     = document.querySelectorAll('.brand-dot');
    const TOTAL_SLIDES  = 7; // original (non-clone) count
    let brandIndex      = 0;
    let brandAutoTimer  = null;
    let brandPaused     = false;

    const getSlideWidth = () => {
        const slide = brandTrack?.querySelector('.brand-slide');
        if (!slide) return 236;
        return slide.offsetWidth + 24; // card + gap
    };

    const goToSlide = (idx) => {
        // Clamp with wrap-around
        brandIndex = ((idx % TOTAL_SLIDES) + TOTAL_SLIDES) % TOTAL_SLIDES;

        // Stop CSS animation & drive manually via transform
        brandTrack.style.animationPlayState = 'paused';
        brandTrack.style.animation = 'none';
        brandTrack.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
        brandTrack.style.transform = `translateX(-${brandIndex * getSlideWidth()}px)`;

        // Dots
        brandDots.forEach((d, i) => d.classList.toggle('active', i === brandIndex));
    };

    const startAuto = () => {
        brandAutoTimer = setInterval(() => {
            if (!brandPaused) goToSlide(brandIndex + 1);
        }, 3000);
    };

    if (brandTrack && brandPrev && brandNext) {
        brandPrev.addEventListener('click', () => { goToSlide(brandIndex - 1); });
        brandNext.addEventListener('click', () => { goToSlide(brandIndex + 1); });

        brandDots.forEach((dot, i) => {
            dot.addEventListener('click', () => goToSlide(i));
        });

        // Pause on hover
        brandTrack.closest('.brand-carousel-wrapper')?.addEventListener('mouseenter', () => { brandPaused = true; });
        brandTrack.closest('.brand-carousel-wrapper')?.addEventListener('mouseleave', () => { brandPaused = false; });

        startAuto();
    }



    /* ── Parallax Depth (About Section) ── */
    // Merged into the main window scroll handler above.

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

    /* ─── Word Reveal ── splitText helper ───

       Uses innerHTML + a sentinel character to handle <br> tags
       reliably regardless of element visibility or layout state.
       Does NOT use innerText (layout-dependent) or childNodes
       walking (requires element to already be in the live DOM
       with correct node types). */
    function splitText(el) {
        // 1. Capture raw markup so <br> tags are preserved exactly
        const rawHTML = el.innerHTML;

        // 2. Replace every <br> variant with a unique sentinel
        //    that cannot appear in normal text content
        const SENTINEL = ' LINEBREAK ';
        const withSentinel = rawHTML.replace(/<br\s*\/?>/gi, SENTINEL);

        // 3. Strip any remaining HTML tags (keeps plain text only)
        const plainText = withSentinel.replace(/<[^>]+>/g, '');

        // 4. Split into logical lines on the sentinel
        const lines = plainText.split(SENTINEL);

        // 5. Rebuild element with word-spans and real <br> elements
        el.innerHTML = '';
        lines.forEach((line, lineIdx) => {
            if (lineIdx > 0) {
                el.appendChild(document.createElement('br'));
            }
            const words = line.trim().split(/[ \t]+/); // space/tab only — not \n
            words.forEach(word => {
                if (!word) return;
                const outer = document.createElement('span');
                outer.className = 'word-reveal';
                const inner = document.createElement('span');
                inner.className = 'word-inner';
                inner.textContent = word + '\u00A0'; // NBSP keeps word spacing
                outer.appendChild(inner);
                el.appendChild(outer);
            });
        });
    }

    /* Section titles only (not hero — hero is handled inside startHeroAnimations) */
    const sectionTitles = document.querySelectorAll('.section-title');
    requestAnimationFrame(() => {
        sectionTitles.forEach(title => {
            splitText(title);
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.querySelectorAll('.word-inner').forEach((word, i) => {
                            setTimeout(() => word.classList.add('visible'), i * 80);
                        });
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            obs.observe(title);
        });
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

    /* ─── Experience Section: Animated Timeline Observer ─── */
    const expSection = document.getElementById('experience');
    if (expSection) {
        const expSpine  = document.getElementById('exp-spine');
        const expDots   = expSection.querySelectorAll('.exp-dot');
        const expCards  = expSection.querySelectorAll('.glass-card.exp-card');

        /* Setup: alternating direction + stagger delays */
        expCards.forEach((card, i) => {
            if (i % 2 !== 0) card.classList.add('from-right');
            card.style.transitionDelay = `${i * 0.15}s`;
        });

        /* Counter animation (easeOutCubic, fires once) */
        const animateExpCounter = (el) => {
            if (el.dataset.animated) return;
            el.dataset.animated = 'true';
            const target   = +el.dataset.target;
            const duration = 1500;
            const start    = performance.now();
            requestAnimationFrame(function tick(now) {
                const p    = Math.min((now - start) / duration, 1);
                const ease = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.floor(ease * target);
                if (p < 1) requestAnimationFrame(tick);
                else el.textContent = target;
            });
        };

        /* Single shared observer handles spine, dots, cards, counters */
        const expObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;

                if (el === expSpine) {
                    el.classList.add('visible');
                } else if (el.classList.contains('exp-dot')) {
                    const idx = [...expDots].indexOf(el);
                    setTimeout(() => el.classList.add('visible'), idx * 120);
                } else if (el.classList.contains('exp-card')) {
                    el.classList.add('visible');
                    el.querySelectorAll('.exp-counter').forEach(animateExpCounter);
                }

                expObs.unobserve(el);
            });
        }, { threshold: 0.2 });

        if (expSpine) expObs.observe(expSpine);
        expDots.forEach(dot  => expObs.observe(dot));
        expCards.forEach(card => expObs.observe(card));
    }

    /* ═══════════════════════════════════════════════
       VIDEO SHOWCASE GRID — Interactions
       ═══════════════════════════════════════════════ */
    (() => {
        const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

        const lightbox   = document.getElementById('vsg-lightbox');
        const lbVideo    = document.getElementById('vsg-lb-video');
        const lbTag      = document.getElementById('vsg-lb-tag');
        const lbTitle    = document.getElementById('vsg-lb-title');
        const lbClose    = document.getElementById('vsg-close-btn');
        const lbBackdrop = lightbox?.querySelector('.vsg-lightbox-backdrop');

        /* ── Stagger index for gold-pulse reveal animation ── */
        document.querySelectorAll('.vsg-card').forEach((card, i) => {
            card.style.setProperty('--card-i', i);
        });

        /* ──────────────────────────────────────────────────
           Lazy-load helper: injects the video src only when
           the card enters the viewport (rootMargin 200px so
           it starts buffering slightly before it's visible)
        ────────────────────────────────────────────────── */
        const lazyObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const card  = entry.target;
                const video = card.querySelector('.vsg-video');
                if (video && !video.src) {
                    video.src = card.dataset.video;
                    video.load(); // preload="none" → trigger metadata load
                }
                lazyObs.unobserve(card);
            });
        }, { rootMargin: '200px 0px' });

        /* ──────────────────────────────────────────────────
           Mobile autoplay: when a card is >60% visible on a
           touch device, autoplay the muted preview loop.
        ────────────────────────────────────────────────── */
        const mobileAutoObs = new IntersectionObserver((entries) => {
            if (!isTouchDevice()) return;
            entries.forEach(entry => {
                const card  = entry.target;
                const video = card.querySelector('.vsg-video');
                if (!video) return;
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                    card.classList.add('is-previewing');
                } else {
                    video.pause();
                    video.currentTime = 0;
                    card.classList.remove('is-previewing');
                }
            });
        }, { threshold: 0.6 });

        /* ──────────────────────────────────────────────────
           Lightbox open / close
        ────────────────────────────────────────────────── */
        const openLightbox = (card) => {
            if (!lightbox) return;
            const src   = card.dataset.video;
            const tag   = card.dataset.tag   || '';
            const title = card.dataset.title || '';

            lbVideo.src = src;
            lbVideo.load();
            if (lbTag)   lbTag.textContent   = tag;
            if (lbTitle) lbTitle.textContent = title;

            lightbox.removeAttribute('hidden');
            document.body.style.overflow = 'hidden';

            // Begin play after a tick (allows CSS transition to start)
            requestAnimationFrame(() => lbVideo.play().catch(() => {}));
        };

        const closeLightbox = () => {
            if (!lightbox) return;
            lbVideo.pause();
            lbVideo.src = '';     // release the network request
            lightbox.setAttribute('hidden', '');
            document.body.style.overflow = '';
        };

        if (lbClose)    lbClose.addEventListener('click', closeLightbox);
        if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });

        /* ──────────────────────────────────────────────────
           Wire up each card
        ────────────────────────────────────────────────── */
        document.querySelectorAll('.vsg-card').forEach(card => {
            const video = card.querySelector('.vsg-video');

            // Lazy-load observation
            lazyObs.observe(card);

            // Mobile autoplay observation
            mobileAutoObs.observe(card);

            // Desktop hover preview (only on pointer devices)
            card.addEventListener('mouseenter', () => {
                if (isTouchDevice() || !video) return;
                video.play().catch(() => {});
                card.classList.add('is-previewing');
            });
            card.addEventListener('mouseleave', () => {
                if (isTouchDevice() || !video) return;
                video.pause();
                video.currentTime = 0;
                card.classList.remove('is-previewing');
            });

            // Click → lightbox
            card.addEventListener('click', () => openLightbox(card));
        });
    })();

});
