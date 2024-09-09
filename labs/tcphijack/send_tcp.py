from scapy.all import *

def send_tcp_packet(src_ip, dst_ip, src_port, dst_port, seq_num, ack_num, ttl_value, window_size, payload):
    # Create IP layer with custom TTL
    ip_layer = IP(src=src_ip, dst=dst_ip, ttl=ttl_value)

    # Create TCP layer with custom sequence number, acknowledgment number, window size
    tcp_layer = TCP(sport=src_port, dport=dst_port, flags="PA", seq=seq_num, ack=ack_num, window=window_size)

    # Create the complete packet by combining IP, TCP, and payload
    packet = ip_layer/tcp_layer/payload

    # Send the packet
    send(packet, verbose=0)
    print(f"Sent TCP packet from {src_ip}:{src_port} to {dst_ip}:{dst_port} with SEQ={seq_num}, ACK={ack_num}, TTL={ttl_value}, Window Size={window_size}")

# Example usage
source_ip = "10.0.2.5"
destination_ip = "10.0.2.4"
source_port = 12345
destination_port = 23
sequence_num = 1000
acknowledgment_num = 2000
ttl_value = 64
window_size = 1024
tcp_payload = "This is the TCP data payload"

# Send the packet
send_tcp_packet(source_ip, destination_ip, source_port, destination_port, sequence_num, acknowledgment_num, ttl_value, window_size, tcp_payload)

