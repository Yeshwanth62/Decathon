#!/bin/bash

# Sanjeevani 2.0 PDF Generator
# This script converts Markdown files to PDF

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Sanjeevani 2.0 PDF Generator ===${NC}"
echo -e "${YELLOW}This script converts Markdown files to PDF.${NC}"
echo

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo -e "${RED}Error: pandoc is not installed.${NC}"
    echo -e "${YELLOW}Please install pandoc:${NC}"
    echo -e "  - Ubuntu/Debian: ${BLUE}sudo apt-get install pandoc texlive-latex-base texlive-fonts-recommended texlive-extra-utils texlive-latex-extra${NC}"
    echo -e "  - macOS: ${BLUE}brew install pandoc basictex${NC}"
    echo -e "  - Windows: ${BLUE}choco install pandoc miktex${NC}"
    exit 1
fi

# Check if wkhtmltopdf is installed (alternative to pandoc+LaTeX)
if ! command -v wkhtmltopdf &> /dev/null; then
    HAS_WKHTMLTOPDF=false
    echo -e "${YELLOW}wkhtmltopdf is not installed. We'll use pandoc with LaTeX.${NC}"
else
    HAS_WKHTMLTOPDF=true
fi

# Function to convert Markdown to PDF using pandoc
convert_with_pandoc() {
    local input_file=$1
    local output_file=$2
    
    echo -e "${GREEN}Converting $input_file to $output_file using pandoc...${NC}"
    
    # Create a temporary YAML metadata file
    cat > temp_metadata.yaml << EOL
---
title: "Sanjeevani 2.0 - Project Handoff Document"
author: "Sanjeevani Health"
date: "$(date +"%B %d, %Y")"
geometry: "margin=1in"
fontsize: 11pt
colorlinks: true
linkcolor: blue
urlcolor: blue
toccolor: blue
toc: true
toc-depth: 3
---
EOL
    
    # Convert Markdown to PDF
    pandoc temp_metadata.yaml "$input_file" -o "$output_file" --pdf-engine=xelatex -V mainfont="DejaVu Sans" -V monofont="DejaVu Sans Mono"
    
    # Remove temporary file
    rm temp_metadata.yaml
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Successfully converted $input_file to $output_file${NC}"
        return 0
    else
        echo -e "${RED}Failed to convert $input_file to $output_file${NC}"
        return 1
    fi
}

# Function to convert Markdown to PDF using wkhtmltopdf
convert_with_wkhtmltopdf() {
    local input_file=$1
    local output_file=$2
    
    echo -e "${GREEN}Converting $input_file to $output_file using wkhtmltopdf...${NC}"
    
    # Convert Markdown to HTML
    pandoc "$input_file" -o temp.html --standalone --metadata title="Sanjeevani 2.0 - Project Handoff Document"
    
    # Convert HTML to PDF
    wkhtmltopdf --enable-local-file-access --footer-right "[page]/[topage]" --footer-font-size 9 temp.html "$output_file"
    
    # Remove temporary file
    rm temp.html
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Successfully converted $input_file to $output_file${NC}"
        return 0
    else
        echo -e "${RED}Failed to convert $input_file to $output_file${NC}"
        return 1
    fi
}

# Get input file
if [ -z "$1" ]; then
    # Default to HANDOFF.md if no input file is specified
    if [ -f "HANDOFF.md" ]; then
        INPUT_FILE="HANDOFF.md"
    else
        echo -e "${RED}Error: HANDOFF.md not found.${NC}"
        echo -e "${YELLOW}Usage: $0 [input_file.md] [output_file.pdf]${NC}"
        exit 1
    fi
else
    INPUT_FILE="$1"
    if [ ! -f "$INPUT_FILE" ]; then
        echo -e "${RED}Error: $INPUT_FILE not found.${NC}"
        exit 1
    fi
fi

# Get output file
if [ -z "$2" ]; then
    # Default to input file name with .pdf extension
    OUTPUT_FILE="${INPUT_FILE%.*}.pdf"
else
    OUTPUT_FILE="$2"
fi

# Convert Markdown to PDF
if [ "$HAS_WKHTMLTOPDF" = true ]; then
    convert_with_wkhtmltopdf "$INPUT_FILE" "$OUTPUT_FILE"
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}Falling back to pandoc...${NC}"
        convert_with_pandoc "$INPUT_FILE" "$OUTPUT_FILE"
    fi
else
    convert_with_pandoc "$INPUT_FILE" "$OUTPUT_FILE"
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}PDF generation completed successfully!${NC}"
    echo -e "${BLUE}Output file: $OUTPUT_FILE${NC}"
else
    echo -e "${RED}PDF generation failed.${NC}"
    exit 1
fi

# Generate PDFs for other documentation files
echo -e "${YELLOW}Do you want to generate PDFs for other documentation files? (y/n)${NC}"
read -p "Generate more PDFs? " generate_more
if [[ "$generate_more" == "y" || "$generate_more" == "Y" ]]; then
    for file in DEPLOYMENT.md DEPLOYMENT_CHECKLIST.md MONITORING.md SECURITY.md; do
        if [ -f "$file" ]; then
            output="${file%.*}.pdf"
            echo -e "${GREEN}Converting $file to $output...${NC}"
            
            if [ "$HAS_WKHTMLTOPDF" = true ]; then
                convert_with_wkhtmltopdf "$file" "$output"
                if [ $? -ne 0 ]; then
                    convert_with_pandoc "$file" "$output"
                fi
            else
                convert_with_pandoc "$file" "$output"
            fi
            
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}Successfully converted $file to $output${NC}"
            else
                echo -e "${RED}Failed to convert $file to $output${NC}"
            fi
        fi
    done
fi

echo
echo -e "${GREEN}All PDF generation tasks completed!${NC}"
echo
