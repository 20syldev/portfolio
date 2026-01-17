#!/bin/bash
# Script to clean code formatting and run linting

GREEN='\033[32m'
RED='\033[31m'
YELLOW='\033[33m'
BLUE='\033[34m'
NC='\033[0m'

echo -e "${BLUE}→${NC} Running linter..."

if npm run lint; then
    echo -e "${GREEN}✓${NC} Linting completed"
else
    echo -e "${RED}✗${NC} Linting failed"
fi

echo ""
echo -e "${BLUE}→${NC} Cleaning trailing newlines...\n"

find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.mjs" -o -name "*.mts" -o -name "*.md" \) \
    ! -path "./node_modules/*" ! -path "./.next/*" ! -path "./out/*" ! -path "./public/v1/*" | while read -r file; do
    before=$(cat "$file")
    perl -pe 'chomp if eof' -i "$file"
    after=$(cat "$file")
    if [ "$before" != "$after" ]; then
        echo -e "${GREEN}✓${NC} Cleaned: $file"
    else
        echo -e "${YELLOW}○${NC} Skipped: $file"
    fi
done

echo ""
echo -e "${BLUE}→${NC} Removing space before self-closing tags...\n"

find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
    ! -path "./node_modules/*" ! -path "./.next/*" ! -path "./out/*" ! -path "./public/v1/*" | while read -r file; do
    before=$(cat "$file")
    sed -i -E 's/([^ ]{2}) \/>/\1\/>/g' "$file"
    after=$(cat "$file")
    if [ "$before" != "$after" ]; then
        echo -e "${GREEN}✓${NC} Fixed tags: $file"
    else
        echo -e "${YELLOW}○${NC} No changes: $file"
    fi
done

echo ""
echo -e "${GREEN}✓${NC} Code cleaning completed!"