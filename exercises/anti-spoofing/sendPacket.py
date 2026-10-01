from scapy.all import *

send(IP(src="10.0.2.6", dst="10.0.2.4")/ICMP())
