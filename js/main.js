/**
 * SmallPawsUnite - Main JavaScript
 * Handles navigation, animations, sliders, forms, and interactive elements
 */

// Current language
let currentLang = localStorage.getItem('language') || 'en';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initLanguageSwitcher();
    initNavigation();
    initScrollEffects();
    initAccordion();
    initStoriesSlider();
    initPetitionModal();
    initContactForm();
    initPetitionForm();
    initCounterAnimation();
    initScrollReveal();
    
    // Apply saved language
    applyLanguage(currentLang);
});

/**
 * Language Switcher functionality
 */
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
            
            // Update active state
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
        
        // Set initial active state
        if (btn.getAttribute('data-lang') === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * Set and apply language
 */
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    applyLanguage(lang);
}

/**
 * Apply translations to all elements
 */
function applyLanguage(lang) {
    const t = translations[lang];
    if (!t) return;
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = getNestedValue(t, key);
        if (value) {
            el.textContent = value;
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const value = getNestedValue(t, key);
        if (value) {
            el.placeholder = value;
        }
    });
    
    // Update document title based on language
    const titles = {
        en: 'Small Dogs, Big Discrimination | Fight Pet Discrimination',
        uk: 'Маленькі собаки, Велика дискримінація | Боротьба з дискримінацією тварин',
        ru: 'Маленькие собаки, Большая дискриминация | Борьба с дискриминацией животных'
    };
    document.title = titles[lang] || titles.en;
    
    // Update meta description
    const descriptions = {
        en: 'Small Dogs, Big Discrimination - Advocating for fair treatment of small dogs in housing, public spaces, and travel. Join the movement for tiny paws everywhere.',
        uk: 'Маленькі собаки, Велика дискримінація - Захищаємо права маленьких собак у житлі, громадських місцях та подорожах. Приєднуйтесь до руху за маленькі лапки по всьому світу.',
        ru: 'Маленькие собаки, Большая дискриминация - Защищаем права маленьких собак в жилье, общественных местах и путешествиях. Присоединяйтесь к движению за маленькие лапки по всему миру.'
    };
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.content = descriptions[lang] || descriptions.en;
    }
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
    }, obj);
}

/**
 * Navigation functionality
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Navbar scroll effect
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const navHeight = navbar?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll effects and active link highlighting
 */
function initScrollEffects() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightNav = () => {
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });
}

/**
 * Accordion functionality for Why It's Unfair section
 */
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header?.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            accordionItems.forEach(i => i.classList.remove('active'));

            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Stories slider functionality
 */
function initStoriesSlider() {
    const slides = document.querySelectorAll('.story-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    if (!slides.length) return;

    let currentSlide = 0;
    let autoSlideInterval;

    const showSlide = (index) => {
        // Handle wrap around
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;

        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentSlide = index;
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);

    // Event listeners
    nextBtn?.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn?.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showSlide(i);
            resetAutoSlide();
        });
    });

    // Auto-slide
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };

    startAutoSlide();

    // Pause on hover
    const slider = document.getElementById('storiesSlider');
    slider?.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    slider?.addEventListener('mouseleave', startAutoSlide);

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    slider?.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider?.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoSlide();
        }
    };
}

/**
 * Petition modal functionality
 */
function initPetitionModal() {
    const modal = document.getElementById('petitionModal');
    const openBtn = document.getElementById('signPetition');
    const closeBtn = modal?.querySelector('.modal-close');
    const overlay = modal?.querySelector('.modal-overlay');

    const openModal = () => {
        modal?.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal?.classList.remove('active');
        document.body.style.overflow = '';
    };

    openBtn?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * Contact form handling
 */
function initContactForm() {
    const form = document.getElementById('contactForm');

    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Simulate form submission
        console.log('Contact form submitted:', data);

        // Show success message (translated)
        const t = translations[currentLang];
        showToast(t?.toast?.contactSuccess || 'Thank you for your message! We\'ll be in touch soon.');

        // Reset form
        form.reset();
    });
}

/**
 * Petition form handling
 */
function initPetitionForm() {
    const form = document.getElementById('petitionForm');
    const modal = document.getElementById('petitionModal');

    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Simulate form submission
        console.log('Petition signed:', data);

        // Close modal
        modal?.classList.remove('active');
        document.body.style.overflow = '';

        // Show success message (translated)
        const t = translations[currentLang];
        showToast(t?.toast?.petitionSuccess || 'Thank you! Your signature has been added to the petition.');

        // Update petition count (simulated)
        updatePetitionCount();

        // Reset form
        form.reset();
    });
}

/**
 * Show toast notification
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = toast?.querySelector('.toast-message');

    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
}

/**
 * Update petition count (simulated)
 */
function updatePetitionCount() {
    const progressFill = document.querySelector('.progress-fill');
    const signatureCount = document.querySelector('.progress-text span strong');

    if (progressFill && signatureCount) {
        // Simulate adding a signature
        const currentCount = parseInt(signatureCount.textContent.replace(/,/g, ''));
        const newCount = currentCount + 1;
        
        signatureCount.textContent = newCount.toLocaleString();

        // Update progress bar
        const percentage = Math.min((newCount / 100000) * 100, 100);
        progressFill.style.width = `${percentage}%`;
    }
}

/**
 * Counter animation for hero stats
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateCounters = () => {
        if (animated) return;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });

        animated = true;
    };

    // Intersection Observer to trigger animation when hero is visible
    const heroStats = document.querySelector('.hero-stats');
    
    if (heroStats) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(heroStats);
    }
}

/**
 * Scroll reveal animations
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-aos]');

    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                el.classList.add('aos-animate');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll(); // Check initial state
}

/**
 * Parallax effect for hero section
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }, { passive: true });
    }
}

// Initialize parallax if not on mobile
if (window.innerWidth > 768) {
    initParallax();
}

/**
 * Lazy loading for images
 */
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

/**
 * Form validation helper
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Debounce helper function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Add keyboard navigation support
 */
document.addEventListener('keydown', (e) => {
    // Tab trap for modal
    const modal = document.querySelector('.modal.active');
    if (modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    }
});

// Add smooth loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
