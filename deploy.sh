#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}========================================${NC}"
echo -e "${GREEN}ACalc - Vercel Deployment Script${NC}"
echo -e "${YELLOW}========================================${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Vercel CLI is not installed!${NC}"
    echo -e "${YELLOW}Installing Vercel CLI globally...${NC}"
    npm install -g vercel
fi

# Make sure we have the latest changes
echo -e "${YELLOW}Checking for git repository...${NC}"
if [ -d ".git" ]; then
    echo -e "${GREEN}Git repository found!${NC}"
    echo -e "${YELLOW}Pulling latest changes...${NC}"
    git pull
else
    echo -e "${RED}No git repository found. Skipping git pull.${NC}"
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Build the project
echo -e "${YELLOW}Building project...${NC}"
npm run build

# Check if the build was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Build successful!${NC}"
else
    echo -e "${RED}Build failed! Aborting deployment.${NC}"
    exit 1
fi

# Deploy to Vercel
echo -e "${YELLOW}Deploying to Vercel...${NC}"
echo -e "${YELLOW}You may be prompted to log in if not already authenticated.${NC}"
echo -e "${YELLOW}Follow the instructions on screen to complete deployment.${NC}"
vercel --prod

# Deployment complete
echo -e "${GREEN}Deployment process complete!${NC}"
echo -e "${YELLOW}========================================${NC}" 