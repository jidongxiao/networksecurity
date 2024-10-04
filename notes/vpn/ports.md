# VPN Ports

VPNs can use various ports depending on the protocol they employ. Here’s a list of common VPN protocols and their associated ports:

## 1. OpenVPN
- **Default Ports:** 
  - **UDP:** `1194` (commonly used for better performance)
  - **TCP:** `443` (often used to bypass firewalls)

## 2. L2TP/IPsec
- **Ports Used:**
  - **UDP:** `1701` (L2TP)
  - **UDP:** `500` (IPsec)
  - **UDP:** `4500` (IPsec NAT traversal)

## 3. PPTP
- **Ports Used:**
  - **TCP:** `1723` (PPTP)
  - **GRE Protocol:** `47` (used for PPTP tunneling)

## 4. SSTP
- **Port Used:**
  - **TCP:** `443` (uses HTTPS, making it less likely to be blocked)

## 5. IKEv2/IPsec
- **Ports Used:**
  - **UDP:** `500` (IKE)
  - **UDP:** `4500` (NAT traversal)

## 6. WireGuard
- **Default Port:**
  - **UDP:** `51820` (though it can be configured to use different ports)

## Summary
While many VPN protocols use specific default ports, it's essential to note that these can often be configured to use different ports if necessary, especially for bypassing firewalls or restrictions. 
