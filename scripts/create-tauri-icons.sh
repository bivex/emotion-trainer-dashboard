#!/bin/bash
set -e

ICONS_DIR="$(dirname "$0")/../src-tauri/icons"
mkdir -p "$ICONS_DIR"

echo "Creating placeholder icons..."

python3 - <<'PYEOF'
import struct, zlib, os, sys

def make_png(width, height, r=30, g=100, b=200, a=255):
    """Create a solid-color RGBA PNG (required by Tauri)."""
    def chunk(ctype, data):
        c = zlib.crc32(ctype + data) & 0xffffffff
        return struct.pack('>I', len(data)) + ctype + data + struct.pack('>I', c)

    # color type 6 = RGBA
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
    raw = b''.join(b'\x00' + bytes([r, g, b, a] * width) for _ in range(height))
    idat = chunk(b'IDAT', zlib.compress(raw))
    iend = chunk(b'IEND', b'')
    return b'\x89PNG\r\n\x1a\n' + ihdr + idat + iend

import sys
icons_dir = sys.argv[1] if len(sys.argv) > 1 else "src-tauri/icons"

sizes = {"32x32.png": (32, 32), "128x128.png": (128, 128), "128x128@2x.png": (256, 256)}
for name, (w, h) in sizes.items():
    with open(os.path.join(icons_dir, name), "wb") as f:
        f.write(make_png(w, h))
    print(f"  Created {name}")
PYEOF

# Create .icns using iconutil on macOS
if command -v iconutil &> /dev/null; then
    ICONSET="/tmp/emotion_trainer.iconset"
    mkdir -p "$ICONSET"
    python3 - "$ICONSET" <<'PYEOF'
import struct, zlib, os, sys

def make_png(width, height, r=30, g=100, b=200, a=255):
    def chunk(ctype, data):
        c = zlib.crc32(ctype + data) & 0xffffffff
        return struct.pack('>I', len(data)) + ctype + data + struct.pack('>I', c)
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
    raw = b''.join(b'\x00' + bytes([r, g, b, a] * width) for _ in range(height))
    idat = chunk(b'IDAT', zlib.compress(raw))
    iend = chunk(b'IEND', b'')
    return b'\x89PNG\r\n\x1a\n' + ihdr + idat + iend

iconset = sys.argv[1]
for size in [16, 32, 64, 128, 256, 512, 1024]:
    with open(os.path.join(iconset, f"icon_{size}x{size}.png"), "wb") as f:
        f.write(make_png(size, size))
    if size <= 512:
        with open(os.path.join(iconset, f"icon_{size}x{size}@2x.png"), "wb") as f:
            f.write(make_png(size * 2, size * 2))
PYEOF
    iconutil -c icns "$ICONSET" -o "$ICONS_DIR/icon.icns"
    rm -rf "$ICONSET"
    echo "  Created icon.icns"
else
    # Fallback: copy a PNG as placeholder
    cp "$ICONS_DIR/128x128.png" "$ICONS_DIR/icon.icns"
    echo "  Created icon.icns (placeholder, install iconutil for proper .icns)"
fi

# Create minimal .ico (Windows format) - just use PNG as placeholder for now
cp "$ICONS_DIR/32x32.png" "$ICONS_DIR/icon.ico"
echo "  Created icon.ico (placeholder)"

echo "Done! Icons created in $ICONS_DIR"
echo "For production: replace with proper icons using 'npx @tauri-apps/cli icon your-icon.png'"
