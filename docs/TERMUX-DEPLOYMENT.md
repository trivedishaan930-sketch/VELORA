# Android Termux deployment — VELORA

These instructions use the separate GitHub repository `trivedishaan930-sketch/VELORA` (GitHub treats repository names as case-insensitive). They do not delete or modify `vasna`.

## 1. Download and extract

Download `VELORA-Full-Project.zip` to the Android **Download** folder.

Open Termux and run:

```bash
pkg update -y && pkg upgrade -y
pkg install git unzip python nodejs gh -y
termux-setup-storage
mkdir -p ~/projects
unzip -o /sdcard/Download/VELORA-Full-Project.zip -d ~/projects/
cd ~/projects/velora-project
```

If Android saves the ZIP under a different folder or filename, change only the ZIP path in the `unzip` command.

## 2. Check and preview

```bash
npm run check
npm run start
```

Open `http://127.0.0.1:4173` in your phone browser. Stop the local server with `CTRL+C` in Termux.

## 3. Sign in to GitHub and push to the separate VELORA repository

The repository already exists as `trivedishaan930-sketch/VELORA` and is empty. GitHub treats `velora` and `VELORA` as the same repository name, so use this one. Sign in from Termux using the browser-based GitHub CLI flow:

```bash
gh auth login
# Select: GitHub.com → HTTPS → Login with a web browser
gh auth setup-git
```

Then configure Git and push:

```bash
git init -b main
git add .
git commit -m "Build VELORA premium romance travel lifestyle foundation"
git remote add origin https://github.com/trivedishaan930-sketch/VELORA.git
git push -u origin main
```

Never paste a password or private access token into this chat or commit it to the repository. The GitHub CLI stores the sign-in locally for Git operations.

If `git push` says the remote contains work that you do not have locally, inspect it first:

```bash
git fetch origin
git log --oneline --decorate --all -8
```

Only if the remote has a separate initial README/license commit and you want to preserve it, merge it:

```bash
git pull origin main --allow-unrelated-histories
```

Resolve any reported conflicts, then push again:

```bash
git push -u origin main
```

Do not use `git push --force` for this setup.

## 4. Enable free GitHub Pages

1. Open `https://github.com/trivedishaan930-sketch/VELORA`.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. The included `.github/workflows/deploy.yml` will run after a push to `main`.
5. Open the **Actions** tab and confirm **Deploy VELORA to GitHub Pages** finishes successfully.
6. Open the Pages URL shown in the workflow or Settings → Pages. Do not treat deployment as complete until the live URL loads and you have checked mobile and desktop.

The repository name is `VELORA`; the project README and visible brand use `VELORA`. GitHub's repository URL may display the original capitalization.

## 5. Recheck after deployment

- Test the homepage at 360px, 390px and 430px phone widths and at desktop width.
- Confirm the couple photo remains visible and the page has no horizontal overflow.
- Test planner submission, saved items, style notes, checklist, story dialogs and concierge demo.
- Install the PWA from the browser's install/add-to-home-screen prompt and test offline after the first online visit.
- If an old version stays cached, refresh once while online; a release updates the service-worker cache version in `sw.js`.

## Alternative: Cloudflare Pages

Connect the same repository to Cloudflare Pages. Use no build command and set the output directory to the repository root (`/`). Review the current free-tier limits in your Cloudflare account before using it. Do not add a paid service as a prerequisite.
