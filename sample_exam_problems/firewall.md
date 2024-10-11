When running "iptables -L", the following output is printed:

```plaintext
Chain INPUT (policy ACCEPT)
target     prot opt source               destination         
ACCEPT     tcp  --  192.168.1.0/24      0.0.0.0/0           tcp dpt:22
ACCEPT     tcp  --  192.168.1.0/24      0.0.0.0/0           tcp dpt:80
ACCEPT     tcp  --  192.168.1.0/24      0.0.0.0/0           tcp dpt:443
DROP       all  --  10.0.0.5            0.0.0.0/0           
REJECT     tcp  --  0.0.0.0/0           0.0.0.0/0           tcp dpt:23 reject-with tcp-reset
ACCEPT     all  --  0.0.0.0/0           0.0.0.0/0           
LOG        all  --  0.0.0.0/0           0.0.0.0/0           LOG level warning prefix "Dropped Packet: "

Chain FORWARD (policy DROP)
target     prot opt source               destination         
ACCEPT     all  --  192.168.1.0/24      10.0.0.0/8         

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination         
ACCEPT     icmp --  0.0.0.0/0           0.0.0.0/0           
DROP       udp  --  0.0.0.0/0           0.0.0.0/0           udp dpt:53
```

**Note**: Rule Processing Order: In iptables, rules are processed in the order they are defined. This means that once a packet matches a rule, the action specified by that rule is taken, and the subsequent rules are not evaluated.

# Sample Questions Based on iptables Output

## Question 1
**Which services are allowed for incoming traffic from the 192.168.1.0/24 subnet?**  
A) SSH, HTTP, HTTPS  
B) SSH, FTP, SMTP  
C) SSH, Telnet, DNS  
D) SSH, POP3, ICMP  

---

## Question 2
**What action is taken for incoming traffic on TCP port 23 from any source?**  
A) It is accepted.  
B) It is dropped silently.  
C) It is rejected with a TCP reset.  
D) It is logged.  

---

## Question 3
**What does the rule `ACCEPT all -- 0.0.0.0/0 0.0.0.0/0` accomplish in the INPUT chain?**  
A) It blocks all incoming traffic.  
B) It accepts all incoming traffic without restriction.  
C) It only accepts traffic from the local subnet.  
D) It allows only ICMP packets.  

---

## Question 4
**What type of traffic is allowed to be forwarded from 192.168.1.0/24 to 10.0.0.0/8?**  
A) Only TCP traffic  
B) All traffic  
C) Only UDP traffic  
D) Only ICMP traffic  

---

## Question 5
**What is the purpose of the `ACCEPT icmp -- 0.0.0.0/0 0.0.0.0/0` rule in the OUTPUT chain?**  
A) To accept all outgoing traffic  
B) To allow outgoing ICMP packets, such as ping  
C) To block ICMP packets from leaving the server  
D) To log ICMP packets  

---

## Question 6
**What does the rule `DROP udp -- 0.0.0.0/0 0.0.0.0/0 udp dpt:53` do?**  
A) It accepts all UDP traffic.  
B) It drops all outgoing UDP traffic.  
C) It drops all DNS queries sent to port 53.  
D) It allows DNS queries to proceed.  

---

## Question 7
**What is the default policy for the FORWARD chain, and what does it imply?**  
A) ACCEPT - All forwarded traffic is allowed by default.  
B) DROP - All forwarded traffic is denied unless explicitly allowed.  
C) REJECT - All forwarded traffic is rejected explicitly.  
D) LOG - All forwarded traffic is logged only.  

---

## Question 8
**What information does the LOG rule in the INPUT chain provide?**  
A) It logs all accepted packets.  
B) It logs dropped packets with a warning message.  
C) It logs all outgoing packets.  
D) It logs only TCP packets.  

---

## Question 9
**What are the security implications of having a rule that accepts all traffic in the INPUT chain?**  
A) It enhances security by allowing only necessary traffic.  
B) It makes the system vulnerable to attacks from any source.  
C) It has no impact on security.  
D) It improves network performance.  

---

## Question 10
**Which port is being specifically dropped in the OUTPUT chain, and what type of traffic does it usually handle?**  
A) Port 22 - SSH traffic  
B) Port 80 - HTTP traffic  
C) Port 53 - DNS traffic  
D) Port 443 - HTTPS traffic  

