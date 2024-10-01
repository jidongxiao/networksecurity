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
    x: 330,
    y: 180,
    text: 'DHCP Client\nUDP Port 67',
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
    x: 830,
    y: 180,
    text: 'DHCP Server\nUDP Port 68',
    fontSize: 24,
    fill: 'black'
});
layer.add(serverText);

// Vertical line below client
var clientLine = new Konva.Line({
    points: [400, 250, 400, 600], // Start at center bottom of clientRect (x = 200, y = 250) and go down (y = 350)
    stroke: 'black',
    strokeWidth: 3,
});
layer.add(clientLine);

// Vertical line below server
var serverLine = new Konva.Line({
    points: [900, 250, 900, 600], // Start at center bottom of serverRect (x = 700, y = 250) and go down (y = 350)
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
var dhcpRequestText = new Konva.Text({
    x: 550,
    y: 300,
    text: 'DHCP Request',
    fontSize: 24,
    fill: 'black',
    visible: false,
    id: 'dhcp_request_text'
});
layer.add(dhcpRequestText);

var dhcpRequestClientText = new Konva.Text({
    x: 110,
    y: 300,
    text: '"I need an IP address."\nThe client,\nbefore its lease expires,\nsends a DHCP Request to\nthe server, asking to\nrenew or extend the\ncurrent IP lease',
    fontSize: 24,
    fill: 'black',
    visible: false,
    id: 'dhcp_request_client_text'
});
layer.add(dhcpRequestClientText);

var dhcpAckText = new Konva.Text({
    x: 550,
    y: 375,
    text: 'DHCP Ack',
    fontSize: 24,
    fill: 'black',
    visible: false,
    id: 'dhcp_ack_text'
});
layer.add(dhcpAckText);

var dhcpAckServerText = new Konva.Text({
    x: 910,
    y: 375,
    text: '"You can continue using the IP address."\nThe DHCP Server responds with an acknowledgment,\n extending the client’s lease\nand allowing it to continue\nusing the same IP address\n for a longer period.',
    fontSize: 24,
    fill: 'black',
    visible: false,
    id: 'dhcp_ack_server_text'
});
layer.add(dhcpAckServerText);

// Draw the arrows (SYN, SYN-ACK, ACK)
var dhcpRequestArrow = drawArrow(400, 300, 900, 375, 'dhcp_request_arrow', 'green');
var dhcpAckArrow = drawArrow(900, 375, 400, 450, 'dhcp_ack_arrow', 'blue');

// Initially hide arrows and add them to the layer
layer.add(dhcpRequestArrow);
layer.add(dhcpAckArrow)

// Draw everything
layer.draw();

// Function to handle the next step
function dhcp_exchange_nextstep() {
    if (step === 0) {
        // Show ACK message and arrow
        dhcpRequestArrow.visible(true);
        dhcpRequestText.visible(true);
        dhcpRequestClientText.visible(true);
        layer.draw(); // Redraw to show the changes
        step++;
    } else if (step === 1) {
        // Show data message and arrow
        dhcpAckArrow.visible(true);
        dhcpAckText.visible(true);
        dhcpAckServerText.visible(true);
        layer.draw(); // Redraw to show the changes
        step++;
    } else {
        alert("2-Phase DHCP Exchange Complete! Please refresh the website to see the animation again.");
    }
}
