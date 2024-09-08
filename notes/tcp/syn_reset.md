## TCP Connections and 4-Tuple

Each TCP connection between two computers is uniquely identified by:

Source IP address
Source port number
Destination IP address
Destination port number

For example, if two computers want to communicate, they can have multiple TCP connections alive at the same time as long as at least one part of this 4-tuple is different (e.g., different source or destination ports).

## The Role of SYN Packets

- A SYN packet is used to initiate a new TCP connection. When a SYN packet is received, the system checks if it already has a connection with the same 4-tuple (source IP, source port, destination IP, destination port).
- If the 4-tuple is unique (i.e., there's no existing connection with that combination), a new TCP connection is established without affecting any other active connections.
- However, if the SYN packet matches the 4-tuple of an existing connection, it becomes problematic.

## Why Receiving a SYN on an Existing Connection Resets It

- If the SYN packet’s 4-tuple matches an existing connection, and its sequence number is within the receive window, the system interprets this as an error. Here's why:

- Connection State: In TCP, once a connection is established, it follows a certain state (e.g., SYN → SYN-ACK → ACK → Data exchange). Sending another SYN with the same 4-tuple in the middle of an established connection doesn’t make sense because the connection is already established. TCP interprets this as a sign that something is wrong.

- Conflicting States: The existing connection might be in the middle of transferring data or waiting for acknowledgments. A SYN packet indicates the start of a new connection and conflicts with the state of the ongoing connection.

- Reset to Prevent Errors: To avoid miscommunication or data corruption, TCP handles this situation by sending a RST (reset) packet to close the existing connection, assuming that the connection state has become inconsistent or corrupted.

## Example:

- If Computer A is communicating with Computer B on port 5000 using an established TCP connection (identified by the 4-tuple: A's IP, A's port, B's IP, B's port 5000), and suddenly A sends another SYN packet with the same source/destination IP and port, and its sequence number is within the receive window, Computer B will assume there is an error.
- Since a SYN means "let’s start a new connection," but the connection already exists, Computer B resets the connection (sends a RST packet) to clear up any potential confusion or conflict in the TCP state machine.
- You can establish a new TCP connection as long as the 4-tuple (source/destination IP and port) is unique. The system does not reset other connections, only the one that matches the 4-tuple in question.
- If you want multiple connections between two computers, simply use different port numbers for each connection (or different IP addresses if applicable). Only when the SYN matches an existing 4-tuple does it cause a reset.

## Summary

- You can have multiple TCP connections between two computers as long as they differ in the 4-tuple (IP addresses and port numbers).
- A SYN packet resets an existing connection only when it shares the exact same 4-tuple as an existing connection, which creates a conflict.
- The reset occurs to prevent confusion or corruption within the already established connection’s state.
