## Lab Discussion

Part 1: Case study. Read this story: https://hackaday.com/2021/09/17/this-week-in-security-office-0-day-forcedentry-protonmail-and-omigod/ Links to an external site.(Please only read that "Router Leaks IP" story)

1. Can you explain how this "router leaks IP" attack works?

2. Do you know what is a GET request?

Part 2: Lab 8 questions:

1. why step 1.2 - changing /etc/hosts is needed, what will happen if we skip this step?

2. what will happen if we skip step 1.3 - configuring DNS server information?

3. what is the expected behavior after step 4? or how to test the effect of step 4?

4. what will happen if we skip step 5 - not adding the zone "attacker32.com" into the local DNS server configuration file.

5. in step 6, when accessing these 3 URLs, which one requires sending DNS queries to the local DNS server?

6. in step 6, why we can't change the temperature from the 3rd URL?

7. the trickiest part of this attack is step 7.1 and step 7.2. why are these two steps needed?

8. in step 7.3, it says "the JavaScript code on this page will send the set-temperature request to http://www.attacker32.com:8080", Links to an external site. why it doesn't send the request to the IoT server?

Part 3: Case studies. Read this story: Six million Sky routers exposed to takeover attacks for 17 monthsLinks to an external site.

1. The article says:"actors could easily exploit if the user had not changed the default admin password", in our lab steps, we didn't even mention or use the default admin password, why the attack still works?

2. The article says:"This script then loads a JavaScript payload on the iframe, which performs consecutive HTTP requests to the server, with the latter responding with its IP address." Why consecutive HTTP requests? Why not just one single request?

====

related story:

https://portswigger.net/daily-swig/vpn-users-unmasked-by-zero-day-vulnerability-in-virgin-media-routers
