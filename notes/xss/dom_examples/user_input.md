## Handling User Input and Displaying it in the DOM

This example takes user input from a form and displays it dynamically in the DOM.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DOM Example</title>
</head>
<body>
    <label for="name">Enter your name: </label>
    <input type="text" id="name" />
    <button onclick="displayName()">Submit</button>

    <p id="greeting"></p>

    <script>
        function displayName() {
            // Access the input value
            const name = document.getElementById('name').value;
            // Access the paragraph element and set its content
            document.getElementById('greeting').textContent = `Hello, ${name}!`;
        }
    </script>
</body>
</html>
```
