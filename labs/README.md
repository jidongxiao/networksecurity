# Environment Setup

In this course, every student needs to install 3 virtual machines on their own computer. The virtual machine images are from the SEED Labs, and this semester we will be using the Ubuntu 20.04 64 bit images.

You can find the images information [here](https://seedsecuritylabs.org/labsetup.html).

When setting up networks, you are highly recommended to use NatNetwork. Follow the instructions [here](https://presentationassistants.com/calendar/serve_file.php?file_id=1mIoGVehi9j7ta3oO0tk7PENzl8Nkp0Ye) to create the NatNetwork first.

If the network set up is successful, you should be able to ping and ssh from one VM to another VM.

# Change Host Names

To make it easier to identify the three virtual machines during the experiments, please change their host names as follows:

| Virtual Machine | Host Name |
| --------------- | --------- |
| VM1             | `VM1`     |
| VM2             | `VM2`     |
| VM3             | `VM3`     |

On each VM, run the following command to change the host name:

* On **VM1**, run:

  ```bash
  $ sudo hostnamectl set-hostname VM1
  ```
* On **VM2**, run:

  ```bash
  $ sudo hostnamectl set-hostname VM2
  ```
* On **VM3**, run:

  ```bash
  $ sudo hostnamectl set-hostname VM3
  ```

After running the command, you can verify the host name with:

```bash
$ hostname
```

The command should display `VM1`, `VM2`, or `VM3`, depending on which virtual machine you are using.

You may need to open a new terminal or log out and log back in for the new host name to appear in the terminal prompt.

# SSH No Password Login

Since these 3 VMs will just be used for experiments purpose and we do not intend to store any important data on these VMs, it is helpful to set up the VMs so that we can ssh from one VM to another without typing the password. To achieve this, follow these steps:

## Step 1

Generate the SSH keys in VM1. (press enter whenever asked)

$ ssh-keygen

## Step 2

Install VM1's public SSH key on VM2. Let's say the VM2's ip is 10.0.2.5, then run 

$ ssh-copy-id 10.0.2.5

## Step 3

The above step will ask you to type your password, which for seed, is dees. After typing the password, now you can ssh from VM1 to VM2 without providing the password.

## Step 4

Repeat the above steps on all 3 VMs - overall you need to do step 1 and step 2 6 times to ensure you can ssh from any of 3 VMs to any other VM, without providing the password.
