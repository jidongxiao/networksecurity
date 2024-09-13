# tcp_sequence_attack.py
from scapy.all import *
import time

# Server details
server_ip = "127.0.0.1"  # Use the IP of the server
server_port = 8080

# TCP Sequence number settings
initial_seq_num = 1000
outside_window_seq_num = 5000  # Example of a sequence number outside the window

# Establish a connection to the server first
syn = IP(dst=server_ip)/TCP(dport=server_port, flags='S', seq=initial_seq_num)
syn_ack = sr1(syn)  # Send SYN and receive SYN-ACK

# Extract server's acknowledgment number and sequence number
server_seq = syn_ack.seq
client_ack = syn_ack.ack

# Complete the 3-way handshake
ack = IP(dst=server_ip)/TCP(dport=server_port, flags='A', seq=client_ack, ack=server_seq + 1)
send(ack)

# Send a packet within the window
print("Sending packet with in-window sequence number...")
data_packet_in_window = IP(dst=server_ip)/TCP(dport=server_port, flags='PA', seq=client_ack, ack=server_seq + 1)/"Hello"
send(data_packet_in_window)

time.sleep(2)

# Send a packet outside the window
print("Sending packet with out-of-window sequence number...")
data_packet_out_window = IP(dst=server_ip)/TCP(dport=server_port, flags='PA', seq=outside_window_seq_num, ack=server_seq + 1)/"Out of window"
send(data_packet_out_window)

# Close connection
fin = IP(dst=server_ip)/TCP(dport=server_port, flags='FA', seq=client_ack + 1, ack=server_seq + 1)
send(fin)

