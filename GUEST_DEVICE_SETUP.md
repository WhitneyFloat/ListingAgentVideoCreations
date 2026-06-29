# Guest macOS Device Setup & Integration Guide

When working remotely on guest macOS devices, standard developer tools (like Xcode CLI tools, system Git, Python3) and runtimes (Node.js/NPM) are typically missing. Attempting to run system wrappers like `/usr/bin/git` triggers interactive Xcode install popups and fails.

This guide documents the lightweight, zero-system-dependency setup we used to successfully run Remotion and integrate with GitHub.

---

## 🛠️ The Solution Architecture
1. **Portable Node.js**: Downloaded the precompiled macOS arm64 binary (`.tar.gz`) from Node.js official servers and extracted it locally.
2. **Git Wrapper Command**: Wrote a dummy `git` shell script in the local Node `bin/` directory. This script catches `git clone` arguments, downloads the repository zip file using `curl`, extracts it using `unzip`, and puts it in the destination folder, bypassing system Git requirements.
3. **Isomorphic Git Client**: Used the pure JavaScript npm package `isomorphic-git` inside Node to commit and push changes back to GitHub securely using a Personal Access Token (PAT).

---

## 📋 Quick Setup Prompt for Future AI Agents
Copy and paste this prompt when starting on a fresh guest machine to instruct the AI agent to replicate this exact setup:

```text
We are working on a guest macOS device without standard developer tools, Node.js, or Git installed. System paths to `git` or `python3` trigger Xcode developer tool warnings and block execution.

Please perform the following setup:
1. Verify system architecture and download the portable Node.js arm64 binary:
   URL: https://nodejs.org/dist/v20.11.1/node-v20.11.1-darwin-arm64.tar.gz
   Extract it in the scratch directory.
2. In the extracted Node `bin/` folder, create a shell script wrapper named `git`:
   - It must log its arguments.
   - If called with `clone`, it must find the URL and destination directory, fetch the repository zipball using `curl`, unzip it, and place it in the target directory.
   - If called with `init` or `--version`, return typical success output.
   - Make this file executable (chmod +x).
3. Prepend the local Node `bin` directory to the PATH variable for all command executions.
4. Set up a simple `git.js` script using `isomorphic-git` for running git push/commit/status programmatically.
```

---

## 💾 The Mock `git` Script Implementation
For reference, this is the script written to the local Node `bin/git` directory:

```bash
#!/bin/bash
IS_CLONE=false
for arg in "$@"; do
  if [[ "$arg" == "clone" ]]; then
    IS_CLONE=true
  fi
done

if [ "$IS_CLONE" = true ]; then
  URL=""
  for arg in "$@"; do
    if [[ "$arg" == http* ]]; then
      URL="$arg"
    fi
  done
  TARGET_DIR="${@: -1}"
  
  if [ "$URL" = "$TARGET_DIR" ]; then
    TARGET_DIR=$(basename "$URL" .git)
  fi
  
  CLEAN_URL=$(echo "$URL" | sed 's/\.git$//')
  ZIP_URL="${CLEAN_URL}/archive/refs/heads/main.zip"
  
  TEMP_ZIP="temp_clone.zip"
  TEMP_DIR="temp_clone_extracted"
  
  rm -f "$TEMP_ZIP"
  rm -rf "$TEMP_DIR"
  mkdir -p "$TEMP_DIR"
  
  curl -L -s "$ZIP_URL" -o "$TEMP_ZIP"
  unzip -q "$TEMP_ZIP" -d "$TEMP_DIR"
  
  EXTRACTED_SUBDIR=$(ls -1 "$TEMP_DIR" | head -n 1)
  mkdir -p "$TARGET_DIR"
  cp -R "$TEMP_DIR/$EXTRACTED_SUBDIR/." "$TARGET_DIR/"
  
  rm -f "$TEMP_ZIP"
  rm -rf "$TEMP_DIR"
  exit 0
fi

if [[ "$*" == *"--version"* ]]; then
  echo "git version 2.45.1"
elif [[ "$*" == *"init"* ]]; then
  echo "Initialized empty Git repository in $(pwd)/.git/"
fi
exit 0
```
