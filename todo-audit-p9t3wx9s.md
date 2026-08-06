# TRAI Site Empirical Audit — Issues to Fix

## Home Page Issues
- [ ] SoundReactiveEffects shows "Enable microphone access" text overlaid on hero — remove or hide this prompt
- [ ] Hero content has a semi-transparent box/rectangle behind it that looks wrong — remove background box from hero text
- [ ] Stat counters animate from 0 but show wrong values (3, 22+, 2%, 0⁶) — counters not reaching final values
- [ ] "SCROLL TO EXPLORE" text overlaps with "Enable microphone access" text — fix z-index/positioning
- [ ] Hero title gold/green gradient looks correct but needs stronger glow
- [ ] MassiveParticleSystem covers entire page including text — needs pointer-events-none confirmed

## Navigation Issues
- [ ] Verify all nav links work correctly
- [ ] "More" dropdown items all navigate correctly
- [ ] Search button opens command palette
- [ ] Notification bell renders without errors

## All Pages to Screenshot and Audit
- [ ] /materials — verify AMC visualization renders
- [ ] /quantum — verify quantum coherence viz renders
- [ ] /energy — verify energy harvesting page
- [ ] /community — verify TechBridge page
- [ ] /research — verify research lab page
- [ ] /patent-claims — verify patent claims explorer
- [ ] /timeline — verify career timeline
- [ ] /case-studies — verify case studies page
- [ ] /advanced-features — verify advanced features page
- [ ] /search — verify search page
- [ ] /gamification — verify gamification page
- [ ] /ai-insights — verify AI insights page
- [ ] /api-docs — verify API docs page
- [ ] /projects — verify project gallery
- [ ] /career-timeline — verify career timeline
- [ ] /admin — verify admin dashboard

## Performance Issues
- [ ] Check bundle size and load time
- [ ] Verify no memory leaks from canvas animations
- [ ] Ensure all canvas components clean up on unmount

## TypeScript / Build Issues
- [ ] Run full TypeScript check
- [ ] Run all tests
- [ ] Verify no console errors
- [x] SoundReactiveEffects shows "Enable microphone access" text overlaid on hero — remove or hide this prompt
- [x] Hero content has a semi-transparent box/rectangle behind it that looks wrong — remove background box from hero text
- [x] Stat counters animate from 0 but show wrong values (3, 22+, 2%, 0⁶) — counters not reaching final values
- [x] "SCROLL TO EXPLORE" text overlaps with "Enable microphone access" text — fix z-index/positioning
- [x] /energy — verify energy harvesting page (fixed CinematicIntro blocking, fixed bg color)
- [x] Run full TypeScript check (0 errors)
- [x] Run all tests (638 tests passing)
- [x] Verify no console errors
