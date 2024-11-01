# Why is `"hello"` Encoded as `aGVsbG8A` in Base64?

The string `"hello"` translates to `aGVsbG8A` in Base64 because of the way Base64 encoding works to convert binary data into ASCII text.

Here's a detailed step-by-step breakdown:

## 1. ASCII to Binary Conversion

Each character in `"hello"` is first converted to its ASCII binary equivalent:

| Character | ASCII Value | Binary Value     |
|-----------|-------------|------------------|
| h         | 104         | `01101000`      |
| e         | 101         | `01100101`      |
| l         | 108         | `01101100`      |
| l         | 108         | `01101100`      |
| o         | 111         | `01101111`      |

These binary values are then combined to form a single binary string:
01101000 01100101 01101100 01101100 01101111

## 2. Splitting into 6-Bit Groups

Base64 encoding requires breaking the binary string into 6-bit chunks. This results in:
011010 000110 010101 101100 011011 000110 111100

## 3. Padding

To ensure the string fits a multiple of 6 bits, Base64 adds padding to reach the required length (24 bits, or a multiple of 4 characters in the output). Here, an extra `000000` (one byte of padding) is added to the end:
011010 000110 010101 101100 011011 000110 111100 000000

## 4. Mapping to Base64 Characters

Each 6-bit segment maps to a character in the Base64 index:

| 6-Bit Group | Base64 Character |
|-------------|------------------|
| 011010      | `a`             |
| 000110      | `G`             |
| 010101      | `V`             |
| 101100      | `s`             |
| 011011      | `b`             |
| 000110      | `G`             |
| 111100      | `8`             |
| 000000      | `A` (padding)   |

## Result

When combined, these characters give the Base64-encoded string `aGVsbG8A`, representing `"hello"`.

In summary, `aGVsbG8A` is the Base64-encoded form of `"hello"` after converting each character to binary, padding, and mapping to Base64 characters.
