## Accessing and Modifying an Element's Text

This example shows how to access an HTML element by its ID and change its text content.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DOM Example</title>
</head>
<body>
    <h1 id="title">Hello, World!</h1>
    <button onclick="changeText()">Change Text</button>

    <script>
        function changeText() {
            // Access the element with id "title"
            const title = document.getElementById('title');
            // Change the text content of the element
            title.textContent = 'DOM Manipulated the Text!';
        }
    </script>
</body>
</html>
```
