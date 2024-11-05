### Create self-signed CA certificate

```console
$ openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 -keyout ca.key -out ca.crt -subj "/CN=www.gomommy.com/O=GoMommy.com, Inc./C=US"
```

### Generate Certificate Requests

The command to generate a CSR is quite similar to the one we used in creating the self-signed certificate for the CA. The only difference is the -x509 option. Without it, the command generates a request; with it, the command generates a self-signed certificate. 

For fakebank:

```console
$ openssl req -newkey rsa:2048 -sha256 -keyout fakebank.key -out fakebank.csr -subj "/CN=www.fakebank.com/O=FakeBank Inc./C=US"
```

For Boa:

```console
$ openssl req -newkey rsa:2048 -sha256 -keyout boa.key -out boa.csr -subj "/CN=www.bankofamerica.com/O=Bank of America Corporation/C=US"
```

### Generate Certifiates

For fakebank:

```console
$ openssl ca -config openssl.cnf -policy policy_anything -md sha256 -days 3650 -in fakebank.csr -out fakebank.crt -batch -cert ca.crt -keyfile ca.key
```

For Boa:

```console
$ openssl ca -config openssl.cnf -policy policy_anything -md sha256 -days 3650 -in boa.csr -out boa.crt -batch -cert ca.crt -keyfile ca.key
```
