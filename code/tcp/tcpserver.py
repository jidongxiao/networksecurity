import socket
import time

def tcp_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(('10.0.2.5', 9090))
    server_socket.listen(1)
    print("Server listening on port 9090...")

    conn, addr = server_socket.accept()
    print(f"Connection from {addr}")

    # Send 1000000 packets in order
    for i in range(1, 1000001):
        packet_data = f"Packet {i}\n".encode('utf-8')  # Encode to bytes
        conn.sendall(packet_data)
        # time.sleep(0.1)  # Short delay to avoid overwhelming the receiver

    conn.close()

tcp_server()

