## DNS Pharming Attack

### Requirement

In this exercise, the attacker modifies the victim's local hosts file. This file maps domain names to IP addresses, and by altering it, the attacker can redirect the user’s browser to a fake website.

### Setup

The provided VM, just one VM.

### Steps

1. Add the following line to the file /etc/hosts

128.113.126.70  www.chase.com

2. Open firefox and type www.chase.com, it should take you to ns.cs.rpi.edu.
