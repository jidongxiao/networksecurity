// Ensure that 'step' is declared in the global scope
var step = 0;

// Create a stage
var stage = new Konva.Stage({
    container: 'container', // ID of container <div>
    width: 1000,
    height: 600
});

// Create a layer
var layer = new Konva.Layer();
stage.add(layer);

// Draw client node
var clientRect = new Konva.Rect({
    x: 100,
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
    x: 150,
    y: 180,
    text: 'Client',
    fontSize: 24,
    fill: 'black'
});
layer.add(clientText);

// Draw server node
var serverRect = new Konva.Rect({
    x: 600,
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
    x: 650,
    y: 180,
    text: 'Server',
    fontSize: 24,
    fill: 'black'
});
layer.add(serverText);

// Vertical line below client
var clientLine = new Konva.Line({
    points: [200, 250, 200, 600], // Start at center bottom of clientRect (x = 200, y = 250) and go down (y = 350)
    stroke: 'black',
    strokeWidth: 3,
});
layer.add(clientLine);

// Vertical line below server
var serverLine = new Konva.Line({
    points: [700, 250, 700, 600], // Start at center bottom of serverRect (x = 700, y = 250) and go down (y = 350)
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
var synText = new Konva.Text({
    x: 350,
    y: 300,
    text: 'SYN seq=x',
    fontSize: 20,
    fill: 'black',
    visible: false,
    id: 'syn_text'
});
layer.add(synText);

var synAckText = new Konva.Text({
    x: 350,
    y: 375,
    text: 'SYN-ACK ack=x+1 seq=y',
    fontSize: 20,
    fill: 'black',
    visible: false,
    id: 'synack_text'
});
layer.add(synAckText);

var ackText = new Konva.Text({
    x: 350,
    y: 450,
    text: 'ACK ack=y+1 seq=x+1',
    fontSize: 20,
    fill: 'black',
    visible: false,
    id: 'ack_text'
});
layer.add(ackText);

var dataText = new Konva.Text({
    x: 350,
    y: 525,
    text: 'DATA',
    fontSize: 20,
    fill: 'black',
    visible: false,
    id: 'data_text'
});
layer.add(dataText);

// Draw the arrows (SYN, SYN-ACK, ACK)
var synArrow = drawArrow(200, 300, 700, 375, 'syn_arrow', 'green');
var synAckArrow = drawArrow(700, 375, 200, 450, 'synack_arrow', 'blue');
var ackArrow = drawArrow(200, 450, 700, 525, 'ack_arrow', 'red');
var dataArrow = drawArrow(200, 525, 700, 600, 'data_arrow', 'black');

// Initially hide arrows and add them to the layer
layer.add(synArrow);
layer.add(synAckArrow);
layer.add(ackArrow);
layer.add(dataArrow)

// Draw everything
layer.draw();

// Function to handle the next step
function tcp_handshake_nextstep() {
    if (step === 0) {
        // Show SYN message and arrow
        synArrow.visible(true);
        synText.visible(true);
        layer.draw(); // Redraw to show the changes
        step++;
    } else if (step === 1) {
        // Show SYN-ACK message and arrow
        synAckArrow.visible(true);
        synAckText.visible(true);
        layer.draw(); // Redraw to show the changes
        step++;
    } else if (step === 2) {
        // Show ACK message and arrow
        ackArrow.visible(true);
        ackText.visible(true);
        layer.draw(); // Redraw to show the changes
        step++;
    } else if (step === 3) {
        // Show data message and arrow
        dataArrow.visible(true);
        dataText.visible(true);
        layer.draw(); // Redraw to show the changes
        step++;
    } else {
        alert("TCP 3-Way Handshake Complete! Please refresh the website to see the animation again.");
    }
}
