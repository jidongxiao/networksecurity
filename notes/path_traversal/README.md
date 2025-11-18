# Path Traversal Attacks --- Lecture Notes

## 1. What Is a Path Traversal Attack?

A **path traversal attack** (also called **directory traversal**) occurs
when a web application uses **user-supplied input** to construct
filesystem paths without proper validation. Attackers exploit this to
access files **outside the intended directory**, such as configuration
files, passwords, or source code.

Examples of malicious inputs:

    ../../../../etc/passwd
    ..%2F..%2F..%2Fetc%2Fshadow
    /etc/passwd
    C:\Windows\win.ini

------------------------------------------------------------------------

## 2. Why Path Traversal Is Even Possible

### 2.1 The server trusts user input to build file paths

Example (dangerous code):

``` php
$file = $_GET['file'];
readfile("/var/www/uploads/" . $file);
```

If attacker provides:

    ../../../../etc/passwd

The OS treats:

    /var/www/uploads/../../../../etc/passwd

as `/etc/passwd`.

------------------------------------------------------------------------

### 2.2 Filesystems allow `..` (parent directory) and symbolic links

These features are legitimate but can be abused.

------------------------------------------------------------------------

### 2.3 Servers and frameworks generally don't block traversal automatically

Functions like: - `open()` - `readFile()` - `include()` -
`file_get_contents()`

will follow whatever path is given.

------------------------------------------------------------------------

### 2.4 Encodings bypass naive filters

Attackers can bypass checks for `"../"` using:

    ..%2F
    ..%5C
    ..\..\ 
    %c0%af (UTF-8 slash)

------------------------------------------------------------------------

## 3. Why Absolute Paths Also Work

Even without `../`, attackers sometimes supply an **absolute path**
(e.g., `/etc/passwd`). This works because of:

### 3.1 Application uses user input directly

``` php
readfile($_GET['file']);
```

The program will open literally any file.

------------------------------------------------------------------------

### 3.2 Absolute paths override concatenation

``` python
full = "/var/data/" + user_input
```

User supplies:

    /etc/passwd

OS resolves:

    /var/data//etc/passwd  →  /etc/passwd

------------------------------------------------------------------------

### 3.3 Canonicalization rules

Functions like `realpath()` or `File.getCanonicalPath()` normalize:

    /var/www/app + "/etc/passwd" → /etc/passwd

------------------------------------------------------------------------

### 3.4 Absolute paths bypass basic "directory traversal" filters

If a developer only blocks `".."`, attackers can simply give a full
path.

------------------------------------------------------------------------

## 4. How to Defend Against Path Traversal

### 4.1 Do not use raw filenames from users

Use **IDs**, not filenames:

    /download?id=42 → maps to /var/data/file42.pdf

------------------------------------------------------------------------

### 4.2 Use canonicalization + sandbox boundary checking

Always verify that the resolved path stays inside the allowed directory.

Example (Python):

``` python
base = "/var/www/uploads/"
full = os.path.realpath(os.path.join(base, user_input))

if not full.startswith(base):
    abort(403)
```

This blocks: - `../` traversal\
- encoded traversal\
- absolute paths\
- symlink bypasses

------------------------------------------------------------------------

### 4.3 Reject absolute paths

Detect and reject: - paths starting with `/` - paths containing
backslashes on Windows - drive letters (`C:\`)

------------------------------------------------------------------------

### 4.4 Use a whitelist of valid files

Safest approach:

    allowed = ["cat.jpg", "dog.png", "info.txt"]

------------------------------------------------------------------------

### 4.5 Use framework-provided safe APIs

Examples: - Flask `send_from_directory` - Express `res.sendFile` -
Django static file helpers

------------------------------------------------------------------------

### 4.6 Restrict filesystem permissions

Ensure the web server user (`www-data`, `apache`, etc.) **cannot** read
sensitive files like: - `/etc/shadow` - private keys - system logs

Even if traversal occurs, access is denied.

------------------------------------------------------------------------

## 5. Summary

Path traversal is possible because: - the OS allows `..` and absolute
path semantics - the server uses user input directly in file paths -
normalization and encodings bypass naive checks

Defenses require: 1. Disallowing direct filenames from users\
2. Canonicalization + boundary checks\
3. Whitelists\
4. Rejecting absolute paths\
5. Safe framework APIs\
6. OS-level permission hardening

This multi-layered approach ensures robust protection.
