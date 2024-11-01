# Routing Tables Sample Questions:

When running "netstat -r", the following output is printed:

```plaintext
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         192.168.1.1     0.0.0.0         UG    100    0        0 eth0
192.168.1.0     0.0.0.0         255.255.255.0   U     0      0        0 eth0
10.0.0.0        192.168.1.2     255.255.255.0   UG    0      0        0 eth0
172.16.0.0      0.0.0.0         255.240.0.0     U     0      0        0 eth1
192.168.2.0     192.168.1.1     255.255.255.0   UG    0      0        0 tun0
172.31.0.0      10.0.0.1        255.255.255.0   UG    0      0        0 tun0
0.0.0.0         172.31.0.1      0.0.0.0         UG    0      0        0 tun0
```

## Question 1
**What is the default gateway for the system?**  
A) 10.0.0.0  
B) 172.16.0.0  
C) 192.168.1.1  
D) 0.0.0.0  

---

## Question 2
**Which interface is used to reach the 10.0.0.0 network?**  
A) eth0  
B) eth1  
C) tun0  
D) wlan0  

---

## Question 3
**Which network can be accessed via the VPN interface (tun0)?**  
A) 192.168.1.0  
B) 10.0.0.0  
C) 172.31.0.0  
D) 172.16.0.0  

---

## Question 4
**What action will be taken for packets destined for 0.0.0.0 through the tun0 interface?**  
A) They are routed to the default gateway.  
B) They are logged.  
C) They are dropped.  
D) They are forwarded to 172.31.0.1.  

---

## Question 5
**What is the subnet mask for the network 192.168.2.0?**  
A) 255.255.0.0  
B) 255.255.255.0  
C) 255.240.0.0  
D) 255.255.255.255  

---

## Question 6
**If a packet is sent to the address 192.168.2.50, which entry in the routing table will be used?**  
A) 0.0.0.0/0 via 192.168.1.1  
B) 192.168.2.0/24 via 192.168.1.1  
C) 10.0.0.0/24 via 192.168.1.2  
D) 172.31.0.0/24 via 10.0.0.1  

---

## Question 7
**What does the entry for the 172.31.0.0 network via tun0 indicate?**  
A) The route is directly connected.  
B) It is a static route through the VPN.  
C) It is a dynamic route.  
D) It is a default route.  

---

## Question 8
**What type of routing does the entry for the 10.0.0.0 network indicate?**  
A) Directly connected  
B) Static route  
C) Dynamic route  
D) Default route  

---

## Question 9
**What happens if the gateway for the 192.168.2.0 network (192.168.1.1) becomes unreachable?**  
A) All traffic will be dropped.  
B) Traffic can still flow through the tun0 interface.  
C) No packets can be sent to the 192.168.2.0 network.  
D) The routing table will automatically update.  

---

## Question 10
**What is the purpose of the "UG" flag in the routing table entries?**  
A) It indicates the route is up and usable.  
B) It indicates the route is unreachable.  
C) It indicates the route is a gateway.  
D) It indicates the route is static.  

