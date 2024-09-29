## Related Commands

When ICMP redirect messages are accepted by a machine, the redirect information will be stored in the machine's routing cache, and the routing cache can be viewed like this:

```console
$ ip route show cache    
142.250.176.214 via 10.0.2.6 dev enp0s3
    cache <redirected> expires 289sec
91.189.91.48 via 10.0.2.6 dev enp0s3
    cache <redirected> expires 286sec
142.250.72.106 via 10.0.2.6 dev enp0s3
    cache <redirected> expires 290sec
142.251.40.174 via 10.0.2.6 dev enp0s3
    cache <redirected> expires 289sec
173.194.185.201 via 10.0.2.6 dev enp0s3
    cache <redirected> expires 288sec
142.250.65.174 via 10.0.2.6 dev enp0s3
    cache <redirected> expires 289sec
```

You can clean the routing cache via this command:

```console
$ sudo ip route flush cache
```

Some other related flags. Some documents say that these flags on the victim machine must be set to 0, otherwise ICMP redirect packets won't be accepted.

```console
$ sudo sysctl -a | grep secure_redirect
net.ipv4.conf.all.secure_redirects = 1
net.ipv4.conf.default.secure_redirects = 1
net.ipv4.conf.docker0.secure_redirects = 1
net.ipv4.conf.enp0s3.secure_redirects = 1
net.ipv4.conf.lo.secure_redirects = 1
```

Some documents say that these flags on the victim machine must also be set to 0, otherwise ICMP redirect packets won't be accepted.

```console
$ sudo sysctl -a | grep -v arp_filter | grep rp_filter
net.ipv4.conf.all.rp_filter = 2
net.ipv4.conf.default.rp_filter = 2
net.ipv4.conf.docker0.rp_filter = 2
net.ipv4.conf.enp0s3.rp_filter = 2
net.ipv4.conf.lo.rp_filter = 0
```
