/**
 * Builds a multi-resolution ICO file from PNG buffers.
 * ICO format: 6-byte header + 16-byte entry per image + concatenated PNG data.
 *
 * @param images - Array of { size, buffer } for each resolution
 * @returns Buffer containing the complete ICO file
 */
export function buildIco(images: { size: number; buffer: Buffer }[]): Buffer {
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // Reserved
    header.writeUInt16LE(1, 2); // Type: ICO
    header.writeUInt16LE(images.length, 4); // Number of images

    const entries = Buffer.alloc(16 * images.length);
    let offset = 6 + 16 * images.length;

    for (let i = 0; i < images.length; i++) {
        const { size, buffer } = images[i];
        const pos = i * 16;
        entries.writeUInt8(size < 256 ? size : 0, pos); // Width (0 = 256)
        entries.writeUInt8(size < 256 ? size : 0, pos + 1); // Height
        entries.writeUInt8(0, pos + 2); // Color palette
        entries.writeUInt8(0, pos + 3); // Reserved
        entries.writeUInt16LE(1, pos + 4); // Color planes
        entries.writeUInt16LE(32, pos + 6); // Bits per pixel
        entries.writeUInt32LE(buffer.length, pos + 8); // Image size
        entries.writeUInt32LE(offset, pos + 12); // Offset to image data
        offset += buffer.length;
    }

    return Buffer.concat([header, entries, ...images.map((img) => img.buffer)]);
}