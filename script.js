// Scroll to top on page load/refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    // Ensure we're at the top when DOM is ready
    window.scrollTo(0, 0);

    gsap.registerPlugin(ScrollTrigger);

    // ---------------------------------------------------------
    // Loading Screen Sequence
    // ---------------------------------------------------------
    const loadingScreen = document.getElementById('loading-screen');
    const loadingTracker = document.getElementById('loading-tracker');
    const loadingProgress = document.getElementById('loading-progress');
    const loadingCaption = document.getElementById('loading-caption');

    // Captions to cycle
    const captions = ["Guiding With Purpose...", "Serving With Compassion...", "Building Communities...", "Creating Impact..."];

    if (loadingScreen && window.innerWidth < 10000) {
        document.body.style.overflow = 'hidden';

        // Caption Cycling Logic
        let captionIndex = 0;
        const captionInterval = setInterval(() => {
            if (loadingCaption) {
                gsap.to(loadingCaption, {
                    opacity: 0, duration: 0.2, onComplete: () => {
                        captionIndex = (captionIndex + 1) % captions.length;
                        loadingCaption.innerText = captions[captionIndex];
                        gsap.to(loadingCaption, { opacity: 1, duration: 0.2 });
                    }
                });
            }
        }, 800);

        const loadTimeline = gsap.timeline({
            onComplete: () => {
                clearInterval(captionInterval);
                loadingScreen.style.display = 'none';
                document.body.style.overflow = '';
                initHeroAnimations();
            }
        });

        // Tracker Animation: Move from left to right with progress fill
        // Calculate end position accounting for tracker width
        loadTimeline
            .to(loadingCaption, { opacity: 1, duration: 0.5, ease: "power2.out" })
            .to(loadingTracker, {
                left: "calc(100% - 24px)",
                duration: 2.5,
                ease: "power2.inOut"
            }, "<")
            .to(loadingProgress, {
                width: "100%",
                duration: 2.5,
                ease: "power2.inOut"
            }, "<")
            .to(loadingScreen, { opacity: 0, duration: 0.3, delay: 0 });
    } else {
        initHeroAnimations();
    }

    function initHeroAnimations() {
        const heroElements = document.querySelectorAll('.hero-animate');
        if (heroElements.length > 0) {
            gsap.set(heroElements, { y: 50, opacity: 0 });
            gsap.to(heroElements, {
                y: 0,
                opacity: 1,
                duration: 0.96,
                stagger: 0.16,
                ease: "power3.out",
                delay: 0
            });
        }
    }

    // ---------------------------------------------------------
    // Scroll Animations (Fade Up)
    // ---------------------------------------------------------
    const fadeUpElements = document.querySelectorAll('.gsap-fade-up');
    fadeUpElements.forEach(element => {
        gsap.from(element, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    });

    // ---------------------------------------------------------
    // Motive Quote Animation
    // ---------------------------------------------------------
    const motiveSection = document.querySelector('.motive-animate');
    if (motiveSection) {
        const motiveLabel = motiveSection.querySelector('.motive-label');
        const motiveQuote = motiveSection.querySelector('.motive-quote');

        gsap.set(motiveLabel, { opacity: 0, x: -30 });
        gsap.set(motiveQuote, { opacity: 0, x: -50, scaleX: 0.95 });

        const motiveTl = gsap.timeline({
            scrollTrigger: {
                trigger: motiveSection,
                start: "top 90%",
                toggleActions: "play none none none"
            }
        });

        motiveTl
            .to(motiveLabel, {
                opacity: 1,
                x: 0,
                duration: 0.5,
                ease: "power3.out"
            })
            .to(motiveQuote, {
                opacity: 1,
                x: 0,
                scaleX: 1,
                duration: 0.7,
                ease: "power3.out"
            }, "-=0.3");
    }

    // ---------------------------------------------------------
    // Delayed Navigation Links (Mobile only with shorter delay)
    // ---------------------------------------------------------


    // ---------------------------------------------------------
    // Timeline Items Staggered Animation
    // ---------------------------------------------------------
    const timelineItems = document.querySelectorAll('#locations .relative.flex');
    timelineItems.forEach((item, index) => {
        gsap.from(item, {
            x: index % 2 === 0 ? -50 : 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    });

    // ---------------------------------------------------------
    // Mobile Mission Carousel Continuous Scroll
    // ---------------------------------------------------------
    const missionCarousel = document.querySelector('#mission .mission-carousel');

    if (missionCarousel && window.innerWidth < 768) {
        // Clone children TWICE for a seamless buffer
        const children = Array.from(missionCarousel.children);
        const originalCount = children.length;

        children.forEach(child => {
            const clone = child.cloneNode(true);
            missionCarousel.appendChild(clone);
        });
        children.forEach(child => {
            const clone = child.cloneNode(true);
            missionCarousel.appendChild(clone);
        });

        // Calculate single set width after cloning
        const singleSetWidth = missionCarousel.scrollWidth / 3;

        let scrollSpeed = 0.65;
        let isPaused = false;

        let lastTime = 0;
        function autoScroll(currentTime) {
            if (!lastTime) lastTime = currentTime;
            const delta = currentTime - lastTime;
            lastTime = currentTime;

            if (!isPaused && delta < 50) { // Skip large jumps (tab switching etc)
                missionCarousel.scrollLeft += scrollSpeed;
                // Seamless reset when we've scrolled past one full set
                if (missionCarousel.scrollLeft >= singleSetWidth * 2) {
                    missionCarousel.scrollLeft = singleSetWidth;
                }
            }
            requestAnimationFrame(autoScroll);
        }

        // Start in the middle set for seamless loop in both directions
        missionCarousel.scrollLeft = singleSetWidth;
        autoScroll();

        missionCarousel.addEventListener('touchstart', () => {
            isPaused = true;
        });

        missionCarousel.addEventListener('touchend', () => {
            // Reset position if needed for seamless loop
            if (missionCarousel.scrollLeft < singleSetWidth * 0.5) {
                missionCarousel.scrollLeft += singleSetWidth;
            } else if (missionCarousel.scrollLeft > singleSetWidth * 2.5) {
                missionCarousel.scrollLeft -= singleSetWidth;
            }
            isPaused = false;
        });

        // Hide scrollbar for cleaner look
        missionCarousel.style.scrollbarWidth = 'none';
        missionCarousel.style.msOverflowStyle = 'none';
    }


    // ---------------------------------------------------------
    // Mobile Menu Animation
    // ---------------------------------------------------------
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeMenuButton = document.getElementById('close-menu-button');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    const mobileMenuSeparators = document.querySelectorAll('.mobile-menu-separator');

    let menuTimeline = gsap.timeline({ paused: true, reversed: true });

    menuTimeline
        .to(mobileMenuOverlay, {
            duration: 0.01,
            autoAlpha: 1,
            display: 'flex',
            onStart: () => { mobileMenuOverlay.classList.remove('hidden'); }
        })
        .fromTo(mobileMenuOverlay,
            { opacity: 0, backgroundColor: "rgba(255, 255, 255, 0)" },
            { opacity: 1, backgroundColor: "rgba(255, 255, 255, 1)", duration: 0.26, ease: "power2.out" }
        )
        .fromTo(closeMenuButton,
            { rotation: -90, opacity: 0, scale: 0.5 },
            { rotation: 0, opacity: 1, scale: 1, duration: 0.2, ease: "back.out(1.7)" },
            "-=0.2"
        )
        .from(mobileMenuLinks, {
            y: 30, opacity: 0, stagger: 0.1, duration: 0.33, ease: "power3.out"
        }, "-=0.2")
        .fromTo(mobileMenuSeparators,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.26, stagger: 0.1, ease: "power2.out" },
            "<"
        );

    function toggleMenu() {
        if (menuTimeline.reversed()) {
            menuTimeline.play();
            document.body.style.overflow = 'hidden';
        } else {
            menuTimeline.reverse();
            document.body.style.overflow = '';
        }
    }

    if (mobileMenuButton && mobileMenuOverlay && closeMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMenu);
        closeMenuButton.addEventListener('click', toggleMenu);
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuTimeline.reverse();
                document.body.style.overflow = '';
            });
        });
    }

    // ---------------------------------------------------------
    // Navbar Scroll Effect
    // ---------------------------------------------------------
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('bg-primary', 'shadow-lg');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.add('bg-transparent');
            navbar.classList.remove('bg-primary', 'shadow-lg');
        }
    });
});

// ---------------------------------------------------------
// Pinned Cards Carousel Navigation (GlobalScope)
// ---------------------------------------------------------
// Initialize scroll feedback & visibility
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('pinned-cards-container');
    const prevBtn = document.getElementById('pinned-prev-btn');
    const nextBtn = document.getElementById('pinned-next-btn');

    if (container && prevBtn && nextBtn) {

        // Initial check for visibility on load
        updateArrowVisibility();

        // Click Handlers
        prevBtn.addEventListener('click', () => {
            container.scrollBy({ left: -container.clientWidth, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
        });

        container.addEventListener('scroll', () => {
            updateArrowVisibility();
        });

        function updateArrowVisibility() {
            const scrollLeft = container.scrollLeft;
            const maxScrollLeft = container.scrollWidth - container.clientWidth;

            // Tolerance to handle varying screen widths/rounding
            const tolerance = 5;

            // Prev Button Visibility
            if (scrollLeft <= tolerance) {
                prevBtn.classList.add('opacity-0');
            } else {
                prevBtn.classList.remove('opacity-0');
            }

            // Next Button Visibility
            if (scrollLeft >= maxScrollLeft - tolerance) {
                nextBtn.classList.add('opacity-0');
            } else {
                nextBtn.classList.remove('opacity-0');
            }
        }
    }
});
