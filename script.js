/* ═══════════════════════════════════════════════════════════════
   HOTEL HAPPY STAY — PREMIUM INTERACTIVE JAVASCRIPT
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // ─── PRELOADER ───
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 2200);
    });

    // Fallback: if load event already fired
    if (document.readyState === 'complete') {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 2200);
    }

    // ─── CUSTOM CURSOR ───
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX - 3 + 'px';
            cursorDot.style.top = mouseY - 3 + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX - 20 + 'px';
            cursorRing.style.top = ringY - 20 + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, input, textarea, select, .service-card, .gallery-item, .gallery-main, .menu-item');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
        });
    }

    // ─── HEADER SCROLL EFFECT ───
    const header = document.getElementById('mainHeader');
    const backToTop = document.getElementById('backToTop');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Header background
        if (scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top
        if (scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        lastScrollY = scrollY;
    });

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ─── ACTIVE NAV LINK ON SCROLL ───
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ─── SMOOTH SCROLL FOR NAV LINKS ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }

            // Close mobile menu if open
            mobileMenu.classList.remove('open');
            hamburger.classList.remove('active');
        });
    });

    // ─── MOBILE MENU ───
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });

    mobileMenuClose.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
    });

    // Close on mobile nav link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
        });
    });

    // ─── SCROLL REVEAL ANIMATIONS ───
    const revealElements = document.querySelectorAll('[data-scroll-reveal]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── COUNTER ANIMATION ───
    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-count'));
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;

            if (isDecimal) {
                el.textContent = current.toFixed(1);
            } else {
                el.textContent = Math.floor(current).toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // Observe counter elements
    const counterElements = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));

    // ─── HERO PARTICLES (STARS) ───
    const canvas = document.getElementById('heroParticles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.twinkleSpeed = Math.random() * 0.02 + 0.005;
                this.twinklePhase = Math.random() * Math.PI * 2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.twinklePhase += this.twinkleSpeed;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                const twinkle = Math.sin(this.twinklePhase) * 0.3 + 0.7;
                const alpha = this.opacity * twinkle;

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 180, 80, ${alpha})`;
                ctx.fill();

                // Glow
                if (this.size > 1.2) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(212, 180, 80, ${alpha * 0.1})`;
                    ctx.fill();
                }
            }
        }

        // Create particles
        const particleCount = Math.min(80, Math.floor(canvas.width * canvas.height / 15000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animateParticles);
        }

        animateParticles();

        // Cleanup on section leave
        const heroSection = document.getElementById('home');
        const particleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    cancelAnimationFrame(animationFrameId);
                } else {
                    animateParticles();
                }
            });
        });
        particleObserver.observe(heroSection);
    }

    // ─── MENU CATEGORY FILTER ───
    const menuCatBtns = document.querySelectorAll('.menu-cat-btn');
    const menuItems = document.querySelectorAll('.menu-item, .menu-subcategory');

    menuCatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            menuCatBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            // Filter items with animation
            menuItems.forEach(item => {
                if (item.getAttribute('data-category') === category) {
                    item.style.display = item.classList.contains('menu-subcategory') ? 'block' : 'flex';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(15px)';

                    setTimeout(() => {
                        item.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // ─── MODALS ───
    function setupModal(toggleId, modalId, closeId) {
        const toggle = document.getElementById(toggleId);
        const modal = document.getElementById(modalId);
        const close = document.getElementById(closeId);

        if (!toggle || !modal || !close) return;

        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });

        close.addEventListener('click', () => {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    setupModal('privacyToggle', 'privacyModal', 'privacyModalClose');
    setupModal('termsToggle', 'termsModal', 'termsModalClose');
    setupModal('refundToggle', 'refundModal', 'refundModalClose');

    // Close modals on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.open').forEach(modal => {
                modal.classList.remove('open');
                document.body.style.overflow = '';
            });
        }
    });

    // ─── FORM HANDLING ───
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submitReservation');
            const originalText = submitBtn.querySelector('.btn-text').textContent;

            submitBtn.querySelector('.btn-text').textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            setTimeout(() => {
                submitBtn.querySelector('.btn-text').textContent = '✓ Request Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

                setTimeout(() => {
                    submitBtn.querySelector('.btn-text').textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.background = '';
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // ─── NEWSLETTER FORM ───
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('newsletterSubmit');
            const input = document.getElementById('newsletterEmail');

            btn.textContent = 'Subscribed ✓';
            btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            input.value = '';

            setTimeout(() => {
                btn.textContent = 'Subscribe';
                btn.style.background = '';
            }, 3000);
        });
    }

    // ─── PARALLAX ON HERO ───
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && scrollY < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            heroContent.style.opacity = 1 - scrollY / window.innerHeight;
        }
    });

    // ─── HERO PHOTO SLIDESHOW ───
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            heroSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % heroSlides.length;
            heroSlides[currentSlide].classList.add('active');
        }, 5000); // Change photo every 5 seconds
    }

    // ─── BACKGROUND MUSIC PLAYER ───
    const bgMusic = document.getElementById('bgMusic');
    const musicPlayer = document.getElementById('musicPlayer');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    let isMusicPlaying = false;

    function toggleMusic() {
        if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
            musicPlayer.classList.add('paused');
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        } else {
            bgMusic.volume = 0.3;
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                musicPlayer.classList.remove('paused');
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            }).catch(() => {
                // Autoplay blocked — user must click
                console.log('Music autoplay blocked. Click the music player to start.');
            });
        }
    }

    if (musicPlayer) {
        musicPlayer.addEventListener('click', toggleMusic);
    }

    // Try auto-play music on first user interaction (click, touch, scroll, keydown)
    let hasAutoPlayAttempted = false;
    
    function tryAutoPlay() {
        if (!hasAutoPlayAttempted && !isMusicPlaying) {
            bgMusic.volume = 0.5;
            const playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isMusicPlaying = true;
                    hasAutoPlayAttempted = true;
                    musicPlayer.classList.remove('paused');
                    // Remove listeners once successful
                    ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
                        window.removeEventListener(evt, tryAutoPlay);
                    });
                }).catch(error => {
                    console.log('Autoplay prevented by browser:', error);
                });
            }
        }
    }

    ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
        window.addEventListener(evt, tryAutoPlay, { once: false, passive: true });
    });

    // ─── TILT EFFECT ON SERVICE CARDS ───
    if (window.innerWidth > 768) {
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

                // Move glow
                const glow = card.querySelector('.service-card-glow');
                if (glow) {
                    glow.style.left = `${x - rect.width}px`;
                    glow.style.top = `${y - rect.height}px`;
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ─── LAZY LOADING IMAGES WITH FADE ───
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.6s ease';

        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
    });

    // ─── MAGNETIC BUTTON EFFECT ───
    if (window.innerWidth > 768) {
        const magneticBtns = document.querySelectorAll('.btn-primary, .header-phone');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    console.log('%c🌟 Hotel Happy Stay — Where The Sky Becomes Your Ceiling', 'font-size: 16px; color: #d4a017; font-family: Georgia; padding: 10px;');
    console.log('%cCrafted with ❤️ in Nashik', 'font-size: 12px; color: #737373;');
});
