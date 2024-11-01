## Example Scenario

Assume we have the following SPF record for the domain `example.com`:

```text
v=spf1 ip4:192.0.2.0/24 -all
```

This record means that only IP addresses within the range `192.0.2.0` to `192.0.2.255` are authorized to send emails on behalf of `example.com`. Any other IP addresses will be rejected.

### Case 1: SPF Pass

- **Sending Server IP:** `192.0.2.5` (an authorized IP address)
- **Email Sent From:** `user@example.com`
- **Email Server IP:** `192.0.2.5`
- **SPF Check:**
  - The receiving mail server checks the SPF record for `example.com`.
  - It sees that `192.0.2.5` is included in the `192.0.2.0/24` range.
- **Result:** SPF Pass
- **Mail Header Example:**

```text
Received-SPF: pass (mail.example.com: domain of user@example.com designates 192.0.2.5 as permitted sender)
```

### Case 2: SPF Fail

- **Sending Server IP:** `198.51.100.5` (an unauthorized IP address)
- **Email Sent From:** `user@example.com`
- **Email Server IP:** `198.51.100.5`
- **SPF Check:**
- The receiving mail server checks the SPF record for `example.com`.
- It sees that `198.51.100.5` is **not** in the `192.0.2.0/24` range.
- **Result:** SPF Fail
- **Mail Header Example:**

```text
Received-SPF: fail (mail.example.com: domain of user@example.com does not designate 198.51.100.5 as permitted sender)
```

### Summary

- **SPF Pass:** The email is sent from an IP address that is listed in the SPF record, so the email is likely to be considered legitimate.
- **SPF Fail:** The email is sent from an IP address that is not authorized, leading the receiving server to potentially reject or mark the email as spam.

### References

For more in-depth information on SPF checks and their importance in email authentication, you can refer to:
- [Cloudflare: SPF Records](https://www.cloudflare.com/learning/security/glossary/spf-record/)
- [MXToolbox: SPF Record Lookup](https://mxtoolbox.com/spf.aspx)
