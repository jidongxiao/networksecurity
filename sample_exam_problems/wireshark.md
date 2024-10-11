# Wireshark Sample Questions:

## Capture 1:
Given following wireshark capture:

```console
1   0.000000 192.168.1.5 -> 192.168.1.1  ICMP  Echo (ping) request  id=0x0001, seq=1
2   0.001000 192.168.1.1 -> 192.168.1.5  ICMP  Echo (ping) reply    id=0x0001, seq=1
3   0.002500 192.168.1.5 -> 192.168.1.1  TCP   51586 → 80 [SYN]  Seq=0 Win=65535 Len=0 MSS=1460
4   0.003000 192.168.1.1 -> 192.168.1.5  TCP   80 → 51586 [SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0
5   0.003500 192.168.1.5 -> 192.168.1.1  TCP   51586 → 80 [ACK]  Seq=1 Ack=1 Win=65535 Len=0
6   0.004000 192.168.1.5 -> 192.168.1.1  HTTP  GET /index.html HTTP/1.1
7   0.004500 192.168.1.1 -> 192.168.1.5  HTTP  HTTP/1.1 200 OK
```

1. **What is the purpose of the packet shown in the second row?**
   - A) It is a request to retrieve a webpage.
   - B) It is an acknowledgment of a ping request.
   - C) It is a TCP connection establishment.
   - D) It is a response to a file transfer.

2. **In the third row, what does the SYN flag indicate?**
   - A) It indicates the termination of a connection.
   - B) It signals the initiation of a connection.
   - C) It acknowledges the receipt of a packet.
   - D) It indicates an error in the connection.

3. **What can you infer about the communication in row four?**
   - A) The client is requesting a file.
   - B) The server is acknowledging a connection setup.
   - C) The communication is encrypted.
   - D) The packets are from a denial of service attack.

4. **Based on the capture, which device initiated the connection to the web server?**
   - A) 192.168.1.1
   - B) 192.168.1.5
   - C) Both devices
   - D) Neither device

## Capture 2:
Given following wireshark capture:

```console
No.     Time        Source          Destination     Protocol Length Info
1       0.000000    192.168.1.100   192.168.1.1     TCP      74     12345 > 80 [SYN] Seq=0 Win=5840 Len=0 MSS=1460
2       0.000001    192.168.1.100   192.168.1.1     TCP      74     12346 > 80 [SYN] Seq=0 Win=5840 Len=0 MSS=1460
3       0.000002    192.168.1.100   192.168.1.1     TCP      74     12347 > 80 [SYN] Seq=0 Win=5840 Len=0 MSS=1460
4       0.000003    192.168.1.100   192.168.1.1     TCP      74     12348 > 80 [SYN] Seq=0 Win=5840 Len=0 MSS=1460
5       0.000004    192.168.1.100   192.168.1.1     TCP      74     12349 > 80 [SYN] Seq=0 Win=5840 Len=0 MSS=1460
6       0.000005    192.168.1.100   192.168.1.1     TCP      74     12350 > 80 [SYN] Seq=0 Win=5840 Len=0 MSS=1460
7       0.000006    192.168.1.100   192.168.1.1     TCP      74     12351 > 80 [SYN] Seq=0 Win=5840 Len=0 MSS=1460
8       0.000007    192.168.1.100   192.168.1.1     TCP      74     12352 > 80 [SYN] Seq=0 Win=5840 Len=0 MSS=1460
9       0.000008    192.168.1.100   192.168.1.1     TCP      74     12353 > 80 [SYN] Seq=0 Win=5840 Len=0 MSS=1460
10      0.000009    192.168.1.100   192.168.1.1     TCP      74     12354 > 80 [SYN] Seq=0 Win=5840 Len=0 MSS=1460
11      0.000010    192.168.1.100   192.168.1.1     TCP      74     12355 > 80 [SYN] Seq=0 Win=5840 Len=0 MSS=1460
12      0.000011    192.168.1.100   192.168.1.1     TCP      74     12356 > 80 [SYN] Seq=0 Win=5840 Len=0 MSS=1460
13      0.000012    192.168.1.100   192.168.1.1     TCP      74     12357 > 80 [SYN] Seq=0 Win=5840 Len=0 MSS=1460
14      0.000013    192.168.1.100   192.168.1.1     TCP      74     12358 > 80 [SYN] Seq=0 Win=5840 Len=0 MSS=1460
15      0.000014    192.168.1.100   192.168.1.1     TCP      74     12359 > 80 [SYN] Seq=0 Win=5840 Len=0 MSS=1460
...
```

1. **What does the presence of multiple SYN packets from the same source IP address (192.168.1.100) indicate in this capture?**
   - A) Normal connection establishment
   - B) A SYN flooding attack
   - C) An acknowledgment of connections
   - D) A TCP reset attack

2. **In this capture, what is the primary goal of the client?**
   - A) To establish a legitimate TCP connection
   - B) To exhaust the server's resources
   - C) To encrypt the communication
   - D) To redirect traffic

3. **What TCP flag is set in all the packets shown in this capture?**
   - A) ACK
   - B) FIN
   - C) SYN
   - D) RST

4. **If the target server (192.168.1.1) receives these packets, what potential problem could arise?**
   - A) The server might become slow or unresponsive.
   - B) The server will successfully connect with the client.
   - C) The server will ignore the packets.
   - D) The server will automatically blacklist the source IP.

5. **What measures could be taken to mitigate SYN flooding attacks?**
   - A) Implementing SYN cookies
   - B) Increasing the number of open ports
   - C) Disabling TCP connections
   - D) Ignoring all SYN packets

