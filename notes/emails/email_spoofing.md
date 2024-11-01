# Key Indicators of Email Spoofing in Headers

When inspecting email headers for signs of spoofing, certain clues can reveal if an email has been manipulated to appear as if it originated from a legitimate sender.

## 1. Mismatch in "From" and "Return-Path" or "Reply-To"
- The **"From"** address may look legitimate, but check if the **"Return-Path"** or **"Reply-To"** addresses are different or suspicious.
- Spoofers may use a convincing "From" address while redirecting replies to a malicious address.

## 2. Discrepancies in "Received" Headers
- Each server that handles the email adds a **"Received"** header, showing the email's journey.
- A mismatch between the **domains** or **IP addresses** in the "Received" headers and the expected sending server can indicate spoofing.

## 3. SPF (Sender Policy Framework) Fail
- Look for **"Received-SPF: Fail"** or similar results.
- A fail here means the email's sending IP is **not authorized** by the domain's SPF record, hinting at potential spoofing.

## 4. DKIM (DomainKeys Identified Mail) Fail
- Check if the **DKIM-Signature** header exists and if validation was successful.
- A failed DKIM check means the email may have been **tampered with** or was not legitimately sent from the domain it claims.

## 5. DMARC (Domain-based Message Authentication, Reporting, and Conformance) Fail
- Look for the result of DMARC validation. A **DMARC: Fail** or **none** means the email failed both SPF and DKIM alignment, suggesting it's unauthorized.

## 6. Suspicious HELO/EHLO Identity
- The **HELO** or **EHLO** used by the sending server may be suspicious if it does not match the domain's legitimate mail servers.

## 7. Mismatch in IP Geolocation
- If the **IP address** listed in the "Received" headers geolocates to a region that doesn't match the expected sender location, it could be a sign of forgery.

## 8. Generic or Missing "Message-ID"
- A legitimate email typically has a unique **"Message-ID"**. If this field is **missing** or seems generic or inconsistent, it might indicate spoofing.

### Conclusion
By analyzing email headers, we can identify potential spoofing attempts that could be used in phishing or fraud attacks. Pay attention to any irregularities in the "From," "Received," SPF, DKIM, and DMARC fields.

