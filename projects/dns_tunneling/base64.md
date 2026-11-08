# Understanding Base64 Encoding and Decoding

Base64 encoding is a method used to convert binary data (such as files, images, etc.) into ASCII text. By representing binary data as text, Base64 encoding allows the transmission of data over systems that handle only text, such as email or JSON formats.

## How Base64 Encoding Works

Base64 converts text data into ASCII characters by dividing the input into chunks of 3 bytes (24 bits) and mapping each 6-bit chunk to a character in the Base64 character set (`A–Z`, `a–z`, `0–9`, `+`, and `/`). This results in a 4-character output for every 3 bytes of input.

1. **Binary Grouping**: Each group of 3 bytes (24 bits) is divided into 4 groups of 6 bits.
2. **Character Mapping**: Each 6-bit chunk is converted to its decimal value and mapped to a character using the Base64 index table below.
3. **Output**: The mapped characters form the Base64 encoded string.

### Base64 Index Table

| Decimal Index | Base64 Character |
|---:|:---:|
| 0–25 | A–Z |
| 26–51 | a–z |
| 52–61 | 0–9 |
| 62 | + |
| 63 | / |

**Example:** The 6-bit binary value `011000` equals decimal 24, which maps to `Y` in the Base64 table.

For instance, the word "cat" in ASCII bytes (`c = 99, a = 97, t = 116`) is represented as binary `01100011 01100001 01110100`. Splitting this into 6-bit groups gives `011000 110110 000101 110100`. These groups correspond to decimal values `24, 54, 5, 52`, which map to `Y2F0` in Base64.

### Padding with `=`

Base64 processes input data in groups of 3 bytes (24 bits), producing 4 Base64 characters (6 bits each). However, if the final input group contains fewer than 3 bytes, Base64 adds padding characters (`=`) to complete the group of 4 output characters.

Here are 3 example cases:

**Case 1: Input contains 3 bytes (`Man`)**

1. Look up the ASCII decimal values:

   | Character | ASCII decimal |
   |---|---:|
   | M | 77 |
   | a | 97 |
   | n | 110 |

2. Convert each decimal value into 8-bit binary: `01001101 01100001 01101110`
3. Divide into 6-bit groups: `010011 010110 000101 101110`
4. Convert the four 6-bit groups into Base64 characters: `TWFu`.
5. No padding is needed because the 3 input bytes produce exactly 4 Base64 characters, filling all four output positions.

**Case 2: Input contains 2 bytes (`Ma`)**

1. ASCII decimal values: `M = 77`, `a = 97`.
2. Convert to 8-bit binary: `01001101 01100001`
3. Add two zero bits and divide into 6-bit groups: `010011 010110 000100`
4. Convert the three 6-bit groups into Base64 characters: `TWE`.
5. Add one = padding character to fill the fourth output position, resulting in `TWE=`.

**Case 3: Input contains 1 byte (`M`)**

1. ASCII decimal value: `M = 77`.
2. Convert to 8-bit binary: `01001101`
3. Add four zero bits and divide into 6-bit groups: `010011 010000`
4. Convert the groups into Base64 characters: `TQ`
5. Since 1 input byte produces only 2 Base64 characters, add two = padding characters to fill the remaining two output positions: `TQ==`.

**Summary:**

| Input | Input bytes | Base64 output |
|---|---:|---|
| `Man` | 3 | `TWFu` |
| `Ma` | 2 | `TWE=` |
| `M` | 1 | `TQ==` |

Remember: Every 3 input bytes produce 4 Base64 characters. Padding (`=`) fills unused positions in the final group when fewer than 3 input bytes remain.

## Decoding Base64

Decoding reverses the process:
- Each Base64 character is mapped back to its 6-bit binary form.
- These binary groups are combined and translated back into their original byte sequence, recovering the original binary data.

## The Hello Example Encoding

The word "hello" is encoded as `aGVsbG8=` in Base64.

1. **ASCII Conversion:** Convert each character into its ASCII decimal value:

   | Character | ASCII Decimal |
   |---|---:|
   | h | 104 |
   | e | 101 |
   | l | 108 |
   | l | 108 |
   | o | 111 |

2. **Binary Conversion:** Convert each decimal value into 8-bit binary and combine them:

   `01101000 01100101 01101100 01101100 01101111`

3. **Binary Grouping:** Divide the 40 bits into groups of 6 bits. Since 40 is not divisible by 6, add two zero bits at the end to complete the final group:

   `011010 000110 010101 101100 011011 000110 111100`

4. **Character Mapping:** Convert each 6-bit group into its decimal index and use the Base64 index table:

   | 6-bit Binary | Decimal Index | Base64 Character |
   |---|---:|:---:|
   | 011010 | 26 | a |
   | 000110 | 6 | G |
   | 010101 | 21 | V |
   | 101100 | 44 | s |
   | 011011 | 27 | b |
   | 000110 | 6 | G |
   | 111100 | 60 | 8 |

5. **Padding:** The seven Base64 characters occupy seven positions, but Base64 output must contain a multiple of four characters (in groups of four). Add one `=` padding character to complete the final group.

   **Final Base64 output:** `aGVsbG8=`

## Use Cases

Base64 is useful in:
- Embedding images directly into HTML or CSS
- Sending binary data over APIs in a text-based format
- Encoding attachments for email transmission

Note that Base64 encoding increases the data size by about 33% due to its expansion into ASCII text.
