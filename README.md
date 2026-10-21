# ds-gitui 🌿

A visual Git graph and repository control plugin for **DeepSeek Harness** (Desktop & Web).  
Directly embedded into DeepSeek Harness's right sidebar, featuring a **VSCode Git Graph-style smooth continuous Bézier subway graph**, interactive branch operations, commit inspections, file diff viewer, and staging controls.

---

## 📸 Preview

![ds-gitui Preview](./git-graph-preview.png)

---

## ✨ Features

- **Subway Git Graph (连续平滑贝塞尔曲线图谱)**:
  - Global continuous SVG overlay canvas inspired by VSCode `git-graph`.
  - Smooth cubic Bézier S-curves with vertical tangent transitions for branch splits and merges.
  - Multi-lane interval merging and knockout outline styling (`var(--dsh-layer-0)`) for crystal-clear visual hierarchy.
  - Distinctive visual indicators for HEAD, merge commits, tags, branch tips, and uncommitted working tree changes.
- **Seamless DeepSeek Harness Right Sidebar Integration**:
  - Registered as a native right sidebar tab (`ds-gitui`) and guide card in DeepSeek Harness.
  - Automatically tracks and binds to the active session workspace (`cwd`).
  - Supports quick tab opening, full-screen expansion, and side-by-side splitting.
- **Interactive Branch & Commit Operations**:
  - Double-click commit to view detailed changes and commit metadata.
  - Right-click context menus: checkout branch, merge branch, delete branch, create tag, cherry-pick, revert, reset, and copy SHA.
  - Quick action toolbar: Branch filter dropdown, Refresh, `+ Branch`, `Stash`, `Fetch`, `Pull`, and `Push`.
- **Working Tree & Staging**:
  - Displays unstaged and staged files with count badges.
  - One-click Stage All (`全部暂存`) and Unstage All.
  - Inline commit composer for quick commits directly from the sidebar.
- **Built-in Diff Inspector**:
  - Side drawer inspecting commit details, parent links, author/committer dates.
  - File diff list with additions/deletions statistics and full unified diff viewer.
- **Reliable & Confined Git Service**:
  - Safe subprocess execution with temp-file stdio to prevent EPERM in restricted sandbox environments.

---

## 🚀 Installation

1. Clone or link `ds-gitui` into your DeepSeek Harness profile directory (e.g. `~/.dsh/profiles/desktop`):

```bash
cd ~/.dsh/profiles/desktop/node_modules
# On Windows PowerShell:
New-Item -ItemType Junction -Target "C:\Users\<user>\Documents\deepseek\ds-gitui" -Path "ds-gitui"
```

2. Add `ds-gitui` to `~/.dsh/profiles/desktop/package.json`:

```json
{
  "dependencies": {
    "ds-gitui": "link:../../../../Documents/deepseek/ds-gitui"
  },
  "dsh": {
    "bundles": [
      "ds-gitui"
    ]
  }
}
```

3. Build the client bundle (if developing from source):

```bash
pnpm run build
# or node build.mjs
```

4. Launch or reload DeepSeek Harness. In any session, click **ds-gitui** in the right sidebar or from the "开始" (Guide) tab to start exploring your Git history visually!

---

## 🛠️ Development

- **`build.mjs`**: Compiles client-side React components into standard DSH Cordis client bundle (`lib/client.js`).
- **`src/git-graph-view.js`**: Frontend UI, branch layout solver, and Bézier topology generator.
- **`src/styles.js`**: Scoped styles matching DSH dark theme tokens.
- **`lib/git-service.js`**: Host-side Git operations and parser service.
- **`lib/index.js`**: Host plugin entry exposing `/api/git-graph/*` endpoints.

---

## 📄 License

MIT © [yaanlaan](https://github.com/yaanlaan)
