#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ALLOWLIST_FILE="${ROOT_DIR}/publish.allowlist"
DIST_DIR="${ROOT_DIR}/dist"

if [[ ! -f "${ALLOWLIST_FILE}" ]]; then
  echo "Missing allowlist file: ${ALLOWLIST_FILE}" >&2
  exit 1
fi

rm -rf "${DIST_DIR}"
mkdir -p "${DIST_DIR}"

while IFS= read -r raw_line || [[ -n "${raw_line}" ]]; do
  line="${raw_line%%#*}"
  line="$(echo "${line}" | sed 's/[[:space:]]*$//')"

  if [[ -z "${line}" ]]; then
    continue
  fi

  src="${ROOT_DIR}/${line}"
  dest="${DIST_DIR}/${line}"

  if [[ ! -e "${src}" ]]; then
    echo "Allowlist path not found: ${line}" >&2
    exit 1
  fi

  if [[ -d "${src}" ]]; then
    mkdir -p "$(dirname "${dest}")"
    cp -R "${src}" "${dest}"
  else
    mkdir -p "$(dirname "${dest}")"
    cp "${src}" "${dest}"
  fi
done < "${ALLOWLIST_FILE}"

echo "Built deploy output in: ${DIST_DIR}"
