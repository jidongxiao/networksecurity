## Event Handling

This example demonstrates how to handle an event (like a button click) and execute a function in response to it.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DOM Example</title>
</head>
<body>
    <button id="clickButton">Click Me</button>

    <script>
        // Access the button element
        const button = document.getElementById('clickButton');

        // Add an event listener to the button
        button.addEventListener('click', function() {
            alert('Button was clicked!');
        });
    </script>
</body>
</html>
```
