# Contributing

Use short-lived branches and pull requests against `main`. CI checks commit conventions, versions, JavaScript syntax, core tests, and the actual installation ZIP in Chromium.

## Development

```sh
npm ci
npm run setup:hooks
npx playwright install chromium
git switch -c fix/describe-the-change
```

Use `feat/`, `fix/`, `docs/`, or `chore/` branch prefixes. Keep each PR focused. Before pushing:

```sh
npm run check
npm test
npm run test:browser
git add <changed-files>
git commit -m "fix: restore previews after GitHub navigation"
git push -u origin fix/describe-the-change
```

Open a PR with a Conventional Commit title and describe the behavior and validation. CI validates both the PR title and every non-merge commit introduced by the PR. GitHub runs the checks against the proposed merge result. Merge with **Squash and merge** after checks pass; its commit title comes from the PR title. The merged branch is deleted automatically.

`main` requires a PR and passing `Checks`, blocks force pushes/deletion, and keeps a linear history. Required approvals are zero for this solo-maintainer project; external review can still be requested. Local hooks are an early check; GitHub checks enforce the rule even if someone skips a hook.

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```text
<type>[optional scope][!]: <description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. Keep the first line within 100 characters, use a clear description, and omit its final period. Chinese and English descriptions are both accepted. Explain the reason in the body when useful. Mark breaking changes with `!` and a `BREAKING CHANGE:` footer.

```text
feat: preview HTML file pages
fix(viewer): preserve fragment navigation
docs: 更新安装说明
ci: verify packaged extension before release
```

## Release

1. Create a release branch, for example `chore/release-0.1.3`.
2. Run `npm run version:release -- 0.1.3`. This updates the manifest, package, and lockfile together and rejects a version that does not increase.
3. Update versioned documentation/download links and describe changes in the PR. Use `chore: release v0.1.3` as the commit and PR title.
4. Merge the PR after CI passes. Update local `main` and tag that merged commit:

   ```sh
   git switch main
   git pull --ff-only origin main
   git tag -a v0.1.3 -m "README HTML v0.1.3"
   git push origin v0.1.3
   ```

5. The **Release** workflow requires the tag to match the manifest/package/lockfile version and its commit to belong to `main`. It reruns CI, tests the extracted ZIP, then publishes a normal GitHub Release as Latest with ZIP, SHA-256, and generated release notes. Failed checks prevent publication; rerun a failed workflow after resolving transient runner failures. Do not move published tags or replace released assets.
6. Download the tested release ZIP and upload it to the existing Chrome Web Store item. Store submission/review remains separate and manual; this workflow does not upload to Google.

Existing `v0.1.2` and earlier releases are preserved. Adding this workflow does not republish old tags. Tags such as `v0.1.3-beta.1` are intentionally rejected because Chrome requires numeric versions; use a branch/PR artifact to test a candidate before tagging.

For packaging, local ZIP verification, and store details, see [development](docs/DEVELOPMENT.md) and [publishing](docs/PUBLISHING.md).
