## Exercise: Exploring Longest Prefix Matching

## Objective

In this exercise, you will configure several overlapping routes in the Linux
routing table and use `ip route get` to determine which route Linux selects
for different destination addresses.

The key concept is **Longest Prefix Matching (LPM)**:

> When multiple routes match a destination address, Linux selects the route
> with the longest (most specific) matching prefix.

---

### Setup

The provided VM, just one VM.

## 1. Inspect the Current Routing Table

First, examine the routing table before making any changes:

```bash
ip route
```

Take a moment to identify the existing routes, including the default route
if one is present.

## 2. Add the Exercise Routes

Add the following exercise routes to your routing table.

```bash
sudo ip route add 0.0.0.0/0 dev dummy1
sudo ip route add 18.0.0.0/8 dev dummy5
sudo ip route add 171.0.0.0/8 dev dummy2
sudo ip route add 171.0.0.0/10 dev dummy4
sudo ip route add 171.0.15.0/24 dev dummy1
sudo ip route add 55.128.0.0/10 dev dummy6
sudo ip route add 63.19.5.0/30 dev dummy3
```

After adding the routes, verify that they are present in the routing table.

```bash
ip route
```

You should see all 7 exercise routes in the routing table.

---

## 3. Determine Which Route Is Selected

For each of the followng five destination addresses provided, use `ip route get` to determine which route Linux selects.

```bash
ip route get <DESTINATION>
```

For example:

```bash
ip route get 63.19.5.3
```

Linux will report the route it would use to reach that destination.

Record the selected prefix for each destination.

| Destination       | Selected Prefix | Prefix Length |
| ----------------- | --------------- | ------------- |
| `63.19.5.3` |                 |               |
| `171.15.15.0` |                 |               |
| `63.19.5.32` |                 |               |
| `44.199.230.1` |                 |               |
| `171.128.16.0` |                 |               |

---

For each of your five destinations, explain: Why does Linux select that route?

## 5. Observe the Default Route

The default route is:

```text
0.0.0.0/0
```

It matches every IPv4 destination because it specifies zero network bits.

Use `ip route get` for a destination that does not match any of the exercise prefixes.

```bash
ip route get 1.2.3.4
```

Observe that Linux falls back to the default route.

This demonstrates that:

```text
More specific route
        ↓
Longest Prefix Match
        ↓
Default route only if nothing more specific matches
```

---

## 6. Clean Up

When you have finished the exercise, **remove all routes that you added**.

```bash
sudo ip route del 0.0.0.0/0 dev dummy1
sudo ip route del 18.0.0.0/8 dev dummy5
sudo ip route del 171.0.0.0/8 dev dummy2
sudo ip route del 171.0.0.0/10 dev dummy4
sudo ip route del 171.0.15.0/24 dev dummy1
sudo ip route del 55.128.0.0/10 dev dummy6
sudo ip route del 63.19.5.0/30 dev dummy3
```

Verify that the exercise routes have been removed.

```bash
ip route
```

Make sure that only the original routing configuration remains.

> **Important:** Do not delete the VM's original routes or default route.

---

## Questions

1. What does the `/` number in a CIDR prefix represent?
2. Why can multiple routes match the same destination address?
3. When multiple routes match, what determines which route Linux selects?
4. Why does `10.1.2.0/24` take precedence over `10.1.0.0/16` for a destination such as `10.1.2.150`?
5. Why does `0.0.0.0/0` match every IPv4 destination?
6. Why does the default route lose to a more-specific route?
7. In your experiment, did `ip route get` select the route you expected? Explain why.
