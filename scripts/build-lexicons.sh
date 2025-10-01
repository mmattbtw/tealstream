#!/bin/bash

# Build script for generating TypeScript types from all lexicons
# This script finds all .json files in the lexicons directory and generates types for each

echo "Building TypeScript types from all lexicons..."

# Create lexiconTypes directory if it doesn't exist
mkdir -p ./lexiconTypes

# Find all .json files in lexicons directory and create an array
lexicon_files=()
while IFS= read -r -d '' file; do
    lexicon_files+=("$file")
done < <(find ./lexicons -name "*.json" -type f -print0)

# Generate types for all lexicons at once
echo "Generating types for ${#lexicon_files[@]} lexicon files..."
bunx @atproto/lex-cli gen-api ./lexiconTypes "${lexicon_files[@]}" --yes

echo "Lexicon type generation complete!"
