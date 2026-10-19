#!/usr/bin/env python3
"""
Pre-compress source photos + logo to reduce Vercel image optimizer origin-fetch cost.
LB-CS-14: images shipped to public/ must satisfy per-asset byte budget before upload.

Policy:
  - photos/*.jpg|png: downscale longest edge to 1920px, re-encode JPEG q=82 progressive. Target ≤300 KB.
  - brand/*.png (logo): keep PNG (brand), downscale if raster >512px, OR output WebP sibling.

Usage: python3 scripts/compress_sources.py [--dry-run]
"""
import argparse
import json
import os
import shutil
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
PHOTOS = PUBLIC / "photos"
BRAND = PUBLIC / "brand"
BACKUP = PHOTOS / ".originals_backup"

MAX_LONGEST_EDGE = 1600
JPEG_QUALITY = 80
PHOTO_TARGET_KB = 260
LOGO_MAX_EDGE = 512


def kb(path: Path) -> float:
    return path.stat().st_size / 1024.0


def compress_photo(src: Path, dst: Path, backup: Path, dry_run: bool):
    before_kb = kb(src)
    img = Image.open(src)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    w, h = img.size
    longest = max(w, h)
    if longest > MAX_LONGEST_EDGE:
        scale = MAX_LONGEST_EDGE / longest
        new_w, new_h = int(w * scale), int(h * scale)
        img = img.resize((new_w, new_h), Image.LANCZOS)
    else:
        new_w, new_h = w, h

    if dry_run:
        return {"path": str(src.relative_to(ROOT)), "before_kb": round(before_kb, 1),
                "would_resize_to": [new_w, new_h], "dry_run": True}

    if not backup.exists():
        shutil.copy2(src, backup)

    quality = JPEG_QUALITY
    cur_longest = max(new_w, new_h)
    cur_img = img
    for attempt in range(6):
        cur_img.save(dst, format="JPEG", quality=quality, progressive=True, optimize=True)
        after_kb = kb(dst)
        if after_kb <= PHOTO_TARGET_KB:
            break
        if quality > 72:
            quality -= 4
            continue
        # quality floor hit; downscale further
        if cur_longest > 1280:
            cur_longest = int(cur_longest * 0.85)
            scale = cur_longest / max(cur_img.size)
            cur_img = cur_img.resize((int(cur_img.size[0] * scale), int(cur_img.size[1] * scale)), Image.LANCZOS)
            new_w, new_h = cur_img.size
            quality = 78
            continue
        break

    return {"path": str(src.relative_to(ROOT)), "before_kb": round(before_kb, 1),
            "after_kb": round(after_kb, 1), "quality": quality, "dim": [new_w, new_h]}


def compress_logo(src: Path, backup: Path, dry_run: bool):
    before_kb = kb(src)
    img = Image.open(src)
    orig_mode = img.mode
    w, h = img.size
    longest = max(w, h)
    if longest > LOGO_MAX_EDGE:
        scale = LOGO_MAX_EDGE / longest
        new_w, new_h = int(w * scale), int(h * scale)
        img_resized = img.resize((new_w, new_h), Image.LANCZOS)
    else:
        new_w, new_h = w, h
        img_resized = img

    if dry_run:
        return {"path": str(src.relative_to(ROOT)), "before_kb": round(before_kb, 1),
                "would_resize_to": [new_w, new_h], "dry_run": True}

    if not backup.exists():
        shutil.copy2(src, backup)

    img_resized.save(src, format="PNG", optimize=True)
    after_kb = kb(src)
    return {"path": str(src.relative_to(ROOT)), "before_kb": round(before_kb, 1),
            "after_kb": round(after_kb, 1), "mode": orig_mode, "dim": [new_w, new_h]}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    BACKUP.mkdir(exist_ok=True)
    results = {"photos": [], "logos": []}

    for jpg in sorted(PHOTOS.glob("*.jpg")):
        if jpg.name.startswith("."):
            continue
        backup = BACKUP / jpg.name
        res = compress_photo(jpg, jpg, backup, args.dry_run)
        results["photos"].append(res)

    for png in sorted(BRAND.glob("*.png")):
        backup = BRAND / f".orig_{png.name}"
        res = compress_logo(png, backup, args.dry_run)
        results["logos"].append(res)

    total_before = sum(r["before_kb"] for r in results["photos"] + results["logos"])
    total_after = sum(r.get("after_kb", r["before_kb"]) for r in results["photos"] + results["logos"])
    results["summary"] = {
        "total_before_kb": round(total_before, 1),
        "total_after_kb": round(total_after, 1),
        "reduction_pct": round(100 * (1 - total_after / total_before), 1) if total_before else 0,
        "dry_run": args.dry_run,
    }

    out = ROOT / "scripts" / "compress_sources_result.json"
    out.write_text(json.dumps(results, indent=2))
    print(json.dumps(results["summary"], indent=2))
    print(f"full report: {out.relative_to(ROOT)}")

    # Fail-close: no photo >400KB after
    offenders = [r for r in results["photos"] if r.get("after_kb", 0) > 400]
    if offenders and not args.dry_run:
        print(f"WARN {len(offenders)} photos still >400KB after compression:", file=sys.stderr)
        for r in offenders:
            print(f"  {r['path']}: {r['after_kb']} KB", file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()
