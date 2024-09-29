# to observe packets loss, on the client side, run this:
# $ sudo iptables -A INPUT -p udp -m statistic --mode random --probability 0.5 -j DROP
#

import socket

def udp_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server_socket.bind(('10.0.2.5', 9090))  # Server binds to its own IP and port
    print("Server bound to 10.0.2.5:9090 and waiting for a client...")

    client_address = None

    # First, receive a packet from the client to get the client's address
    data, client_address = server_socket.recvfrom(1024)
    print(f"Received initial message from client {client_address}: {data.decode('utf-8')}")

    # Now start sending packets to the client
    for i in range(1000000):
        message = f"Packet {i+1}".encode('utf-8')
        server_socket.sendto(message, client_address)

    server_socket.close()

udp_server()

