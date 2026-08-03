#!/usr/bin/env python3
"""Static dev server for KidSpark that never lets the browser cache.

python -m http.server sends Last-Modified, which browsers happily treat as
permission to reuse CSS and ES modules for the rest of the session. During
development that means edits silently don't show up until a hard refresh.
This serves the same files with no-store, so a normal reload is always
enough. Production hosting should do the opposite and cache aggressively.
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        # Keep the console readable: only report failures.
        if args and str(args[1]).startswith(("4", "5")):
            super().log_message(fmt, *args)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
    root = sys.argv[2] if len(sys.argv) > 2 else "/var/www/KID"
    handler = partial(NoCacheHandler, directory=root)
    with ThreadingHTTPServer(("0.0.0.0", port), handler) as httpd:
        print(f"KidSpark dev server on http://localhost:{port} (no-store)")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
