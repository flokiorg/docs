#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
git add package-lock.json
git commit -m "chore: add package-lock.json"
