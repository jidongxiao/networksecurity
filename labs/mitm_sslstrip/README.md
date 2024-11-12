## Man-in-the-Middle (MITM) Attack Against HTTPS (a.k.a. the SSLstrip attack)

### Background

HTTPS is designed to protect against man-in-the-middle (MitM) attacks by encrypting data transmitted between a client (like a web browser) and a server, making it much more difficult for attackers to intercept or alter the communication. HTTPS, which uses the SSL/TLS protocol, encrypts data before it is sent over the internet. This means that even if an attacker manages to intercept the data, they would only see encrypted content, not readable information like usernames, passwords, or credit card numbers. This encryption is achieved through public and private keys, which are part of a secure key exchange process between the client and server.

Yet, HTTPS is still not a panacea. In this lab we will learn the SSLStrip attack, which is effective against HTTPS. SSLstrip is a type of cyberattack that exploits vulnerabilities in how HTTPS connections are managed to intercept and monitor data meant to be encrypted. Introduced by security researcher Moxie Marlinspike in 2009, SSLstrip specifically targets the transition between HTTP (unencrypted) and HTTPS (encrypted) communication, making it possible for an attacker to downgrade secure connections to unencrypted ones and thus capture sensitive data such as login credentials and personal information.

SSLstrip typically requires the attacker to be in a position to intercept network traffic. This is often achieved through a Man-in-the-Middle attack, where the attacker places themselves between the victim and the legitimate website or server. This can be done using techniques like ARP spoofing or DNS spoofing to redirect the victim’s traffic through the attacker’s machine. But in this lab, to simplify the lab steps, we will just demonstrate that when a victim connects to a coffee shop's wifi, what the coffee shop employee can do. We assume the coffee shop employee has physical access to the store's wireless router. In such a scenario, the wireless router naturally will serve as the gateway machine, and as the gateway machine it naturally can be used to perform man-in-the-middle attack, and SSLstrip works like this:

1. When a user types a website URL without specifying "https://" (e.g., typing example.com), most websites automatically redirect the user from http://example.com to https://example.com for a secure connection. More specifically, the web server responds with an HTTP 301 or 302 redirect response to upgrade the connection to HTTPS (i.e., redirecting from http://example.com to https://example.com)
2. The attacker intercepts and modifies this redirect response, stripping out the upgrade to HTTPS and keeping the connection on HTTP. This way, the client never actually connects to the secure HTTPS version and remains on HTTP. As an example, the following is the python code segment, which simply replaces the string "https" in the HTTP response to the string "http".
```python
   # Ensure that the response is in HTTP format to send back to the client
    if flow.response.status_code == 301 or flow.response.status_code == 302:
        location = flow.response.headers.get("Location")
        if location and location.startswith("https://"):
            # Change "https" to "http" in the redirect location
            flow.response.headers["Location"] = location.replace("https://", "http://", 1)
```
3. Meanwhile, the attacker establishes a secure HTTPS connection with the server on behalf of the client. They keep the connection between the server and attacker encrypted. However, the attacker continues to communicate with the client over HTTP, exposing sensitive information like login credentials in plaintext and allowing the attacker to view and modify the data.
4. As a result, while the attacker connects securely to https://example.com, they relay the page back to the victim over HTTP (unencrypted), thus "stripping" away HTTPS.

**Question**: Will step 2 here lead to an infinite loop? Client visits http://example.com, server forces client to go to https://example.com, attacker changes it to http://example.com, and thus client will go to http://example.com, server forces client to go to https://example.com, attacker once again changes it to http://example.com...this will never come to an end and eventually the browser will display a timeout message. How is this addressed in the script we use for this lab?

### Lab Requirement

In this lab, the attacker will use the SSLstrip technique to intercept a victim's HTTP traffic and capture the victim client's login credentials to the site: [www.usps.com](www.usps.com).

**Note**: This website is chosen for this lab mostly because of its relatively simple web interface. Many other popular websites use fancy technologies and do not support the browser our virtual machines use.

### Setup

2 Linux VMs. VM1 as the victim (web client); VM3 as the attacker. The 2 VMs reside in the same network. The following is the IP addresses for the VMs used in this README.

| VM  |  IP Address  |
|-----|--------------|
| VM1 |  10.0.2.4    |
| VM3 |  10.0.2.6    |

on the victim VM, we specify the attacker's machine as the default gateway - so as to simulate the situation when the victim is connected to a public wifi where the owner can be a malicious actor.

```console
$ sudo ip route add default via 10.0.2.6 // here, change 10.0.2.6 to your attacker's IP
```

This screenshot shows the moment right before executing this command, 

![alt text](lab-mitm-add-route-before-enter.png "before entering")

This screenshot shows the moment right after executing this command, 

![alt text](lab-mitm-add-route-after-enter.png "after entering")

This screenshot shows the effect of this command as shown in the routing table - a default gateway is added.

![alt text](lab-mitm-routing-table.png "the routing table")
Also, on the attacker's machine, changing the firewall setting and enable ip forwarding:

```console
$ sudo iptables -F
$ sudo iptables -P FORWARD ACCEPT
$ sudo sysctl -w net.ipv4.ip_forward=1
$ sudo iptables -t nat -A PREROUTING -p tcp --destination-port 80 -j REDIRECT --to-port 8080
```

The 4th command here redirects the victim's HTTP traffic to the attacker's port 8080, and we will run a script on the attacker's VM which listens on port 8080, and intercepts the victim's HTTP traffic.

### Attack: 

1. The victim, opens firefox, accesses the web page: [www.usps.com](http://www.usps.com/). As of now, it shows:

![alt text](lab-mitm-original-page.png "the original page")


3. The attacker, runs the attack script: [http\_attack.py](http_attack.py). You need sudo to run the script:

```console
$ sudo python3 http_attack.py
```

Note: You have to change the IP addresses and the network interface in the above script, so as to reflect the correct information in your environment. In total you need to change 3 lines:

```console
CLIENT_IP = '10.0.2.4'   # The IP of your client
ATTACKER_IP = '10.0.2.6'  # The IP of the attacker
IFACE = "enp0s3"         # The Network interface to capture packets
```

This screenshot shows the moment right before the attacker launches the attack.
![alt text](lab-mitm-launch-attack.png "launch attack")

Explanation: what this script does is: keep sniffing packets going between the victim client and the web server, when a packet which goes from the client to the web server is captured, just forward it to the server, when a packet which goes from the web server to the client is captured, modify its content so as to show the message "this site is hacked".

4. the victim, refreshes the web page: [http://ns.cs.rpi.edu/test.html](http://ns.cs.rpi.edu/test.html). This screenshot shows that the web page is changed, which proves that the attack is successful and this concludes this lab.

![alt text](lab-mitm-final-success.png "lab is successful!")

**Troubleshooting tips**: if refreshing the web page does not change the content, remember to delete the browser cache, you can find the button (to delete the cache) in **Preferences** in firefox, as shown in these screenshots, just press "Clear Data".

![alt text](lab-mitm-clear-cache1.png "clear cache data 1")
![alt text](lab-mitm-clear-cache2.png "clear cache data 2")

