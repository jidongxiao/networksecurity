# Subdomain Takeover and CNAME Records

## What is Subdomain Takeover?

Subdomain takeover occurs when an attacker takes control of a subdomain of a website, typically because the subdomain points to a resource that is no longer in use or has not been properly configured. This can happen if a subdomain's DNS records are misconfigured, leading to potential security issues and the ability to serve malicious content.

Subdomain takeover is closely related to CNAME records due to the way DNS (Domain Name System) resolves subdomains and how it manages associations between domain names and their respective resources. 

## How CNAME Records Are Involved

1. **CNAME Record Basics**: 
   - A CNAME (Canonical Name) record is a DNS record that maps an alias name (a subdomain) to the canonical name (the true or main domain) of a resource. When a DNS query is made for a CNAME, it points to another domain instead of directly to an IP address.

2. **Delegation of Control**:
   - When a subdomain has a CNAME record pointing to an external service (e.g., a cloud provider, CDN, or hosting service), it effectively delegates control over that subdomain to the target domain specified in the CNAME record.

3. **Impact of Removal or Misconfiguration**:
   - If the external service or resource that the CNAME points to is removed or becomes inactive (for example, if an organization decommissioned their cloud service account), the subdomain may become orphaned. 
   - If the CNAME record still exists in the DNS but no longer resolves to a valid service, an attacker can potentially register that resource or take control of it, effectively hijacking the subdomain.

## Example Scenario

Take this an example, as of today, 10/10/2024, when running this *dig* command, we can see:

```console
$ dig us.cnn.com

; <<>> DiG 9.18.28-0ubuntu0.22.04.1-Ubuntu <<>> us.cnn.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 30965
;; flags: qr rd ra; QUERY: 1, ANSWER: 5, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 65494
;; QUESTION SECTION:
;us.cnn.com.			IN	A

;; ANSWER SECTION:
us.cnn.com.		26	IN	CNAME	cnn-tls.map.fastly.net.
cnn-tls.map.fastly.net.	60	IN	A	151.101.67.5
cnn-tls.map.fastly.net.	60	IN	A	151.101.131.5
cnn-tls.map.fastly.net.	60	IN	A	151.101.195.5
cnn-tls.map.fastly.net.	60	IN	A	151.101.3.5

;; Query time: 4 msec
;; SERVER: 127.0.0.53#53(127.0.0.53) (UDP)
;; WHEN: Thu Oct 10 22:24:03 EDT 2024
;; MSG SIZE  rcvd: 139

```

1. **CNAME Setup**: CNN sets up a subdomain, `us.cnn.com`, with a CNAME record pointing to `cnn-tls.map.fastly.net`.
  
2. **Service Removal**: If one day, CNN decides to stop using us.cnn.com and discontinue their subscription with the hosting service on fastly.net, but CNN forget to remove the CNAME record.

3. **Attack Opportunity**: An attacker notices that `us.cnn.com` points to a service that is no longer active. The attacker can now register `cnn-tls.map.fastly.net` (if it becomes available) and control any traffic that comes to `us.cnn.com`.

4. **Exploitation**: The attacker can serve malicious content, phishing pages, or redirect traffic as they see fit, effectively taking over the subdomain.

## Mitigation Strategies

To prevent subdomain takeover, organizations should:

- **Regularly Audit DNS Records**: Ensure that all CNAME records point to active resources and that inactive subdomains are properly cleaned up.
  
- **Monitor DNS Changes**: Use DNS monitoring tools to alert administrators of changes to DNS records, especially for subdomains.

- **Implement Security Measures**: Use security measures such as HTTP Strict Transport Security (HSTS) and Content Security Policy (CSP) to mitigate the impact if a subdomain takeover occurs.

- **Remove Unused Subdomains**: Actively remove subdomains that are no longer needed or used.

