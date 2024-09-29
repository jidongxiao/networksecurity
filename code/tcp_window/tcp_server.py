import socket

def tcp_server():
    # Create a socket object (IPv4 and TCP)
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    # Bind the socket to the address and port
    try:
        server_socket.bind(('10.0.2.5', 9090))  # Bind to all interfaces on port 9090
        print("Socket bound to 10.0.2.5:9090")
    except socket.error as e:
        print(f"Error binding socket: {e}")
        return
    
    # Start listening for incoming connections (1 is the max number of queued connections)
    server_socket.listen(1)
    print("Server listening on port 9090...")

    # Accept a client connection
    conn, addr = server_socket.accept()
    print(f"Connection established from {addr}")

    while True:
        try:
            # Receive data from the client
            data = conn.recv(1024)
            if not data:
                # If no data is received, break the loop and close the connection
                print("Connection closed by client.")
                break

            # Decode and print the received message
            print(f"Received message: {data.decode('utf-8')}")
        except socket.error as e:
            print(f"Error receiving data: {e}")
            break
    
    # Close the connection and the server socket
    conn.close()
    server_socket.close()

if __name__ == "__main__":
    tcp_server()

