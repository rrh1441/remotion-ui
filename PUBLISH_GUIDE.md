# 📦 Publishing Guide for Remotion-UI

## Prerequisites

### 1. Create an npm account
Visit [npmjs.com](https://www.npmjs.com/signup) and create a free account.

### 2. Login to npm locally
```bash
npm login
```
Enter your username, password, and email when prompted.

### 3. Verify authentication
```bash
npm whoami
```
This should display your npm username.

## Publishing Steps

### 1. Final Build
```bash
cd packages/cli
pnpm build
```

### 2. Dry Run (Recommended)
Test what will be published without actually publishing:
```bash
npm publish --dry-run
```

### 3. Publish Beta Version
```bash
npm publish --tag beta
```

The `--tag beta` ensures users must explicitly install the beta version with:
```bash
npm install @remotion-ui/cli@beta
```

### 4. Verify Publication
Check that your package is live:
```bash
npm view @remotion-ui/cli
```

## Post-Publishing

### Testing the Published Package
In a new directory:
```bash
# Create a test Remotion project
npm create remotion@latest test-remotion-ui
cd test-remotion-ui

# Install your published CLI
npm install -D @remotion-ui/cli@beta

# Test the CLI
npx remotion-ui init
npx remotion-ui add title-card
```

### Promoting to Stable
Once you're confident with the beta:
```bash
# Update version in package.json to 0.1.0
# Then publish as latest
npm publish --tag latest
```

## Troubleshooting

### Access Denied Error
If you get a 403 error, the package name might be taken. Check:
```bash
npm view @remotion-ui/cli
```

### Package Name Conflicts
If the scoped package name is taken, you may need to:
1. Use a different scope (your npm username)
2. Or publish under a different name

### Two-Factor Authentication
If you have 2FA enabled on npm:
```bash
npm publish --otp=YOUR_2FA_CODE --tag beta
```

## Current Package Status

- **Package**: @remotion-ui/cli
- **Version**: 0.1.0-beta.1
- **Features**: ✅ Complete
- **Tests**: ✅ Basic tests added
- **Documentation**: ✅ Updated with beta notice

## Next Steps After Publishing

1. **Share the beta**:
   - Post in Remotion Discord
   - Tweet about it
   - Create a demo video

2. **Gather feedback**:
   - Create GitHub issue templates
   - Monitor npm downloads
   - Respond to issues quickly

3. **Plan v0.1.0 stable**:
   - Fix any beta issues
   - Complete remaining doc pages
   - Polish based on feedback

Good luck with your first npm package! 🚀