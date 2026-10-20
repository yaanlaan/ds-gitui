import fs from 'node:fs';
import path from 'node:path';

const stylesRaw = fs.readFileSync('src/styles.js', 'utf8');
const stylesContent = stylesRaw.replaceAll('export const ', 'const ');

const viewContent = fs.readFileSync('src/git-graph-view.js', 'utf8');

// Strip export statements from viewContent so it can be embedded in client bundle
const cleanedViewContent = viewContent
  .replace(/import\s*React[\s\S]*?from\s*['"]react['"];?/g, '')
  .replaceAll('export function ', 'function ')
  .replaceAll('export const ', 'const ');

const clientBundle = `// DeepSeek Harness Git Graph Plugin - Client Bundle
window.__ModuleLoader__.load({
  id: "dsh-plugin-git-graph",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    const React = require("react");

    // ==========================================
    // 1. UI 样式注入
    // ==========================================
    ${stylesContent}

    function installUiStyles() {
      if (typeof document === 'undefined') return;
      const STYLE_ID = 'dsh-git-graph-styles';
      let el = document.getElementById(STYLE_ID);
      if (!el) {
        el = document.createElement('style');
        el.id = STYLE_ID;
        document.head.appendChild(el);
      }
      el.textContent = GIT_GRAPH_STYLES;
    }

    // ==========================================
    // 2. 视图与组件定义
    // ==========================================
    ${cleanedViewContent}

    const GitGraphView = createGitGraphComponent(React);
    const GitGraphArtwork = createGitGraphArtwork(React);
    const GitGraphTitle = createGitGraphTitle(React);

    const PLUGIN_ID = "dsh-plugin-git-graph";
    const TAB_KIND = "git-graph";

    // ==========================================
    // 3. 插件依赖注入与生命周期
    // ==========================================
    const inject = [
      "slots",
      "sidebarRightTabs",
      "sidebarRight"
    ];

    function apply(ctx) {
      installUiStyles();

      // 1. 注册右侧侧边栏 Tab 定义以及 "开始 (Guide)" 入口项
      ctx.effect(() => ctx.sidebarRightTabs.register({
        id: PLUGIN_ID,
        kind: TAB_KIND,
        title: () => "Git Graph",
        guide: [{
          id: "open",
          order: 35,
          title: () => "Git Graph",
          description: () => "在侧边栏可视化浏览与操作 Git 分支与提交图谱",
          icon: GitGraphArtwork
        }]
      }), "dsh-plugin-git-graph: sidebar tab");

      // 2. 注册侧边栏 Tab 内容主体 (同时以 PLUGIN_ID 和 TAB_KIND 注册保障分发)
      ctx.effect(() => ctx.slots.inject("sidebar.right.pane.tab", () => ctx.slots.register({
        name: "sidebar.right.pane.tab",
        key: PLUGIN_ID
      }, GitGraphView)), "dsh-plugin-git-graph: tab body id");

      ctx.effect(() => ctx.slots.inject("sidebar.right.pane.tab", () => ctx.slots.register({
        name: "sidebar.right.pane.tab",
        key: TAB_KIND
      }, GitGraphView)), "dsh-plugin-git-graph: tab body kind");

      // 3. 注册侧边栏 Tab 标题
      ctx.effect(() => ctx.slots.inject("sidebar.right.pane.tab.title", () => ctx.slots.register({
        name: "sidebar.right.pane.tab.title",
        key: PLUGIN_ID
      }, GitGraphTitle)), "dsh-plugin-git-graph: tab title id");

      ctx.effect(() => ctx.slots.inject("sidebar.right.pane.tab.title", () => ctx.slots.register({
        name: "sidebar.right.pane.tab.title",
        key: TAB_KIND
      }, GitGraphTitle)), "dsh-plugin-git-graph: tab title kind");
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.GitGraphView = GitGraphView;
    exports.GitGraphArtwork = GitGraphArtwork;
    exports.GitGraphTitle = GitGraphTitle;

    return module.exports;
  }
});
`;

if (!fs.existsSync('lib')) {
  fs.mkdirSync('lib', { recursive: true });
}

fs.writeFileSync('lib/client.js', clientBundle, 'utf8');
console.log('Successfully built lib/client.js (' + (clientBundle.length / 1024).toFixed(1) + ' KB)');
