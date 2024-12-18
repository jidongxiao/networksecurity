## Man-in-the-middle attack against PKI

### Requirements 

In this lab, you will first see how PKI defeats man-in-the-middle attack, but then if the CA is compromised - its private key is exposed, then attackers launching a man-in-the-middle attack can defeat PKI. The attacker's goal is, when the victim visits https://www.cnn.com, the victim will actually be taken to fakenews.com (not the REAL fakenews.com, but a website created by the attacker).

### Setup

Two VMs: victim VM and attacker VM.

### Assumptions

We assume there is a trusted CA called GoMommy. And GoMommy's private key and certificate are both created already (named ca.key and ca.crt). We also assume we have used this CA to certify a website called fakenews.com. The private key and certificate for this website are also created and provided (named fakenews.key and fakenews.pem).

### Steps

0. on both the victim VM and the attacker VM: Download GoMommy's certificate ca.crt (from here: http://ns.cs.rpi.edu/pki/ca.crt), and then load it into the firefox browser:

Edit -> Preferences -> Privacy & Security -> Certificates -> View Certificates -> Import.

![alt text](lab9-import.png "Lab 9 Import")

(if you don't see Import, use the view->zoom out option of your browser)

Note: select "Trust this CA to identify websites."

Note 2: we import this because we assume GoMommy is a trusted CA, and for trusted CA, its certificate is supposed to be pre-loaded in the browser.

#### Attacker Setting Up fakenews.com

1.1. download fakenews.key and fakenews.pem into the home directory - i.e., /home/seed/ directory. (download fakenews.key from http://ns.cs.rpi.edu/pki/fakenews.key, and download fakenews.pem from http://ns.cs.rpi.edu/pki/fakenews.pem)

1.2. setup a website called fakenews.com on the attacker's VM. first, we create a folder under /var/www, called *fakenews*.

```console
$ sudo mkdir /var/www/fakenews
```

1.3. we then create the home page for fakenews.com. Inside /var/www/fakenews, we create a file called index.html, with the following content:

```console
$ sudo vi index.html
<html>
<body>
	Welcome to fakenews.com! Every day we provide you with the latest and most authentic fake news!
</body>
</html>
```

1.4. we then setup a virtual host so that we host fakenews.com via https. To achieve this, we add the following content at the end of this file: /etc/apache2/sites-available/000-default.conf.

```console
<VirtualHost *:443>
ServerName fakenews.com
DocumentRoot /var/www/fakenews
DirectoryIndex index.html

SSLEngine On
SSLCertificateFile /home/seed/fakenews.pem
SSLCertificateKeyFile /home/seed/fakenews.key
</VirtualHost>
```

1.5. run the following commands to configure and enable SSL.

```console
$ sudo a2enmod ssl	// this command enables ssl, a2enmod means "apache2 enable module", the opposite is a2dismod, which means "apache2 disable module".
$ sudo a2ensite default-ssl	// this command a2ensite enables an apache site, i.e., a virtual host, which is specified in the above 000-default.conf file. The opposite command is called a2dissite.
$ sudo apachectl configtest	// this command apachectl checks apache configuration file for valid syntax.
$ sudo service apache2 restart // this command actually starts the apache web server.
```

Note the passphrase here is 1234.

At this moment, if you, still on the attacker's VM, add "127.0.0.1 fakenews.com" in /etc/hosts, and you type https://fakenews.com in the browser, you should be able to access the fakenews.com we just created.

**Warning**: if you don't see the "Welcome to fakenews.com!" page, then your website setup is not successful, don't need to move forward.

#### Victim Visiting CNN

2.1. on the victim VM, we emulate the result of a DNS cache poisoning attack. So that www.cnn.com points to the attacker's VM. We achieve this by editing /etc/hosts so as to have the following entry:

```console
ATTACKER_IP	www.cnn.com
```

Replace ATTACKER_IP with the attacker VM's IP address.

2.2. we now type https://www.cnn.com in the browser and see if the man-in-the-middle attack is successful - if so, we should be visiting the attacker's fakenews.com.

Note: the attack here will not be successful, and you, as the victim client, are expected get a warning message saying "Your connection is not secure", as shown below:

![alt text](lab9-insecure.png "Lab 9 Insecure")

#### Attacker Stole the CA's Privacy Key

3.1. on the attacker VM, now we assume the attacker has compromised the CA and stole the CA's (i.e., GoMommy) private key ca.key. With this key, we, as an attacker, can sign any certificates in the name of GoMommy. Assume we, as the attacker, have created a private key for www.cnn.com, and have signed a certificate for www.cnn.com. The private key (named cnn.key) and the certificate (named cnn.pem) are here: http://ns.cs.rpi.edu/pki/cnn.key and http://ns.cs.rpi.edu/pki/cnn.pem. The attacker downloads these two files to its home directory, i.e., /home/seed.

3.2. Now edit the file we mentioned in Step 1.4, but change the certificate and the key from fakenews to cnn. i.e.:

```console
<VirtualHost *:443>
ServerName fakenews.com
DocumentRoot /var/www/fakenews
DirectoryIndex index.html

SSLEngine On
SSLCertificateFile /home/seed/cnn.pem
SSLCertificateKeyFile /home/seed/cnn.key
</VirtualHost>
```

3.3. Run the following command to restart the apache web server:

```console
# sudo service apache2 restart
```

Note: once again the passphrase here is 1234.

#### Victim Visiting CNN Again

4. On the victim VM, repeat step 2.1. Now the attack should be successful: the victim who types https://www.cnn.com should be redirected to the attacker's fakenews.com. As can be seen in the picture below.

![alt text](lab9-success.png "Lab 9 Success")
