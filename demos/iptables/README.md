## iptables Reject Demo

When configure the REJECT, we can specify what reject message we want to send:

1. If iptables rejects with the TCP reset option, the client sees a TCP RST.

```console
# force TCP RST replies for attempts to connect to port 22
sudo iptables -I INPUT -p tcp --dport 22 -j REJECT --reject-with tcp-reset
```

2. If iptables rejects with an ICMP rejection (e.g. icmp-port-unreachable), the client sees an ICMP Destination Unreachable (Type 3, Code 3 — “port unreachable”).

```console
sudo iptables -I INPUT -p tcp --dport 22 -j REJECT --reject-with icmp-port-unreachable
```

3. If we DROP the packet instead of REJECT, no reply is sent at all.

```console
sudo iptables -I INPUT -p tcp --dport 22 -j DROP
```
