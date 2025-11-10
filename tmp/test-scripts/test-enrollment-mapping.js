const puppeteer = require('puppeteer');

async function mapEnrollmentFormFields() {
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        // Navigate to the enrollment form
        await page.goto('https://docs.google.com/forms/d/e/1FAIpQLSfhLKmg5axwS2wpd2OuFm61qqnT2RpVQ4vEy4ooPjCR7UCY-w/viewform');
        
        console.log('Form loaded, please manually fill out and submit the form...');
        console.log('Monitoring network requests for entry IDs...');
        
        // Listen for the network request to capture entry IDs
        const interceptedRequests = [];
        page.on('request', request => {
            if (request.url().includes('formResponse')) {
                interceptedRequests.push(request);
                console.log('\n=== FORM SUBMISSION DETECTED ===');
                console.log('Form submission URL:', request.url());
                console.log('POST data:', request.postData());
                
                // Parse the POST data to extract entry IDs
                const postData = request.postData();
                if (postData) {
                    const entries = postData.match(/entry\.\d+/g);
                    if (entries) {
                        console.log('\n=== ENTRY IDS FOUND ===');
                        entries.forEach(entry => {
                            console.log(entry);
                        });
                    }
                }
            }
        });
        
        console.log('Browser will stay open for manual form submission...');
        console.log('Close the browser window when done.');
        
        // Keep the browser open until manually closed
        await new Promise(() => {});
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

mapEnrollmentFormFields();
