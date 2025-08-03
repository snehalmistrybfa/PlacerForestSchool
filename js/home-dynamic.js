/**
 * Home Page Dynamic Content Management
 */

let homeContent = null;

/**
 * Initialize home page with dynamic content
 */
async function initializePage() {
    if (contentManager.pageContent) {
        homeContent = contentManager.pageContent;
        populateHomeContent();
    }
}

/**
 * Populate home page with content from JSON
 */
function populateHomeContent() {
    if (!homeContent) return;

    // Update meta tags
    updateMetaTags();
    
    // Update hero section
    updateHeroSection();
    
    // Update carousel
    updateCarousel();
    
    // Update intro section
    updateIntroSection();
    
    // Update schedule section
    updateScheduleSection();
    
    // Update CTA section
    updateCtaSection();
    
    // Update mission section
    updateMissionSection();
}

/**
 * Update meta tags
 */
function updateMetaTags() {
    const meta = homeContent.meta;
    
    // Update title
    document.title = meta.title;
    
    // Update meta description
    updateMetaTag('description', meta.description);
    updateMetaTag('keywords', meta.keywords);
    updateMetaTag('author', meta.author);
    
    // Update Open Graph tags
    updateMetaProperty('og:title', meta.openGraph.title);
    updateMetaProperty('og:description', meta.openGraph.description);
    updateMetaProperty('og:url', meta.openGraph.url);
}

/**
 * Update hero section
 */
function updateHeroSection() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.textContent = homeContent.hero.title;
    }
}

/**
 * Update carousel images
 */
function updateCarousel() {
    const carouselContainer = document.querySelector('.carousel-container');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!carouselContainer || !dotsContainer) return;
    
    // Clear existing content
    carouselContainer.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    // Add slides
    homeContent.carousel.images.forEach((image, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `<img src="${image.src}" alt="${image.alt}">`;
        carouselContainer.appendChild(slide);
        
        // Create dot
        const dot = document.createElement('span');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => currentSlide(index + 1);
        dotsContainer.appendChild(dot);
    });
    
    // Re-initialize carousel functionality
    initializeCarouselAfterUpdate();
}

/**
 * Update intro section
 */
function updateIntroSection() {
    const section = homeContent.introSection;
    
    // Update title
    const sectionTitle = document.querySelector('.intro-section .section-title');
    if (sectionTitle) {
        sectionTitle.textContent = section.title;
    }
    
    // Update intro text
    const introText = document.querySelector('.intro-text');
    if (!introText) return;
    
    // Build intro content
    let introHTML = '';
    
    // Add paragraphs
    section.paragraphs.forEach(paragraph => {
        introHTML += `<p>${paragraph}</p>`;
    });
    
    // Add benefits list
    introHTML += '<ul class="benefits-list">';
    section.benefits.forEach(benefit => {
        introHTML += `<li>${benefit.icon} ${benefit.text}</li>`;
    });
    introHTML += '</ul>';
    
    // Add highlight
    introHTML += `<p class="highlight">${section.highlight}</p>`;
    
    introText.innerHTML = introHTML;
}

/**
 * Update schedule section
 */
function updateScheduleSection() {
    const section = homeContent.scheduleSection;
    
    // Update section title
    const sectionTitle = document.querySelector('.schedule-section .section-title');
    if (sectionTitle) {
        sectionTitle.textContent = section.title;
    }
    
    // Update schedule card
    const scheduleCard = document.querySelector('.schedule-card');
    if (!scheduleCard) return;
    
    let cardHTML = `<h3>${section.card.title}</h3>`;
    
    section.card.details.forEach(detail => {
        cardHTML += `<p><strong>${detail.icon} ${detail.label}</strong> ${detail.value}</p>`;
    });
    
    cardHTML += `<p><em>${section.card.note}</em></p>`;
    
    scheduleCard.innerHTML = cardHTML;
}

/**
 * Update CTA section
 */
function updateCtaSection() {
    const section = homeContent.ctaSection;
    
    // Update title
    const ctaTitle = document.querySelector('.cta-section h2');
    if (ctaTitle) {
        ctaTitle.textContent = section.title;
    }
    
    // Update description
    const ctaDescription = document.querySelector('.cta-section p');
    if (ctaDescription) {
        ctaDescription.textContent = section.description;
    }
    
    // Update buttons
    const ctaButtons = document.querySelector('.cta-buttons');
    if (!ctaButtons) return;
    
    ctaButtons.innerHTML = '';
    section.buttons.forEach(button => {
        const buttonElement = document.createElement('a');
        buttonElement.href = button.url;
        buttonElement.className = button.class;
        buttonElement.textContent = button.text;
        buttonElement.onclick = () => trackEvent('click', 'CTA', button.trackingLabel);
        ctaButtons.appendChild(buttonElement);
    });
    
    // Update contact info
    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo && contentManager.siteConfig) {
        const contact = contentManager.siteConfig.site;
        contactInfo.innerHTML = `
            <p>📞 <a href="tel:${contact.phone.replace(/[^0-9]/g, '')}">${contact.phone}</a></p>
            <p>✉️ <a href="mailto:${contact.email}">${contact.email}</a></p>
        `;
    }
}

/**
 * Update mission section
 */
function updateMissionSection() {
    const section = homeContent.missionSection;
    
    // Update title
    const missionTitle = document.querySelector('.mission-section h2');
    if (missionTitle) {
        missionTitle.textContent = section.title;
    }
    
    // Update content
    const missionContent = document.querySelector('.mission-section p');
    if (missionContent) {
        missionContent.textContent = section.content;
    }
}

/**
 * Reinitialize carousel after content update
 */
function initializeCarouselAfterUpdate() {
    // Reset carousel variables
    if (window.currentSlideIndex !== undefined) {
        window.currentSlideIndex = 0;
    }
    
    // Stop any existing auto-slide
    if (window.stopAutoSlide && typeof window.stopAutoSlide === 'function') {
        window.stopAutoSlide();
    }
    
    // Restart carousel functionality
    if (window.initCarousel && typeof window.initCarousel === 'function') {
        window.initCarousel();
    }
}

/**
 * Helper functions
 */
function updateMetaTag(name, content) {
    const metaTag = document.querySelector(`meta[name="${name}"]`);
    if (metaTag && content) {
        metaTag.setAttribute('content', content);
    }
}

function updateMetaProperty(property, content) {
    const metaTag = document.querySelector(`meta[property="${property}"]`);
    if (metaTag && content) {
        metaTag.setAttribute('content', content);
    }
}
