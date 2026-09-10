# Lecture Exercise: Understanding the rsh Protocol with Wireshark

## Objective

In this exercise, we will use **Wireshark** to observe and understand how the Remote Shell (`rsh`) protocol works.

We will use two virtual machines:

* **Client** — runs the `rsh` client.
* **Server** — runs the `rsh` server.

We will run a normal `rsh` command and use Wireshark to examine the TCP connections and data exchanged between the Client and Server.

---

## Background Knowledge

Unlike many modern client-server protocols, `rsh` uses **two TCP connections**.

### First TCP connection: Normal communication

The first connection is used for normal `rsh` communication.

| Endpoint |     Port |
| -------- | -------: |
| Client   | **1023** |
| Server   |  **514** |

The Client connects from TCP port **1023** to TCP port **514** on the Server.

Port 514 is the standard port used by the `rsh` service.

### Second TCP connection: Error messages

The second connection is used by the Server to send **error messages** back to the Client.

For this connection:

| Endpoint |                     Port |
| -------- | -----------------------: |
| Server   |                 **1023** |
| Client   | **chosen by the Client** |

The Client chooses a port for this second connection. We will use Wireshark to observe which port the Client actually uses.

### Why are two connections important?

The `rsh` protocol requires the second connection to be established before the requested command is executed.

This is particularly important for understanding the **Kevin Mitnick attack** that we will study later:

> An attacker can inject an `rsh` command after the first TCP connection has been established. However, based on the `rsh` protocol, the command will only be executed after the second TCP connection is successfully established.

In this exercise, we will first observe this behavior using a **normal rsh connection**.

---

# Step 1: Install rsh

Run the following commands on **both the Client and Server VMs**:

```bash
$ sudo apt-get update
$ sudo apt-get install rsh-redone-client
$ sudo apt-get install rsh-redone-server
```

The `rsh-redone-client` package provides the `rsh` client program, while `rsh-redone-server` provides the server-side components.

---

# Step 2: Configure rsh on the Server

The `rsh` server uses a `.rhosts` file to determine which remote hosts are trusted.

On the **Server VM**, create the `.rhosts` file:

```bash
$ touch .rhosts
```

Add the IP address of the **Client VM** to the file:

```bash
$ echo [client's IP address] > .rhosts
```

Replace `[client's IP address]` with the actual IP address of the Client VM.

For example:

```bash
$ echo 10.0.2.4 > .rhosts
```

Set the file permissions:

```bash
$ chmod 644 .rhosts
```

This configuration tells the Server to trust the specified Client for `rsh` connections.

---

# Step 3: Test the rsh Connection

On the **Client VM**, run:

```bash
$ rsh [server's IP address] date
```

For example:

```bash
$ rsh 10.0.2.5 date
```

If the configuration is correct, the Server will execute the `date` command and return the result to the Client.

You should see output similar to:

```text
Wed Sep 10 23:15:42 EDT 2026
```

Notice that the Client does **not** ask you to enter a password. This is because the Server is configured to trust the Client through `.rhosts`.

---

# Step 4: Capture the rsh Traffic with Wireshark

Start **Wireshark** on the Client VM before running the `rsh` command.

Run:

```bash
$ rsh [server's IP address] date
```

After the command completes, stop the Wireshark capture.

Use Wireshark to identify the packets associated with the `rsh` communication.

## Questions

Examine the captured packets and answer the following questions:

1. Based on your observation in Wireshark, does rsh use encryption?
2. **Suppose you are an attacker attempting to hijack an `rsh` TCP connection and inject a command. How many TCP packets does the attacker need to send? Describe the purpose of each packet.** Assume that the attacker is on the **same network as the victim machines**.

> **Important:** In this exercise, we are observing a normal `rsh` connection. We do **not** manually specify the port used for the second connection. In the later Kevin Mitnick attack exercise, we will construct the packets ourselves and deliberately choose a port (such as `9090`) for the second connection.
