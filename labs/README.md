# Environment Setup

In this course, every student needs to install 3 virtual machines on their own computer. The virtual machine images are from the SEED Labs, and this semester we will be using the Ubuntu 20.04 64 bit images.

You can find the images information [here](https://seedsecuritylabs.org/labsetup.html).

# SSH No Password Login

Since these 3 VMs will just be used for experiments purpose and we do not intend to store any important data on these VMs, it is helpful to set up the VMs so that we can ssh from one VM to another without typing the password. To achieve this, follow these steps:

# Step 1

Generate the key in VM1. (press enter whenever asked)

$ ssh-keygen

Generating public/private rsa key pair.

Enter file in which to save the key (/home/seed/.ssh/id_rsa):

Enter passphrase (empty for no passphrase):

Enter same passphrase again:

Your identification has been saved in /home/seed/.ssh/id_rsa.

Your public key has been saved in /home/seed/.ssh/id_rsa.pub.

The key fingerprint is:

SHA256:Y0urYmUgI78jefnm79kueD5wa0zqn5gxkp89kHpcHKc

The key's randomart image is:

+---[RSA 3072]----+

|                 |

|                 |

|                 |

|. o . . .        |

| o o + +S        |

|  ..+ Eo +       |

| .o=o% .o        |

|o *oOBO=         |

| o OOOX=o        |

+----[SHA256]-----+

# Step 2

ssh-copy-id remote_host_ip, let's say the remote VM's ip is 10.0.2.16, then

$ ssh-copy-id 10.0.2.16

# Step 3

The above step will ask you to type your password, which for seed, is dees. after typing the password, now you can ssh to the other party without providing the password.

# Step 4

Repeat the above steps on all 3 VMs - overall you need to do step 1 and step 2 6 times to ensure you can ssh from any of 3 VMs to any other VM, without providing the password.
