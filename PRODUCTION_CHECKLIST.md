# Production Checklist

## Build and CI

- [ ] `npm ci` completes successfully
- [ ] `npm run build` passes locally
- [ ] GitHub Actions CI (`.github/workflows/ci.yml`) is green

## Functional checks

- [ ] All assets load correctly
- [ ] Refresh works on deep links
- [ ] No console errors in production
- [ ] Countdown + modal flow works as expected
- [ ] Konami easter egg still triggers correctly

## UX checks

- [ ] Mobile responsive
- [ ] Fast load and acceptable performance

## Deployment checks

- [ ] Vercel env vars (`VITE_*`) are set correctly
- [ ] Production URL smoke test passed
- [ ] Rollback path confirmed (previous healthy deploy available)
