#!/bin/bash

# Test Google Forms submission with correct entry field mapping
# Based on the actual Google Form structure

echo "Testing Google Forms submission with correct entry IDs..."

curl 'https://docs.google.com/forms/d/e/1FAIpQLSfhLKmg5axwS2wpd2OuFm61qqnT2RpVQ4vEy4ooPjCR7UCY-w/formResponse' \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'cache-control: max-age=0' \
  -H 'content-type: application/x-www-form-urlencoded' \
  -H 'origin: http://localhost:8001' \
  -H 'priority: u=0, i' \
  -H 'referer: http://localhost:8001/' \
  -H 'sec-ch-ua: "Chromium";v="131", "Not_A Brand";v="24"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: iframe' \
  -H 'sec-fetch-mode: navigate' \
  -H 'sec-fetch-site: cross-site' \
  -H 'sec-fetch-user: ?1' \
  -H 'upgrade-insecure-requests: 1' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' \
  --data-raw 'entry.153991797=Friday+Program+%2810+AM+-+3+PM%29&entry.1259515391=Emma+Thompson&entry.1904207928=2018-05-15&entry.46770409=No+known+allergies+or+special+considerations.&entry.1760598539=Sarah+Thompson&entry.2010795504=555-123-4567&entry.468070000=sarah.thompson.test%40example.com&entry.928837263=123+Oak+Street%0D%0ALincoln%2C+CA+95648&entry.704141376=John+Thompson&entry.343389045=555-987-6543&entry.351445251=Father&entry.1356648142=No+known+allergies+or+medical+conditions.&entry.1990020228=No+dietary+restrictions.&entry.1086360565=Ability+to+Participate+%26+Assumption+of+Risk%3A+I+acknowledge+that+outdoor+forest+school+activities+involve+inherent+risks+and+that+my+child+is+physically+and+emotionally+capable+of+participating+in+the+program.&entry.1086360565=Waiver+%26+Release+of+Liability%3A+I+release+Placer+Forest+School%2C+its+instructors%2C+and+associated+parties+from+any+liability+for+injuries+or+damages+that+may+occur+during+participation+in+the+program.&entry.1086360565=Medical+Emergency+Authorization%3A+I+authorize+Placer+Forest+School+staff+to+seek+emergency+medical+treatment+for+my+child+if+needed+and+agree+to+be+responsible+for+any+associated+costs.&entry.1344520112=Yes%2C+I+give+permission+for+my+child+to+be+included+in+photos%2Fvideos+for+program+documentation+and+promotional+materials&entry.1527804629=Emma+loves+nature+and+is+excited+to+join+the+forest+school+program%21' \
  -w "HTTP Status: %{http_code}\nTotal time: %{time_total}s\n" \
  -o response.html

echo ""
echo "Response saved to response.html"
echo "Checking response content..."
head -20 response.html
