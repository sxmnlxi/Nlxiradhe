# RewardApp (working name)

A reward/offers-style app: browse offers, earn coins, refer friends, withdraw to UPI/bank.
Built with **Expo** (React Native) so it can be developed and built entirely from a phone —
no laptop, no Android Studio.

## Theme
All colors live in `src/theme/colors.js` — change `primary` there to re-theme the whole app.
Current theme: white background, pink primary (`#FF3E86`).

## What's built so far
- Project scaffold, navigation (5-tab bar: Home, Offers, Refer, My Offers, Profile)
- Full **Withdraw** screen (UPI/Bank selector, amount, security note) — reachable from Profile
- Placeholder screens for Home, Offers, Refer, My Offers, Profile — built one at a time next

## Phone-only development workflow
You don't need a laptop for any of this:

1. **Edit code**: use GitHub's mobile web editor (github.dev) or the GitHub app, or an
   in-browser IDE like StackBlitz/CodeSandbox. Push this project to a GitHub repo.
2. **Preview live on your phone**: install the **Expo Go** app from Play Store, then either:
   - Import this project into **Expo Snack** (snack.expo.dev, works in a phone browser) — scan
     the QR it gives you with Expo Go, or
   - Connect the GitHub repo to **expo.dev** (Expo's dashboard) and run a dev build.
3. **Build the real APK/AAB for the Play Store**: use **EAS Build** — triggered from
   expo.dev's website (works from a phone browser, no CLI/laptop required). It builds in
   Expo's cloud and gives you a download link / auto-submits to Play Console.
4. **Submit to Play Store**: Play Console's website works fine from a phone browser.

## Backend (for your cPanel hosting)
This app currently has **mock data only** (see `MOCK_BALANCE` in `WithdrawScreen.js`). You'll
want a small REST API on your cPanel host — PHP + MySQL is the natural fit for shared hosting:
- `POST /api/auth/*` — login/OTP
- `GET /api/wallet/balance`
- `POST /api/wallet/withdraw`
- `GET /api/offers`, `POST /api/offers/:id/complete`
- `GET /api/referrals`

Point the app at it via a single `API_BASE_URL` constant (I'll wire this in once we build the
data layer — happy to write the PHP endpoints too).

## Two things worth knowing before you launch this publicly
1. **Play Store policy on reward/offerwall apps**: Google has specific, fairly strict rules
   around apps that pay users for actions (installs, surveys, "offers") — misconfigured ones
   get rejected or suspended. Worth reading Google Play's Developer Policy on "Incentivized
   Traffic" before submitting.
2. **UPI/bank withdrawals = handling real money**: in India, apps that move money between
   users and bank accounts generally need to go through a licensed payment aggregator/gateway
   (Razorpay, Cashfree, etc.) rather than transferring funds directly — going straight bank-to-
   bank yourself can run into RBI payment-aggregator regulations. Worth checking with a
   payment gateway's docs (most have a straightforward payout/UPI payout API) before this goes
   live with real coins-to-rupees conversion.

Neither of these blocks building the app — just flagging them now so they don't surprise you
at launch.

## Next screens to build (say which one and I'll do it next)
- Home (balance summary + featured offers + quick actions)
- Offers list + offer detail
- Refer & Earn (invite code/link, referral list)
- Profile (user info, level/XP, activity stats)
