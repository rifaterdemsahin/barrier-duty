#!/usr/bin/env python3
import datetime
import re
import sys

def bump_version(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"File {file_path} not found.")
        return

    # Extract current version
    version_match = re.search(r'<span id="app-version">v(\d+)\.(\d+)\.(\d+)</span>', content)
    if not version_match:
        print(f"Version string not found in {file_path}")
        return

    major, minor, patch = int(version_match.group(1)), int(version_match.group(2)), int(version_match.group(3))
    new_patch = patch + 1
    new_version_str = f"v{major}.{minor}.{new_patch}"

    # Get current UTC timestamp
    deploy_date = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    # Replace version
    content = re.sub(
        r'<span id="app-version">v\d+\.\d+\.\d+</span>', 
        f'<span id="app-version">{new_version_str}</span>', 
        content
    )
    
    # Replace deploy date
    content = re.sub(
        r'<span id="deploy-date">.*?</span>', 
        f'<span id="deploy-date">{deploy_date}</span>', 
        content
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Successfully bumped version to {new_version_str} and date to {deploy_date} in {file_path}")

if __name__ == "__main__":
    bump_version("index.html")
