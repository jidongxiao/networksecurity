## The Comcast Throttling Scandal (2007)

- Incident: In 2007, Comcast, one of the largest ISPs in the U.S., was caught secretly throttling (slowing down) users' internet connections when they were using peer-to-peer (P2P) file-sharing services like BitTorrent.

Comcast used a technique that involved sending TCP reset (RST) packets to disrupt peer-to-peer (P2P) file-sharing traffic, particularly for protocols like BitTorrent and Gnutella. This effectively throttled users' internet connections by terminating ongoing P2P connections.

- How TCP Reset Attacks Worked in This Case:

TCP Reset (RST) Packet: The TCP protocol uses a "reset" packet (RST) to abruptly close a connection between two devices. Normally, this is done legitimately when one side encounters a problem or no longer wishes to continue communication.

- Comcast’s Approach: Comcast would inject forged TCP RST packets into the traffic stream between two peers (computers) engaged in file sharing. These RST packets would falsely signal to both parties that the connection was being closed, disrupting the file transfer.

- Effect on P2P Traffic: Since peer-to-peer networks rely on continuous connections between many users, the injection of TCP reset packets caused significant disruption, resulting in slower download/upload speeds or entirely terminated connections. This allowed Comcast to reduce the load on its network caused by bandwidth-heavy activities like file sharing.

- Detection and Fallout:

Users and technology experts began noticing that their P2P connections were being mysteriously interrupted. This led to investigations by groups like the Electronic Frontier Foundation (EFF), who confirmed that Comcast was actively interfering with P2P traffic using TCP reset attacks.

- Security Implications: This case raised serious concerns about net neutrality and ISPs' control over user traffic. It also sparked debates on how much power ISPs should have over the data they transmit.

- Outcome: The Federal Communications Commission (FCC) took action against Comcast, and in 2015, the Open Internet Order was passed, strengthening net neutrality rules. However, those rules were rolled back in 2018, reigniting concerns about ISP control.
