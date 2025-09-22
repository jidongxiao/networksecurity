## DHCP Starvation Attack Demo

Steps:

1. Attacker: compile the attacking program. This program basically generates a lot of fake/random MAC addresses and sends out DHCP DISCOVER requests using these fake/random MAC addresses.

```console
$ gcc -o dhcp_starve dhcp_starve.c -lpcap
```

**Note**: before compilation, change enp0s3 to the attacker's NIC name.

2. Attacker: launch attack:

```console
$ sudo ./dhcp_starve
```

3. Victim client: boot the VM and see if it can still get an IP address
