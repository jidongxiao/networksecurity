### Why Multiple Hops?

Emails often pass through multiple servers (or hops) before reaching their final destination. Here's why multiple hops might be necessary:

1. **Email Relaying**  
   Large organizations or service providers often relay emails through multiple servers for **security** or **performance** reasons. For example, emails may go through internal servers before leaving the organization, or they may pass through third-party filtering services.

2. **Anti-Spam/Anti-Virus Filtering**  
   Some email providers use external or internal gateways to scan incoming messages for spam, malware, and phishing. These gateways represent additional hops where emails are processed and cleaned before final delivery.

3. **Load Balancing and Distribution**  
   Large-scale email services, such as those offered by Google or Microsoft, often route messages through multiple servers for **load balancing**. This ensures that no single server becomes overwhelmed with traffic.

4. **Network Routing**  
   Emails can also traverse different servers based on the network configuration and distance between the sender and the recipient. In cases where the two are in different geographical regions, the message may be routed through multiple intermediary servers to reach its destination efficiently.

5. **Third-Party Services**  
   Some organizations outsource email processing to third-party services like **cloud-based email security providers**, which analyze and modify the headers or body content before forwarding the email to the recipient's mail server.
