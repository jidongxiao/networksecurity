# DNS Tunneling

## Overview

In this assignment, you will write a DNS server program and a DNS client program, the two of which communicate secretly. Your program must run in the provided virtual machine. Submissions that fail to compile or run in the provided virtual machine will not be graded.

## Learning Objectives

- Understanding the DNS protocol.
- Understanding the format of DNS messages.
- Understanding the DNS tunneling technique.

## Background

Imagine you are in a network where all other traffic is blocked and only DNS traffic is allowed. In such a situation, if you still want two computers to communicate, then you have to rely on some special techniques, and in this assignment, the technique we will be using is known as DNS tunneling.

DNS tunneling is a technique that encodes data within DNS queries and responses, allowing two systems to communicate covertly by passing data through DNS traffic. It’s commonly used in scenarios where direct communication channels are restricted, such as within a firewall or a captive network. DNS tunneling can also be used maliciously to exfiltrate data or establish a command-and-control (C2) channel to control compromised machines.

## Specification

You are required to use C programming language to implement your client and server. You are allowed (and maybe encouraged) to use chatgpt. When developing and testing your programs, you are highly recommended to use just one VM only, and when running both the client and the server on the same VM, you can let your server use the IP address *127.0.0.1*.

To simplify your task, the two programs (the DNS client and the DNS server) only need to exchange 4 messages: 

1. The client first sends a message to server: this message is "hi", 
2. The server responds with another message "hey!",
3. The client then sends a message to server: this message is "hello", 
4. The server responds with another message "hello client".

However, given that the goal here is to communicate covertly, these 4 messages should not be directly visible to whoever is monitoring the network using tools such as wireshark. Instead, 

1. Your client should use the [Base64 encoding](base64.md) to encode the message in the DNS query. For example, in Base64 encoding, *hello* is encoded as *aGVsbG8=*, therefore, in order to send the message "hello", your client can send a query asking for the IP address of aGVsbG8=.apple.com.

2. Once your server receives the DNS query, it parses the query so as to retrieve the part *aGVsbG8=*, and then it decodes *aGVsbG8=*, so as to get *hello*. After that, the server encodes the response message into its DNS response. Note that the server side encoding can be much easier and it does not use Base64 encoding, instead, it simply encodes the response message into the IPv4 address. For example, the characters *hell* can be represented as 104.101.108.108, because the ascii code of *h* is 104, the ascii code of *e* is 101, and the ascii code of *l* is 108.

3. Once the client receives the DNS response, it parses the response and decodes the IP address, so as to get the message, after that, the client should print the received message.

## Expected Output

When running the programs, you are expected to get the following results:

### Server

```console
$ sudo ./server
DNS server listening on port 53...
Encoded Query Name: aGk=
Decoded Data: hi
DNS response sent with message "hey!" encoded in A records.
Encoded Query Name: aGVsbG8=
Decoded Data: hello
DNS response sent with message "hello client" encoded in A records.
```

### Client

```console
$ ./client
Message to send: hi
Encoded data to send: aGk=
Decoded message from server: hey!
Message to send: hello
Encoded data to send: aGVsbG8=
Decoded message from server: hello client
```

## Wireshark Capture

When running the two programs, we should see 4 DNS messages in wireshark, and it is your responsibility to make sure these DNS messages have the correct format. In other words, wireshark should not report any malformed DNS packets. Given that our goal here is to communicate covertly, any malformed DNS packets in wireshark would make the communication suspicious and thus should be avoided.

## Dig Test

You should also test your server program using the *dig* command (run twice in a row) like this:

```console
$ dig @localhost aGk=.apple.com

; <<>> DiG 9.16.1-Ubuntu <<>> @localhost aGk=.apple.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 59805
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;aGk=.apple.com.		IN	A

;; ANSWER SECTION:
aGk=.apple.com.	60	IN	A	104.101.121.33

;; Query time: 0 msec
;; SERVER: 127.0.0.1#53(127.0.0.1)
;; WHEN: Fri Nov 01 13:12:04 EDT 2024
;; MSG SIZE  rcvd: 49

$ dig @localhost aGVsbG8=.apple.com

; <<>> DiG 9.16.1-Ubuntu <<>> @localhost aGVsbG8=.apple.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 48110
;; flags: qr rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;aGVsbG8=.apple.com.		IN	A

;; ANSWER SECTION:
aGVsbG8=.apple.com.	60	IN	A	104.101.108.108
aGVsbG8=.apple.com.	60	IN	A	111.32.99.108
aGVsbG8=.apple.com.	60	IN	A	105.101.110.116

;; Query time: 16 msec
;; SERVER: 127.0.0.1#53(127.0.0.1)
;; WHEN: Fri Nov 01 13:14:01 EDT 2024
;; MSG SIZE  rcvd: 85
```

These 2 dig commands should not report any error or malformed DNS responses.

### Explanation of the Second `dig` Command

The second command queries the DNS server using `aGVsbG8=.apple.com`. Notice that the query name contains `aGVsbG8=`, which is the Base64 encoding of the word `hello`.

The server responds with three DNS A records:

```text
aGVsbG8=.apple.com.  60  IN  A  104.101.108.108
aGVsbG8=.apple.com.  60  IN  A  111.32.99.108
aGVsbG8=.apple.com.  60  IN  A  105.101.110.116
```

Decode each A record:

| DNS A record | ASCII decimal values | Decoded text |
|---|---|---|
| `104.101.108.108` | 104, 101, 108, 108 | `hell` |
| `111.32.99.108` | 111, 32, 99, 108 | `o cl` |
| `105.101.110.116` | 105, 101, 110, 116 | `ient` |

For example, ASCII decimal value 104 represents `h`, 101 represents `e`, and 32 represents a space.

Combining the decoded text from all three A records, in the order returned, gives:

**`hello client`**

This demonstrates how a DNS server can use A records to carry arbitrary text data rather than simply returning IP addresses for network communication.

## Group Project

This is a group project. You may work individually or form a group of up to 4 students. Each group must submit one project.

## Submission

Due: 11:59pm, Friday, December 4th, 2026.

Submit the following files via Submitty:

- Source code: All source code files required to compile and run your client and server programs.

- README file: The README must include:

  - Instructions for compiling and running your programs.

  - The test results from both dig commands, including their complete outputs.

- Wireshark screenshot: A screenshot showing the captured DNS traffic generated by your client and server. The screenshot must clearly show all 4 DNS messages: 2 queries and 2 responses.

## Grading Rubric

12 pts

- No compilation warnings or errors. (1 pt)
- Client side produces expected output. (3 pts)
- Server side produces expected output, including the output of both `dig` commands. (3 pts)
- Wireshark capture shows no suspicious traffic. (2 pts)
  - Exactly 4 DNS messages must be observed: 2 queries and 2 responses.
- A completed README file provided. (3 pts)
  - The README contains instructions to compile and run the programs. (1 pt)
  - The README contains test results from both `dig` commands. (2 pts)
- Late submission penalty: within the 3-day late window. (-1 pt)
