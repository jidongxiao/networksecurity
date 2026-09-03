#!/usr/bin/python
from scapy.all import *

# Get the destination host from the command line.
# Example:
#   sudo python3 traceroute.py 8.8.8.8
host = sys.argv[1]

print("Traceroute " + host)

# Start with a TTL of 1.
# Each router that forwards an IP packet decreases its TTL by 1.
# Therefore, a TTL of 1 causes the packet to expire at the first router.
ttl = 1

while 1:

        # Create an IP layer.
        IPLayer = IP()

        # Set the destination IP address.
        IPLayer.dst = host

        # Set the packet's Time To Live (TTL).
        # We increase this value after each successful probe so that
        # the packet can reach one additional router each time.
        IPLayer.ttl = ttl

        # Create an ICMP packet.
        # By default, this is an ICMP Echo Request (ping) packet.
        ICMPpkt = ICMP()

        # Combine the IP and ICMP layers:
        #
        #       IP header
        #           +
        #       ICMP header
        #
        # The "/" operator in Scapy stacks protocol layers.
        pkt = IPLayer / ICMPpkt

        # Send the packet and wait for the first response.
        #
        # sr1() means:
        #   sr = send and receive
        #   1  = return the first response
        #
        # If no response is received, sr1() returns None.
        #
        # verbose=0 prevents Scapy from printing its normal
        # packet-sending status messages.
        replypkt = sr1(pkt, verbose=0)

        # If there is no response, stop the traceroute.
        if replypkt is None:
                break

        # ICMP type 0 = Echo Reply.
        #
        # This normally means that the packet reached the
        # destination host and the destination replied.
        elif replypkt[ICMP].type == 0:
                print("%d hops away: " % ttl, replypkt[IP].src)
                print("Done", replypkt[IP].src)
                break

        # Otherwise, we received an ICMP response from an
        # intermediate router.
        #
        # Most commonly, this is ICMP Type 11:
        # "Time Exceeded"
        #
        # The source IP address of the ICMP response tells us
        # which router caused the TTL to expire.
        else:
                print("%d hops away: " % ttl, replypkt[IP].src)

                # Increase the TTL by 1 so the next packet can
                # travel through one more router.
                ttl += 1

