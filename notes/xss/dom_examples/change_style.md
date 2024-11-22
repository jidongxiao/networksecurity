## Changing an Element's Style

This example shows how to change the style of an element (like its background color) using JavaScript.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DOM Example</title>
</head>
<body>
    <div id="box" style="width: 100px; height: 100px; background-color: blue;"></div>
    <button onclick="changeColor()">Change Color</button>

    <script>
        function changeColor() {
            // Access the element by id
            const box = document.getElementById('box');
            // Change its background color
            box.style.backgroundColor = 'green';
        }
    </script>
</body>
</html>
```
