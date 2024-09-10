TCP in-order Delivery

These scripts show that even in the cases of packet losses, TCP still guarantees in-order delivery.

## Run the server like this:

```console
$ python3 tcpserver.py
```

## Run the client like this:

```console
$ python3 tcpclient.py
```

## Other notes

Can also run this command on the client side to force packet loss (and should see packet loss and re-transmit in wireshark)

```console
$ sudo iptables -A INPUT -p tcp -m statistic --mode random --probability 0.5 -j DROP
```

**Note**: first, try run the above two scripts without setting this iptables rule, and should see all packets get received very fast; next, set up this iptables rule and re-run the two scripts, this time, we should see the packets received in a slow fashion - because now some packets are dropped and need to resend, and TCP guarantees in-order delivery.

To clear iptables rules:

```console
$ sudo iptables -F
```

To view iptables rules:

```console
$ sudo iptables -L
```

Also, the client does not have to run a script to receive packet, it can just run:

```console
$ telnet server_ip 9090
```

## Wireshark Notes

In wireshark, we can apply these filters to observe out of order packets and re-transmission packets.

```console
tcp.analysis.out_of_order
tcp.analysis.retransmission
```

TCP guarantees in-order delivery of data to the receiving application, but during transmission, packets can arrive out of order at the receiver's network stack. While we see out-of-order packets in Wireshark, the TCP stack at the receiver reorders the packets before delivering the data to the application layer. TCP uses sequence numbers to determine the correct order and waits for missing segments. Only when all the data is in order does it pass it up to the application.

## Other Related Wireshark Filters

```console
tcp.analysis.duplicate_ack
tcp.analysis.fast_retransmission
```

### Duplicate ACK

A duplicate ACK is an indication that the receiver has received some out-of-order packets but is still missing a segment. The receiver acknowledges the last in-sequence byte it received by sending the same ACK number repeatedly in the hope that the missing packet will be retransmitted.

### Fast Retransmission

TCP uses duplicate ACKs as part of its fast retransmission mechanism. When the sender receives three duplicate ACKs, it interprets that as an indication that a packet has been lost and retransmits the missing packet without waiting for the retransmission timeout.
