# SPF (Sender Policy Framework)

SPF (Sender Policy Framework) is an email validation system designed to detect and prevent email spoofing. It allows domain owners to specify which mail servers are permitted to send emails on behalf of their domain.

## How SPF Works

1. **DNS Record Setup**:
   - SPF relies on a special DNS record that specifies the authorized mail servers for a domain.
   - Domain owners create an **SPF record** (usually a `TXT` record) that lists the IP addresses or mail servers allowed to send email on behalf of their domain.
   - Example of an SPF record:
     ```text
     rpi.edu. 7200 IN TXT "v=spf1 ip4:128.113.1.200/29 ip4:128.113.26.109 -all"
     ```
     This example allows emails from the IP range `128.113.1.200/29` and the IP `128.113.26.109` to be considered valid for the domain `rpi.edu`.

2. **Mail Flow and SPF Check**:
   - When a recipient mail server receives an email, it checks the SPF record of the sending domain.
   - The recipient’s server queries the DNS for the SPF record of the domain found in the "envelope-from" address (Return-Path) of the email.
   - It compares the sending server's IP address to the list of authorized IPs in the SPF record.

3. **SPF Results**:
   Based on the comparison, the recipient’s mail server will return one of the following results:
   - **Pass**: The sending IP is listed in the SPF record.
   - **Fail**: The sending IP is not authorized. The email should be rejected or marked as spam depending on the server's configuration.
   - **SoftFail**: The IP is not authorized, but the domain owner does not request outright rejection. The email may still be accepted but treated with caution.
   - **Neutral**: The SPF record does not make a recommendation on the sender.
   - **None**: No SPF record is found for the domain.

4. **SPF Syntax**:
   The SPF record follows a standard format:
   ```text
   v=spf1 <mechanism> <mechanism> ... <qualifier>
   ```

## Key Components

- **`v=spf1`**: The version of SPF.

### Mechanisms:

- **`ip4`**: Specifies authorized IPv4 addresses or ranges.
- **`ip6`**: Specifies authorized IPv6 addresses or ranges.
- **`a`**: Authorizes the IP address of the domain’s `A` or `AAAA` records.
- **`mx`**: Authorizes the domain's mail exchangers (MX records).
- **`include`**: Allows inclusion of other SPF records (e.g., for third-party services like SendGrid).
- **`all`**: Matches any IP not already covered by previous mechanisms.

### Qualifiers (modifiers to SPF behavior):

- **`+` (Pass)**: The default if no qualifier is specified.
- **`-` (Fail)**: The email should be rejected if the IP is not authorized.
- **`~` (SoftFail)**: Indicates a failed check, but the email should still be accepted with a warning.
- **`?` (Neutral)**: No definitive action is specified.

## Example SPF Record

Here’s a simple example of an SPF record:

```text
v=spf1 ip4:192.168.1.1/24 -all
```

This record allows emails from the IP range `192.168.1.1/24` and rejects emails from any other IP address.

## Limitations of SPF

- **Forwarding Issues**: When an email is forwarded, the IP address of the forwarding server may not be listed in the original domain’s SPF record, causing SPF checks to fail.
- **Only Validates IP**: SPF only checks the sending IP address, which means attackers could still spoof other parts of the email (e.g., the "From" header).
- **Does Not Prevent All Spoofing**: SPF is useful for validating the sending server's IP, but it does not verify the email's content or headers.

## SPF in Practice

SPF is often used in conjunction with **DKIM** (DomainKeys Identified Mail) and **DMARC** (Domain-based Message Authentication, Reporting, and Conformance) for more robust email authentication.

## Testing and Learning SPF

To experiment with SPF:

- Use tools like `dig` or `nslookup` to query the SPF record for a domain:
  ```bash
  dig txt example.com
  ```

- Test SPF validation by sending emails from authorized and unauthorized IPs to see how receiving servers handle them.

- Observe mail headers for Received-SPF results in mail clients like Gmail or Outlook to see if SPF checks are passing.

## Conclusion

SPF is a key component of modern email authentication. It helps reduce email spoofing by verifying the sending server's IP address, but it works best when combined with other technologies like DKIM and DMARC for a full email security solution.
