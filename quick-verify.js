const http = require('http');

const tests = [
  { url: '/index.html', search: 'Friday: 9:00 AM - 1:00 PM', name: 'Index - Friday timing' },
  { url: '/index.html', search: 'Wednesday: 11:30 AM - 3:30 PM', name: 'Index - Wednesday timing' },
  { url: '/index.html', search: 'Monday: 11:30 AM - 3:30 PM', name: 'Index - Monday timing' },
  { url: '/enrollment.html', search: 'Friday Program (9:00 AM - 1:00 PM)', name: 'Enrollment - Friday option' },
  { url: '/enrollment.html', search: 'Monday Program (11:30 AM - 3:30 PM)', name: 'Enrollment - Monday option' },
  { url: '/enrollment.html', search: 'Tuition is nonrefundable once classes start', name: 'Enrollment - Refund policy' },
  { url: '/enrollment.html', search: 'Tuition: $520 per session', name: 'Enrollment - $520 price' },
  { url: '/terms.html', search: 'Nonrefundable Tuition Policy', name: 'Terms - Nonrefundable clause' },
  { url: '/faqs.html', search: 'Friday from 9:00 AM to 1:00 PM', name: 'FAQs - Friday timing' },
  { url: '/index.html', search: 'Mon & Wed: 11:30 AM - 3:30 PM | Fri: 9 AM - 1 PM', name: 'Footer - All programs' }
];

let passed = 0;
let failed = 0;

function makeRequest(url, search, name) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: url,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (data.includes(search)) {
          console.log(`✓ ${name}`);
          passed++;
        } else {
          console.log(`✘ ${name}`);
          failed++;
        }
        resolve();
      });
    });

    req.on('error', () => {
      console.log(`✘ ${name} - Connection error`);
      failed++;
      resolve();
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Verifying Content Changes\n');
  
  for (const test of tests) {
    await makeRequest(test.url, test.search, test.name);
  }
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();

