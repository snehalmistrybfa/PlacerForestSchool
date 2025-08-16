window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-K6CQNKX257');

/**
 * Tracks a custom event with Google Analytics.
 * @param {string} eventName The name of the event (e.g., 'click', 'form_submit').
 * @param {string} eventCategory The category of the event (e.g., 'CTA', 'enrollment').
 * @param {string} eventLabel A label for the event (e.g., 'Register Now').
 */
function trackEvent(eventName, eventCategory, eventLabel) {
    gtag('event', eventName, {
        'event_category': eventCategory,
        'event_label': eventLabel
    });
}
