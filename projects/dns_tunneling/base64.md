# Understanding Base64 Encoding and Decoding

Base64 encoding is a method used to convert binary data (such as files, images, etc.) into ASCII text. By representing binary data as text, Base64 encoding allows the transmission of data over systems that handle only text, such as email or JSON formats.

## How Base64 Encoding Works

Base64 converts binary data into ASCII characters by dividing the input into chunks of 3 bytes (24 bits) and mapping each 6-bit chunk to a character in the Base64 character set (A–Z, a–z, 0–9, `+`, and `/`). This results in a 4-character output for every 3 bytes of input.

1. **Binary Grouping**: Each group of 3 bytes (24 bits) is divided into 4 groups of 6 bits.
2. **Character Mapping**: Each 6-bit chunk is mapped to a character from the Base64 index table.
3. **Output**: The result is a Base64 encoded string.

For instance, the word "cat" in ASCII bytes (`c = 99, a = 97, t = 116`) is represented as binary `01100011 01100001 01110100`. Splitting this into 6-bit groups, `011000 110110 000101 110100`, then maps to "Y2F0" in Base64.

### Padding with `=`

If the input data isn’t a multiple of 3 bytes, Base64 uses padding (`=`) to make the encoded output a multiple of 4 characters. This padding helps ensure consistent formatting in data transmission.

## Decoding Base64

Decoding reverses the process:
- Each Base64 character is mapped back to its 6-bit binary form.
- These binary groups are combined and translated back into their original byte sequence, recovering the original binary data.

## Example Encoding

The word "hello" becomes `aGVsbG8A` in Base64:
1. Binary of "hello": `01101000 01100101 01101100 01101100 01101111`
2. Grouped into 6-bit chunks: `011010 000110 010101 101100 011011 000110 1111`
3. Maps to characters: `aGVsbG8A`

## Use Cases

Base64 is useful in:
- Embedding images directly into HTML or CSS
- Sending binary data over APIs in a text-based format
- Encoding attachments for email transmission

Note that Base64 encoding increases the data size by about 33% due to its expansion into ASCII text.
