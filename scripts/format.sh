#!/bin/bash
# Script to clean code formatting and run linting

GREEN='\033[32m'
YELLOW='\033[33m'
BLUE='\033[34m'
NC='\033[0m'

echo -e "${BLUE}→${NC} Running Prettier..."
echo ""
npx prettier --write "src/**/*.{ts,tsx}" "scripts/**/*.ts" "public/**/*.svg" "*.{js,mjs,json}"
echo ""
echo -e "${GREEN}✓${NC} Prettier completed"

echo ""
echo -e "${BLUE}→${NC} Running linter..."
npm run lint -- --fix
echo -e "${GREEN}✓${NC} Linting completed"

echo ""
echo -e "${BLUE}→${NC} Cleaning trailing newlines..."

newline_changes=""
while read -r file; do
    before=$(cat "$file")
    perl -pe 'chomp if eof' -i "$file"
    after=$(cat "$file")
    if [ "$before" != "$after" ]; then
        newline_changes+="${GREEN}✓${NC} Cleaned: $file\n"
    fi
done < <(find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.mjs" -o -name "*.mts" -o -name "*.md" \) \
    ! -path "./node_modules/*" ! -path "./.next/*" ! -path "./out/*" ! -path "./public/legacy/*")

if [ -n "$newline_changes" ]; then
    echo ""
    echo -e "$newline_changes"
else
    echo -e " ${YELLOW}○${NC} No changes needed\n"
fi

echo -e "${GREEN}✓${NC} Code cleaning completed!"