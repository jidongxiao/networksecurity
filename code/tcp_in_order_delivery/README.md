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
telnet server_ip 9090
```
