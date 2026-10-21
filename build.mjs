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

const clientBundle = `// DeepSeek Harness ds-gitui Plugin - Client Bundle
(function() {
  function factory(require) {
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
      const STYLE_ID = 'ds-gitui-styles';
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

    const PLUGIN_ID = "ds-gitui";
    const TAB_KIND = "ds-gitui";

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
      try {
        if (!ctx.sidebarRightTabs?.ids?.has(PLUGIN_ID)) {
          ctx.effect(() => ctx.sidebarRightTabs.register({
            id: PLUGIN_ID,
            kind: TAB_KIND,
            title: () => "ds-gitui",
            guide: [{
              id: "open",
              order: 35,
              title: () => "ds-gitui",
              description: () => "在侧边栏可视化浏览与操作 Git 分支与提交图谱",
              icon: GitGraphArtwork
            }]
          }), "ds-gitui: sidebar tab");
        }
      } catch (err) {
        console.warn('[ds-gitui] sidebarRightTabs.register:', err);
      }

      // 2. 注册侧边栏 Tab 内容主体与标题 (支持 ds-gitui 及历史 key 兼容)
      ["ds-gitui", "git-graph", "dsh-plugin-git-graph"].forEach(key => {
        try {
          ctx.effect(() => ctx.slots.inject("sidebar.right.pane.tab", () => ctx.slots.register({
            name: "sidebar.right.pane.tab",
            key
          }, GitGraphView)), "ds-gitui: tab body " + key);

          ctx.effect(() => ctx.slots.inject("sidebar.right.pane.tab.title", () => ctx.slots.register({
            name: "sidebar.right.pane.tab.title",
            key
          }, GitGraphTitle)), "ds-gitui: tab title " + key);
        } catch (err) {
          console.warn('[ds-gitui] slots register:', err);
        }
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.GitGraphView = GitGraphView;
    exports.GitGraphArtwork = GitGraphArtwork;
    exports.GitGraphTitle = GitGraphTitle;

    return module.exports;
  }

  // Register in ModuleLoader with idempotent guards
  if (!window.__ds_gitui_registered__) {
    window.__ds_gitui_registered__ = true;
    try {
      window.__ModuleLoader__.load({ id: "ds-gitui", factory });
    } catch (e) {
      console.warn('[ds-gitui] ModuleLoader load ds-gitui:', e);
    }
  }

  if (!window.__dsh_plugin_git_graph_registered__) {
    window.__dsh_plugin_git_graph_registered__ = true;
    try {
      window.__ModuleLoader__.load({
        id: "dsh-plugin-git-graph",
        factory: function() {
          return {
            apply: function() {}
          };
        }
      });
    } catch (e) {
      console.warn('[ds-gitui] ModuleLoader load dsh-plugin-git-graph:', e);
    }
  }
})();
`;

if (!fs.existsSync('lib')) {
  fs.mkdirSync('lib', { recursive: true });
}

fs.writeFileSync('lib/client.js', clientBundle, 'utf8');
console.log('Successfully built lib/client.js (' + (clientBundle.length / 1024).toFixed(1) + ' KB)');
