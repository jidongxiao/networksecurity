# Building Wireshark 3.2.3 from Source on Ubuntu 20.04

## Overview

In this tutorial, you will download, compile, and install **Wireshark v3.2.3** from source code on Ubuntu 20.04.

Wireshark is a network protocol analyzer widely used for network troubleshooting, traffic analysis, and network security research.

**Estimated completion time: Approximately 15 minutes.**

We will install Wireshark 3.2.3 in a separate directory so that it does not replace or interfere with the existing Wireshark installation.

## Step 1: Install Required Dependencies

Open a terminal in your Ubuntu 20.04 VM and run:

```bash
sudo apt update

sudo apt install -y \
    build-essential \
    cmake \
    flex \
    bison \
    pkg-config \
    libglib2.0-dev \
    libpcap-dev \
    libgcrypt20-dev \
    libgnutls28-dev \
    libssl-dev \
    libkrb5-dev \
    libzstd-dev \
    zlib1g-dev \
    liblz4-dev \
    libsnappy-dev \
    qtbase5-dev \
    qttools5-dev \
    qttools5-dev-tools \
    qtmultimedia5-dev \
    libqt5svg5-dev \
    libc-ares-dev \
    libsmi2-dev \
    libnl-3-dev \
    libnl-genl-3-dev \
    python3
```

These packages provide the necessary compilers, build tools, networking libraries, cryptographic libraries, and Qt5 GUI dependencies.

## Step 2: Download Wireshark 3.2.3

Navigate to your home directory:

```bash
cd ~
```

Download the official Wireshark 3.2.3 source code:

```bash
wget https://www.wireshark.org/download/src/all-versions/wireshark-3.2.3.tar.xz
```

If the downloading command fails and it asks you to provide the parameter of "--no-check-certificate", add it like this:

```bash
wget https://www.wireshark.org/download/src/all-versions/wireshark-3.2.3.tar.xz --no-check-certificate
```

Extract the archive:

```bash
tar -xf wireshark-3.2.3.tar.xz
```

Navigate into the extracted source directory:

```bash
cd wireshark-3.2.3
```

## Step 3: Configure the Build

Create a separate build directory:

```bash
mkdir build
cd build
```

Configure the project using CMake:

```bash
cmake .. \
    -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_INSTALL_PREFIX=/opt/wireshark-3.2.3
```

**Important:** The option `-DCMAKE_INSTALL_PREFIX=/opt/wireshark-3.2.3` ensures that Wireshark 3.2.3 will be installed separately from the system's existing Wireshark installation.

## Step 4: Compile Wireshark

Compile the source code:

```bash
make -j$(nproc)
```

The `-j$(nproc)` option allows the compiler to use all available CPU cores, which can significantly speed up compilation.

Compilation may take several minutes, depending on the CPU and memory allocated to your VM.

## Step 5: Install Wireshark

Install the compiled program:

```bash
sudo make install
```

Update the shared library cache:

```bash
sudo ldconfig
```

Wireshark 3.2.3 should now be installed under:

```text
/opt/wireshark-3.2.3/
```

Your existing Wireshark executable remains unchanged.

## Step 6: Verify the Installation

Check the version of the newly installed Wireshark:

```bash
/opt/wireshark-3.2.3/bin/wireshark --version
```

The output should begin with:

```text
Wireshark 3.2.3
```

You can launch its graphical interface using:

```bash
/opt/wireshark-3.2.3/bin/wireshark
```

You can also verify the command-line version, TShark:

```bash
/opt/wireshark-3.2.3/bin/tshark --version
```

## Step 7: Run Both Wireshark Versions Independently

If you already have Wireshark installed through Ubuntu's package manager, you can continue using it normally.

To run the existing system version:

```bash
/usr/bin/wireshark
```

To run the newly compiled Wireshark 3.2.3:

```bash
/opt/wireshark-3.2.3/bin/wireshark
```

The two versions have separate executable locations, allowing you to use either one without replacing the other.

### Optional: Use a Separate Configuration Directory

By default, different Wireshark versions may share the same user configuration files.

To avoid potential configuration conflicts, create a separate configuration directory:

```bash
mkdir -p ~/.config/wireshark-3.2.3
```

Then launch Wireshark 3.2.3 using:

```bash
WIRESHARK_CONFIG_DIR="$HOME/.config/wireshark-3.2.3" \
    /opt/wireshark-3.2.3/bin/wireshark
```

This keeps the older version's preferences and profiles separate from those of your existing installation.

## Summary

You have successfully:

1. Installed the required build dependencies.
2. Downloaded Wireshark 3.2.3 source code.
3. Configured the build using CMake.
4. Compiled Wireshark from source.
5. Installed Wireshark in a separate directory.
6. Verified the installation and launched Wireshark 3.2.3.

**Total estimated time: Approximately 15 minutes**, although the actual time depends on your VM's hardware resources and Internet connection.

**Note:** Wireshark 3.2.3 is an older release intended here for educational and experimental purposes. Use it in your lab VM, and avoid opening untrusted packet captures with this version.
