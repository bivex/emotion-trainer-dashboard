#!/bin/bash
set -e

APP_NAME="Emotion Trainer (Debug)"
APP_PATH="target/debug/bundle/macos/${APP_NAME}.app"
CONTENTS="${APP_PATH}/Contents"
MACOS="${CONTENTS}/MacOS"
RESOURCES="${CONTENTS}/Resources"

echo "Building ${APP_NAME}.app (with DevTools)..."

# Build debug binary first
echo "Building debug binary..."
cargo build

# Create directory structure
rm -rf "${APP_PATH}"
mkdir -p "${MACOS}" "${RESOURCES}"

# Create Info.plist
cat > "${CONTENTS}/Info.plist" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>emotion-trainer</string>
    <key>CFBundleIdentifier</key>
    <string>com.genemotions.emotion-trainer.debug</string>
    <key>CFBundleName</key>
    <string>Emotion Trainer (Debug)</string>
    <key>CFBundleVersion</key>
    <string>1.0.0-debug</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
EOF

# Copy binary and resources
cp target/debug/emotion-trainer "${MACOS}/"
chmod +x "${MACOS}/emotion-trainer"

cp -r ../dist "${RESOURCES}/"
cp icons/icon.icns "${RESOURCES}/"

echo "✓ Built ${APP_NAME}.app (with DevTools enabled)"
echo "  Location: ${APP_PATH}"
echo "  Size: $(du -sh "${APP_PATH}" | cut -f1)"
echo ""
echo "To install: cp -R '${APP_PATH}' /Applications/"
echo "To run: open '${APP_PATH}'"
echo ""
echo "⚠️  Debug build is slower and has DevTools enabled"
