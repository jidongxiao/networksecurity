# Understanding URL Fragments and Anchors

This activity demonstrates the purpose of the `#` character in a URL. A URL fragment identifies a specific location (element) within a webpage and allows users to navigate directly to that location without reloading the entire page.

## Task 1: Navigate to Different Sections

1. Open `anchors.html` in a browser.
2. Click the links to CSRF, XSS, and SSRF.
3. Observe how the URL changes when you click each link.
4. Manually modify the URL by appending `#csrf`, `#xss`, or `#ssrf` and observe the result.

**Questions:**
- What does `#csrf` identify in the URL?
- What HTML attribute identifies the destination element?
- What happens if you specify a fragment that does not exist?

## Task 2: Examine the HTTP Request

1. Open the browser's Developer Tools and select the Network tab.
2. Navigate to the page using a URL such as `anchors.html#csrf`.
3. Examine the HTTP request sent by the browser.

**Questions:**
- Is `#csrf` included in the HTTP request?
- Does clicking a fragment link require the browser to download the webpage again?

## Key Observations

- The `#` character introduces a URL fragment.
- A fragment such as `#csrf` typically identifies an HTML element with `id="csrf"`.
- The browser uses the fragment to navigate to the corresponding location within the webpage.
- The fragment is processed by the browser and is **not included in the HTTP request sent to the web server**.
