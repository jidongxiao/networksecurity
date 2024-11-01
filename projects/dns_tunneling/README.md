# Overview

In this assignment, you will write a DNS server program and a DNS client program, the two of which communicate secretly. Your program must run in the provided virtual machine. Submissions that fail to compile or run in the provided virtual machine will not be graded.

## Learning Objectives

- Understanding the DNS protocol.
- Understanding DNS message format.
- Understanding the DNS tunneling technique.

## Background

Imagine you are in a network where all other traffic is blocked and only DNS traffic is allowed. In such a situation, if you still want two computers to communicate, then you have to rely on some special techniques, and in this assignment, the technique we will be using is known as DNS tunneling.

DNS tunneling is a technique that encodes data within DNS queries and responses, allowing two systems to communicate covertly by passing data through DNS traffic. It’s commonly used in scenarios where direct communication channels are restricted, such as within a firewall or a captive network. DNS tunneling can also be used maliciously to exfiltrate data or establish a command-and-control (C2) channel to control compromised machines.

## Specification

You are required to use C programming language to implement your client and server. You are allowed to use chatgpt.

To simplify your task, the two programs (DNS client and DNS server) only need to exchange two messages: 

1. The client first sends a message to server: this message is "hello", 
2. The server responds with another message "hello client".

However, given that the goal here is to communicate covertly, these two messages should not be directly visible to whoever is monitoring the network using tools such as wireshark.

## Submission

Due: 23:59pm, Friday, Nov 22nd, 2024.

Your submission should include your source code and a README.

## Grading Rubric

To be added later.
