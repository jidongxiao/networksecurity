## TCP Window Overview

- TCP uses a sliding window mechanism to manage data flow between sender and receiver.
- The window size determines how much data can be sent by the sender before it needs to stop and wait for an acknowledgment (ACK) from the receiver.
- Main purpose: Prevent overwhelming the receiver with more data than it can handle (flow control).

## Components of TCP Window

- ACK Number:
 - Indicates the next expected byte by the receiver.
 - Example: If ACK = 5000, it means all bytes up to 4999 have been received.

- Window Size (rwnd):
 - Advertised by the receiver to indicate how much more data it can accept.
 - Example: If rwnd = 2000, the receiver can accept 2000 more bytes.

## Calculating the TCP Window

In TCP, the expected window is determined based on the sequence number of the last acknowledged byte (the ACK number) and the receive window size (advertised window). These factors are used to decide the range of sequence numbers that a receiver is willing to accept at any given time.

### How to Calculate the Expected Window

#### ACK Number (Acknowledge Number):
This is the sequence number that the receiver expects next. It is essentially the last byte that has been received in sequence, plus one.

#### Receive Window Size (rwnd):
The receiver's TCP stack advertises the window size (in bytes) to the sender. This indicates the amount of buffer space available to receive new data without overrunning the receiver's buffer.

The receive window starts at the ACK number and extends by the receive window size. The range of acceptable sequence numbers lies between the current ACK number and the ACK number + rwnd.

## Expected Window Formula
Let:

ACK = Last acknowledged sequence number.
rwnd = Receiver window size (advertised by the receiver).

The valid window for sequence numbers is:

```console
Valid sequence number range = [ACK, ACK + rwnd - 1]
```

In other words:

Lower bound: The sequence number immediately after the last acknowledged byte (ACK).
Upper bound: The sequence number that represents the last byte within the buffer that can be received, which is ACK + rwnd - 1.

## Example
Suppose the following:

ACK = 5000 (last byte acknowledged is 4999, so the receiver expects byte 5000 next).
rwnd = 2000 bytes.
The valid sequence number window is:

```console
Valid range = [5000, 6999]
```

So, any incoming packet with a sequence number between 5000 and 6999 is considered valid and will be accepted. A packet with a sequence number outside this range will be discarded or ignored.

## Sequence Number and SYN Packets

When a SYN packet is received:

- The sequence number in the SYN packet is compared against this valid window.
- If the SYN packet’s sequence number is within the window and doesn't align with the current state of the connection (i.e., it’s unexpected), it triggers a RST to reset the connection.
- If the sequence number is outside the window, the SYN packet is ignored.

## Checking Sequence Number in Practice
In practice, a TCP receiver keeps track of:

- The last acknowledged sequence number (ACK).
- The receive window size (rwnd).
- By comparing the sequence number of an incoming packet with the current window (ACK to ACK + rwnd - 1), the receiver determines if the packet is valid or should be ignored. This mechanism ensures that only sequence numbers that fit within the current flow of data can be processed.
