name: Handle Plugin PR

on:
  pull_request:
    types: [closed]
    branches:
      - verified-plugins

jobs:
  build:
    runs-on: ubuntu-latest

    if: github.event.pull_request.merged == true

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Node.js environment
      uses: actions/setup-node@v3
      with:
        node-version: '14'

    - name: Install dependencies
      run: npm install

    - name: Generate Plugin Pages
      run: node generatePages.js

    - name: Commit and push changes
      run: |
        git config --global user.name "GitHub Actions"
        git config --global user.email "actions@github.com"
        git add .
        git commit -m "Add plugin pages and update plugin list"
        git push origin website
