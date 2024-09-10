import socket

def udp_client():
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    
    # Send an initial message to the server to let it know the client's address
    server_address = ('10.0.2.5', 9090)
    message = "Hello, server".encode('utf-8')
    client_socket.sendto(message, server_address)

    # Now receive messages from the server
    while True:
        data, addr = client_socket.recvfrom(1024)
        print(f"Received message from {addr}: {data.decode('utf-8')}")
        if not data:
            break

    client_socket.close()

udp_client()

