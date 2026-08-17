#!/usr/bin/env bash
set -euo pipefail

python scripts/migrate-trai-platform.py

npm uninstall vite-plugin-manus-runtime --save-dev --package-lock-only --ignore-scripts
npm install --save-dev --save-exact vite@8.2.1 --package-lock-only --ignore-scripts
npm ci --prefer-offline --ignore-scripts

npm exec -- prettier --write \
  vite.config.ts \
  tooling/trai-dev-observer.js \
  client/src/_core/hooks/useAuth.ts \
  client/src/hooks/useSessionId.ts \
  client/src/pages/DomainConfiguration.tsx \
  client/src/pages/MelaNation.tsx \
  client/src/pages/ApiDocsPage.tsx \
  drizzle/schema.ts \
  server/_core/llm.ts \
  server/_core/map.ts \
  server/_core/notification.ts \
  server/_core/sdk.ts \
  server/_core/storageProxy.ts \
  server/_core/trustedOrigins.ts \
  server/_core/types/oauthTypes.ts \
  server/_core/vite.ts \
  server/auth.logout.test.ts \
  server/routers/features.ts \
  server/storage.ts \
  server/__tests__/completeIntegration.test.ts

rm -f scripts/migrate-trai-platform.py scripts/run-trai-platform-migration.sh

if git grep -niE 'manus' -- . ':!.github/workflows'; then
  echo '::error::legacy vendor reference remains outside temporary migration workflows'
  exit 1
fi
legacy_vendor="$(printf '\155\141\156\165\163')"
legacy_pkg="vite-plugin-${legacy_vendor}-runtime"
if npm ls "$legacy_pkg" >/dev/null 2>&1; then
  echo '::error::legacy vendor runtime package still resolves'
  exit 1
fi

npm audit --audit-level=low
npm run check:facts
npm exec -- tsc --noEmit
CLAUDE_API_KEY_HL=sk-ant-api03-ci-hl-0000000000000000000000000000000000000000 \
CLAUDE_API_KEY_QC=sk-ant-api03-ci-qc-1111111111111111111111111111111111111111 \
  npm exec -- vitest run
VITE_SITE_URL=https://trai.org npm exec -- vite build

test -f dist/public/index.html
test -d dist/public/media
test -f dist/public/og.png
if grep -RniE '__trai_dev__|__TRAI_DEV_OBSERVER__|trai-dev-observer|\.trai-dev-logs' dist/public; then
  echo '::error::development observability leaked into production artifacts'
  exit 1
fi

git config user.name 'Heru_Ahmose'
git config user.email 'aitconsult22@gmail.com'
git add -A
git reset -- .github/workflows
git diff --cached --check
git commit -m 'build: replace legacy platform with TRAI systems and Vite 8'
git push origin HEAD:build/vite8-trai-observer-20260817
