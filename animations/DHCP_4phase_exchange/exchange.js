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
    x: 130,
    y: 180,
    text: 'DHCP Client\nUDP Port 67',
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
    x: 630,
    y: 180,
    text: 'DHCP Server\nUDP Port 68',
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
var dhcpDiscoverText = new Konva.Text({
    x: 350,
    y: 300,
    text: 'DHCP Discover',
    fontSize: 20,
    fill: 'black',
    visible: false,
    id: 'dhcp_discover_text'
});
layer.add(dhcpDiscoverText);

var dhcpDiscoverClientText = new Konva.Text({
    x: 10,
    y: 300,
    text: '"I need an IP address."\nDHCP Client broadcasts\na request to find available\nDHCP Servers in the network',
    fontSize: 12,
    fill: 'black',
    visible: false,
    id: 'dhcp_discover_client_text'
});
layer.add(dhcpDiscoverClientText);

var dhcpOfferText = new Konva.Text({
    x: 350,
    y: 375,
    text: 'DHCP Offer',
    fontSize: 20,
    fill: 'black',
    visible: false,
    id: 'dhcp_offer_text'
});
layer.add(dhcpOfferText);

var dhcpOfferServerText = new Konva.Text({
    x: 710,
    y: 375,
    text: '"Here’s an available IP address."\n(IP address and other network configuration options,\nsuch as subnet mask, gateway, etc.)',
    fontSize: 12,
    fill: 'black',
    visible: false,
    id: 'dhcp_offer_server_text'
});
layer.add(dhcpOfferServerText);

var dhcpRequestText = new Konva.Text({
    x: 350,
    y: 450,
    text: 'DHCP Request',
    fontSize: 20,
    fill: 'black',
    visible: false,
    id: 'dhcp_request_text'
});
layer.add(dhcpRequestText);

var dhcpRequestClientText = new Konva.Text({
    x: 10,
    y: 450,
    text: '"I’d like to use that IP address."\nThe client responds by\nformally requesting to\nuse the IP address and\nnetwork configuration\nthat was offered.',
    fontSize: 12,
    fill: 'black',
    visible: false,
    id: 'dhcp_request_client_text'
});
layer.add(dhcpRequestClientText);

var dhcpAckText = new Konva.Text({
    x: 350,
    y: 525,
    text: 'DHCP Ack',
    fontSize: 20,
    fill: 'black',
    visible: false,
    id: 'dhcp_ack_text'
});
layer.add(dhcpAckText);

var dhcpAckServerText = new Konva.Text({
    x: 710,
    y: 525,
    text: '"You can use the IP address now."\nThe DHCP Server acknowledges the client’s\nrequest and finalizes the lease, allowing the client\nto officially use the assigned IP address\nand network settings.',
    fontSize: 12,
    fill: 'black',
    visible: false,
    id: 'dhcp_ack_server_text'
});
layer.add(dhcpAckServerText);

// Draw the arrows (SYN, SYN-ACK, ACK)
var dhcpDiscoverArrow = drawArrow(200, 300, 700, 375, 'dhcp_discover_arrow', 'green');
var dhcpOfferArrow = drawArrow(700, 375, 200, 450, 'dhcp_offer_arrow', 'blue');
var dhcpRequestArrow = drawArrow(200, 450, 700, 525, 'dhcp_request_arrow', 'red');
var dhcpAckArrow = drawArrow(700, 525, 200, 600, 'dhcp_ack_arrow', 'black');

// Initially hide arrows and add them to the layer
layer.add(dhcpDiscoverArrow);
layer.add(dhcpOfferArrow);
layer.add(dhcpRequestArrow);
layer.add(dhcpAckArrow)

// Draw everything
layer.draw();

// Function to handle the next step
function dhcp_exchange_nextstep() {
    if (step === 0) {
        // Show SYN message and arrow
        dhcpDiscoverArrow.visible(true);
        dhcpDiscoverText.visible(true);
        dhcpDiscoverClientText.visible(true);
        layer.draw(); // Redraw to show the changes
        step++;
    } else if (step === 1) {
        // Show SYN-ACK message and arrow
        dhcpOfferArrow.visible(true);
        dhcpOfferText.visible(true);
        dhcpOfferServerText.visible(true);
        layer.draw(); // Redraw to show the changes
        step++;
    } else if (step === 2) {
        // Show ACK message and arrow
        dhcpRequestArrow.visible(true);
        dhcpRequestText.visible(true);
        dhcpRequestClientText.visible(true);
        layer.draw(); // Redraw to show the changes
        step++;
    } else if (step === 3) {
        // Show data message and arrow
        dhcpAckArrow.visible(true);
        dhcpAckText.visible(true);
        dhcpAckServerText.visible(true);
        layer.draw(); // Redraw to show the changes
        step++;
    } else {
        alert("4-Phase DHCP Exchange Complete! Please refresh the website to see the animation again.");
    }
}
