# Publishing

Netlify publishes the repository root directly. The configuration is in
`netlify.toml`; it runs no build command and uses `.` as the publish directory.

Push commits to `main` to update the live site. `deprecated/`, `archive/`, and
other local-only files listed in `.netlifyignore` are excluded from deployment.
