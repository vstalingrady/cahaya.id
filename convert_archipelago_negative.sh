#!/bin/bash

# Script to convert Indonesian archipelago AVIF image to binary ASCII art
# Black areas represented with " " (space), white areas (sea) with "/"

INPUT_FILE="/home/ubuntu/Downloads/indonesia-map-outline-vector-15272696.avif"
TEMP_DIR="/tmp/ascii_art"
OUTPUT_FILE="$TEMP_DIR/indonesia-map.png"
ASCII_OUTPUT="/home/ubuntu/caharaya/public/indonesia_archipelago_negative.txt"

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

# Add padding to the ASCII art
echo "Adding padding to ASCII art..."
TEMP_ASCII="$TEMP_DIR/ascii_temp.txt"
mv "$ASCII_OUTPUT" "$TEMP_ASCII"

# Create top padding (7 lines of 206 characters: 200 + 6 for side padding)
for i in {1..7}; do
    printf '%206s\n' | tr ' ' '/' >> "$ASCII_OUTPUT"
done

# Add side padding to each line and append to output
while IFS= read -r line; do
    printf '///%s///\n' "$line" >> "$ASCII_OUTPUT"
done < "$TEMP_ASCII"

# Create bottom padding (7 lines of 206 characters)
for i in {1..7}; do
    printf '%206s\n' | tr ' ' '/' >> "$ASCII_OUTPUT"
done

echo "Padding added successfully!"
echo "Displaying padded ASCII art:"
cat "$ASCII_OUTPUT"

# Clean up temporary files
rm -rf "$TEMP_DIR"

echo "Done!"