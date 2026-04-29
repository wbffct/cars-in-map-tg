#!/usr/bin/env python3
import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path


DEFAULT_PUBLIC_URL = "https://cars-json-api.wbffct.workers.dev/cars.json"


def build_upload_url(public_url: str) -> str:
    if public_url.endswith("/cars.json"):
        return public_url[: -len("/cars.json")] + "/upload"

    return public_url


def read_json_file(path: Path) -> bytes:
    try:
        with path.open("r", encoding="utf-8") as file:
            data = json.load(file)
    except FileNotFoundError:
        raise SystemExit(f"File not found: {path}")
    except json.JSONDecodeError as error:
        raise SystemExit(f"Invalid JSON in {path}: {error}")

    return json.dumps(data, ensure_ascii=False, separators=(",", ":")).encode("utf-8")


def upload_cars_json(file_path: Path, public_url: str, token: str) -> None:
    upload_url = build_upload_url(public_url)
    body = read_json_file(file_path)

    request = urllib.request.Request(
        upload_url,
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "cars-in-map-telegram-uploader/1.0",
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            response_body = response.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as error:
        response_body = error.read().decode("utf-8", errors="replace")
        raise SystemExit(f"Upload failed: HTTP {error.code} {response_body}")
    except urllib.error.URLError as error:
        raise SystemExit(f"Upload failed: {error.reason}")

    print(f"Uploaded {file_path} to {upload_url}")
    if response_body:
        print(response_body)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Upload cars.json to Cloudflare Worker KV.")
    parser.add_argument(
        "--file",
        default="public/cars.json",
        help="Path to cars JSON file. Default: public/cars.json",
    )
    parser.add_argument(
        "--url",
        default=os.environ.get("CARS_PUBLIC_URL", DEFAULT_PUBLIC_URL),
        help="Public /cars.json URL or direct /upload URL.",
    )

    return parser.parse_args()


def main() -> None:
    args = parse_args()
    token = os.environ.get("CARS_UPLOAD_TOKEN")

    if not token:
        raise SystemExit("Set CARS_UPLOAD_TOKEN environment variable first.")

    upload_cars_json(Path(args.file), args.url, token)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(130)
