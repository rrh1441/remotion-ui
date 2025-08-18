# 📦 Publishing to npm

## Prerequisites

1. **npm Account**: Create one at [npmjs.com](https://www.npmjs.com/)
2. **Login**: Run `npm login` and enter your credentials
3. **2FA**: If enabled, have your authenticator ready

## Publishing Steps

### 1. Test Locally First

```bash
# Build the CLI
pnpm --filter @remotion-ui/cli build

# Create a global link
cd packages/cli
npm link

# Test in a separate Remotion project
cd ~/my-test-remotion-project
npm link @remotion-ui/cli
npx remotion-ui init
npx remotion-ui add title-card

# If it works, unlink
npm unlink @remotion-ui/cli
cd ~/remotion-ui/packages/cli
npm unlink
```

### 2. Pre-Publish Checklist

- [ ] All tests pass: `pnpm test`
- [ ] Build succeeds: `pnpm build`
- [ ] Templates are copied correctly
- [ ] Version number is correct in `package.json`
- [ ] README.md is up to date
- [ ] Committed all changes to git

### 3. Publish to npm

```bash
# From the monorepo root
cd packages/cli

# Dry run first (see what would be published)
npm publish --dry-run

# If everything looks good, publish!
npm publish --access public

# Or use pnpm from root
pnpm --filter @remotion-ui/cli publish --access public
```

### 4. First-Time Publishing

For the first publish of a scoped package (@remotion-ui/cli):

```bash
# Must explicitly set public access
npm publish --access public
```

### 5. Version Management

To bump version before publishing:

```bash
# Patch version (0.1.0 -> 0.1.1)
npm version patch

# Minor version (0.1.0 -> 0.2.0)
npm version minor

# Major version (0.1.0 -> 1.0.0)
npm version major

# Then publish
npm publish
```

### 6. Verify Publication

After publishing:

1. Check npm: [https://www.npmjs.com/package/@remotion-ui/cli](https://www.npmjs.com/package/@remotion-ui/cli)
2. Test installation in a fresh project:
   ```bash
   npm install -D @remotion-ui/cli
   npx remotion-ui --help
   ```

## Troubleshooting

### "You must sign up for private packages"

Add `--access public` to the publish command.

### "No authenticate user"

Run `npm login` first.

### "Package name too similar to existing packages"

This shouldn't happen with @remotion-ui scope, but if it does, ensure you own the scope.

### "You cannot publish over the previously published versions"

Bump the version number in package.json first.

## GitHub Release

After npm publish:

```bash
# Tag the release
git tag v0.1.0
git push origin v0.1.0

# Create GitHub release
gh release create v0.1.0 \
  --title "v0.1.0 - Initial Release" \
  --notes "- 20+ motion components
- 70+ production assets
- CLI for easy installation
- Full TypeScript support"
```

## Automating with GitHub Actions

For future releases, you can automate with GitHub Actions:

```yaml
# .github/workflows/publish.yml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm --filter @remotion-ui/cli publish --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

## Post-Publish

1. **Announce** on Twitter/X, Discord, Reddit r/remotion
2. **Update** the main README with npm install instructions
3. **Monitor** npm downloads and GitHub issues
4. **Respond** to early user feedback

---

## Quick Commands Reference

```bash
# Build
pnpm --filter @remotion-ui/cli build

# Test locally
npm link

# Publish (first time)
npm publish --access public

# Publish (subsequent)
npm version patch && npm publish

# Check what will be published
npm publish --dry-run
```