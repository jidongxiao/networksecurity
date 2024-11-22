## Adding an Element to the DOM

This example demonstrates how to add a new element to the page using JavaScript.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DOM Example</title>
</head>
<body>
    <div id="container">
        <h2>Item List</h2>
    </div>
    <button onclick="addItem()">Add Item</button>

    <script>
        function addItem() {
            // Create a new <p> element
            const newItem = document.createElement('p');
            // Set its content
            newItem.textContent = 'New item added to the list!';
            // Append the new element to the container
            document.getElementById('container').appendChild(newItem);
        }
    </script>
</body>
</html>
```
