// Ensure that 'step' is declared in the global scope
var step = 0;

// Create a stage
var stage = new Konva.Stage({
    container: 'container', // ID of container <div>
    width: 2000,
    height: 1000
});

// Create a layer
var layer = new Konva.Layer();
stage.add(layer);

// Draw client node
var clientRect = new Konva.Rect({
    x: 300,
    y: 150,
    width: 200,
    height: 100,
    fill: '#ddd',
    stroke: 'black',
    strokeWidth: 4,
    cornerRadius: 10,
});
layer.add(clientRect);

var clientText = new Konva.Text({
    x: 350,
    y: 190,
    text: 'Evil Client',
    fontSize: 24,
    fill: 'black'
});
layer.add(clientText);

// Draw server node
var serverRect = new Konva.Rect({
    x: 800,
    y: 150,
    width: 200,
    height: 100,
    fill: '#ddd',
    stroke: 'black',
    strokeWidth: 4,
    cornerRadius: 10,
});
layer.add(serverRect);

var serverText = new Konva.Text({
    x: 860,
    y: 190,
    text: 'Server',
    fontSize: 24,
    fill: 'black'
});
layer.add(serverText);

// Vertical line below client
var clientLine = new Konva.Line({
    points: [400, 250, 400, 700],
    stroke: 'black',
    strokeWidth: 3,
});
layer.add(clientLine);

// Vertical line below server
var serverLine = new Konva.Line({
    points: [900, 250, 900, 700],
    stroke: 'black',
    strokeWidth: 3,
});
layer.add(serverLine);

// Function to draw arrows for messages
function drawArrow(fromX, fromY, toX, toY, id, color) {
    return new Konva.Arrow({
        points: [fromX, fromY, toX, toY],
        pointerLength: 10,
        pointerWidth: 10,
        fill: color,
        stroke: color,
        strokeWidth: 4,
        id: id,
        visible: false
    });
}

// Message texts
var heartbeatRequestText = new Konva.Text({
    x: 550,
    y: 300,
    text: 'Heartbeat Request',
    fontSize: 20,
    fill: 'black',
    visible: false,
    id: 'heartbeat_request_text'
});
layer.add(heartbeatRequestText);

// Message texts
var heartbeatRequestClientText = new Konva.Text({
    x: 110,
    y: 300,
    text: '“Are you there?\nThe magic word is “giraffe,”\nwhich is 100 characters long.”',
    fontSize: 20,
    fill: 'black',
    visible: false,
    id: 'heartbeat_request_client_text'
});
layer.add(heartbeatRequestClientText);

var dataLeakText = new Konva.Text({
    x: 550,
    y: 400,
    text: 'Data Leak',
    fontSize: 20,
    fill: 'black',
    visible: false,
    id: 'data_leak_text'
});
layer.add(dataLeakText);

var dataLeakServerText = new Konva.Text({
    x: 910,
    y: 400,
    text: 'Server sends more data than requested.\n"Yes I’m here. \nYour magic word was \n“giraffe1^v6%\n$John Smith:645-43-5324:07/19/1982:\njsmith:Secr3tPassw0rd:202-563-1234:\nsmith@email.com$""',
    fontSize: 20,
    fill: 'black',
    visible: false,
    id: 'data_leak_server_text'
});
layer.add(dataLeakServerText);

var sensitiveDataText = new Konva.Text({
    x: 650,
    y: 475,
    text: 'Leaked Sensitive Data',
    fontSize: 20,
    fill: 'red',
    visible: false,
    id: 'sensitive_data_text'
});
layer.add(sensitiveDataText);

// Draw the arrows
var heartbeatRequestArrow = drawArrow(400, 300, 900, 375, 'heartbeat_request_arrow', 'green');
var dataLeakArrow = drawArrow(900, 400, 400, 475, 'data_leak_arrow', 'red');

// Initially hide arrows and add them to the layer
layer.add(heartbeatRequestArrow);
layer.add(dataLeakArrow);

// Draw everything
layer.draw();

// Function to handle the next step
function heartbleed_nextstep() {
    if (step === 0) {
        // Show Heartbeat Request message and arrow
        heartbeatRequestArrow.visible(true);
        heartbeatRequestText.visible(true);
        heartbeatRequestClientText.visible(true);
        layer.draw(); // Redraw to show the changes
        step++;
    } else if (step === 1) {
        // Show Data Leak message and arrow
        dataLeakArrow.visible(true);
        dataLeakText.visible(true);
        dataLeakServerText.visible(true);
        layer.draw(); // Redraw to show the changes
        step++;
    } else if (step === 2) {
        // Show Leaked Sensitive Data
        sensitiveDataText.visible(true);
        layer.draw(); // Redraw to show the changes
        step++;
    } else {
        alert("Heartbleed Exploit Complete! Please refresh the website to see the animation again.");
    }
}