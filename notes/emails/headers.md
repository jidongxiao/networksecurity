# Understanding Email Headers

Email headers provide detailed information about the path and handling of an email message. They help in diagnosing issues and verifying the source and authenticity of emails.

## Key Email Headers Fields

1. **From**  
   Indicates who the email is from.  
   Example: `From: sender@example.com`

2. **To**  
   Specifies the intended recipient(s) of the email.  
   Example: `To: receiver@example.com`

3. **Subject**  
   Displays the subject line of the email.  
   Example: `Subject: Meeting Update`

4. **Date**  
   Shows the date and time the email was sent.  
   Example: `Date: Tue, 15 Oct 2024 10:35:46 +0000`

5. **Message-ID**  
   A unique identifier assigned to the email by the sending server.  
   Example: `Message-ID: <unique-id@mail.example.com>`

6. **Received**  
   Shows the route the email took from the sender to the receiver. Each `Received` field documents one "hop" in the journey.  
   Example:  
Received: from mail.example.com (mail.example.com [192.0.2.1])
by receiver.com with ESMTP id 123ABC

7. **Return-Path**  
Indicates the email address where bounce messages are delivered.  
Example: `Return-Path: <bounce@example.com>`

## Authentication Headers

1. **DKIM (DomainKeys Identified Mail)**  
Ensures the email content has not been tampered with. It uses a digital signature to verify the integrity of the email message.  
Example:  
DKIM-Signature: v=1; a=rsa-sha256; d=example.com; s=selector; h=from:to
;

2. **SPF (Sender Policy Framework)**  
SPF is used to verify that the sender’s email server is authorized to send messages for the domain. It helps prevent email spoofing. The results of SPF checks are often included in the headers.  
Example of an SPF result header:  
Received-SPF: pass (google.com: domain of sender@example.com designates 192.0.2.1 as permitted sender) Authentication-Results: spf=pass (sender SPF authorized) smtp.mailfrom=example.com

**SPF Result Values**:
- **Pass**: The IP is authorized to send on behalf of the domain.
- **Fail**: The IP is not authorized to send on behalf of the domain.
- **SoftFail**: The message is not authorized but should be accepted with caution.
- **None**: No SPF record found for the domain.

**How SPF Works**: The receiving server checks the SPF record of the sender's domain to verify if the sending IP is authorized to send mail for that domain.

3. **DMARC (Domain-based Message Authentication, Reporting & Conformance)**  
Works with SPF and DKIM to provide instructions to email receivers on how to handle failed authentication attempts (e.g., reject or quarantine emails).  
Example:  
DMARC-Filter: OpenDMARC Filter v1.4.0 mail.receiver.com 123ABC

## Troubleshooting with Headers

Email headers help diagnose delivery delays, spam classification, or unauthorized access. By examining the headers, you can track down which servers processed the email and check authentication results like DKIM, SPF, and DMARC.

### Example Email Headers
From: sender@example.com To: receiver@example.com Subject: Test Email Date: Tue, 15 Oct 2024 10:35:46 +0000 Message-ID: unique-id@mail.example.com Received: from mail.example.com (mail.example.com [192.0.2.1]) by receiver.com with ESMTP id 123ABC DKIM-Signature: v=1; a=rsa-sha256; d=example.com; s=selector; h=from:to
; Received-SPF: pass (google.com: domain of sender@example.com designates 192.0.2.1 as permitted sender) Authentication-Results: spf=pass smtp.mailfrom=example.com DMARC-Filter: OpenDMARC Filter v1.4.0 mail.receiver.com 123ABC

