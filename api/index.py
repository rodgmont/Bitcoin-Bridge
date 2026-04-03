# Vercel Serverless Entry Point
# This file serves as a thin bridge for Vercel's /api convention.
# All core logic resides in /src (see Technical README.md).

from src.index import app
