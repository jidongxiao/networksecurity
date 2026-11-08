# Understanding Base64 Encoding and Decoding

Base64 encoding is a method used to convert binary data (such as files, images, etc.) into ASCII text. By representing binary data as text, Base64 encoding allows the transmission of data over systems that handle only text, such as email or JSON formats.

## How Base64 Encoding Works

Base64 converts binary data into ASCII characters by dividing the input into chunks of 3 bytes (24 bits) and mapping each 6-bit chunk to a character in the Base64 character set (A–Z, a–z, 0–9, `+`, and `/`). This results in a 4-character output for every 3 bytes of input.

1. **Binary Grouping**: Each group of 3 bytes (24 bits) is divided into 4 groups of 6 bits.
2. **Character Mapping**: Each 6-bit chunk is mapped to a character from the Base64 index table.
3. **Output**: The result is a Base64 encoded string.

For instance, the word "cat" in ASCII bytes (`c = 99, a = 97, t = 116`) is represented as binary `01100011 01100001 01110100`. Splitting this into 6-bit groups, `011000 110110 000101 110100`, then maps to "Y2F0" in Base64.

### Padding with `=`

Base64 converts every 3 input bytes (24 bits) into 4 Base64 characters (6 bits each).

If the input contains fewer than 3 bytes in its final group, Base64 adds `=` padding characters to complete the group of 4 output characters.

Here are three examples:

| Input | Input bytes | Base64 characters before padding | Padding | Final Base64 |
|---|---:|---|---|---|
| `Man` | 3 | `TWFu` | None | `TWFu` |
| `Ma` | 2 | `TWE` | `=` | `TWE=` |
| `M` | 1 | `TQ` | `==` | `TQ==` |

For example, encoding `Man`:

1. Convert each character into 8-bit binary:
   `01001101 01100001 01101110`
2. Combine the 24 bits and divide them into four 6-bit groups:
   `010011 010110 000101 101110`
3. Convert each 6-bit group into its Base64 character:
   `T W F u`
4. No padding is needed because all 3 input bytes were processed.

**Remember:** Base64 always produces groups of 4 output characters. The `=` character fills unused positions when the final input group contains fewer than 3 bytes.

## Decoding Base64

Decoding reverses the process:
- Each Base64 character is mapped back to its 6-bit binary form.
- These binary groups are combined and translated back into their original byte sequence, recovering the original binary data.

## Example Encoding

The word "hello" becomes `aGVsbG8=` in Base64:
1. Binary of "hello": `01101000 01100101 01101100 01101100 01101111`
2. Grouped into 6-bit chunks (adding two zero bits at the end): `011010 000110 010101 101100 011011 000110 111100`
3. Maps to characters: `aGVsbG8=`

## Use Cases

Base64 is useful in:
- Embedding images directly into HTML or CSS
- Sending binary data over APIs in a text-based format
- Encoding attachments for email transmission

Note that Base64 encoding increases the data size by about 33% due to its expansion into ASCII text.
