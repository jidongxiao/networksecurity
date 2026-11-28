# Same-Origin Policy (SOP) Laboratory

## 1. Objectives

The objective of this lab is to understand how browsers enforce the
Same-Origin Policy (SOP).

You will experiment with cross-origin interactions between two websites
and investigate what a website can and cannot access when interacting
with another origin.

By completing this lab, you should understand:

- What constitutes an origin.
- Which cross-origin resources can be loaded.
- Why loading a resource does not necessarily permit reading its contents.
- How SOP restricts access to another website's DOM.
- Why cross-origin HTTP requests can reach a server even when
  JavaScript cannot read their responses.
- How browser storage is isolated between origins.
- How websites can communicate using postMessage().

## 2. Lab Environment

This lab uses two websites running on the same machine.

| Website | Address | Technology |
|---|---|---|
| Banking website | http://localhost:4000 | Node.js / Express |
| Attacker website | http://localhost:8000 | Python HTTP server |

Although both websites use localhost, they have different ports.
Therefore, they have different origins.

An origin consists of three components:

    Origin = (scheme, host, port)

For example:

    http://localhost:4000
    http://localhost:8000

These are different origins because their port numbers differ.

## 3. Setup

### 3.1 Install dependencies

Install Node.js, npm, and Python 3 if they are not already installed.

    sudo apt install nodejs npm python3

### 3.2 Start the banking server

Open a terminal:

    cd sop/banking

Install Express:

    npm install express

Start the banking server:

    node server.js

The server should display:

    Banking server listening on http://localhost:4000
    CORS is not enabled.

### 3.3 Log in to the banking website

Open a browser and visit:

    http://localhost:4000

Log in using:

    Username: jessica
    Password: 50505

You should see:

    Welcome, jessica!
    Your account balance: $10000

Keep this tab open.

### 3.4 Start the attacker server

Open another terminal:

    cd sop/attacker

Start the Python HTTP server:

    python3 -m http.server 8000

Open another browser tab and visit:

    http://localhost:8000

You should see the SOP laboratory page.

IMPORTANT: Use localhost consistently for both websites.
Do not mix localhost and 127.0.0.1.

## 4. Experiments

For each experiment:

1. Predict what you expect the browser to do.
2. Run the experiment.
3. Observe the result.
4. Inspect the browser Developer Tools when appropriate.
5. Explain the result based on SOP.

### Experiment 1: Cross-Origin Image Loading

Click "Load Banking Image".

Observe whether an image hosted by the banking website
can be displayed on the attacker website.

Questions:

1. Was the image successfully loaded?
2. Did the browser block the cross-origin request?
3. Does SOP prevent a website from displaying images
   hosted by another origin?

### Experiment 2: Cross-Origin JavaScript

Click "Load Banking JavaScript".

Open the browser console.

Observe the message:

    Banking JavaScript executed!

Questions:

1. Was the JavaScript file successfully loaded?
2. Did the JavaScript execute?
3. In whose JavaScript execution context did it execute?
4. Does SOP prevent a website from including JavaScript
   hosted by another origin?

### Experiment 3: Cross-Origin CSS

Click "Load Banking CSS".

Observe whether the appearance of the target element changes.

Questions:

1. Was the stylesheet successfully loaded?
2. Could the browser apply the stylesheet?
3. Does SOP prevent cross-origin stylesheets from being loaded?

### Experiment 4: Cross-Origin iframe Access

The attacker page contains an iframe displaying the banking
website's private account page.

First, observe the contents displayed inside the iframe.

Click "Read Banking Page".

Questions:

1. Can the attacker website display the banking page?
2. Can JavaScript running on the attacker website read
   the banking page's DOM?
3. What exception does the browser raise?
4. Why does the iframe load successfully even though
   its DOM cannot be accessed?

Next, click "Read Banking localStorage".

Questions:

1. Can the attacker website access the banking website's
   localStorage?
2. Why is this operation restricted?

### Experiment 5: Cross-Origin Fetch

Click "Fetch Account Information".

Observe the result displayed by the attacker website.

Next, inspect the Network tab in Developer Tools.

Find the request:

    http://localhost:4000/api/account

Inspect the request and response.

Questions:

1. Did the browser send the HTTP request?
2. Did the banking server receive the request?
3. Did the banking server return account information?
4. Why couldn't JavaScript on the attacker website read
   the response?
5. Was an OPTIONS preflight request necessary?

Pay particular attention to the difference between
sending a request and reading its response.

### Experiment 6: Cross-Origin Form Submission

Enter a message and click "Submit to Banking Website".

Observe the response displayed inside the second iframe.

Inspect the banking server terminal.

Questions:

1. Did the browser submit the form?
2. Did the banking server receive the submitted information?
3. Can the attacker website freely inspect the resulting
   banking document?
4. Does SOP prevent cross-origin form submissions?

### Experiment 7: Cross-Origin Canvas Access

Click "Read Image Pixels".

Observe the result.

Questions:

1. Could the banking image be loaded?
2. Could the image be drawn onto the canvas?
3. Could JavaScript read the image's pixel data?
4. Why does the browser distinguish between displaying
   an image and reading its pixel data?

### Experiment 8: Cross-Origin Communication

Click "Send Message to Banking Website".

Look inside the banking page displayed in the iframe.

You should see the received message.

Questions:

1. Did the attacker website successfully communicate
   with the banking website?
2. Why is postMessage() permitted even though direct
   DOM access is restricted?
3. Why should the receiving website validate event.origin?

## 5. Summary

Complete the following table based on your observations.

| Operation | Allowed or Blocked? |
|---|---|
| Load a cross-origin image | |
| Load and execute cross-origin JavaScript | |
| Load cross-origin CSS | |
| Display a cross-origin page in an iframe | |
| Read a cross-origin iframe's DOM | |
| Read cross-origin localStorage | |
| Send a cross-origin fetch request | |
| Read a cross-origin fetch response without CORS | |
| Submit a cross-origin form | |
| Read cross-origin canvas pixel data | |
| Communicate using postMessage() | |

## 6. Important Takeaways

The Same-Origin Policy does not prohibit all cross-origin
interactions.

It restricts access to certain cross-origin resources and
data, particularly when JavaScript attempts to inspect
another origin's contents.

For example:

- A website can display a cross-origin image but cannot
  necessarily read its pixel data.
- A website can display another origin inside an iframe
  but cannot freely inspect its DOM.
- A browser can send a cross-origin HTTP request even
  when JavaScript cannot read the response.
- A website can submit a form to another origin.
- Websites can communicate through explicitly provided
  mechanisms such as postMessage().

CORS is a separate mechanism that allows servers to
selectively grant cross-origin access.

This lab deliberately does not enable CORS. You will
investigate CORS in a separate laboratory.

## 7. References

- MDN: Same-Origin Policy
  https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy

- MDN: Cross-Origin Resource Sharing (CORS)
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS

- MDN: Window.postMessage()
  https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
