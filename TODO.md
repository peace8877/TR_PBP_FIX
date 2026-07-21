# TODO - Fix Image Display on Product Pages

## Problem
Backend stores image in `image_url` field, but frontend reads `image` field.

## Steps
- [x] 1. Analyze code to understand the issue
- [x] 2. Fix **ProductsPage.jsx** - change `p.image` → `p.image_url` in image rendering (3 occurrences: table, detail modal, edit modal preview)
- [x] 3. Fix **CashierDashboardPage.jsx** - map API response to add computed `image` field with full URL
- [ ] 4. Ensure Laravel storage link exists: run `php artisan storage:link` on backend

