# Publishing (Allowlist-Based)

This project publishes from `dist/`, built from an explicit allowlist.

## 1) Edit the allowlist

Update `publish.allowlist` with the exact files/folders you want live.

## 2) Build deploy output

Run from repo root:

```bash
bash scripts/build-dist.sh
```

## 3) Deploy only `dist/`

Set your host/deploy job to publish the `dist/` directory, not the repo root.

## Notes

- If a path in `publish.allowlist` does not exist, the build fails.
- This prevents accidental publishing of archived or draft files.
