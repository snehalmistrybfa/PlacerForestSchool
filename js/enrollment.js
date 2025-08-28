// Enrollment page JavaScript

// Function to handle Google Forms iframe
function handleGoogleFormScrolling() {
    const iframe = document.getElementById('google-form');
    
    if (iframe) {
        // Allow normal scrolling - remove any scroll restrictions
        iframe.removeAttribute('scrolling');
        iframe.style.overflow = 'auto';
        
        // Listen for load event
        iframe.addEventListener('load', function() {
            console.log('Google Form loaded');
            
            // Try to detect if we can access iframe content for dynamic sizing
            try {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDocument) {
                    // Get actual content height
                    const body = iframeDocument.body;
                    const html = iframeDocument.documentElement;
                    
                    const height = Math.max(
                        body.scrollHeight,
                        body.offsetHeight,
                        html.clientHeight,
                        html.scrollHeight,
                        html.offsetHeight
                    );
                    
                    if (height > 0 && height > 1000) {
                        // Add some padding to ensure submit button is visible
                        iframe.style.height = (height + 200) + 'px';
                        console.log('Set iframe height to:', height + 200);
                    }
                }
            } catch (e) {
                // CORS restriction - use generous fixed height
                console.log('Using fixed height due to CORS');
                // Use a very generous height to ensure all content is visible
                iframe.style.height = '5000px';
            }
        });
        
        // Ensure iframe can be interacted with normally
        iframe.style.pointerEvents = 'auto';
        iframe.style.userSelect = 'auto';
    }
}

// Simple initialization
document.addEventListener('DOMContentLoaded', handleGoogleFormScrolling);

// Fallback for already loaded DOM
if (document.readyState !== 'loading') {
    handleGoogleFormScrolling();
}