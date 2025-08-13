// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Initialize carousel
    initCarousel();
    
    // Track page view
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href
        });
    }
});

// Carousel functionality
window.currentSlideIndex = 0;
let slides, dots;
let autoSlideInterval;
let autoSlideTimeout;

function initCarousel() {
    slides = document.querySelectorAll('.carousel-slide');
    dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    // Initialize lazy loading for carousel images
    initLazyLoading();
    
    window.currentSlideIndex = 0;
    showSlide(window.currentSlideIndex);
    startAutoSlide();
    
    // Pause auto-slide on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
        
        // Add keyboard navigation
        carouselContainer.addEventListener('keydown', handleKeyboardNavigation);
        carouselContainer.setAttribute('tabindex', '0');
        
        // Add touch support
        addTouchSupport(carouselContainer);
    }
}

function initLazyLoading() {
    const carouselImages = document.querySelectorAll('.carousel-slide img[loading="lazy"]');
    
    carouselImages.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });
}

// Make functions globally accessible
window.initCarousel = initCarousel;
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;
window.stopAutoSlide = stopAutoSlide;

function showSlide(index) {
    // Refresh slides and dots in case they were updated
    slides = document.querySelectorAll('.carousel-slide');
    dots = document.querySelectorAll('.dot');
    
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (dots[index]) {
        dots[index].classList.add('active');
    }
    
    window.currentSlideIndex = index;
    
    // Track carousel interaction
    if (typeof gtag !== 'undefined') {
        gtag('event', 'carousel_view', {
            event_category: 'engagement',
            event_label: `slide_${index + 1}`,
            value: index + 1
        });
    }
}

function changeSlide(direction) {
    stopAutoSlide();
    
    window.currentSlideIndex += direction;
    
    // Refresh slides count in case it was updated
    slides = document.querySelectorAll('.carousel-slide');
    
    if (window.currentSlideIndex >= slides.length) {
        window.currentSlideIndex = 0;
    } else if (window.currentSlideIndex < 0) {
        window.currentSlideIndex = slides.length - 1;
    }
    
    showSlide(window.currentSlideIndex);
    
    // Track manual navigation
    if (typeof gtag !== 'undefined') {
        gtag('event', 'carousel_navigation', {
            event_category: 'engagement',
            event_label: direction > 0 ? 'next' : 'previous',
            value: 1
        });
    }
    
    // Restart auto-slide after a delay
    autoSlideTimeout = setTimeout(startAutoSlide, 5000);
}

function currentSlide(index) {
    stopAutoSlide();
    showSlide(index - 1);
    
    // Track dot navigation
    if (typeof gtag !== 'undefined') {
        gtag('event', 'carousel_dot_click', {
            event_category: 'engagement',
            event_label: `dot_${index}`,
            value: index
        });
    }
    
    // Restart auto-slide after a delay
    autoSlideTimeout = setTimeout(startAutoSlide, 5000);
}

function startAutoSlide() {
    // Refresh slides count
    slides = document.querySelectorAll('.carousel-slide');
    
    if (slides.length <= 1) return;
    
    // Clear existing interval before starting a new one
    stopAutoSlide();

    autoSlideInterval = setInterval(() => {
        window.currentSlideIndex = (window.currentSlideIndex + 1) % slides.length;
        showSlide(window.currentSlideIndex);
    }, 5000); // Change slide every 5 seconds
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
    if (autoSlideTimeout) {
        clearTimeout(autoSlideTimeout);
        autoSlideTimeout = null;
    }
}

// Make stopAutoSlide globally accessible
window.stopAutoSlide = stopAutoSlide;

function handleKeyboardNavigation(e) {
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        changeSlide(1);
    } else if (e.key === 'Escape') {
        e.preventDefault();
        stopAutoSlide();
    }
}

function addTouchSupport(container) {
    let startX = 0;
    let endX = 0;
    
    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });
    
    container.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                changeSlide(1);
            } else {
                // Swipe right - previous slide
                changeSlide(-1);
            }
        }
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Track section views
            if (typeof gtag !== 'undefined') {
                const sectionName = entry.target.className.split(' ')[0];
                gtag('event', 'section_view', {
                    event_category: 'engagement',
                    event_label: sectionName,
                    value: 1
                });
            }
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});

// Form validation and tracking (for future forms)
function validateForm(formElement) {
    let isValid = true;
    const requiredFields = formElement.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            showFieldError(field, 'This field is required');
        } else {
            field.classList.remove('error');
            hideFieldError(field);
        }
        
        // Email validation
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                field.classList.add('error');
                showFieldError(field, 'Please enter a valid email address');
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && field.value.trim()) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(field.value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                field.classList.add('error');
                showFieldError(field, 'Please enter a valid phone number');
            }
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function hideFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Enhanced analytics tracking
function trackUserEngagement() {
    let scrollDepth = 0;
    let timeOnPage = Date.now();
    
    // Track scroll depth
    window.addEventListener('scroll', () => {
        const scrollPercentage = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        if (scrollPercentage > scrollDepth && scrollPercentage % 25 === 0) {
            scrollDepth = scrollPercentage;
            if (typeof gtag !== 'undefined') {
                gtag('event', 'scroll_depth', {
                    event_category: 'engagement',
                    event_label: `${scrollPercentage}%`,
                    value: scrollPercentage
                });
            }
        }
    });
    
    // Track time on page when user leaves
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - timeOnPage) / 1000);
        if (typeof gtag !== 'undefined') {
            gtag('event', 'time_on_page', {
                event_category: 'engagement',
                event_label: 'seconds',
                value: timeSpent
            });
        }
    });
}

// Initialize engagement tracking
trackUserEngagement();

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Replace with placeholder or hide if image fails to load
            this.style.display = 'none';
            console.warn(`Failed to load image: ${this.src}`);
        });
    });
});

// Performance monitoring
window.addEventListener('load', function() {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_time', {
                event_category: 'performance',
                event_label: 'milliseconds',
                value: loadTime
            });
        }
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Arrow key navigation for carousel
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    }
    
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Touch/swipe support for carousel
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            changeSlide(1);
        } else {
            // Swipe right - previous slide
            changeSlide(-1);
        }
    }
}
