import socket

def tcp_client():
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect(('10.0.2.5', 9090))
    print("Client connected to server")

    while True:
        data = client_socket.recv(1024)
        if not data:
            break
        print(f"Received: {data.decode().strip()}")

    client_socket.close()

tcp_client()


