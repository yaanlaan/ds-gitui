// DeepSeek Harness Git Graph Plugin - Client Bundle
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
    const GIT_GRAPH_STYLES = `
/* DeepSeek Harness Git Graph Plugin Styles */

.dsh-git-graph-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: var(--dsh-base, #131418);
  color: var(--dsh-fg-primary, #e2e8f0);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 13px;
  position: relative;
  user-select: none;
}

/* Toolbar */
.dsh-git-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--dsh-layer-1, rgba(255, 255, 255, 0.03));
  border-bottom: 1px solid var(--dsh-border, rgba(255, 255, 255, 0.08));
  flex-wrap: wrap;
  z-index: 10;
}

.dsh-git-toolbar-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dsh-git-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid var(--dsh-border, rgba(255, 255, 255, 0.12));
  background: var(--dsh-layer-2, rgba(255, 255, 255, 0.05));
  color: var(--dsh-fg-primary, #e2e8f0);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.dsh-git-btn:hover:not(:disabled) {
  background: var(--dsh-hover-bg, rgba(255, 255, 255, 0.1));
  border-color: var(--dsh-accent, #3b82f6);
  color: #fff;
}

.dsh-git-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.dsh-git-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dsh-git-btn-primary {
  background: var(--dsh-accent, #3b82f6);
  border-color: var(--dsh-accent, #3b82f6);
  color: #fff;
}

.dsh-git-btn-primary:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
}

.dsh-git-select, .dsh-git-input {
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 6px;
  border: 1px solid var(--dsh-border, rgba(255, 255, 255, 0.12));
  background: var(--dsh-layer-2, rgba(0, 0, 0, 0.25));
  color: var(--dsh-fg-primary, #e2e8f0);
  outline: none;
  transition: border-color 0.15s ease;
}

.dsh-git-select:focus, .dsh-git-input:focus {
  border-color: var(--dsh-accent, #3b82f6);
}

.dsh-git-search-box {
  flex: 1;
  min-width: 130px;
}

/* Branch & Status Badges */
.dsh-git-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 1px 6px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
  white-space: nowrap;
}

.dsh-badge-branch {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.4);
}

.dsh-badge-head {
  background: #3b82f6;
  color: #ffffff;
  font-weight: 600;
}

.dsh-badge-remote {
  background: rgba(147, 51, 234, 0.2);
  color: #c084fc;
  border: 1px solid rgba(147, 51, 234, 0.4);
}

.dsh-badge-tag {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.dsh-badge-uncommitted {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px dashed rgba(239, 68, 68, 0.5);
  font-weight: 600;
}

/* Working tree quick card */
.dsh-git-working-tree-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(245, 158, 11, 0.08);
  border-bottom: 1px solid rgba(245, 158, 11, 0.2);
  font-size: 12px;
}

.dsh-git-quick-commit {
  display: flex;
  gap: 6px;
  flex: 1;
  margin-left: 12px;
}

/* Main Commit List / Graph Table */
.dsh-git-main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.dsh-git-table-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  position: relative;
}

.dsh-git-commit-row {
  display: flex;
  align-items: center;
  height: 32px;
  min-width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: background-color 0.1s ease;
  font-size: 12px;
}

.dsh-git-commit-row:hover {
  background-color: var(--dsh-hover-bg, rgba(255, 255, 255, 0.06));
}

.dsh-git-commit-row.selected {
  background-color: rgba(59, 130, 246, 0.15) !important;
  border-left: 3px solid var(--dsh-accent, #3b82f6);
}

.dsh-git-commit-row.uncommitted-row {
  background-color: rgba(245, 158, 11, 0.05);
}

.dsh-git-col-graph {
  flex-shrink: 0;
  height: 32px;
  position: relative;
  overflow: visible;
}

.dsh-git-col-desc {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.dsh-git-col-hash {
  width: 75px;
  flex-shrink: 0;
  font-family: monospace;
  font-size: 11px;
  color: var(--dsh-fg-muted, #94a3b8);
  padding: 0 4px;
}

.dsh-git-col-author {
  width: 110px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--dsh-fg-secondary, #cbd5e1);
  padding: 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dsh-git-author-avatar {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
}

.dsh-git-col-date {
  width: 110px;
  flex-shrink: 0;
  color: var(--dsh-fg-muted, #94a3b8);
  padding: 0 8px;
  text-align: right;
  font-size: 11px;
}

/* Detail Drawer */
.dsh-git-drawer {
  height: 320px;
  min-height: 180px;
  max-height: 60%;
  background: var(--dsh-layer-1, #181920);
  border-top: 1px solid var(--dsh-border, rgba(255, 255, 255, 0.12));
  display: flex;
  flex-direction: column;
  z-index: 20;
}

.dsh-git-drawer-resizer {
  height: 4px;
  background: transparent;
  cursor: row-resize;
  transition: background 0.2s;
}

.dsh-git-drawer-resizer:hover {
  background: var(--dsh-accent, #3b82f6);
}

.dsh-git-drawer-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid var(--dsh-border, rgba(255, 255, 255, 0.08));
}

.dsh-git-drawer-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.dsh-git-file-list {
  width: 260px;
  border-right: 1px solid var(--dsh-border, rgba(255, 255, 255, 0.08));
  overflow-y: auto;
  padding: 4px 0;
}

.dsh-git-file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  margin: 1px 4px;
}

.dsh-git-file-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.dsh-git-file-item.selected {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.dsh-file-status-tag {
  font-size: 10px;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 6px;
  flex-shrink: 0;
}

.dsh-status-M { background: #3b82f6; color: #fff; }
.dsh-status-A { background: #10b981; color: #fff; }
.dsh-status-D { background: #ef4444; color: #fff; }
.dsh-status-U { background: #f59e0b; color: #fff; }

.dsh-git-diff-viewer {
  flex: 1;
  overflow: auto;
  background: #0d1117;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  line-height: 18px;
  padding: 8px;
  color: #c9d1d9;
}

.dsh-diff-line {
  white-space: pre-wrap;
  word-break: break-all;
  padding: 0 4px;
}

.dsh-diff-added {
  background-color: rgba(46, 160, 67, 0.2);
  color: #7ee787;
}

.dsh-diff-removed {
  background-color: rgba(248, 81, 73, 0.2);
  color: #ffa198;
}

.dsh-diff-header {
  color: #8b949e;
  font-weight: 600;
}

/* Context Menu */
.dsh-git-context-menu {
  position: fixed;
  z-index: 1000;
  background: #1e1f26;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  min-width: 180px;
}

.dsh-git-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  color: #e2e8f0;
}

.dsh-git-menu-item:hover {
  background: #3b82f6;
  color: #ffffff;
}

.dsh-git-menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 4px 0;
}

/* Modals */
.dsh-git-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.dsh-git-modal {
  width: 420px;
  background: #181920;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dsh-git-modal-title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}

.dsh-git-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

/* Toast */
.dsh-git-toast {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: #1e1f26;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  z-index: 2000;
  animation: dshFadeIn 0.2s ease-out;
}

@keyframes dshFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Loading & Empty States */
.dsh-git-center-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--dsh-fg-muted, #94a3b8);
  gap: 10px;
  text-align: center;
  padding: 20px;
}

.dsh-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: dshSpin 0.7s linear infinite;
}

@keyframes dshSpin {
  to { transform: rotate(360deg); }
}

.dsh-git-action-tag {
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--dsh-fg-secondary, #cbd5e1);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.dsh-git-action-tag:hover {
  background: var(--dsh-accent, #3b82f6);
  color: #fff;
  border-color: var(--dsh-accent, #3b82f6);
}
`;


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
    /**
 * DeepSeek Harness Git Graph Plugin - React View Component
 * Uses React.createElement (h) for zero-dependency native execution in Cordis/Electron/Browser
 */

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#f97316', // orange
  '#a855f7'  // violet
];

function formatRelativeDate(isoStr) {
  if (!isoStr) return '';
  const date = new Date(isoStr);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffSec < 60) return '刚刚';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} 分钟前`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} 小时前`;
  if (diffSec < 86400 * 30) return `${Math.floor(diffSec / 86400)} 天前`;
  return date.toLocaleDateString();
}

function computeGraphLayout(commits) {
  const lanes = [];
  const rows = [];
  const commitIndices = new Map();

  commits.forEach((c, idx) => {
    commitIndices.set(c.hash, idx);
  });

  for (let i = 0; i < commits.length; i++) {
    const commit = commits[i];
    let lane = lanes.indexOf(commit.hash);

    if (lane === -1) {
      const emptyIdx = lanes.indexOf(null);
      lane = emptyIdx !== -1 ? emptyIdx : lanes.length;
    }

    lanes[lane] = null;
    const passingLanesBefore = lanes.map((h, lIdx) => (h ? lIdx : null)).filter(x => x !== null);

    const parentConnections = [];
    if (commit.parents && commit.parents.length > 0) {
      commit.parents.forEach((parentHash, pIdx) => {
        let parentLane = lanes.indexOf(parentHash);
        if (parentLane === -1) {
          if (pIdx === 0 && lanes[lane] === null) {
            lanes[lane] = parentHash;
            parentLane = lane;
          } else {
            const emptyIdx = lanes.indexOf(null);
            if (emptyIdx !== -1) {
              lanes[emptyIdx] = parentHash;
              parentLane = emptyIdx;
            } else {
              parentLane = lanes.length;
              lanes.push(parentHash);
            }
          }
        }
        parentConnections.push({
          parentHash,
          parentLane,
          isFirst: pIdx === 0
        });
      });
    }

    rows.push({
      commit,
      lane,
      color: COLORS[lane % COLORS.length],
      parentConnections,
      passingLanesBefore
    });
  }

  const maxLane = Math.max(0, ...rows.map(r => r.lane), ...rows.flatMap(r => r.parentConnections.map(p => p.parentLane)));
  return { rows, maxLane };
}

function getActiveSessionCwd(sessionId) {
  if (typeof document === 'undefined') return '';
  try {
    const treeEl = document.querySelector('[role="tree"]') || document.querySelector('._9lTDKa_listArea');
    if (treeEl) {
      const key = Object.keys(treeEl).find(k => k.startsWith('__reactFiber$'));
      let fiber = treeEl[key];
      while (fiber) {
        const list = fiber.memoizedProps?.list;
        if (list && list.byId) {
          if (sessionId && list.byId[sessionId]?.cwd) {
            return list.byId[sessionId].cwd;
          }
          const sessionEl = document.querySelector('[data-sidebar-right-session]');
          const activeId = sessionEl?.dataset?.sidebarRightSession;
          if (activeId && list.byId[activeId]?.cwd) {
            return list.byId[activeId].cwd;
          }
          for (const s of Object.values(list.byId)) {
            if (s.cwd) return s.cwd;
          }
        }
        fiber = fiber.return;
      }
    }
  } catch (e) {}
  return '';
}

function createGitGraphComponent(React) {
  const h = React.createElement;
  const { useState, useEffect, useRef, useMemo, useCallback } = React;

  return function GitGraphView(props) {
    const [currentCwd, setCurrentCwd] = useState(() => props.cwd || getActiveSessionCwd(props.sessionId) || '');
    const [workspacesList, setWorkspacesList] = useState([]);
    const [repoOverview, setRepoOverview] = useState(null);
    const [commits, setCommits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCommit, setSelectedCommit] = useState(null);
    const [commitDetails, setCommitDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileDiff, setFileDiff] = useState(null);
    const [loadingDiff, setLoadingDiff] = useState(false);
    const [commitMessage, setCommitMessage] = useState('');
    const [committing, setCommitting] = useState(false);
    const [contextMenu, setContextMenu] = useState(null);
    const [modal, setModal] = useState(null);
    const [modalInput, setModalInput] = useState('');
    const [modalExtra, setModalExtra] = useState('');
    const [toast, setToast] = useState(null);
    const [stashes, setStashes] = useState([]);

    const showToast = useCallback((msg, duration = 3000) => {
      setToast(msg);
      setTimeout(() => setToast(null), duration);
    }, []);

    // Universal API call helper attaching cwd & sessionId
    const apiCall = useCallback(async (action, queryParams = {}, postData = null) => {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(queryParams)) {
        if (v !== undefined && v !== null) params.set(k, String(v));
      }
      const activeCwd = currentCwd || getActiveSessionCwd(props.sessionId);
      if (activeCwd) params.set('cwd', activeCwd);
      if (props.sessionId) params.set('sessionId', props.sessionId);

      const url = `/api/git-graph/${action}${params.toString() ? '?' + params.toString() : ''}`;
      const options = postData ? {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...postData, cwd: activeCwd, sessionId: props.sessionId })
      } : {};

      const res = await fetch(url, options);
      return await res.json();
    }, [currentCwd, props.sessionId]);

    // Initial CWD sync
    useEffect(() => {
      if (!currentCwd) {
        const detected = getActiveSessionCwd(props.sessionId);
        if (detected) setCurrentCwd(detected);
      }
    }, [props.sessionId, currentCwd]);

    // Load available workspaces
    useEffect(() => {
      let isMounted = true;
      (async () => {
        try {
          const res = await fetch('/api/git-graph/workspaces');
          const json = await res.json();
          if (isMounted && json.success && Array.isArray(json.workspaces)) {
            setWorkspacesList(json.workspaces);
            if (!currentCwd && json.currentCwd) {
              setCurrentCwd(json.currentCwd);
            }
          }
        } catch (e) {}
      })();
      return () => { isMounted = false; };
    }, [currentCwd]);

    // Load repository overview and commits log
    const loadRepoData = useCallback(async (branch = selectedBranch) => {
      setLoading(true);
      setError(null);
      try {
        const overviewJson = await apiCall('overview');
        if (!overviewJson.success || !overviewJson.data?.isRepo) {
          setError('当前工作区不是一个 Git 仓库 (Not a Git repository)');
          setRepoOverview(null);
          setCommits([]);
          setLoading(false);
          return;
        }
        setRepoOverview(overviewJson.data);

        const logJson = await apiCall('log', { branch, maxCount: 300 });
        if (logJson.success) {
          setCommits(logJson.commits || []);
        } else {
          setError(logJson.error || '获取 Git 提交记录失败');
        }

        // Fetch stashes list
        try {
          const stashJson = await apiCall('stash-list');
          if (stashJson.success) setStashes(stashJson.stashes || []);
        } catch (e) {}
      } catch (err) {
        setError('无法连接到 Git 服务端: ' + err.message);
      } finally {
        setLoading(false);
      }
    }, [apiCall, selectedBranch]);

    useEffect(() => {
      loadRepoData();
    }, [loadRepoData]);

    const handleSelectFile = useCallback(async (hash, filePath) => {
      setSelectedFile(filePath);
      setLoadingDiff(true);
      try {
        const json = await apiCall('diff', { hash, file: filePath });
        if (json.success) {
          setFileDiff(json.diff);
        } else {
          setFileDiff('无法加载 Diff: ' + (json.error || '未知错误'));
        }
      } catch (err) {
        setFileDiff('加载 Diff 异常: ' + err.message);
      } finally {
        setLoadingDiff(false);
      }
    }, [apiCall]);

    const handleSelectCommit = useCallback(async (commit) => {
      setSelectedCommit(commit);
      setSelectedFile(null);
      setFileDiff(null);
      setLoadingDetails(true);

      if (commit.hash === '*uncommitted*' || commit.isUncommitted) {
        try {
          const overviewJson = await apiCall('overview');
          let uncommittedFiles = overviewJson?.data?.files || [];
          if (uncommittedFiles.length === 0 && overviewJson?.data?.status?.dirty) {
            try {
              const headDetails = await apiCall('commit-details', { hash: 'HEAD' });
              if (headDetails?.details?.files) {
                uncommittedFiles = headDetails.details.files.map(f => ({ ...f, staged: false }));
              }
            } catch (e) {}
          }
          const details = {
            hash: '*uncommitted*',
            shortHash: '*uncomm*',
            subject: '未提交的修改 (Uncommitted changes)',
            body: '工作区或暂存区中尚未提交的文件改动',
            author: 'You',
            email: '',
            date: '刚刚',
            parents: [],
            files: uncommittedFiles.map(f => ({
              path: f.path,
              status: f.status,
              staged: f.staged,
              additions: 0,
              deletions: 0
            }))
          };
          setCommitDetails(details);
          if (details.files.length > 0) {
            handleSelectFile('*uncommitted*', details.files[0].path);
          }
        } catch (err) {
          showToast('获取未提交详情失败: ' + err.message);
        } finally {
          setLoadingDetails(false);
        }
        return;
      }

      try {
        const json = await apiCall('commit-details', { hash: commit.hash });
        if (json.success && json.details) {
          setCommitDetails(json.details);
          if (json.details.files?.length > 0) {
            handleSelectFile(commit.hash, json.details.files[0].path);
          }
        }
      } catch (err) {
        showToast('获取提交详情失败: ' + err.message);
      } finally {
        setLoadingDetails(false);
      }
    }, [apiCall, handleSelectFile, showToast]);

    const handleCheckout = async (target) => {
      try {
        const json = await apiCall('checkout', {}, { target });
        if (json.success) {
          showToast(`已成功检出至: ${target}`);
          loadRepoData();
        } else {
          showToast('检出失败: ' + (json.error || '未知错误'));
        }
      } catch (e) {
        showToast('操作失败: ' + e.message);
      }
    };

    const handleCreateBranch = async () => {
      if (!modalInput.trim()) return;
      try {
        const json = await apiCall('create-branch', {}, {
          branchName: modalInput.trim(),
          startPoint: modal.targetCommit
        });
        if (json.success) {
          showToast(`分支 "${modalInput}" 创建成功`);
          setModal(null);
          loadRepoData();
        } else {
          showToast('创建分支失败: ' + json.error);
        }
      } catch (e) {
        showToast('操作失败: ' + e.message);
      }
    };

    const handleCreateTag = async () => {
      if (!modalInput.trim()) return;
      try {
        const json = await apiCall('create-tag', {}, {
          tagName: modalInput.trim(),
          commitHash: modal.targetCommit,
          message: modalExtra.trim()
        });
        if (json.success) {
          showToast(`标签 "${modalInput}" 创建成功`);
          setModal(null);
          loadRepoData();
        } else {
          showToast('创建标签失败: ' + json.error);
        }
      } catch (e) {
        showToast('操作失败: ' + e.message);
      }
    };

    const handleMerge = async (branchName) => {
      try {
        const json = await apiCall('merge', {}, { branchName });
        if (json.success) {
          showToast(`已成功合并分支 "${branchName}" 到当前分支`);
          loadRepoData();
        } else {
          showToast('合并失败: ' + (json.error || '冲突或错误'));
        }
      } catch (e) {
        showToast('合并异常: ' + e.message);
      }
    };

    const handleDeleteBranch = async (branchName, force = false) => {
      if (!window.confirm(`确定要删除分支 "${branchName}" 吗？`)) return;
      try {
        const json = await apiCall('delete-branch', {}, { branchName, force });
        if (json.success) {
          showToast(`已成功删除分支: ${branchName}`);
          loadRepoData();
        } else {
          showToast('删除分支失败: ' + (json.error || '未知错误'));
        }
      } catch (e) {
        showToast('操作失败: ' + e.message);
      }
    };

    const handleReset = async (mode) => {
      try {
        const json = await apiCall('reset', {}, { hash: modal.targetCommit, mode });
        if (json.success) {
          showToast(`已 Reset 到提交: ${modal.targetCommit.slice(0, 7)}`);
          setModal(null);
          loadRepoData();
        } else {
          showToast('Reset 失败: ' + json.error);
        }
      } catch (e) {
        showToast('操作失败: ' + e.message);
      }
    };

    const handleCherryPick = async (commitHash) => {
      try {
        const json = await apiCall('cherry-pick', {}, { commitHash });
        if (json.success) {
          showToast(`Cherry-pick 成功: ${commitHash.slice(0, 7)}`);
          loadRepoData();
        } else {
          showToast('Cherry-pick 失败: ' + json.error);
        }
      } catch (e) {
        showToast('Cherry-pick 异常: ' + e.message);
      }
    };

    const handleRevert = async (commitHash) => {
      try {
        const json = await apiCall('revert', {}, { commitHash });
        if (json.success) {
          showToast(`Revert 成功: ${commitHash.slice(0, 7)}`);
          loadRepoData();
        } else {
          showToast('Revert 失败: ' + json.error);
        }
      } catch (e) {
        showToast('Revert 异常: ' + e.message);
      }
    };

    const handleQuickCommit = async () => {
      if (!commitMessage.trim()) return;
      setCommitting(true);
      try {
        await apiCall('stage', {}, { files: ['.'] });
        const json = await apiCall('commit', {}, { message: commitMessage.trim() });
        if (json.success) {
          showToast('提交成功！');
          setCommitMessage('');
          loadRepoData();
        } else {
          showToast('提交失败: ' + json.error);
        }
      } catch (e) {
        showToast('提交异常: ' + e.message);
      } finally {
        setCommitting(false);
      }
    };

    const handleStageToggle = async (filePath, isStaged) => {
      try {
        const action = isStaged ? 'unstage' : 'stage';
        const json = await apiCall(action, {}, { files: [filePath] });
        if (json.success) {
          showToast(isStaged ? `已取消暂存: ${filePath}` : `已暂存: ${filePath}`);
          if (selectedCommit?.isUncommitted) {
            handleSelectCommit(selectedCommit);
          }
          loadRepoData();
        } else {
          showToast('操作失败: ' + json.error);
        }
      } catch (e) {
        showToast('异常: ' + e.message);
      }
    };

    const handleStageAll = async () => {
      try {
        const json = await apiCall('stage', {}, { files: ['.'] });
        if (json.success) {
          showToast('已暂存所有修改');
          loadRepoData();
        }
      } catch (e) {
        showToast('暂存失败: ' + e.message);
      }
    };

    const handleUnstageAll = async () => {
      try {
        const json = await apiCall('unstage', {}, { files: ['.'] });
        if (json.success) {
          showToast('已取消暂存所有修改');
          loadRepoData();
        }
      } catch (e) {
        showToast('取消暂存失败: ' + e.message);
      }
    };

    const handleStashSave = async () => {
      try {
        const json = await apiCall('stash-save', {}, { message: modalInput.trim() || undefined });
        if (json.success) {
          showToast('已成功暂存工作区改动 (Stash Saved)');
          setModal(null);
          loadRepoData();
        } else {
          showToast('Stash 失败: ' + json.error);
        }
      } catch (e) {
        showToast('Stash 异常: ' + e.message);
      }
    };

    const handleStashPop = async (index = 0) => {
      try {
        const json = await apiCall('stash-pop', {}, { index });
        if (json.success) {
          showToast('已成功应用并恢复 Stash 暂存');
          loadRepoData();
        } else {
          showToast('Stash Pop 失败: ' + json.error);
        }
      } catch (e) {
        showToast('Stash Pop 异常: ' + e.message);
      }
    };

    const handleFetch = async () => {
      showToast('正在从远程拉取分支与 Tag 信息 (Fetching)...');
      try {
        const json = await apiCall('fetch', {}, {});
        if (json.success) {
          showToast('Fetch 完成！');
          loadRepoData();
        } else {
          showToast('Fetch 失败: ' + json.error);
        }
      } catch (e) {
        showToast('Fetch 异常: ' + e.message);
      }
    };

    const handlePull = async () => {
      showToast('正在拉取并合并远程变更 (Pulling)...');
      try {
        const json = await apiCall('pull', {}, {});
        if (json.success) {
          showToast('Pull 完成！已是最新代码');
          loadRepoData();
        } else {
          showToast('Pull 失败: ' + json.error);
        }
      } catch (e) {
        showToast('Pull 异常: ' + e.message);
      }
    };

    const handlePush = async () => {
      showToast('正在推送到远程仓库 (Pushing)...');
      try {
        const json = await apiCall('push', {}, {});
        if (json.success) {
          showToast('Push 成功！');
          loadRepoData();
        } else {
          showToast('Push 失败: ' + json.error);
        }
      } catch (e) {
        showToast('Push 异常: ' + e.message);
      }
    };

    const filteredCommits = useMemo(() => {
      if (!searchQuery.trim()) return commits;
      const q = searchQuery.toLowerCase();
      return commits.filter(c =>
        c.subject.toLowerCase().includes(q) ||
        c.author.toLowerCase().includes(q) ||
        c.hash.toLowerCase().includes(q) ||
        c.refs.some(r => r.name.toLowerCase().includes(q))
      );
    }, [commits, searchQuery]);

    const graphData = useMemo(() => computeGraphLayout(filteredCommits), [filteredCommits]);

    const handleContextMenu = (e, commit) => {
      e.preventDefault();
      setContextMenu({
        x: Math.min(e.clientX, window.innerWidth - 220),
        y: Math.min(e.clientY, window.innerHeight - 280),
        commit
      });
    };

    useEffect(() => {
      const closeMenu = () => setContextMenu(null);
      window.addEventListener('click', closeMenu);
      return () => window.removeEventListener('click', closeMenu);
    }, []);

    // Working directory basename for toolbar display
    const cwdDisplayName = useMemo(() => {
      if (!currentCwd) return '未选工作区';
      const parts = currentCwd.replace(/\\/g, '/').split('/').filter(Boolean);
      return parts[parts.length - 1] || currentCwd;
    }, [currentCwd]);

    if (loading && !repoOverview && commits.length === 0) {
      return h('div', { className: 'dsh-git-graph-container' },
        h('div', { className: 'dsh-git-center-msg' },
          h('div', { className: 'dsh-spinner' }),
          h('span', null, '正在分析 Git 仓库图谱...')
        )
      );
    }

    if (error && !repoOverview) {
      return h('div', { className: 'dsh-git-graph-container' },
        // Top Toolbar with workspace switcher even when error
        h('div', { className: 'dsh-git-toolbar' },
          h('div', { className: 'dsh-git-toolbar-group' },
            h('span', { style: { fontWeight: 600, fontSize: 12, color: '#94a3b8' } }, '工作区:'),
            h('select', {
              className: 'dsh-git-select',
              value: currentCwd,
              onChange: (e) => {
                setCurrentCwd(e.target.value);
                setSelectedCommit(null);
              }
            },
              workspacesList.map(ws =>
                h('option', { key: ws.id, value: ws.path }, `${ws.title || ws.path}`)
              )
            ),
            h('button', { className: 'dsh-git-btn', onClick: () => loadRepoData() }, '重新检查')
          )
        ),
        h('div', { className: 'dsh-git-center-msg' },
          h('svg', { width: 40, height: 40, viewBox: '0 0 24 24', fill: 'none', stroke: '#ef4444', strokeWidth: 2 },
            h('circle', { cx: 12, cy: 12, r: 10 }),
            h('line', { x1: 12, y1: 8, x2: 12, y2: 12 }),
            h('line', { x1: 12, y1: 16, x2: 12.01, y2: 16 })
          ),
          h('div', { style: { fontWeight: 600, color: '#f87171' } }, error),
          h('div', { style: { fontSize: 12, color: '#94a3b8', maxWidth: 360 } },
            `路径: ${currentCwd || '未指定'}`
          ),
          h('button', { className: 'dsh-git-btn dsh-git-btn-primary', onClick: () => loadRepoData() }, '重试检查')
        )
      );
    }

    const laneWidth = 16;
    const svgWidth = Math.max(60, (graphData.maxLane + 1) * laneWidth + 16);

    return h('div', { className: 'dsh-git-graph-container' },
      // 1. Top Toolbar
      h('div', { className: 'dsh-git-toolbar' },
        // Workspace Selector
        h('div', { className: 'dsh-git-toolbar-group' },
          h('span', { title: currentCwd, style: { display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 12 } },
            h('svg', {
              width: 14,
              height: 14,
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: 2,
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              style: { flexShrink: 0, opacity: 0.85 }
            },
              h('path', { d: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z' })
            ),
            workspacesList.length > 0
              ? h('select', {
                  className: 'dsh-git-select',
                  style: { maxWidth: 140, fontWeight: 600 },
                  value: currentCwd,
                  title: currentCwd,
                  onChange: (e) => {
                    setCurrentCwd(e.target.value);
                    setSelectedCommit(null);
                  }
                },
                  workspacesList.map(ws =>
                    h('option', { key: ws.id, value: ws.path }, ws.title || ws.path)
                  )
                )
              : h('span', { style: { color: '#60a5fa' } }, cwdDisplayName)
          )
        ),

        // Branch Filter
        h('div', { className: 'dsh-git-toolbar-group' },
          h('select', {
            className: 'dsh-git-select',
            value: selectedBranch,
            onChange: (e) => {
              setSelectedBranch(e.target.value);
              loadRepoData(e.target.value);
            }
          },
            h('option', { value: 'ALL' }, '所有分支 (All Branches)'),
            repoOverview?.branches?.map(b =>
              h('option', { key: b.name, value: b.name }, b.isHead ? `* ${b.name}` : b.name)
            )
          )
        ),

        // Action Buttons
        h('div', { className: 'dsh-git-toolbar-group' },
          h('button', { className: 'dsh-git-btn', onClick: () => loadRepoData(), title: '刷新提交图谱' },
            h('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
              h('path', { d: 'M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2' })
            ),
            '刷新'
          ),
          h('button', {
            className: 'dsh-git-btn',
            title: '创建新分支',
            onClick: () => {
              setModal({ type: 'createBranch', targetCommit: repoOverview?.currentBranch || 'HEAD' });
              setModalInput('');
            }
          }, '+ 分支'),
          h('button', {
            className: 'dsh-git-btn',
            title: 'Stash 暂存当前未提交修改',
            onClick: () => {
              setModal({ type: 'stashSave' });
              setModalInput('');
            }
          }, 'Stash'),
          stashes.length > 0 && h('button', {
            className: 'dsh-git-btn',
            title: `恢复最近 Stash 暂存 (${stashes.length} 个可用)`,
            onClick: () => handleStashPop(0)
          }, `Pop (${stashes.length})`),
          h('button', { className: 'dsh-git-btn', onClick: handleFetch, title: 'Fetch 远程仓库' }, 'Fetch'),
          h('button', { className: 'dsh-git-btn', onClick: handlePull, title: 'Pull 拉取并合并' }, 'Pull'),
          h('button', { className: 'dsh-git-btn', onClick: handlePush, title: 'Push 推送到远程' }, 'Push')
        ),

        // Current HEAD badge
        h('div', { className: 'dsh-git-toolbar-group' },
          h('span', { className: 'dsh-git-badge dsh-badge-head', title: `当前分支: ${repoOverview?.currentBranch}` },
            `HEAD: ${repoOverview?.currentBranch || 'unknown'}`
          )
        ),

        // Search Filter
        h('div', { className: 'dsh-git-search-box' },
          h('input', {
            type: 'text',
            className: 'dsh-git-input',
            style: { width: '100%' },
            placeholder: '搜索提交、作者或 SHA...',
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value)
          })
        )
      ),

      // 2. Working Tree Changes Bar
      repoOverview?.status?.dirty && h('div', { className: 'dsh-git-working-tree-bar' },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          h('span', { style: { fontWeight: 600, color: '#f59e0b' } }, '未提交改动:'),
          h('span', null,
            repoOverview.status.stagedCount > 0 && `已暂存: ${repoOverview.status.stagedCount} `,
            repoOverview.status.unstagedCount > 0 && `未暂存: ${repoOverview.status.unstagedCount} `,
            repoOverview.status.untrackedCount > 0 && `未跟踪: ${repoOverview.status.untrackedCount}`
          ),
          h('button', { className: 'dsh-git-action-tag', onClick: handleStageAll }, '暂存全部'),
          repoOverview.status.stagedCount > 0 && h('button', { className: 'dsh-git-action-tag', onClick: handleUnstageAll }, '取消暂存')
        ),
        h('div', { className: 'dsh-git-quick-commit' },
          h('input', {
            type: 'text',
            className: 'dsh-git-input',
            style: { flex: 1 },
            placeholder: '输入提交信息进行一键提交...',
            value: commitMessage,
            onChange: (e) => setCommitMessage(e.target.value),
            onKeyDown: (e) => e.key === 'Enter' && handleQuickCommit()
          }),
          h('button', {
            className: 'dsh-git-btn dsh-git-btn-primary',
            disabled: committing || !commitMessage.trim(),
            onClick: handleQuickCommit
          }, committing ? '提交中...' : '提交全部')
        )
      ),

      // 3. Main Commit Table & Graph
      h('div', { className: 'dsh-git-main-area' },
        h('div', { className: 'dsh-git-table-container' },
          graphData.rows.length === 0
            ? h('div', { className: 'dsh-git-center-msg' }, '暂无匹配的 Git 提交记录')
            : graphData.rows.map((row, idx) => {
                const { commit, lane, color, parentConnections, passingLanesBefore } = row;
                const isSelected = selectedCommit?.hash === commit.hash;
                const dotX = lane * laneWidth + 10;
                const dotY = 16;

                return h('div', {
                  key: commit.hash + idx,
                  className: `dsh-git-commit-row ${isSelected ? 'selected' : ''} ${commit.isUncommitted ? 'uncommitted-row' : ''}`,
                  onClick: () => handleSelectCommit(commit),
                  onContextMenu: (e) => handleContextMenu(e, commit)
                },
                  // Visual SVG Subway Graph Cell
                  h('div', { className: 'dsh-git-col-graph', style: { width: svgWidth } },
                    h('svg', { width: svgWidth, height: 32, style: { display: 'block' } },
                      passingLanesBefore.map(lIdx => {
                        if (lIdx === lane) return null;
                        const px = lIdx * laneWidth + 10;
                        const pColor = COLORS[lIdx % COLORS.length];
                        return h('line', {
                          key: `pass-${lIdx}`,
                          x1: px,
                          y1: 0,
                          x2: px,
                          y2: 32,
                          stroke: pColor,
                          strokeWidth: 2,
                          strokeOpacity: 0.75
                        });
                      }),
                      parentConnections.map((pc, pIdx) => {
                        const targetX = pc.parentLane * laneWidth + 10;
                        const targetY = 32;
                        const pColor = COLORS[pc.parentLane % COLORS.length];
                        if (pc.parentLane === lane) {
                          return h('line', {
                            key: `p-${pIdx}`,
                            x1: dotX,
                            y1: dotY,
                            x2: dotX,
                            y2: 32,
                            stroke: color,
                            strokeWidth: 2
                          });
                        }
                        const d = `M ${dotX} ${dotY} C ${dotX} ${dotY + 10}, ${targetX} ${targetY - 10}, ${targetX} ${targetY}`;
                        return h('path', {
                          key: `p-${pIdx}`,
                          d,
                          fill: 'none',
                          stroke: pc.isFirst ? color : pColor,
                          strokeWidth: 2
                        });
                      }),
                      commit.isUncommitted
                        ? h('circle', {
                            cx: dotX,
                            cy: dotY,
                            r: 5,
                            fill: 'none',
                            stroke: '#f59e0b',
                            strokeWidth: 2,
                            strokeDasharray: '2,2'
                          })
                        : [
                            commit.isHead && h('circle', {
                              key: 'head-ring',
                              cx: dotX,
                              cy: dotY,
                              r: 8,
                              fill: 'none',
                              stroke: color,
                              strokeWidth: 1.5,
                              strokeOpacity: 0.5
                            }),
                            h('circle', {
                              key: 'node-dot',
                              cx: dotX,
                              cy: dotY,
                              r: commit.isHead ? 5 : 4,
                              fill: color,
                              stroke: '#181920',
                              strokeWidth: 2
                            })
                          ]
                    )
                  ),

                  // Commit Description & Badges
                  h('div', { className: 'dsh-git-col-desc' },
                    commit.refs.map((ref, rIdx) => {
                      if (ref.type === 'head') {
                        return h('span', { key: rIdx, className: 'dsh-git-badge dsh-badge-head' }, 'HEAD');
                      }
                      if (ref.type === 'branch' || ref.type === 'remote') {
                        const isRemote = ref.type === 'remote';
                        return h('span', {
                          key: rIdx,
                          className: `dsh-git-badge ${isRemote ? 'dsh-badge-remote' : 'dsh-badge-branch'}`,
                          title: `双击检出此分支 (${ref.name})`,
                          onDoubleClick: (e) => {
                            e.stopPropagation();
                            handleCheckout(ref.name);
                          }
                        },
                          h('svg', { width: 10, height: 10, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5 },
                            h('line', { x1: 6, y1: 3, x2: 6, y2: 15 }),
                            h('circle', { cx: 18, cy: 6, r: 3 }),
                            h('circle', { cx: 6, cy: 18, r: 3 }),
                            h('path', { d: 'M18 9a9 9 0 0 1-9 9' })
                          ),
                          ref.name
                        );
                      }
                      if (ref.type === 'tag') {
                        return h('span', { key: rIdx, className: 'dsh-git-badge dsh-badge-tag' },
                          h('svg', {
                            width: 10,
                            height: 10,
                            viewBox: '0 0 24 24',
                            fill: 'none',
                            stroke: 'currentColor',
                            strokeWidth: 2.2,
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round'
                          },
                            h('path', { d: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z' }),
                            h('line', { x1: 7, y1: 7, x2: 7.01, y2: 7 })
                          ),
                          ref.name
                        );
                      }
                      if (ref.type === 'uncommitted') {
                        return h('span', { key: rIdx, className: 'dsh-git-badge dsh-badge-uncommitted' }, '* 工作区未提交');
                      }
                      return null;
                    }),
                    h('span', {
                      style: {
                        fontWeight: commit.isHead ? 600 : 400,
                        color: commit.isUncommitted ? '#f59e0b' : 'inherit'
                      }
                    }, commit.subject)
                  ),

                  // Short Hash
                  h('div', {
                    className: 'dsh-git-col-hash',
                    title: '点击复制完整 SHA',
                    onClick: (e) => {
                      e.stopPropagation();
                      if (!commit.isUncommitted) {
                        navigator.clipboard?.writeText(commit.hash);
                        showToast(`已复制: ${commit.hash}`);
                      }
                    }
                  }, commit.shortHash),

                  // Author
                  h('div', { className: 'dsh-git-col-author' },
                    h('span', { className: 'dsh-git-author-avatar' },
                      commit.author ? commit.author.charAt(0).toUpperCase() : '?'
                    ),
                    h('span', null, commit.author)
                  ),

                  // Date
                  h('div', { className: 'dsh-git-col-date', title: commit.date }, formatRelativeDate(commit.date))
                );
              })
        ),

        // 4. Commit Details & File Diff Drawer
        selectedCommit && h('div', { className: 'dsh-git-drawer' },
          h('div', { className: 'dsh-git-drawer-resizer' }),
          h('div', { className: 'dsh-git-drawer-header' },
            h('div', { style: { flex: 1, overflow: 'hidden' } },
              h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 } },
                h('span', { style: { fontWeight: 600, fontSize: 13, color: '#fff' } },
                  commitDetails?.subject || selectedCommit.subject
                ),
                h('span', {
                  className: 'dsh-git-col-hash',
                  style: { background: 'rgba(255,255,255,0.08)', borderRadius: 4, padding: '2px 6px' }
                }, selectedCommit.shortHash)
              ),
              h('div', { style: { fontSize: 11, color: '#94a3b8', display: 'flex', gap: 12 } },
                h('span', null, `作者: ${commitDetails?.author || selectedCommit.author} <${commitDetails?.email || ''}>`),
                h('span', null, `时间: ${commitDetails?.date || selectedCommit.date}`)
              )
            ),
            h('button', {
              className: 'dsh-git-btn',
              style: { padding: '2px 8px' },
              onClick: () => setSelectedCommit(null)
            }, '关闭')
          ),

          h('div', { className: 'dsh-git-drawer-body' },
            // File List
            h('div', { className: 'dsh-git-file-list' },
              h('div', {
                style: { padding: '6px 10px', fontSize: 11, fontWeight: 600, color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.06)' }
              }, `变更文件 (${commitDetails?.files?.length || 0})`),
              loadingDetails
                ? h('div', { style: { padding: 12, textAlign: 'center', color: '#94a3b8' } }, '正在加载文件列表...')
                : commitDetails?.files?.map(file =>
                    h('div', {
                      key: file.path,
                      className: `dsh-git-file-item ${selectedFile === file.path ? 'selected' : ''}`,
                      onClick: () => handleSelectFile(selectedCommit.hash, file.path),
                      title: file.path
                    },
                      h('div', { style: { display: 'flex', alignItems: 'center', overflow: 'hidden', flex: 1 } },
                        h('span', { className: `dsh-file-status-tag dsh-status-${file.status.charAt(0).toUpperCase()}` },
                          file.status.charAt(0).toUpperCase()
                        ),
                        h('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, file.path)
                      ),
                      h('div', { style: { display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, marginLeft: 6 } },
                        selectedCommit.isUncommitted && h('button', {
                          className: 'dsh-git-action-tag',
                          onClick: (e) => {
                            e.stopPropagation();
                            handleStageToggle(file.path, file.staged);
                          }
                        }, file.staged ? '取消暂存' : '暂存'),
                        file.additions > 0 && h('span', { style: { color: '#10b981', fontSize: 10 } }, `+${file.additions}`),
                        file.deletions > 0 && h('span', { style: { color: '#ef4444', fontSize: 10 } }, `-${file.deletions}`)
                      )
                    )
                  )
            ),

            // Diff Viewer
            h('div', { className: 'dsh-git-diff-viewer' },
              loadingDiff
                ? h('div', { style: { padding: 20, textAlign: 'center', color: '#94a3b8' } }, '正在生成代码差异...')
                : !fileDiff
                  ? h('div', { style: { padding: 20, textAlign: 'center', color: '#94a3b8' } }, '点击左侧文件查看代码改动差异')
                  : fileDiff.split('\n').map((line, lIdx) => {
                      let className = 'dsh-diff-line';
                      if (line.startsWith('+') && !line.startsWith('+++')) className += ' dsh-diff-added';
                      else if (line.startsWith('-') && !line.startsWith('---')) className += ' dsh-diff-removed';
                      else if (line.startsWith('@@') || line.startsWith('diff --git')) className += ' dsh-diff-header';

                      return h('div', { key: lIdx, className }, line || ' ');
                    })
            )
          )
        )
      ),

      // 5. Context Menu
      contextMenu && h('div', {
        className: 'dsh-git-context-menu',
        style: { left: contextMenu.x, top: contextMenu.y },
        onClick: (e) => e.stopPropagation()
      },
        contextMenu.commit.isUncommitted ? [
          h('div', {
            key: 'stage-all',
            className: 'dsh-git-menu-item',
            onClick: () => {
              handleStageAll();
              setContextMenu(null);
            }
          }, '暂存所有更改 (Stage All)'),
          h('div', {
            key: 'unstage-all',
            className: 'dsh-git-menu-item',
            onClick: () => {
              handleUnstageAll();
              setContextMenu(null);
            }
          }, '取消暂存所有更改 (Unstage All)'),
          h('div', { key: 'div1', className: 'dsh-git-menu-divider' }),
          h('div', {
            key: 'stash',
            className: 'dsh-git-menu-item',
            onClick: () => {
              setModal({ type: 'stashSave' });
              setModalInput('');
              setContextMenu(null);
            }
          }, '存入临时储藏 (Stash Changes)...')
        ] : [
          h('div', {
            key: 'checkout',
            className: 'dsh-git-menu-item',
            onClick: () => {
              handleCheckout(contextMenu.commit.hash);
              setContextMenu(null);
            }
          }, '检出此提交 (Checkout Commit)'),
          h('div', {
            key: 'create-branch',
            className: 'dsh-git-menu-item',
            onClick: () => {
              setModal({ type: 'createBranch', targetCommit: contextMenu.commit.hash });
              setModalInput('');
              setContextMenu(null);
            }
          }, '在此提交创建分支 (Create Branch)...'),
          h('div', {
            key: 'create-tag',
            className: 'dsh-git-menu-item',
            onClick: () => {
              setModal({ type: 'createTag', targetCommit: contextMenu.commit.hash });
              setModalInput('');
              setModalExtra('');
              setContextMenu(null);
            }
          }, '在此提交添加标签 (Create Tag)...'),
          ...(contextMenu.commit.refs?.filter(r => r.type === 'branch' && !r.isHead) || []).map(b => [
            h('div', { key: `div-b-${b.name}`, className: 'dsh-git-menu-divider' }),
            h('div', {
              key: `checkout-b-${b.name}`,
              className: 'dsh-git-menu-item',
              onClick: () => {
                handleCheckout(b.name);
                setContextMenu(null);
              }
            }, `检出分支 "${b.name}"`),
            h('div', {
              key: `merge-b-${b.name}`,
              className: 'dsh-git-menu-item',
              onClick: () => {
                handleMerge(b.name);
                setContextMenu(null);
              }
            }, `合并分支 "${b.name}" 到当前分支`),
            h('div', {
              key: `del-b-${b.name}`,
              className: 'dsh-git-menu-item',
              style: { color: '#ef4444' },
              onClick: () => {
                handleDeleteBranch(b.name);
                setContextMenu(null);
              }
            }, `删除分支 "${b.name}"`)
          ]).flat(),
          h('div', { key: 'div2', className: 'dsh-git-menu-divider' }),
          h('div', {
            key: 'cherry-pick',
            className: 'dsh-git-menu-item',
            onClick: () => {
              handleCherryPick(contextMenu.commit.hash);
              setContextMenu(null);
            }
          }, '采撷此提交 (Cherry-pick)'),
          h('div', {
            key: 'revert',
            className: 'dsh-git-menu-item',
            onClick: () => {
              handleRevert(contextMenu.commit.hash);
              setContextMenu(null);
            }
          }, '还原此提交 (Revert)'),
          h('div', { key: 'div3', className: 'dsh-git-menu-divider' }),
          h('div', {
            key: 'copy-sha',
            className: 'dsh-git-menu-item',
            onClick: () => {
              navigator.clipboard?.writeText(contextMenu.commit.hash);
              showToast('已复制完整 SHA: ' + contextMenu.commit.hash);
              setContextMenu(null);
            }
          }, '复制完整 SHA 散列值'),
          h('div', {
            key: 'copy-subject',
            className: 'dsh-git-menu-item',
            onClick: () => {
              navigator.clipboard?.writeText(contextMenu.commit.subject);
              showToast('已复制提交信息');
              setContextMenu(null);
            }
          }, '复制提交信息 (Commit Subject)'),
          h('div', { key: 'div4', className: 'dsh-git-menu-divider' }),
          h('div', {
            key: 'reset',
            className: 'dsh-git-menu-item',
            onClick: () => {
              setModal({ type: 'reset', targetCommit: contextMenu.commit.hash });
              setContextMenu(null);
            }
          }, 'Reset 当前分支到此提交...')
        ]
      ),

      // 6. Modals
      modal && h('div', { className: 'dsh-git-modal-overlay', onClick: () => setModal(null) },
        h('div', { className: 'dsh-git-modal', onClick: (e) => e.stopPropagation() },
          modal.type === 'createBranch' && [
            h('div', { key: 't', className: 'dsh-git-modal-title' }, '基于提交创建新分支'),
            h('div', { key: 'st', style: { fontSize: 12, color: '#94a3b8' } }, `目标提交: ${modal.targetCommit?.slice(0, 7) || modal.targetCommit}`),
            h('input', {
              key: 'inp',
              type: 'text',
              className: 'dsh-git-input',
              placeholder: '输入新分支名称 (如 feature/my-work)',
              value: modalInput,
              onChange: (e) => setModalInput(e.target.value),
              onKeyDown: (e) => { if (e.key === 'Enter') handleCreateBranch(); },
              autoFocus: true
            }),
            h('div', { key: 'act', className: 'dsh-git-modal-actions' },
              h('button', { className: 'dsh-git-btn', onClick: () => setModal(null) }, '取消'),
              h('button', { className: 'dsh-git-btn dsh-git-btn-primary', onClick: handleCreateBranch }, '创建分支')
            )
          ],
          modal.type === 'createTag' && [
            h('div', { key: 't', className: 'dsh-git-modal-title' }, '创建 Git 标签 (Tag)'),
            h('div', { key: 'st', style: { fontSize: 12, color: '#94a3b8' } }, `目标提交: ${modal.targetCommit?.slice(0, 7) || modal.targetCommit}`),
            h('input', {
              key: 'inp1',
              type: 'text',
              className: 'dsh-git-input',
              placeholder: '输入标签名 (如 v1.0.0)',
              value: modalInput,
              onChange: (e) => setModalInput(e.target.value),
              onKeyDown: (e) => { if (e.key === 'Enter') handleCreateTag(); },
              autoFocus: true
            }),
            h('input', {
              key: 'inp2',
              type: 'text',
              className: 'dsh-git-input',
              placeholder: '附注信息 (可选)',
              value: modalExtra,
              onChange: (e) => setModalExtra(e.target.value),
              onKeyDown: (e) => { if (e.key === 'Enter') handleCreateTag(); }
            }),
            h('div', { key: 'act', className: 'dsh-git-modal-actions' },
              h('button', { className: 'dsh-git-btn', onClick: () => setModal(null) }, '取消'),
              h('button', { className: 'dsh-git-btn dsh-git-btn-primary', onClick: handleCreateTag }, '创建标签')
            )
          ],
          modal.type === 'reset' && [
            h('div', { key: 't', className: 'dsh-git-modal-title' }, 'Reset 当前分支'),
            h('div', { key: 'st', style: { fontSize: 12, color: '#94a3b8' } }, `重置到提交: ${modal.targetCommit?.slice(0, 7) || modal.targetCommit}`),
            h('div', { key: 'opts', style: { display: 'flex', flexDirection: 'column', gap: 8, margin: '8px 0' } },
              h('button', { className: 'dsh-git-btn', onClick: () => handleReset('soft') }, 'Soft Reset (保留所有修改与暂存)'),
              h('button', { className: 'dsh-git-btn', onClick: () => handleReset('mixed') }, 'Mixed Reset (默认，保留工作区修改，重置暂存区)'),
              h('button', {
                className: 'dsh-git-btn',
                style: { borderColor: '#ef4444', color: '#f87171' },
                onClick: () => handleReset('hard')
              }, 'Hard Reset (丢弃所有未提交修改，危险操作)')
            ),
            h('div', { key: 'act', className: 'dsh-git-modal-actions' },
              h('button', { className: 'dsh-git-btn', onClick: () => setModal(null) }, '取消')
            )
          ],
          modal.type === 'stashSave' && [
            h('div', { key: 't', className: 'dsh-git-modal-title' }, '暂存当前工作区修改 (Stash Changes)'),
            h('div', { key: 'st', style: { fontSize: 12, color: '#94a3b8' } }, '将当前未提交的所有代码保存到 Stash 堆栈中，使工作区恢复干净'),
            h('input', {
              key: 'inp',
              type: 'text',
              className: 'dsh-git-input',
              placeholder: 'Stash 描述信息 (可选，如 WIP: refactor)',
              value: modalInput,
              onChange: (e) => setModalInput(e.target.value),
              onKeyDown: (e) => { if (e.key === 'Enter') handleStashSave(); },
              autoFocus: true
            }),
            h('div', { key: 'act', className: 'dsh-git-modal-actions' },
              h('button', { className: 'dsh-git-btn', onClick: () => setModal(null) }, '取消'),
              h('button', { className: 'dsh-git-btn dsh-git-btn-primary', onClick: handleStashSave }, '保存 Stash')
            )
          ]
        )
      ),

      // 7. Toast
      toast && h('div', { className: 'dsh-git-toast' }, toast)
    );
  };
}

function createGitGraphArtwork(React) {
  const h = React.createElement;
  return function GitGraphArtwork(props) {
    return h('svg', {
      width: props?.size || 24,
      height: props?.size || 24,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    },
      h('circle', { cx: 18, cy: 18, r: 3 }),
      h('circle', { cx: 6, cy: 6, r: 3 }),
      h('path', { d: 'M6 9v12' }),
      h('path', { d: 'M18 9a9 9 0 0 0-9 9' })
    );
  };
}

function createGitGraphTitle(React) {
  const h = React.createElement;
  return function GitGraphTitle() {
    return h('span', null, 'Git Graph');
  };
}


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
