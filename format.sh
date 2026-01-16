#!/bin/bash

# Script to clean code formatting and run linting

echo "Running linter..."

npm run lint

echo "Cleaning trailing newlines..."

find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.mjs" -o -name "*.mts" -o -name "*.md" \) \
    ! -path "./node_modules/*" ! -path "./.next/*" ! -path "./out/*" ! -path "./public/v1/*" | while read -r file; do
    perl -pe 'chomp if eof' -i "$file"
    echo "Cleaned: $file"
done

echo "Removing space before self-closing tags..."

find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
    ! -path "./node_modules/*" ! -path "./.next/*" ! -path "./out/*" ! -path "./public/v1/*" | while read -r file; do
    sed -i -E 's/([^ ]{2}) \/>/\1\/>/g' "$file"
done

echo "Code cleaning completed!"