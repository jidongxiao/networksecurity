## SSH Keys Regeneration Demo

Steps:

1. On ssh client, connects to the server via ssh:

$ ssh 10.0.2.5

2. on ssh server, regenerate the keys:

```
$ sudo rm -f /etc/ssh/ssh_host_*
$ sudo ssh-keygen -A
ssh-keygen: generating new host keys: RSA DSA ECDSA ED25519 
$ sudo systemctl restart sshd
$ sudo systemctl status sshd --no-pager
```

3. on ssh client, ssh again to the server, now we get this error:

```
$ ssh 10.0.2.5
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ECDSA key sent by the remote host is
SHA256:+o9wRGtkq+lyFfPYsLaXT8qmxjjnL3n3TEPhrnHGpOw.
Please contact your system administrator.
Add correct host key in /home/seed/.ssh/known_hosts to get rid of this message.
Offending ECDSA key in /home/seed/.ssh/known_hosts:1
  remove with:
  ssh-keygen -f "/home/seed/.ssh/known_hosts" -R "10.0.2.5"
ECDSA host key for 10.0.2.5 has changed and you have requested strict checking.
Host key verification failed.
```
