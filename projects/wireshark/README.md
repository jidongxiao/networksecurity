The most important thing to understand is that **Wireshark is not organized as one giant `src/` directory**. Its source tree is divided mostly by responsibility: packet dissection, file I/O, capture, UI, utilities, plugins, etc.

Here is what each major directory in the wireshark source tree is for.

---

# 1. The Most Important Directories

First think of the tree like this:

```text
                    Wireshark
                       |
        +--------------+--------------+
        |              |              |
       UI          Packet Analysis   Capture
        |              |              |
     ui/qt/           epan/         capture/
        |
        +----------------
        |
   Your new feature
```

And then there are supporting components:

```text
wiretap/     -> read/write capture files
wsutil/      -> general Wireshark utilities
plugins/     -> dynamically loaded plugins
extcap/      -> external capture interfaces
include/     -> shared public/internal headers
resources/   -> icons, images, UI resources, etc.
cmake/       -> build-system machinery
test/        -> tests
doc/         -> documentation
tools/       -> development/build tools
```

---

# 2. `app/`

```text
app/
```

This contains application-level pieces.

Think of it as infrastructure associated with the Wireshark applications rather than the packet dissectors themselves.

---

# 3. `capture/`

```text
capture/
```

This is concerned with **live packet capture**.

Conceptually:

```text
Network interface
       |
       v
   libpcap
       |
       v
   capture/
       |
       v
   Wireshark
```

It deals with things such as:

* Capturing packets from interfaces
* Capture processes
* Capture synchronization
* Capture options
* Communication between capture components

If your feature is:

> "Do something whenever a packet is captured live"

then `capture/` may be relevant.

But if your feature is:

> "Do something based on TCP retransmissions"

you probably **don't modify `capture/`**. You would more likely use information produced by the dissectors in `epan/`.

---

# 4. `cmake/`

```text
cmake/
```

Build-system infrastructure.

It contains CMake modules and helper files used to configure and build Wireshark.

For example:

```text
cmake/
    ...
```

This is where Wireshark's build system gets its knowledge about:

* Libraries
* Compiler capabilities
* Optional features
* Platform-specific configuration
* Build options

For this assignment, **avoid changing this unless your feature genuinely requires a new external dependency or build configuration**.

---

# 5. `doc/`

```text
doc/
```

Documentation.

This includes documentation for Wireshark developers/users and related material.

You generally won't need this for implementing your feature.

---

# 6. `epan/` ⭐⭐⭐

This is one of the **most important directories in the entire Wireshark source tree**.

```text
epan/
```

The name comes from **E**xtensible **PAN**alysis.

This is where much of Wireshark's **packet-analysis engine** lives.

Think:

```text
                Packet
                  |
                  v
             epan/
                  |
        +---------+---------+
        |         |         |
     dissect   analyze    fields
```

It contains infrastructure for:

* Packet dissection
* Protocol analysis
* Protocol trees
* Packet fields
* Conversations
* Expert information
* Protocol registration
* Packet metadata
* Statistics

And importantly, you will find protocol dissectors under here.

For example, conceptually:

```text
epan/dissectors/
    packet-tcp.c
    packet-ip.c
    packet-http.c
    packet-dns.c
    ...
```

If your absurd feature depends on:

> TCP retransmissions
> DNS packets
> HTTP requests
> IP TTL
> TCP flags
> packet lengths
> protocol fields

then **`epan/` is likely involved**.

---

# 7. `epan/dissectors/` ⭐⭐⭐

Although it wasn't shown separately by your `ls` command because it's inside `epan`, this deserves special attention.

```text
epan/
    dissectors/
```

This is where Wireshark understands individual network protocols.

For example:

```text
packet-ip.c
packet-tcp.c
packet-udp.c
packet-dns.c
packet-http.c
...
```

A dissector takes raw packet bytes and essentially says:

```text
"These bytes mean an IPv4 packet."

"These bytes mean TCP."

"This field is the source port."

"This field is the destination port."
```

If you want to **add support for a new protocol**, this is one of the first places you would look.

For your absurd feature, however, you probably don't want to create an entirely new protocol dissector unless that is part of your idea.

---

# 8. `extcap/`

```text
extcap/
```

**External capture interfaces.**

This allows Wireshark to obtain packets from things that aren't traditional network interfaces.

For example, an external program can act as a capture source.

Conceptually:

```text
Special hardware / program
          |
          v
       extcap
          |
          v
      Wireshark
```

Examples include specialized capture mechanisms and external capture programs.

If your feature involves:

> "Capture packets from some weird external device"

then investigate `extcap/`.

For a normal UI feature, probably not relevant.

---

# 9. `include/`

```text
include/
```

Shared header files.

You'll find declarations that need to be shared across different components.

Think:

```text
.c file
   |
   +---- includes ----> .h
```

For example:

```c
#include <wireshark/...>
```

If you create a substantial new subsystem, you may eventually need to put shared headers here.

But **don't automatically put every new `.h` file here**.

If your new feature is a Qt UI feature, it may be more appropriate to keep:

```text
ui/qt/my_feature.h
ui/qt/my_feature.cpp
```

together.

---

# 10. `libpcap/`

```text
libpcap/
```

This is related to the packet-capture library used by Wireshark.

`libpcap` provides the mechanism for capturing packets from network interfaces on Unix-like systems.

Think of it as:

```text
              Wireshark
                  |
                  v
              libpcap
                  |
                  v
             NIC/interface
```

---

# 11. `plugins/` ⭐⭐

```text
plugins/
```

Wireshark's plugin infrastructure.

This is important because Wireshark supports functionality that can be implemented as plugins rather than directly modifying the core.

There are different types of plugins.

For example:

```text
plugins/
    epan/
    ...
```

Protocol dissectors can be implemented as plugins.

---

# 12. `resources/`

```text
resources/
```

Resources used by the application.

Things such as:

* Icons
* Images
* UI resources
* Other static application assets

If your absurd feature needs an icon or some graphical resource, you may touch this directory.

For example:

```text
"Make the Wireshark shark dance when TCP retransmissions exceed 20%."
```

The dancing shark artwork could potentially live here.

But the **logic** controlling it would probably be in `ui/qt/`.

---

# 13. `test/`

```text
test/
```

Testing infrastructure.

This includes automated tests for Wireshark.

If you add a serious feature, tests can go here.

---

# 14. `tools/`

```text
tools/
```

Development and maintenance tools.

Think:

```text
tools/
    scripts
    development utilities
    analysis tools
    ...
```

These are generally used to **develop Wireshark**, rather than being part of the main packet-analysis application.

---

# 15. `ui/` ⭐⭐⭐⭐⭐

```text
ui/
```

This contains Wireshark's user-interface implementations.

You will find things such as:

```text
ui/
    cli/
    qt/
    ...
```

The important distinction is:

```text
ui/cli/
    command-line interface

ui/qt/
    graphical Wireshark application
```

Since the assignment specifically requires something that is:

> "clearly visible or audible during a live demonstration"

**`ui/qt/` is probably where you want to start.**

---

# 16. `ui/qt/` ⭐⭐⭐⭐⭐

This is the **Qt graphical user interface** for Wireshark.

If you launch:

```bash
./run/wireshark
```

you're looking at code from here.

This is where you find things associated with:

* Main window
* Packet list
* Packet details
* Menus
* Toolbars
* Dialog boxes
* Preferences
* Statistics windows
* Graphs
* Visualizations
* Qt event handling
* User interaction

If you want to create something like:

> "When packet loss exceeds 10%, make the Wireshark window shake."

you'd likely be working in:

```text
ui/qt/
```

If you want:

> "Display a giant sinking ship when TCP retransmissions increase."

again:

```text
ui/qt/
```

If you want:

> "Add a menu item called Absurd Network Mode."

again:

```text
ui/qt/
```

---

# 17. `wiretap/` ⭐⭐⭐

This is another very important subsystem.

```text
wiretap/
```

**Wiretap is Wireshark's capture-file I/O library.**

It deals with reading and writing capture files in different formats.

Conceptually:

```text
.pcap
.pcapng
other capture formats
        |
        v
     wiretap/
        |
        v
     Wireshark
```

So:

```text
epan/
```

is primarily about:

> "What does this packet mean?"

while:

```text
wiretap/
```

is primarily about:

> "How do I read this packet capture file?"

That's a very important distinction.

---

# 18. `wsutil/` ⭐⭐

```text
wsutil/
```

**Wireshark utility library.**

This contains general-purpose functionality shared by many Wireshark programs.

Things such as:

* Memory utilities
* String utilities
* Filesystem utilities
* Time utilities
* Logging
* Platform abstractions
* Miscellaneous helper functions

You can think of it as:

```text
                 Wireshark programs
                 /      |       \
                /       |        \
             tshark  wireshark  dumpcap
                \       |        /
                 \      |       /
                    wsutil/
```

If your feature needs a generic utility that belongs outside the UI or packet-dissection layers, this may be appropriate.

---

# 19. `fuzz/`

```text
fuzz/
```

Fuzz testing.

Wireshark uses fuzzing to discover crashes and other bugs by feeding malformed or unusual inputs into its packet-processing code.

For example:

```text
random/malformed packet
          |
          v
      dissector
          |
          v
      crash?
```

You normally won't modify this for this assignment.

---

# 20. `fix/`

```text
fix/
```

Maintenance/fix-related material.

This isn't normally where you would implement a new Wireshark feature.

---

# 21. `packaging/`

```text
packaging/
```

Packaging Wireshark for different operating systems/distributions.

For example:

* Debian packages
* Windows packaging
* macOS packaging
* Installer-related files

You don't want to modify this for your feature.

---

# 22. `doxygen` / documentation configuration

You have:

```text
doxygen.cfg.in
wireshark.dox
```

These are documentation-generation configuration files.

Not relevant to feature implementation.

---

# 23. The top-level `.c` files

```text
capture.c
dumpcap.c
editcap.c
mergecap.c
randpkt.c
rawshark.c
tshark.c
text2pcap.c
...
```

These are largely **individual Wireshark command-line programs/utilities**.

For example:

```text
tshark.c
```

is the command-line Wireshark program.

```bash
tshark
```

is essentially:

> Wireshark packet analysis without the graphical interface.

Similarly:

```text
dumpcap.c
```

is primarily concerned with packet capture.

```text
editcap.c
```

works with capture files.

```text
mergecap.c
```

merges capture files.

```text
text2pcap.c
```

converts ASCII hex dumps into packet captures.

---

# 24. A Very Useful Mental Model

Overall, the wireshark code base is like this:

```text
                 Wireshark
                     |
        +------------+-------------+
        |            |             |
        v            v             v
     Capture      Analysis         UI
        |            |             |
    capture/       epan/         ui/qt/
                     |
                     |
              epan/dissectors/
```

And:

```text
Capture file
    |
    v
 wiretap/
    |
    v
 Packet bytes
    |
    v
 epan/
    |
    v
 Protocol dissectors
    |
    v
 Packet information
    |
    v
 ui/qt/
    |
    v
 Screen / sound / interaction
```

---
