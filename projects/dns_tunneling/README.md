# Overview

In this assignment, you will write a DNS server program and a DNS client program, the two of which communicate secretly. Your program must run in the provided virtual machine. Submissions that fail to compile or run in the provided virtual machine will not be graded.

## Learning Objectives

- Understanding the DNS protocol.
- Understanding the format of DNS messages.
- Understanding the DNS tunneling technique.

## Background

Imagine you are in a network where all other traffic is blocked and only DNS traffic is allowed. In such a situation, if you still want two computers to communicate, then you have to rely on some special techniques, and in this assignment, the technique we will be using is known as DNS tunneling.

DNS tunneling is a technique that encodes data within DNS queries and responses, allowing two systems to communicate covertly by passing data through DNS traffic. It’s commonly used in scenarios where direct communication channels are restricted, such as within a firewall or a captive network. DNS tunneling can also be used maliciously to exfiltrate data or establish a command-and-control (C2) channel to control compromised machines.

## Specification

You are required to use C programming language to implement your client and server. You are allowed (and maybe encouraged) to use chatgpt.

To simplify your task, the two programs (DNS client and DNS server) only need to exchange 4 messages: 

1. The client first sends a message to server: this message is "hi", 
2. The server responds with another message "hi client",
3. The client then sends a message to server: this message is "hello", 
4. The server responds with another message "hello client".

However, given that the goal here is to communicate covertly, these 4 messages should not be directly visible to whoever is monitoring the network using tools such as wireshark. Instead, 

1. Your client should use the [Base64 encoding](base64.md) to encode the message in the DNS query. For example, in Base64 encoding, *hello* is encoded as *aGVsbG8A* (why? read [here](hello.md)), therefore, in order to send the message "hello", your client can send a query asking for the IP address of aGVsbG8A.google.com.

2. Once your server receives the DNS query, it parses the query so as to retrieve the part *aGVsbG8A*, and then it decodes *aGVsbG8A*, so as to get *hello*. After that, the server encodes the response message into its DNS response. Note that the server side encoding can be much easier and it does not use Base64 encoding, instead, it simply encodes the response message into the IPv4 address. For example, the characters *hell* can be represented as 104.101.108.108, because the ascii code of *h* is 104, the ascii code of *e* is 101, and the ascii code of *l* is 108.

3. Once the client receives the DNS response, it parses the response and decodes the IP address, so as to get the message, after that, the client should print the received message.

## Expected Output

When running the program, you are expected to get the following results:

### Server

```console
$ sudo ./server
DNS server listening on port 53...
Encoded Query Name: aGkA
Decoded Data: hi
DNS response sent with message "hey!" encoded in A records.
Encoded Query Name: aGVsbG8A
Decoded Data: hello
DNS response sent with message "hello client" encoded in A records.
```

### Client

```console
$ ./client
Message to send: hi
Encoded data to send: aGkA
Decoded message from server: hey!
Message to send: hello
Encoded data to send: aGVsbG8A
Decoded message from server: hello client
```

## Wireshark Capture

When running the two programs, we should see 4 DNS messages in wireshark, and it is your responsibility to make sure these DNS messages have the correct format. In other words, wireshark should not report any malformed DNS packets. Given that our goal here is the communicate covertly, any malformed DNS packets in wireshark would make the communication suspicious and thus should be avoided.

## Submission

Due: 23:59pm, Friday, Nov 22nd, 2024.

Your submission should include your source code and a README file.

## Grading Rubric

10 pts

 - No compilation warnings or errors. (1 pts)
 - Client side produces expected output. (3 pts)
 - Server side produces expected output. (3 pts)
 - No suspicious traffic observed in wireshark. (2 pts)
 - A completed README file provided. (1 pts)

