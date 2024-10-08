## DHCP (Dynamic Host Configuration Protocol)

- closely related to MAC addresses.

- DHCP Assignment: When a device connects to a network, it uses its MAC address to request an IP address from the DHCP server. The MAC address uniquely identifies the device on the network.

- IP Allocation: The DHCP server assigns an IP address to the device, associating that IP address with the device’s MAC address. This ensures that the IP is leased to the correct device.

- MAC Address Filtering: Some networks use DHCP with MAC address filtering, where the DHCP server only assigns IP addresses to specific devices with allowed MAC addresses, enhancing security.

- Static DHCP Leases: DHCP servers can be configured to always assign the same IP address to a device with a specific MAC address. This is known as a static DHCP lease, useful for devices that need consistent IP addresses.

## Ports

- DHCP clients use UDP port 68 to receive responses from the DHCP server.

- DHCP servers use UDP port 67 to send responses to DHCP clients.

## Packets Exchange

DHCP can involve either a 4-phase or 2-phase exchange, depending on the situation:

1. 4-Phase DHCP Exchange (Normal Process):

This is the standard process that occurs when a client does not have a valid IP address and is looking for one on the network. The phases are as follows:

- DHCP Discover: The client broadcasts a discovery message to find DHCP servers.
- DHCP Offer: Available DHCP servers respond with an offer, which includes an IP address and other network configuration parameters.
- DHCP Request: The client selects an offer (typically the first one it receives) and sends a request to the DHCP server asking to use the offered IP address.
- DHCP ACK: The DHCP server sends an acknowledgment (ACK), confirming the lease of the IP address and other network parameters.

This 4-phase process ensures proper negotiation and allocation of network resources.

View the [animation](https:///jidongxiao.github.io/networksecurity/animations/DHCP_4phase_exchange/index.html) here for this 4-phase exchange.

2. 2-Phase DHCP Exchange (Renewal or Rebinding Process):

If a client already has a valid IP address and is simply renewing or extending its lease, only two phases are necessary:

- DHCP Request: The client directly sends a request to the DHCP server to extend its existing lease.
- DHCP ACK: The server acknowledges and extends the lease, providing updated lease time and possibly refreshed network parameters.

This 2-phase process happens during normal lease renewal (usually when the lease is about to expire).

View the [animation](https://jidongxiao.github.io/networksecurity/animations/DHCP_2phase_exchange/index.html) here for this 2-phase exchange.

### Key Differences:

The 4-phase exchange happens when the client needs a new IP address.
The 2-phase exchange happens during renewal or rebinding when the client already has an assigned IP address.

This allows DHCP to adapt to the situation, reducing overhead when renewal is sufficient.

## Commands in Linux to Start the Exchange

4-Phase Exchange: Initiating a New DHCP Lease

Command: 

```console
$ sudo dhclient -v
```

- This command initiates a new DHCP lease process, starting from the DHCP Discover phase, when the client doesn't have an IP address.
- The -v option is for verbose mode, allowing you to see the DHCP Discover, Offer, Request, and ACK phases in the output.

2-Phase Exchange: Renewing an Existing Lease

Command:

```console
$ sudo dhclient -r && sudo dhclient
```

The dhclient -r part releases the current DHCP lease, and the dhclient command starts the renewal process. If you already have a lease, sudo dhclient on its own will attempt to renew the current lease, initiating the 2-phase exchange (DHCP Request -> DHCP ACK).

## Commands in Ubuntu Linux to Check Current DHCP Lease:

```console
$ cat /var/lib/dhcp/dhclient.leases
```

or 

## Commands in Ubuntu Linux to Monitor DHCP Traffic:

```console
$ sudo apt install dhcpdump	// this command just installs dhcpdump, do this once and no need to do it again in the future.
$ sudo dhcpdump -i <interface>  // here we need to specify which network interface to monitor.
```
