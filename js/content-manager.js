/**
 * Content Management System
 * Loads content from JSON files and populates HTML elements
 */

class ContentManager {
    constructor() {
        this.siteConfig = null;
        this.pageContent = null;
    }

    /**
     * Load site configuration
     */
    async loadSiteConfig() {
        try {
            const response = await fetch('/content/site-config.json');
            this.siteConfig = await response.json();
            return this.siteConfig;
        } catch (error) {
            console.error('Error loading site config:', error);
            return null;
        }
    }

    /**
     * Load page-specific content
     */
    async loadPageContent(pageName) {
        try {
            const response = await fetch(`/content/${pageName}-content.json`);
            this.pageContent = await response.json();
            return this.pageContent;
        } catch (error) {
            console.error(`Error loading ${pageName} content:`, error);
            return null;
        }
    }

    /**
     * Populate navigation menu
     */
    populateNavigation() {
        if (!this.siteConfig) return;

        const navMenu = document.querySelector('.nav-menu');
        const navLogo = document.querySelector('.nav-logo h2');
        
        if (navLogo) {
            navLogo.textContent = this.siteConfig.site.logo;
        }

        if (navMenu && this.siteConfig.navigation) {
            navMenu.innerHTML = '';
            this.siteConfig.navigation.forEach(item => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = item.url;
                a.className = 'nav-link';
                a.textContent = item.text;
                
                // Add active class if current page
                if (window.location.pathname.includes(item.url) || 
                    (item.url === 'index.html' && window.location.pathname === '/')) {
                    a.classList.add('active');
                }
                
                li.appendChild(a);
                navMenu.appendChild(li);
            });
        }
    }

    /**
     * Populate footer
     */
    populateFooter() {
        if (!this.siteConfig) return;

        const footer = document.querySelector('.footer');
        if (!footer) return;

        const footerHTML = `
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>${this.siteConfig.site.logo}</h3>
                        <p>${this.siteConfig.site.tagline}</p>
                    </div>
                    <div class="footer-section">
                        <h3>Contact</h3>
                        <p>📞 ${this.siteConfig.site.phone}</p>
                        <p>✉️ ${this.siteConfig.site.email}</p>
                        <p>📍 ${this.siteConfig.site.location}</p>
                    </div>
                    <div class="footer-section">
                        <h3>Program</h3>
                        <p>${this.siteConfig.program.schedule}</p>
                        <p>${this.siteConfig.program.ageRange}</p>
                        <p>${this.siteConfig.program.description}</p>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; ${new Date().getFullYear()} Placer Forest School. All rights reserved.</p>
                </div>
            </div>
        `;
        
        footer.innerHTML = footerHTML;
    }

    /**
     * Update Google Analytics ID
     */
    updateGoogleAnalytics() {
        if (!this.siteConfig) return;

        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.innerHTML.includes('GA_MEASUREMENT_ID')) {
                script.innerHTML = script.innerHTML.replace(/GA_MEASUREMENT_ID/g, this.siteConfig.site.googleAnalyticsId);
            }
        });
    }

    /**
     * Initialize content management for the current page
     */
    async init(pageName = null) {
        // Load site configuration
        await this.loadSiteConfig();
        
        // Populate common elements
        this.populateNavigation();
        this.populateFooter();
        this.updateGoogleAnalytics();

        // Load page-specific content if pageName is provided
        if (pageName) {
            await this.loadPageContent(pageName);
        }
    }

    /**
     * Get nested property from object using dot notation
     */
    getNestedProperty(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }

    /**
     * Set text content for element by selector
     */
    setTextContent(selector, text) {
        const element = document.querySelector(selector);
        if (element && text) {
            element.textContent = text;
        }
    }

    /**
     * Set HTML content for element by selector
     */
    setHTMLContent(selector, html) {
        const element = document.querySelector(selector);
        if (element && html) {
            element.innerHTML = html;
        }
    }
}

// Global content manager instance
const contentManager = new ContentManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Auto-detect page name from URL
    const pathname = window.location.pathname;
    let pageName = null;
    
    if (pathname.includes('enrollment.html')) {
        pageName = 'enrollment';
    } else if (pathname.includes('about.html')) {
        pageName = 'about';
    } else if (pathname.includes('contact.html')) {
        pageName = 'contact';
    } else if (pathname.includes('faqs.html')) {
        pageName = 'faqs';
    } else if (pathname.includes('resources.html')) {
        pageName = 'resources';
    } else if (pathname.includes('index.html') || pathname === '/') {
        pageName = 'home';
    }

    await contentManager.init(pageName);
    
    // Trigger page-specific initialization if function exists
    if (typeof initializePage === 'function') {
        initializePage();
    }
});
