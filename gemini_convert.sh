#!/bin/bash

# Script to convert Indonesian archipelago AVIF image to binary ASCII art
# Black areas represented with " " (space), white areas (sea) with "/"

INPUT_FILE="indonesia-map-outline-vector-15272696.avif"
TEMP_DIR="/tmp/ascii_art"
OUTPUT_FILE="$TEMP_DIR/indonesia-map.png"
ASCII_OUTPUT="public/indonesia_archipelago_negative.txt"

# Create temporary directory
mkdir -p "$TEMP_DIR"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Input file $INPUT_FILE not found!"
    exit 1
fi

echo "Converting AVIF to PNG..."
convert "$INPUT_FILE" "$OUTPUT_FILE"

# Check if conversion was successful
if [ ! -f "$OUTPUT_FILE" ]; then
    echo "Error: Failed to convert AVIF to PNG!"
    exit 1
fi

echo "Converting PNG to binary ASCII art with negative space..."
# Using jp2a with inverted colors, width 200, height 78, and custom character set
# " " (space) for black (land), "/" for white (sea)
jp2a --width=200 --height=78 --invert --chars="/ " "$OUTPUT_FILE" > "$ASCII_OUTPUT"

# Check if ASCII conversion was successful
if [ ! -f "$ASCII_OUTPUT" ]; then
    echo "Error: Failed to create ASCII art!"
    exit 1
fi

echo "Binary ASCII art with negative space saved to $ASCII_OUTPUT"
echo "Displaying binary ASCII art:"
cat "$ASCII_OUTPUT"

# Clean up temporary files
rm -rf "$TEMP_DIR"

echo "Done!"
