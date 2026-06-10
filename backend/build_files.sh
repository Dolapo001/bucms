#!/usr/bin/env bash
# Vercel build script — runs during deployment to collect static files
set -e

pip install -r requirements.txt
python manage.py collectstatic --noinput
