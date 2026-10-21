// DeepSeek Harness ds-gitui Plugin - Client Bundle
(function() {
  function factory(require) {
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
  gap: 4px;
  padding: 0 7px;
  height: 19px;
  line-height: 19px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 9px;
  white-space: nowrap;
  user-select: none;
  transition: all 0.15s ease;
  box-sizing: border-box;
}

.dsh-git-badge:hover {
  filter: brightness(1.15);
  transform: translateY(-0.5px);
}

.dsh-badge-branch {
  background: rgba(59, 130, 246, 0.18);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.5);
  font-weight: 600;
}

.dsh-badge-head {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.35), rgba(37, 99, 235, 0.25));
  color: #bfdbfe;
  border: 1.5px solid #60a5fa;
  font-weight: 700;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
}

.dsh-badge-head .dsh-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #60a5fa;
  box-shadow: 0 0 6px #60a5fa;
  display: inline-block;
  animation: dshPulse 2s infinite ease-in-out;
}

@keyframes dshPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.dsh-badge-remote {
  background: rgba(147, 51, 234, 0.12);
  color: #c084fc;
  border: 1px dashed rgba(147, 51, 234, 0.5);
}

.dsh-badge-tag {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.18));
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.7);
  font-weight: 600;
  border-radius: 4px;
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.2);
}

.dsh-badge-uncommitted {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px dashed rgba(239, 68, 68, 0.5);
  font-weight: 600;
}

/* Branch ownership indicator on commit row */
.dsh-git-branch-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 6px;
  height: 16px;
  line-height: 16px;
  font-size: 10.5px;
  font-weight: 600;
  border-radius: 4px;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.dsh-git-branch-indicator:hover {
  filter: brightness(1.25);
  transform: translateY(-0.5px);
}

.dsh-branch-indicator-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 4px currentColor;
}

/* Branch filter banner */
.dsh-git-filter-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 12px;
  background: rgba(59, 130, 246, 0.1);
  border-bottom: 1px solid rgba(59, 130, 246, 0.25);
  font-size: 11.5px;
  gap: 8px;
  flex-shrink: 0;
}

.dsh-git-filter-banner-text {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.dsh-git-graph-canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 2;
}

.dsh-git-commit-row {
  display: flex;
  align-items: center;
  height: 24px;
  min-width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
  cursor: pointer;
  transition: background-color 0.1s ease;
  font-size: 12px;
  line-height: 24px;
}

.dsh-git-commit-row:hover {
  background-color: var(--dsh-hover-bg, rgba(255, 255, 255, 0.06));
}

.dsh-git-commit-row.selected {
  background-color: rgba(59, 130, 246, 0.15) !important;
  border-left: 2px solid var(--dsh-accent, #3b82f6);
}

.dsh-git-commit-row.uncommitted-row {
  background-color: rgba(245, 158, 11, 0.05);
}

.dsh-git-commit-row.dimmed {
  opacity: 0.28 !important;
  filter: grayscale(45%);
}

.dsh-git-commit-row.highlighted-branch {
  background-color: rgba(255, 255, 255, 0.06) !important;
}

.dsh-git-col-graph {
  flex-shrink: 0;
  height: 24px;
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
  width: 70px;
  flex-shrink: 0;
  font-family: monospace;
  font-size: 11px;
  color: var(--dsh-fg-muted, #94a3b8);
  padding: 0 4px;
}

.dsh-git-col-author {
  width: 100px;
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
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.8);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 600;
  flex-shrink: 0;
}

.dsh-git-col-date {
  width: 90px;
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
.dsh-status-R { background: #a855f7; color: #fff; }

/* VSCode-inspired Diff Viewer */
.dsh-diff-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #0d1117;
}

.dsh-diff-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: #161b22;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 11px;
}

.dsh-diff-filepath {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  color: #e6edf3;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dsh-diff-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}

.dsh-diff-stat-add {
  color: #3fb950;
  font-weight: 600;
}

.dsh-diff-stat-del {
  color: #f85149;
  font-weight: 600;
}

.dsh-git-diff-viewer {
  flex: 1;
  overflow: auto;
  background: #0d1117;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 20px;
  color: #c9d1d9;
}

.dsh-diff-table {
  width: 100%;
  border-collapse: collapse;
  user-select: text;
}

.dsh-diff-row {
  display: flex;
  width: 100%;
  min-width: max-content;
}

.dsh-diff-row:hover {
  background: rgba(255, 255, 255, 0.04);
}

.dsh-diff-num-old,
.dsh-diff-num-new {
  width: 42px;
  min-width: 42px;
  text-align: right;
  padding-right: 6px;
  color: #6e7681;
  font-size: 11px;
  user-select: none;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.dsh-diff-marker {
  width: 20px;
  min-width: 20px;
  text-align: center;
  user-select: none;
  font-weight: 600;
}

.dsh-diff-code {
  flex: 1;
  padding: 0 8px;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: inherit;
}

.dsh-diff-row-added {
  background-color: rgba(46, 160, 67, 0.18);
}

.dsh-diff-row-added .dsh-diff-num-new {
  color: #7ee787;
}

.dsh-diff-row-added .dsh-diff-marker {
  color: #7ee787;
}

.dsh-diff-row-added .dsh-diff-code {
  color: #e6edf3;
}

.dsh-diff-row-removed {
  background-color: rgba(248, 81, 73, 0.18);
}

.dsh-diff-row-removed .dsh-diff-num-old {
  color: #ffa198;
}

.dsh-diff-row-removed .dsh-diff-marker {
  color: #ffa198;
}

.dsh-diff-row-removed .dsh-diff-code {
  color: #ffa198;
}

.dsh-diff-row-hunk {
  background: rgba(56, 139, 253, 0.14);
  border-top: 1px solid rgba(56, 139, 253, 0.25);
  border-bottom: 1px solid rgba(56, 139, 253, 0.25);
  color: #58a6ff;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 0;
}

.dsh-diff-hunk-content {
  padding-left: 12px;
}

.dsh-diff-row-meta {
  color: #8b949e;
  font-size: 11px;
  padding: 2px 12px;
  font-style: italic;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.dsh-diff-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #8b949e;
  gap: 8px;
  padding: 24px;
  text-align: center;
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

/* ==========================================================
 * View Switcher & DAG Topology Graph Styles
 * ========================================================== */

.dsh-git-view-switcher {
  display: inline-flex;
  align-items: center;
  background: var(--dsh-layer-2, rgba(0, 0, 0, 0.35));
  border: 1px solid var(--dsh-border, rgba(255, 255, 255, 0.12));
  border-radius: 6px;
  padding: 2px;
  gap: 2px;
}

.dsh-git-view-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: var(--dsh-fg-muted, #94a3b8);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.dsh-git-view-tab:hover {
  color: var(--dsh-fg-primary, #e2e8f0);
  background: rgba(255, 255, 255, 0.06);
}

.dsh-git-view-tab.active {
  background: var(--dsh-accent, #3b82f6);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
}

/* DAG Topology Graph Container & Viewport */
.dsh-git-dag-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  background: var(--dsh-base, #131418);
  background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 24px 24px;
}

.dsh-git-dag-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: var(--dsh-layer-1, rgba(255, 255, 255, 0.03));
  border-bottom: 1px solid var(--dsh-border, rgba(255, 255, 255, 0.08));
  font-size: 11px;
  color: var(--dsh-fg-muted, #94a3b8);
  z-index: 5;
  flex-wrap: wrap;
  gap: 8px;
}

.dsh-git-dag-toolbar-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dsh-git-dag-hint {
  font-size: 11px;
  color: var(--dsh-fg-muted, #64748b);
  display: flex;
  align-items: center;
  gap: 4px;
}

.dsh-git-dag-viewport {
  flex: 1;
  overflow: hidden;
  position: relative;
  cursor: grab;
  user-select: none;
}

.dsh-git-dag-viewport.dragging {
  cursor: grabbing;
}

.dsh-git-dag-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: 0 0;
  will-change: transform;
}

.dsh-git-dag-edges {
  position: absolute;
  top: 0;
  left: 0;
  overflow: visible;
  pointer-events: none;
  z-index: 1;
}

/* DAG Node Cards */
.dsh-dag-node {
  background: var(--dsh-layer-2, #1c1d24);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  z-index: 2;
  box-sizing: border-box;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
}

.dsh-dag-node:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.65);
  border-color: rgba(255, 255, 255, 0.35) !important;
  z-index: 10;
}

.dsh-dag-node.dragging {
  cursor: grabbing !important;
  transform: scale(1.025);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.8), 0 0 0 2px var(--dsh-accent, #3b82f6) !important;
  z-index: 60 !important;
  transition: none !important;
}

.dsh-dag-node.selected {
  border-color: var(--dsh-accent, #3b82f6) !important;
  box-shadow: 0 0 0 2px var(--dsh-accent, #3b82f6), 0 8px 24px rgba(59, 130, 246, 0.35) !important;
  z-index: 12;
}

.dsh-dag-node.related {
  border-color: #60a5fa !important;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.75), 0 6px 18px rgba(0, 0, 0, 0.5);
  z-index: 8;
}

.dsh-dag-node.dimmed {
  opacity: 0.22;
}

.dsh-dag-node.is-head-node {
  border-color: #3b82f6 !important;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, var(--dsh-layer-2, #1c1d24) 100%);
  box-shadow: 0 0 14px rgba(59, 130, 246, 0.25), 0 4px 14px rgba(0, 0, 0, 0.45);
}

/* Ports on 4 edges */
.dsh-dag-port {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--dsh-layer-2, #1c1d24);
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  pointer-events: none;
  z-index: 4;
  transition: all 0.2s ease;
}
.dsh-dag-port.port-top {
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
}
.dsh-dag-port.port-bottom {
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
}
.dsh-dag-port.port-left {
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
}
.dsh-dag-port.port-right {
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
}

.dsh-dag-node:hover .dsh-dag-port,
.dsh-dag-node.selected .dsh-dag-port,
.dsh-dag-node.related .dsh-dag-port {
  border-color: #60a5fa;
  background: #3b82f6;
  box-shadow: 0 0 6px rgba(96, 165, 250, 0.8);
}

.dsh-dag-node-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  font-size: 11px;
}

.dsh-dag-header-left {
  display: flex;
  align-items: center;
  gap: 5px;
}

.dsh-dag-drag-handle {
  color: var(--dsh-fg-muted, #64748b);
  display: flex;
  align-items: center;
  opacity: 0.6;
  cursor: grab;
}
.dsh-dag-node:hover .dsh-dag-drag-handle {
  opacity: 1;
  color: var(--dsh-fg-secondary, #94a3b8);
}

.dsh-dag-node-hash {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-weight: 600;
  color: var(--dsh-fg-secondary, #cbd5e1);
  font-size: 11px;
  background: rgba(255, 255, 255, 0.06);
  padding: 1px 4px;
  border-radius: 4px;
}

.dsh-dag-copy-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--dsh-fg-muted, #64748b);
  cursor: pointer;
  padding: 2px;
  border-radius: 3px;
  transition: all 0.15s ease;
}
.dsh-dag-copy-icon-btn:hover {
  color: var(--dsh-fg-primary, #f1f5f9);
  background: rgba(255, 255, 255, 0.1);
}

.dsh-dag-node-author {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--dsh-fg-secondary, #cbd5e1);
  font-size: 11px;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dsh-dag-node-date {
  color: var(--dsh-fg-muted, #64748b);
  font-size: 10px;
  white-space: nowrap;
}

.dsh-dag-node-subject {
  font-size: 12px;
  font-weight: 500;
  color: var(--dsh-fg-primary, #f1f5f9);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.35;
  word-break: break-word;
}

.dsh-dag-node-footer {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 1px;
  overflow: hidden;
}

.dsh-badge-merge {
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.4);
}

/* Curve Edge Glow & Animations */
@keyframes dsh-flow-dash {
  to {
    stroke-dashoffset: -24;
  }
}

.dsh-dag-edge-flow {
  animation: dsh-flow-dash 1.2s linear infinite;
}

.dsh-dag-edge-active {
  filter: drop-shadow(0 0 4px rgba(96, 165, 250, 0.8));
}

/* Branch Topology View */
.dsh-git-branches-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dsh-git-branch-stats-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 10px;
}

.dsh-git-stat-card {
  background: var(--dsh-layer-1, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--dsh-border, rgba(255, 255, 255, 0.08));
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dsh-git-stat-num {
  font-size: 18px;
  font-weight: 700;
  color: var(--dsh-fg-primary, #f1f5f9);
}

.dsh-git-stat-label {
  font-size: 11px;
  color: var(--dsh-fg-muted, #94a3b8);
}

.dsh-git-branch-section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--dsh-fg-secondary, #cbd5e1);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.dsh-git-branch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 10px;
}

.dsh-git-branch-card {
  background: var(--dsh-layer-2, rgba(255, 255, 255, 0.04));
  border: 1px solid var(--dsh-border, rgba(255, 255, 255, 0.08));
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.15s ease;
}

.dsh-git-branch-card:hover {
  background: var(--dsh-hover-bg, rgba(255, 255, 255, 0.06));
  border-color: rgba(255, 255, 255, 0.18);
}

.dsh-git-branch-card.is-head {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.08);
}

.dsh-git-branch-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.dsh-git-branch-card-name {
  font-weight: 600;
  font-size: 13px;
  color: var(--dsh-fg-primary, #f1f5f9);
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dsh-git-branch-card-commit {
  font-size: 11px;
  color: var(--dsh-fg-muted, #94a3b8);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dsh-git-branch-card-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  flex-wrap: wrap;
}
`;


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
    /**
 * DeepSeek Harness Git Graph Plugin - React View Component
 * Uses React.createElement (h) for zero-dependency native execution in Cordis/Electron/Browser
 */

let h = (typeof window !== 'undefined' && window.React) ? window.React.createElement : null;

function getH() {
  return h || (typeof window !== 'undefined' && window.React?.createElement);
}

function formatRelativeDate(isoStr) {
  if (!isoStr) return '';
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return String(isoStr);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffSec < 60) return '刚刚';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} 分钟前`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} 小时前`;
  if (diffSec < 86400 * 30) return `${Math.floor(diffSec / 86400)} 天前`;
  return date.toLocaleDateString();
}

function parseUnifiedDiff(diffText) {
  if (!diffText || typeof diffText !== 'string') return [];
  const lines = diffText.split('\n');
  const parsed = [];
  let oldLine = 0;
  let newLine = 0;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (raw.startsWith('@@')) {
      const match = raw.match(/@@\s+-(\d+)(?:,\d+)?\s+\+(\d+)(?:,\d+)?\s+@@/);
      if (match) {
        oldLine = parseInt(match[1], 10);
        newLine = parseInt(match[2], 10);
      }
      parsed.push({ type: 'hunk', raw, oldLine: null, newLine: null });
    } else if (raw.startsWith('+') && !raw.startsWith('+++')) {
      parsed.push({ type: 'added', raw: raw.slice(1), prefix: '+', oldLine: null, newLine: newLine++ });
    } else if (raw.startsWith('-') && !raw.startsWith('---')) {
      parsed.push({ type: 'removed', raw: raw.slice(1), prefix: '-', oldLine: oldLine++, newLine: null });
    } else if (raw.startsWith('diff --git') || raw.startsWith('index ') || raw.startsWith('---') || raw.startsWith('+++')) {
      parsed.push({ type: 'meta', raw, oldLine: null, newLine: null });
    } else {
      parsed.push({ type: 'context', raw: raw.startsWith(' ') ? raw.slice(1) : raw, prefix: ' ', oldLine: oldLine++, newLine: newLine++ });
    }
  }
  return parsed;
}

const COLORS = [
  '#10b981', // emerald / green (primary trunk)
  '#a855f7', // purple / violet
  '#f59e0b', // amber / orange
  '#06b6d4', // cyan / teal
  '#ec4899', // pink / magenta
  '#3b82f6', // blue
  '#14b8a6', // mint
  '#f97316', // coral orange
  '#6366f1', // indigo
  '#84cc16', // lime
  '#d946ef', // fuchsia
  '#eab308'  // yellow
];

const BRANCH_PRESET_COLORS = {
  main: '#10b981',       // 翡翠绿 (主干)
  master: '#10b981',     // 翡翠绿 (主干)
  develop: '#38bdf8',    // 亮蓝
  dev: '#38bdf8',
  staging: '#f59e0b',
  production: '#10b981'
};

const DISTINCT_PALETTE = [
  '#10b981', '#a855f7', '#f59e0b', '#06b6d4',
  '#ec4899', '#3b82f6', '#14b8a6', '#f97316',
  '#6366f1', '#84cc16', '#d946ef', '#eab308'
];

function cleanBranchName(name) {
  if (!name) return '';
  return name
    .replace(/^(origin|upstream|github|gitlab)\//, '')
    .replace(/^tag:\s*/, '')
    .replace(/^\*\s*/, '');
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getBranchColor(rawName) {
  const name = cleanBranchName(rawName);
  if (!name) return '#60a5fa';
  const lower = name.toLowerCase();

  if (BRANCH_PRESET_COLORS[lower]) {
    return BRANCH_PRESET_COLORS[lower];
  }
  if (lower.startsWith('release') || lower.startsWith('v')) {
    return '#f59e0b'; // 琥珀橙
  }
  if (lower.startsWith('hotfix') || lower.startsWith('bugfix') || lower.startsWith('fix')) {
    return '#ef4444'; // 珊瑚红
  }
  if (lower.startsWith('feature/ui') || lower.startsWith('ui-') || lower.includes('ui')) {
    return '#a855f7'; // 紫罗兰
  }
  if (lower.startsWith('feature/demo') || lower.includes('demo')) {
    return '#ec4899'; // 洋红粉
  }

  const idx = hashString(name) % DISTINCT_PALETTE.length;
  return DISTINCT_PALETTE[idx];
}

function analyzeCommitBranches(commits) {
  if (!commits || commits.length === 0) {
    return { commitBranchInfo: new Map(), allBranchNames: [] };
  }

  const commitMap = new Map();
  commits.forEach(c => commitMap.set(c.hash, c));

  const branchHeads = [];
  commits.forEach(c => {
    (c.refs || []).forEach(r => {
      if (r.type === 'branch' || r.type === 'remote') {
        const cleanName = cleanBranchName(r.name);
        if (cleanName && !branchHeads.some(b => b.name === cleanName)) {
          branchHeads.push({
            name: cleanName,
            hash: c.hash,
            color: getBranchColor(cleanName)
          });
        }
      }
    });
  });

  const commitToBranches = new Map();
  commits.forEach(c => commitToBranches.set(c.hash, new Set()));

  branchHeads.forEach(bh => {
    const queue = [bh.hash];
    const visited = new Set();
    while (queue.length > 0) {
      const curHash = queue.shift();
      if (!curHash || visited.has(curHash)) continue;
      visited.add(curHash);

      const branchSet = commitToBranches.get(curHash);
      if (branchSet) branchSet.add(bh.name);

      const curCommit = commitMap.get(curHash);
      if (curCommit && curCommit.parents) {
        for (const p of curCommit.parents) {
          if (!visited.has(p)) queue.push(p);
        }
      }
    }
  });

  const result = new Map();
  commits.forEach(c => {
    const branches = Array.from(commitToBranches.get(c.hash) || []);
    let primary = branches[0] || '';
    if (branches.includes('main')) {
      primary = 'main';
    } else if (branches.includes('master')) {
      primary = 'master';
    }
    result.set(c.hash, {
      branches,
      primaryBranch: primary,
      primaryColor: primary ? getBranchColor(primary) : '#94a3b8'
    });
  });

  return { commitBranchInfo: result, allBranchNames: branchHeads.map(b => b.name) };
}

function renderBranchIcon() {
  const _h = getH();
  if (!_h) return null;
  return _h('svg', {
    width: 11,
    height: 11,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    style: { marginRight: 2, flexShrink: 0 }
  },
    _h('line', { x1: 6, y1: 3, x2: 6, y2: 15 }),
    _h('circle', { cx: 18, cy: 6, r: 3 }),
    _h('circle', { cx: 6, cy: 18, r: 3 }),
    _h('path', { d: 'M18 9a9 9 0 0 1-9 9' })
  );
}

function renderCloudIcon() {
  const _h = getH();
  if (!_h) return null;
  return _h('svg', {
    width: 11,
    height: 11,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    style: { marginRight: 2, flexShrink: 0 }
  },
    _h('path', { d: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z' })
  );
}

function renderTagIcon() {
  const _h = getH();
  if (!_h) return null;
  return _h('svg', {
    width: 11,
    height: 11,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    style: { marginRight: 2, flexShrink: 0 }
  },
    _h('path', { d: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z' }),
    _h('line', { x1: 7, y1: 7, x2: 7.01, y2: 7 })
  );
}

function computeGraphLayout(commits, branchAnalysis) {
  if (!commits || commits.length === 0) {
    return { rows: [], paths: [], maxLane: 0 };
  }

  const PALETTE = [
    '#eab308', // gold / yellow trunk (Lane 0)
    '#3b82f6', // blue (Lane 1)
    '#10b981', // green (Lane 2)
    '#a855f7', // purple (Lane 3)
    '#f97316', // orange (Lane 4)
    '#ec4899', // pink (Lane 5)
    '#06b6d4', // cyan (Lane 6)
    '#84cc16'  // lime (Lane 7)
  ];

  const He = -1;
  class Branch {
    constructor(colour) {
      this.colour = colour;
      this.lines = [];
      this.end = 0;
    }
    addLine(p1, p2, isCommitted, lockedFirst) {
      this.lines.push({ p1: { ...p1 }, p2: { ...p2 }, isCommitted, lockedFirst });
    }
  }

  class Vertex {
    constructor(id, isCommitted) {
      this.id = id;
      this.x = 0;
      this.nextX = 0;
      this.parents = [];
      this.children = [];
      this.nextParent = 0;
      this.onBranch = null;
      this.connections = [];
      this.isCommitted = isCommitted;
    }
    addChild(c) { this.children.push(c); }
    addParent(p) { this.parents.push(p); }
    getNextParent() { return this.nextParent < this.parents.length ? this.parents[this.nextParent] : null; }
    registerParentProcessed() { this.nextParent++; }
    isMerge() { return this.parents.length > 1; }
    addToBranch(b, x) {
      if (this.onBranch === null) {
        this.onBranch = b;
        this.x = x;
      }
    }
    isNotOnBranch() { return this.onBranch === null; }
    getBranch() { return this.onBranch; }
    getPoint() { return { x: this.x, y: this.id }; }
    getNextPoint() { return { x: this.nextX, y: this.id }; }
    getPointConnectingTo(parent, branch) {
      for (let i = 0; i < this.connections.length; i++) {
        if (this.connections[i]?.connectsTo === parent && this.connections[i]?.onBranch === branch) {
          return { x: i, y: this.id };
        }
      }
      return null;
    }
    registerUnavailablePoint(x, connectsTo, onBranch) {
      if (x === this.nextX) {
        this.nextX = x + 1;
        this.connections[x] = { connectsTo, onBranch };
      }
    }
  }

  const commitLookup = {};
  commits.forEach((c, i) => {
    commitLookup[c.hash] = i;
    if (c.shortHash) commitLookup[c.shortHash] = i;
    if (c.hash && c.hash.length >= 7) commitLookup[c.hash.slice(0, 7)] = i;
  });

  const vertices = commits.map((c, i) => new Vertex(i, !c.isUncommitted));
  const dummyParent = new Vertex(He, true);

  vertices.forEach((v, i) => {
    (commits[i].parents || []).forEach(pHash => {
      let pIdx = commitLookup[pHash];
      if (typeof pIdx === 'number') {
        v.addParent(vertices[pIdx]);
        vertices[pIdx].addChild(v);
      } else {
        v.addParent(dummyParent);
      }
    });
  });

  const branches = [];
  const availableColours = [];

  function getAvailableColour(e) {
    for (let t = 0; t < availableColours.length; t++) {
      if (e > availableColours[t]) return t;
    }
    availableColours.push(0);
    return availableColours.length - 1;
  }

  function determinePath(e) {
    let t = e;
    let i = vertices[t];
    let n = vertices[t].getNextParent();
    let o;
    let s = i.isNotOnBranch() ? i.getNextPoint() : i.getPoint();
    let r;

    if (n !== null && n.id !== He && i.isMerge() && !i.isNotOnBranch() && !n.isNotOnBranch()) {
      let a = false;
      let l = n.getBranch();
      for (t = e + 1; t < vertices.length; t++) {
        o = vertices[t];
        r = o.getPointConnectingTo(n, l);
        if (r !== null) {
          a = true;
        } else {
          r = o.getNextPoint();
        }
        l.addLine(s, r, i.isCommitted, !a && o !== n ? s.x < r.x : true);
        o.registerUnavailablePoint(r.x, n, l);
        s = r;
        if (a) {
          i.registerParentProcessed();
          break;
        }
      }
    } else {
      let h = new Branch(getAvailableColour(e));
      i.addToBranch(h, s.x);
      i.registerUnavailablePoint(s.x, i, h);
      for (t = e + 1; t < vertices.length; t++) {
        o = vertices[t];
        r = (n === o && !n.isNotOnBranch()) ? o.getPoint() : o.getNextPoint();
        h.addLine(s, r, i.isCommitted, s.x < r.x);
        o.registerUnavailablePoint(r.x, n, h);
        s = r;
        if (n === o) {
          i.registerParentProcessed();
          let c = !n.isNotOnBranch();
          n.addToBranch(h, r.x);
          i = n;
          n = i.getNextParent();
          if (n === null || c) break;
        }
      }
      if (t === vertices.length && n !== null && n.id === He) {
        i.registerParentProcessed();
      }
      h.end = t;
      branches.push(h);
      availableColours[h.colour] = t;
    }
  }

  let s = 0;
  while (s < vertices.length) {
    if (vertices[s].getNextParent() !== null || vertices[s].isNotOnBranch()) {
      determinePath(s);
    } else {
      s++;
    }
  }

  const grid = { x: 16, y: 24, offsetX: 14, offsetY: 12 };
  const paths = [];
  let maxLane = 0;

  vertices.forEach(v => {
    if (v.x > maxLane) maxLane = v.x;
  });

  branches.forEach(b => {
    const rawLines = [];
    b.lines.forEach(l => {
      rawLines.push({
        p1: { x: l.p1.x * grid.x + grid.offsetX, y: l.p1.y * grid.y + grid.offsetY },
        p2: { x: l.p2.x * grid.x + grid.offsetX, y: l.p2.y * grid.y + grid.offsetY },
        isCommitted: l.isCommitted,
        lockedFirst: l.lockedFirst
      });
    });

    // Merge contiguous straight vertical lines
    let o = 0;
    while (o < rawLines.length - 1) {
      const cur = rawLines[o];
      const next = rawLines[o + 1];
      if (cur.p1.x === cur.p2.x && cur.p2.x === next.p1.x && next.p1.x === next.p2.x && cur.p2.y === next.p1.y && cur.isCommitted === next.isCommitted) {
        cur.p2.y = next.p2.y;
        rawLines.splice(o + 1, 1);
      } else {
        o++;
      }
    }

    // Build SVG path string with smooth Bezier curves
    let d = '';
    let isDashed = false;
    for (let k = 0; k < rawLines.length; k++) {
      const line = rawLines[k];
      if (!line.isCommitted) isDashed = true;
      const x1 = line.p1.x;
      const y1 = line.p1.y;
      const x2 = line.p2.x;
      const y2 = line.p2.y;

      if (d === '' || (k > 0 && (x1 !== rawLines[k - 1].p2.x || y1 !== rawLines[k - 1].p2.y))) {
        d += `M ${x1} ${y1} `;
      }

      if (x1 === x2) {
        d += `L ${x2} ${y2} `;
      } else {
        const cp = Math.abs(y2 - y1) * 0.5;
        d += `C ${x1} ${y1 + cp} ${x2} ${y2 - cp} ${x2} ${y2} `;
      }
    }

    if (d.trim()) {
      paths.push({
        colour: b.colour,
        color: PALETTE[b.colour % PALETTE.length],
        d: d.trim(),
        isDashed
      });
    }
  });

  const rows = commits.map((c, i) => {
    const v = vertices[i];
    const branchInfo = branchAnalysis?.commitBranchInfo?.get(c.hash);
    const color = c.isUncommitted
      ? '#f59e0b'
      : (v.onBranch ? PALETTE[v.onBranch.colour % PALETTE.length] : (branchInfo?.primaryColor || PALETTE[0]));

    return {
      commit: c,
      lane: v.x,
      x: v.x * grid.x + grid.offsetX,
      y: i * grid.y + grid.offsetY,
      color,
      colorIndex: v.onBranch ? v.onBranch.colour : 0,
      primaryBranch: branchInfo?.primaryBranch || '',
      branches: branchInfo?.branches || []
    };
  });

  return { rows, paths, maxLane, grid };
}

function renderRefBadges({
  commit,
  branchAnalysis,
  hoveredBranch,
  setHoveredBranch,
  handleCheckout,
  showBranchIndicator = true
}) {
  const _h = getH();
  if (!_h) return [];
  const isHead = commit.isHead || commit.refs?.some(r => r.type === 'head');
  const branchInfo = branchAnalysis?.commitBranchInfo?.get(commit.hash);
  const elements = [];

  // 1. HEAD 指针徽章
  if (isHead) {
    elements.push(
      _h('span', {
        key: 'badge-head',
        className: 'dsh-git-badge dsh-badge-head',
        title: '当前工作区检出的 HEAD 指针'
      },
        _h('span', { className: 'dsh-badge-dot' }),
        'HEAD'
      )
    );
  }

  // 2. 明确的 refs (tag, remote, branch, uncommitted)
  let hasExplicitBranchRef = false;
  if (commit.refs && commit.refs.length > 0) {
    commit.refs.forEach((ref, rIdx) => {
      if (ref.type === 'head') return;

      if (ref.type === 'tag') {
        elements.push(
          _h('span', {
            key: `ref-tag-${ref.name}-${rIdx}`,
            className: 'dsh-git-badge dsh-badge-tag',
            title: `Git Tag 标签: ${ref.name}`
          },
            renderTagIcon(),
            ref.name
          )
        );
      } else if (ref.type === 'remote') {
        hasExplicitBranchRef = true;
        const cleanName = cleanBranchName(ref.name);
        const branchColor = getBranchColor(cleanName);
        const isHovered = hoveredBranch === cleanName;

        elements.push(
          _h('span', {
            key: `ref-remote-${ref.name}-${rIdx}`,
            className: 'dsh-git-badge dsh-badge-remote',
            style: {
              color: branchColor,
              borderColor: isHovered ? branchColor : `${branchColor}88`,
              backgroundColor: isHovered ? `${branchColor}33` : `${branchColor}14`,
              boxShadow: isHovered ? `0 0 8px ${branchColor}66` : 'none'
            },
            title: `远程分支: ${ref.name} (鼠标悬停高亮追踪)`,
            onMouseEnter: () => setHoveredBranch && setHoveredBranch(cleanName),
            onMouseLeave: () => setHoveredBranch && setHoveredBranch(null)
          },
            renderCloudIcon(),
            _h('span', { style: { opacity: 0.6, marginRight: 1 } }, 'origin/'),
            cleanName
          )
        );
      } else if (ref.type === 'branch') {
        hasExplicitBranchRef = true;
        const cleanName = cleanBranchName(ref.name);
        const branchColor = getBranchColor(cleanName);
        const isHovered = hoveredBranch === cleanName;

        elements.push(
          _h('span', {
            key: `ref-branch-${ref.name}-${rIdx}`,
            className: 'dsh-git-badge dsh-badge-branch',
            style: {
              color: branchColor,
              borderColor: isHovered ? branchColor : `${branchColor}99`,
              backgroundColor: isHovered ? `${branchColor}44` : `${branchColor}24`,
              boxShadow: isHovered ? `0 0 8px ${branchColor}77` : 'none'
            },
            title: `本地分支: ${ref.name} (双击切换检出, 鼠标悬停高亮追踪)`,
            onMouseEnter: () => setHoveredBranch && setHoveredBranch(cleanName),
            onMouseLeave: () => setHoveredBranch && setHoveredBranch(null),
            onDoubleClick: (e) => {
              e.stopPropagation();
              handleCheckout && handleCheckout(ref.name);
            }
          },
            renderBranchIcon(),
            ref.name
          )
        );
      } else if (ref.type === 'uncommitted') {
        elements.push(
          _h('span', {
            key: 'ref-uncommitted',
            className: 'dsh-git-badge dsh-badge-uncommitted',
            title: '当前工作区未提交修改'
          },
            '⚡ Worktree'
          )
        );
      }
    });
  }

  // 3. 如果当前提交没有直接的分支标签，显示其所属主分支胶囊 (Branch Ownership Indicator)
  if (showBranchIndicator && !hasExplicitBranchRef && !commit.isUncommitted && branchInfo?.primaryBranch) {
    const primary = branchInfo.primaryBranch;
    const color = branchInfo.primaryColor || getBranchColor(primary);
    const isHovered = hoveredBranch === primary;

    elements.push(
      _h('span', {
        key: `branch-indicator-${commit.hash}`,
        className: 'dsh-git-branch-indicator',
        style: {
          color: color,
          backgroundColor: isHovered ? `${color}35` : `${color}18`,
          border: `1px solid ${isHovered ? color : color + '55'}`,
          boxShadow: isHovered ? `0 0 6px ${color}55` : 'none'
        },
        title: `归属主分支: ${primary} (悬停高亮整条分支)`,
        onMouseEnter: () => setHoveredBranch && setHoveredBranch(primary),
        onMouseLeave: () => setHoveredBranch && setHoveredBranch(null)
      },
        _h('span', {
          className: 'dsh-branch-indicator-dot',
          style: { backgroundColor: color }
        }),
        primary
      )
    );
  }

  return elements;
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
  h = React.createElement;
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
    const [viewMode, setViewMode] = useState('table'); // 'table' | 'dag' | 'branches'
    const [dagDirection, setDagDirection] = useState('vertical'); // 'vertical' | 'horizontal'
    const [dagZoom, setDagZoom] = useState(1);
    const [dagPan, setDagPan] = useState({ x: 30, y: 30 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hoveredHash, setHoveredHash] = useState(null);
    const [hoveredBranch, setHoveredBranch] = useState(null);
    const [edgeDirection, setEdgeDirection] = useState('parent-to-child'); // 'parent-to-child' | 'child-to-parent'
    const [nodePositions, setNodePositions] = useState({}); // { [hash]: { x, y } }
    const [draggingNodeHash, setDraggingNodeHash] = useState(null);
    const dragNodeRef = useRef(null); // { hash, startMouseX, startMouseY, startNodeX, startNodeY, hasMoved }
    const dagContainerRef = useRef(null);

    const showToast = useCallback((msg, duration = 3000) => {
      setToast(msg);
      setTimeout(() => setToast(null), duration);
    }, []);

    const handleCopyHash = useCallback((e, text, label = 'SHA') => {
      e.stopPropagation();
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
        showToast(`已复制 ${label}: ${text.slice(0, 10)}`);
      } else {
        showToast(`Commit: ${text.slice(0, 10)}`);
      }
    }, [showToast]);

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
      let isMounted = true;
      const detected = getActiveSessionCwd(props.sessionId);
      if (detected && detected !== currentCwd) {
        setCurrentCwd(detected);
        return;
      }
      
      // If not detected yet (e.g. tree element not mounted), retry after a short delay
      if (!currentCwd) {
        const timer = setTimeout(() => {
          if (!isMounted) return;
          const retryDetected = getActiveSessionCwd(props.sessionId);
          if (retryDetected) setCurrentCwd(retryDetected);
        }, 500);
        return () => {
          isMounted = false;
          clearTimeout(timer);
        };
      }
      return () => { isMounted = false; };
    }, [props.sessionId, currentCwd]);

    // Load repository overview and commits log
    const loadRepoData = useCallback(async (branch = selectedBranch) => {
      const activeCwd = currentCwd || getActiveSessionCwd(props.sessionId);
      if (!activeCwd) {
        // CWD not resolved yet, do not mark as permanent error
        return;
      }

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
    }, [apiCall, currentCwd, props.sessionId, selectedBranch]);

    useEffect(() => {
      if (currentCwd) {
        loadRepoData();
      }
    }, [currentCwd, loadRepoData]);

    const handleSelectFile = useCallback(async (commitOrHash, filePath) => {
      setSelectedFile(filePath);
      setLoadingDiff(true);
      try {
        let targetHash = '*uncommitted*';
        if (typeof commitOrHash === 'object' && commitOrHash !== null) {
          targetHash = (commitOrHash.isUncommitted || commitOrHash.hash === '*uncommitted*')
            ? '*uncommitted*'
            : (commitOrHash.hash || '*uncommitted*');
        } else if (typeof commitOrHash === 'string') {
          targetHash = commitOrHash;
        }

        let json = await apiCall('diff', { hash: targetHash, file: filePath });
        
        // If git diff returns empty for a merge commit without range, retry with first-parent range
        if (json.success && (!json.diff || json.diff.trim() === '') && typeof targetHash === 'string' && !targetHash.includes('..') && targetHash !== '*uncommitted*') {
          try {
            const retryJson = await apiCall('diff', { hash: `${targetHash}^1..${targetHash}`, file: filePath });
            if (retryJson.success && retryJson.diff && retryJson.diff.trim() !== '') {
              json = retryJson;
            }
          } catch {}
        }

        if (json.success) {
          setFileDiff(json.diff ?? '');
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
            handleSelectFile(commit, json.details.files[0].path);
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

    const branchAnalysis = useMemo(() => {
      return analyzeCommitBranches(commits);
    }, [commits]);

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

    const graphData = useMemo(() => {
      return computeGraphLayout(filteredCommits, branchAnalysis);
    }, [filteredCommits, branchAnalysis]);

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

    const laneWidth = graphData.grid?.x || 16;
    const rowHeight = graphData.grid?.y || 24;
    const xOffset = graphData.grid?.offsetX || 14;
    const svgWidth = Math.max(54, (graphData.maxLane + 1) * laneWidth + xOffset + 10);
    const totalSvgHeight = graphData.rows.length * rowHeight;

    function getPt(lane, row) {
      return {
        x: lane * laneWidth + xOffset,
        y: row * rowHeight + rowHeight / 2
      };
    }

    const handleDeleteTag = async (tagName) => {
      if (!window.confirm(`确定要删除标签 "${tagName}" 吗？`)) return;
      try {
        const json = await apiCall('delete-tag', {}, { tagName });
        if (json.success) {
          showToast(`已成功删除标签: ${tagName}`);
          loadRepoData();
        } else {
          showToast('删除标签失败: ' + (json.error || '未知错误'));
        }
      } catch (e) {
        showToast('操作失败: ' + e.message);
      }
    };

    // DAG Layout Engine
    const dagLayout = useMemo(() => {
      if (!graphData.rows || graphData.rows.length === 0) {
        return { nodes: [], edges: [], width: 800, height: 600, nodeMap: new Map() };
      }

      const isVertical = dagDirection === 'vertical';
      const W = isVertical ? 260 : 230;
      const H = isVertical ? 76 : 72;
      const gapX = isVertical ? 48 : 56;
      const gapY = isVertical ? 42 : 36;
      const padX = 40;
      const padY = 40;

      const nodes = [];
      const nodeMap = new Map();
      let maxCol = 0;
      let maxRow = 0;

      const rows = graphData.rows;
      const total = rows.length;

      for (let i = 0; i < total; i++) {
        const row = rows[i];
        const commit = row.commit;
        const lane = row.lane;

        // If uncommitted, enrich subject with current status
        if (commit.isUncommitted || commit.hash === '*uncommitted*') {
          if (repoOverview?.status) {
            commit.subject = `未提交修改 (${repoOverview.status.stagedCount || 0} 暂存 / ${repoOverview.status.unstagedCount || 0} 未暂存)`;
          }
        }

        let defaultX, defaultY;
        if (isVertical) {
          defaultX = padX + lane * (W + gapX);
          defaultY = padY + i * (H + gapY);
          if (lane > maxCol) maxCol = lane;
          if (i > maxRow) maxRow = i;
        } else {
          const col = (total - 1 - i);
          defaultX = padX + col * (W + gapX);
          defaultY = padY + lane * (H + gapY);
          if (col > maxCol) maxCol = col;
          if (lane > maxRow) maxRow = lane;
        }

        const custom = nodePositions[commit.hash] || (commit.isUncommitted ? nodePositions['*uncomm*'] : null);
        const x = custom ? custom.x : defaultX;
        const y = custom ? custom.y : defaultY;

        const node = {
          commit,
          lane,
          color: commit.isUncommitted ? '#f59e0b' : row.color,
          colorIndex: commit.isUncommitted ? 99 : row.colorIndex,
          defaultX,
          defaultY,
          x,
          y,
          width: W,
          height: H
        };

        nodes.push(node);
        nodeMap.set(commit.hash, node);
        if (commit.shortHash) nodeMap.set(commit.shortHash, node);
        if (commit.hash && commit.hash.length >= 7) nodeMap.set(commit.hash.slice(0, 7), node);
        if (commit.isUncommitted) {
          nodeMap.set('*uncommitted*', node);
          nodeMap.set('*uncomm*', node);
        }
      }

      // Compute Directed Edges with Adaptive Bézier Splines
      const edges = [];
      for (let i = 0; i < nodes.length; i++) {
        const childNode = nodes[i];
        const childCommit = childNode.commit;
        const parents = childCommit.parents || [];

        for (let pIdx = 0; pIdx < parents.length; pIdx++) {
          const pHash = parents[pIdx];
          const parentNode = nodeMap.get(pHash);
          if (!parentNode) continue;

          const isMerge = parents.length > 1;
          const cxP = parentNode.x + parentNode.width / 2;
          const cyP = parentNode.y + parentNode.height / 2;
          const cxC = childNode.x + childNode.width / 2;
          const cyC = childNode.y + childNode.height / 2;

          const dx = cxC - cxP;
          const dy = cyC - cyP;

          let pP, pC, cpP, cpC;

          if (isVertical) {
            // 纵向视图为主
            if (Math.abs(dy) >= Math.abs(dx) * 0.45) {
              if (dy <= 0) {
                // 标准情况：Child 在 Parent 上方
                pP = { x: cxP, y: parentNode.y };
                pC = { x: cxC, y: childNode.y + childNode.height };
                const distY = Math.abs(dy);
                const cpOffset = Math.max(26, distY * 0.48);
                cpP = { x: pP.x, y: pP.y - cpOffset };
                cpC = { x: pC.x, y: pC.y + cpOffset };
              } else {
                // 用户拖拽：Child 被拖到了 Parent 下方
                pP = { x: cxP, y: parentNode.y + parentNode.height };
                pC = { x: cxC, y: childNode.y };
                const distY = Math.abs(dy);
                const cpOffset = Math.max(26, distY * 0.48);
                cpP = { x: pP.x, y: pP.y + cpOffset };
                cpC = { x: pC.x, y: pC.y - cpOffset };
              }
            } else {
              // 用户拖拽：两节点横向偏向显著
              if (dx >= 0) {
                pP = { x: parentNode.x + parentNode.width, y: cyP };
                pC = { x: childNode.x, y: cyC };
                const cpOffset = Math.max(28, Math.abs(dx) * 0.5);
                cpP = { x: pP.x + cpOffset, y: pP.y };
                cpC = { x: pC.x - cpOffset, y: pC.y };
              } else {
                pP = { x: parentNode.x, y: cyP };
                pC = { x: childNode.x + childNode.width, y: cyC };
                const cpOffset = Math.max(28, Math.abs(dx) * 0.5);
                cpP = { x: pP.x - cpOffset, y: pP.y };
                cpC = { x: pC.x + cpOffset, y: pC.y };
              }
            }
          } else {
            // 横向视图为主
            if (Math.abs(dx) >= Math.abs(dy) * 0.45) {
              if (dx >= 0) {
                // 标准情况：Child 在 Parent 右侧
                pP = { x: parentNode.x + parentNode.width, y: cyP };
                pC = { x: childNode.x, y: cyC };
                const distX = Math.abs(dx);
                const cpOffset = Math.max(26, distX * 0.48);
                cpP = { x: pP.x + cpOffset, y: pP.y };
                cpC = { x: pC.x - cpOffset, y: pC.y };
              } else {
                // 用户拖拽：Child 被拖到了 Parent 左侧
                pP = { x: parentNode.x, y: cyP };
                pC = { x: childNode.x + childNode.width, y: cyC };
                const distX = Math.abs(dx);
                const cpOffset = Math.max(26, distX * 0.48);
                cpP = { x: pP.x - cpOffset, y: pP.y };
                cpC = { x: pC.x + cpOffset, y: pC.y };
              }
            } else {
              // 垂直方向显著
              if (dy >= 0) {
                pP = { x: cxP, y: parentNode.y + parentNode.height };
                pC = { x: cxC, y: childNode.y };
                const cpOffset = Math.max(28, Math.abs(dy) * 0.5);
                cpP = { x: pP.x, y: pP.y + cpOffset };
                cpC = { x: pC.x, y: pC.y - cpOffset };
              } else {
                pP = { x: cxP, y: parentNode.y };
                pC = { x: cxC, y: childNode.y + childNode.height };
                const cpOffset = Math.max(28, Math.abs(dy) * 0.5);
                cpP = { x: pP.x, y: pP.y - cpOffset };
                cpC = { x: pC.x, y: pC.y + cpOffset };
              }
            }
          }

          let pathD;
          if (edgeDirection === 'parent-to-child') {
            pathD = `M ${pP.x} ${pP.y} C ${cpP.x} ${cpP.y}, ${cpC.x} ${cpC.y}, ${pC.x} ${pC.y}`;
          } else {
            pathD = `M ${pC.x} ${pC.y} C ${cpC.x} ${cpC.y}, ${cpP.x} ${cpP.y}, ${pP.x} ${pP.y}`;
          }

          edges.push({
            id: `${childCommit.hash}-${pHash}-${pIdx}`,
            childHash: childCommit.hash,
            parentHash: pHash,
            color: childNode.color,
            isMerge,
            isDashed: childCommit.isUncommitted,
            pathD
          });
        }
      }

      let calculatedWidth = padX * 2 + (maxCol + 1) * (W + gapX);
      let calculatedHeight = padY * 2 + (maxRow + 1) * (H + gapY);

      nodes.forEach(n => {
        if (n.x + n.width + padX > calculatedWidth) calculatedWidth = n.x + n.width + padX;
        if (n.y + n.height + padY > calculatedHeight) calculatedHeight = n.y + n.height + padY;
      });

      return { nodes, edges, width: calculatedWidth, height: calculatedHeight, nodeMap };
    }, [graphData.rows, dagDirection, edgeDirection, repoOverview?.status, nodePositions]);

    const relatedHashes = useMemo(() => {
      if (!hoveredHash || !dagLayout.nodeMap) return null;
      const set = new Set([hoveredHash]);
      const target = dagLayout.nodeMap.get(hoveredHash);
      if (target?.commit?.parents) {
        target.commit.parents.forEach(p => set.add(p));
      }
      dagLayout.nodes.forEach(n => {
        if (n.commit.parents && n.commit.parents.includes(hoveredHash)) {
          set.add(n.commit.hash);
        }
      });
      return set;
    }, [hoveredHash, dagLayout]);

    const handleNodeMouseDown = (e, node) => {
      if (e.button !== 0) return; // 仅左键拖拽
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.dsh-dag-copy-icon-btn')) {
        return;
      }
      e.stopPropagation();

      dragNodeRef.current = {
        hash: node.commit.hash,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startNodeX: node.x,
        startNodeY: node.y,
        hasMoved: false
      };
      setDraggingNodeHash(node.commit.hash);
    };

    const handleDagMouseDown = (e) => {
      if (e.button !== 0) return;
      if (e.target.closest('.dsh-dag-node') || e.target.closest('button') || e.target.closest('select') || e.target.closest('input')) {
        return;
      }
      setIsDragging(true);
      setDragStart({ x: e.clientX - dagPan.x, y: e.clientY - dagPan.y });
    };

    const dagZoomRef = useRef(dagZoom);
    dagZoomRef.current = dagZoom;
    const isDraggingRef = useRef(isDragging);
    isDraggingRef.current = isDragging;
    const dragStartRef = useRef(dragStart);
    dragStartRef.current = dragStart;
    const dagLayoutRef = useRef(dagLayout);
    dagLayoutRef.current = dagLayout;

    useEffect(() => {
      const handleWindowMouseMove = (e) => {
        if (dragNodeRef.current) {
          const d = dragNodeRef.current;
          const zoom = dagZoomRef.current || 1;
          const dx = (e.clientX - d.startMouseX) / zoom;
          const dy = (e.clientY - d.startMouseY) / zoom;
          if (!d.hasMoved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
            d.hasMoved = true;
          }
          if (d.hasMoved) {
            setNodePositions(prev => ({
              ...prev,
              [d.hash]: {
                x: Math.round(d.startNodeX + dx),
                y: Math.round(d.startNodeY + dy)
              }
            }));
          }
          return;
        }

        if (isDraggingRef.current) {
          setDagPan({
            x: e.clientX - dragStartRef.current.x,
            y: e.clientY - dragStartRef.current.y
          });
        }
      };

      const handleWindowMouseUp = () => {
        if (dragNodeRef.current) {
          const d = dragNodeRef.current;
          if (!d.hasMoved) {
            const targetCommit = (dagLayoutRef.current?.nodeMap?.get(d.hash))?.commit;
            if (targetCommit) {
              handleSelectCommit(targetCommit);
            }
          }
          dragNodeRef.current = null;
          setDraggingNodeHash(null);
        }
        if (isDraggingRef.current) {
          setIsDragging(false);
        }
      };

      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleWindowMouseMove);
        window.removeEventListener('mouseup', handleWindowMouseUp);
      };
    }, [handleSelectCommit]);

    const handleDagWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.12 : -0.12;
      setDagZoom(z => Math.max(0.3, Math.min(2.5, +(z + delta).toFixed(2))));
    };

    const handleResetDagView = () => {
      setDagZoom(1);
      setDagPan({ x: 30, y: 30 });
    };

    const handleResetNodePositions = () => {
      setNodePositions({});
      showToast('已复位所有节点至整齐网格排版');
    };

    const handleFitDagView = () => {
      if (!dagContainerRef.current) return;
      const { clientWidth, clientHeight } = dagContainerRef.current;
      const scaleX = (clientWidth - 60) / Math.max(300, dagLayout.width);
      const scaleY = (clientHeight - 80) / Math.max(300, dagLayout.height);
      const newZoom = Math.max(0.3, Math.min(1.2, Math.min(scaleX, scaleY)));
      setDagZoom(+newZoom.toFixed(2));
      setDagPan({ x: 30, y: 30 });
    };



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

    // Render 1: Table & Continuous Curve Subway Graph View
    const renderTableView = () => {
      return h('div', { className: 'dsh-git-table-container' },
        graphData.rows.length === 0
          ? h('div', { className: 'dsh-git-center-msg' }, '暂无匹配的 Git 提交记录')
          : [
              // Global Continuous Graph Overlay Canvas
              h('svg', {
                key: 'global-graph-canvas',
                className: 'dsh-git-graph-canvas',
                width: svgWidth,
                height: totalSvgHeight
              },
                // 1. VSCode native continuous paths with background knockout halos
                (graphData.paths || []).map((p, idx) => {
                  return h('g', { key: `path-${idx}` },
                    // Shadow / halo knockout path for clean visual depth
                    h('path', {
                      d: p.d,
                      fill: 'none',
                      stroke: 'var(--dsh-layer-0, #131418)',
                      strokeWidth: 4.5,
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round'
                    }),
                    // Crisp colored path
                    h('path', {
                      d: p.d,
                      fill: 'none',
                      stroke: p.color,
                      strokeWidth: 2,
                      strokeDasharray: p.isDashed ? '3,3' : 'none',
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round'
                    })
                  );
                }),

                // 2. Commit Vertex Dots (rendered on top of paths)
                graphData.rows.map((row, idx) => {
                  const pt = { x: row.x, y: row.y };
                  const commit = row.commit;
                  const isHead = commit.refs.some(r => r.isHead);
                  const isMerge = commit.parents && commit.parents.length > 1;
                  const isSelected = selectedCommit?.hash === commit.hash;
                  const isUncommitted = commit.isUncommitted;
                  const isDimmed = hoveredBranch && (!row.branches || !row.branches.includes(hoveredBranch));

                  return h('g', {
                    key: `dot-${commit.hash}`,
                    style: { opacity: isDimmed ? 0.25 : 1, transition: 'opacity 0.15s ease' }
                  },
                    h('circle', {
                      cx: pt.x,
                      cy: pt.y,
                      r: isHead ? 6.5 : (isMerge ? 5.5 : 4.5),
                      fill: 'var(--dsh-layer-0, #131418)'
                    }),
                    (isSelected || isHead) && h('circle', {
                      cx: pt.x,
                      cy: pt.y,
                      r: isHead ? 6 : 5.5,
                      fill: 'none',
                      stroke: isHead ? '#3b82f6' : row.color,
                      strokeWidth: 2
                    }),
                    h('circle', {
                      cx: pt.x,
                      cy: pt.y,
                      r: isUncommitted ? 3.5 : (isHead ? 3.5 : (isMerge ? 4 : 3)),
                      fill: isUncommitted ? 'transparent' : (isMerge ? 'var(--dsh-layer-0, #131418)' : row.color),
                      stroke: isUncommitted ? '#f59e0b' : (isMerge ? row.color : 'none'),
                      strokeWidth: isUncommitted ? 1.5 : (isMerge ? 2 : 0)
                    })
                  );
                })
              ),

              // HTML Commit Table Rows
              graphData.rows.map((row, idx) => {
                const commit = row.commit;
                const isSelected = selectedCommit?.hash === commit.hash;
                const isHead = commit.refs.some(r => r.isHead);
                const isDimmed = hoveredBranch && (!row.branches || !row.branches.includes(hoveredBranch));
                const isHighlighted = hoveredBranch && (row.branches && row.branches.includes(hoveredBranch));

                return h('div', {
                  key: commit.hash,
                  className: `dsh-git-commit-row ${isSelected ? 'selected' : ''} ${commit.isUncommitted ? 'uncommitted-row' : ''} ${isDimmed ? 'dimmed' : ''} ${isHighlighted ? 'highlighted-branch' : ''}`,
                  onClick: () => handleSelectCommit(commit),
                  onContextMenu: (e) => handleContextMenu(e, commit)
                },
                  // Placeholder for graph width
                  h('div', {
                    className: 'dsh-git-col-graph',
                    style: { width: svgWidth }
                  }),

                  // Description / Message & Badges
                  h('div', { className: 'dsh-git-col-desc', title: `${commit.hash} - ${commit.subject}` },
                    renderRefBadges({
                      commit,
                      branchAnalysis,
                      hoveredBranch,
                      setHoveredBranch,
                      handleCheckout,
                      showBranchIndicator: true
                    }),
                    h('span', {
                      style: {
                        fontWeight: isHead ? 600 : 400,
                        color: commit.isUncommitted ? '#f59e0b' : (isSelected ? '#fff' : 'inherit')
                      }
                    }, commit.subject)
                  ),

                  // Hash
                  h('div', {
                    className: 'dsh-git-col-hash',
                    title: '点击复制完整 Commit Hash',
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
            ]
      );
    };

    // Render 2: DAG Topology Network Graph View
    const renderDagView = () => {
      if (dagLayout.nodes.length === 0) {
        return h('div', { className: 'dsh-git-center-msg' }, '暂无匹配的 Git 提交记录');
      }

      const canvasWidth = Math.max(1200, dagLayout.width + 160);
      const canvasHeight = Math.max(800, dagLayout.height + 160);

      return h('div', { className: 'dsh-git-dag-container' },
        // DAG Auxiliary Toolbar
        h('div', { className: 'dsh-git-dag-toolbar' },
          h('div', { className: 'dsh-git-dag-toolbar-group' },
            h('span', { style: { fontWeight: 600, color: '#e2e8f0' } }, '排版流向:'),
            h('button', {
              className: `dsh-git-btn ${dagDirection === 'vertical' ? 'dsh-git-btn-primary' : ''}`,
              onClick: () => setDagDirection('vertical'),
              title: '纵向从上至下按时间流动'
            }, '↕ 纵向流向'),
            h('button', {
              className: `dsh-git-btn ${dagDirection === 'horizontal' ? 'dsh-git-btn-primary' : ''}`,
              onClick: () => setDagDirection('horizontal'),
              title: '横向从左至右时间演进'
            }, '↔ 横向流向'),
            h('button', {
              className: 'dsh-git-btn',
              onClick: () => setEdgeDirection(d => d === 'parent-to-child' ? 'child-to-parent' : 'parent-to-child'),
              title: '切换连线箭头指示方向'
            }, edgeDirection === 'parent-to-child' ? '↗ 演进 (父→子)' : '↘ 追溯 (子→父)')
          ),

          h('div', { className: 'dsh-git-dag-toolbar-group' },
            h('button', {
              className: 'dsh-git-btn',
              style: { padding: '2px 8px', fontSize: 13, fontWeight: 700 },
              onClick: () => setDagZoom(z => Math.max(0.3, +(z - 0.15).toFixed(2))),
              title: '缩小'
            }, '−'),
            h('span', { style: { minWidth: 40, textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#f1f5f9' } },
              `${Math.round(dagZoom * 100)}%`
            ),
            h('button', {
              className: 'dsh-git-btn',
              style: { padding: '2px 8px', fontSize: 13, fontWeight: 700 },
              onClick: () => setDagZoom(z => Math.min(2.5, +(z + 0.15).toFixed(2))),
              title: '放大'
            }, '+'),
            h('button', { className: 'dsh-git-btn', onClick: handleResetDagView, title: '重置缩放和视口位置' }, '1:1'),
            h('button', { className: 'dsh-git-btn', onClick: handleFitDagView, title: '适应视口大小' }, '适应'),
            h('button', {
              className: 'dsh-git-btn',
              onClick: handleResetNodePositions,
              title: '复位所有拖拽过的节点到初始整齐网格位置'
            }, '🔄 复位排版')
          ),

          h('div', { className: 'dsh-git-dag-hint' },
            `共 ${dagLayout.nodes.length} 个节点 · 按住节点可自由拖动 · 拖拽空白平移画布 · 滚轮缩放`
          )
        ),

        // DAG Viewport
        h('div', {
          ref: dagContainerRef,
          className: `dsh-git-dag-viewport ${isDragging ? 'dragging' : ''}`,
          onMouseDown: handleDagMouseDown,
          onWheel: handleDagWheel
        },
          h('div', {
            className: 'dsh-git-dag-canvas',
            style: {
              transform: `translate(${dagPan.x}px, ${dagPan.y}px) scale(${dagZoom})`,
              width: canvasWidth,
              height: canvasHeight
            }
          },
            // SVG Directed Edges (Smooth Bezier Splines)
            h('svg', {
              className: 'dsh-git-dag-edges',
              width: canvasWidth,
              height: canvasHeight
            },
              h('defs', null,
                h('marker', {
                  id: 'dag-arrow',
                  viewBox: '0 0 10 10',
                  refX: 8,
                  refY: 5,
                  markerWidth: 6,
                  markerHeight: 6,
                  orient: 'auto'
                },
                  h('path', { d: 'M 0 1 L 9 5 L 0 9 z', fill: 'rgba(255, 255, 255, 0.45)' })
                ),
                h('marker', {
                  id: 'dag-arrow-active',
                  viewBox: '0 0 10 10',
                  refX: 8,
                  refY: 5,
                  markerWidth: 7,
                  markerHeight: 7,
                  orient: 'auto'
                },
                  h('path', { d: 'M 0 1 L 9 5 L 0 9 z', fill: '#60a5fa' })
                )
              ),

              dagLayout.edges.map(edge => {
                const isRelated = relatedHashes
                  ? (relatedHashes.has(edge.childHash) && relatedHashes.has(edge.parentHash))
                  : false;
                const isDimmed = relatedHashes && !isRelated;

                return h('g', { key: edge.id },
                  // Background knockout stroke
                  h('path', {
                    d: edge.pathD,
                    fill: 'none',
                    stroke: 'var(--dsh-base, #131418)',
                    strokeWidth: isRelated ? 6.5 : 5,
                    strokeLinecap: 'round'
                  }),
                  // Foreground colorful bezier curve
                  h('path', {
                    d: edge.pathD,
                    fill: 'none',
                    stroke: isRelated ? '#60a5fa' : edge.color,
                    strokeWidth: isRelated ? 3 : 2,
                    opacity: isDimmed ? 0.2 : (isRelated ? 1 : 0.8),
                    strokeDasharray: edge.isDashed ? '4,4' : (edge.isMerge ? '5,3' : 'none'),
                    strokeLinecap: 'round',
                    markerEnd: isRelated ? 'url(#dag-arrow-active)' : 'url(#dag-arrow)'
                  })
                );
              })
            ),

            // HTML Node Cards (Draggable, Rich Details)
            dagLayout.nodes.map(node => {
              const commit = node.commit;
              const isSelected = selectedCommit?.hash === commit.hash;
              const isHovered = hoveredHash === commit.hash;
              const isRelated = relatedHashes && relatedHashes.has(commit.hash) && !isHovered;
              const isDimmed = (relatedHashes && !relatedHashes.has(commit.hash)) || (hoveredBranch && (!commit.branches || !commit.branches.includes(hoveredBranch)));
              const isHead = commit.refs.some(r => r.isHead);
              const isMerge = commit.parents && commit.parents.length > 1;
              const isDraggingNode = draggingNodeHash === commit.hash;

              let className = 'dsh-dag-node';
              if (isSelected) className += ' selected';
              if (isHovered) className += ' hovered';
              if (isRelated) className += ' related';
              if (isDimmed) className += ' dimmed';
              if (isHead) className += ' is-head-node';
              if (isDraggingNode) className += ' dragging';
              if (commit.isUncommitted) className += ' uncommitted-row';

              return h('div', {
                key: commit.hash,
                className,
                style: {
                  position: 'absolute',
                  left: node.x,
                  top: node.y,
                  width: node.width,
                  height: node.height,
                  borderLeftColor: node.color,
                  borderLeftWidth: 4,
                  borderStyle: commit.isUncommitted ? 'dashed' : 'solid'
                },
                onMouseDown: (e) => handleNodeMouseDown(e, node),
                onContextMenu: (e) => handleContextMenu(e, commit),
                onMouseEnter: () => setHoveredHash(commit.hash),
                onMouseLeave: () => setHoveredHash(null)
              },
                // Ports on 4 edges for clean topology visual
                h('div', { className: 'dsh-dag-port port-top', style: { borderColor: node.color } }),
                h('div', { className: 'dsh-dag-port port-bottom', style: { borderColor: node.color } }),
                h('div', { className: 'dsh-dag-port port-left', style: { borderColor: node.color } }),
                h('div', { className: 'dsh-dag-port port-right', style: { borderColor: node.color } }),

                // Node Header (Handle, Hash, Copy, Author, Date)
                h('div', { className: 'dsh-dag-node-header' },
                  h('div', { className: 'dsh-dag-header-left' },
                    h('span', { className: 'dsh-dag-drag-handle', title: '按住鼠标左键可拖动此节点' }, '⋮⋮'),
                    h('span', { className: 'dsh-dag-node-hash' }, commit.shortHash),
                    !commit.isUncommitted && h('button', {
                      className: 'dsh-dag-copy-icon-btn',
                      title: '复制 Commit SHA',
                      onClick: (e) => handleCopyHash(e, commit.hash, 'SHA')
                    }, '📋')
                  ),
                  h('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
                    h('span', { className: 'dsh-dag-node-author', title: `${commit.author} <${commit.authorEmail || ''}>` },
                      h('span', { className: 'dsh-git-author-avatar' }, (commit.author || '?')[0].toUpperCase()),
                      commit.author
                    ),
                    h('span', { className: 'dsh-dag-node-date', title: commit.date }, formatRelativeDate(commit.date))
                  )
                ),

                // Commit Subject
                h('div', { className: 'dsh-dag-node-subject', title: commit.subject }, commit.subject),

                // Footer (Badges, Head, Merge, Branches, Tags)
                h('div', { className: 'dsh-dag-node-footer' },
                  isMerge && h('span', { className: 'dsh-git-badge dsh-badge-merge' }, `Merge (${commit.parents.length})`),
                  renderRefBadges({
                    commit,
                    branchAnalysis,
                    hoveredBranch,
                    setHoveredBranch,
                    handleCheckout,
                    showBranchIndicator: true
                  })
                )
              );
            })
          )
        )
      );
    };

    // Render 3: Branch Topology Overview
    const renderBranchesView = () => {
      const localBranches = repoOverview?.branches?.filter(b => !b.isRemote) || [];
      const remoteBranches = repoOverview?.branches?.filter(b => b.isRemote) || [];
      const tags = repoOverview?.tags || [];

      return h('div', { className: 'dsh-git-branches-container' },
        // Summary Stats
        h('div', { className: 'dsh-git-branch-stats-bar' },
          h('div', { className: 'dsh-git-stat-card' },
            h('div', { className: 'dsh-git-stat-num', style: { color: '#60a5fa' } }, repoOverview?.currentBranch || '-'),
            h('div', { className: 'dsh-git-stat-label' }, '当前活跃分支 (HEAD)')
          ),
          h('div', { className: 'dsh-git-stat-card' },
            h('div', { className: 'dsh-git-stat-num', style: { color: '#34d399' } }, localBranches.length),
            h('div', { className: 'dsh-git-stat-label' }, '本地分支数')
          ),
          h('div', { className: 'dsh-git-stat-card' },
            h('div', { className: 'dsh-git-stat-num', style: { color: '#c084fc' } }, remoteBranches.length),
            h('div', { className: 'dsh-git-stat-label' }, '远程跟踪分支')
          ),
          h('div', { className: 'dsh-git-stat-card' },
            h('div', { className: 'dsh-git-stat-num', style: { color: '#fbbf24' } }, tags.length),
            h('div', { className: 'dsh-git-stat-label' }, '标签 (Tags)')
          )
        ),

        // Local Branches Section
        h('div', null,
          h('div', { className: 'dsh-git-branch-section-title' },
            h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
              h('line', { x1: 6, y1: 3, x2: 6, y2: 15 }),
              h('circle', { cx: 18, cy: 6, r: 3 }),
              h('circle', { cx: 6, cy: 18, r: 3 }),
              h('path', { d: 'M18 9a9 9 0 0 1-9 9' })
            ),
            '本地分支 (Local Branches)'
          ),
          h('div', { className: 'dsh-git-branch-grid' },
            localBranches.map(b => {
              const latestCommit = commits.find(c => c.refs.some(r => r.name === b.name) || (b.isHead && c.refs.some(r => r.isHead)));
              const bColor = getBranchColor(b.name);
              return h('div', {
                key: b.name,
                className: `dsh-git-branch-card ${b.isHead ? 'is-head' : ''}`,
                style: {
                  borderLeftColor: bColor,
                  borderLeftWidth: 4
                }
              },
                h('div', { className: 'dsh-git-branch-card-header' },
                  h('span', { className: 'dsh-git-branch-card-name', title: b.name },
                    h('span', {
                      className: `dsh-git-badge ${b.isHead ? 'dsh-badge-head' : 'dsh-badge-branch'}`,
                      style: b.isHead ? {} : {
                        color: bColor,
                        borderColor: `${bColor}99`,
                        backgroundColor: `${bColor}24`
                      }
                    },
                      b.isHead ? h('span', { className: 'dsh-badge-dot' }) : renderBranchIcon(),
                      b.isHead ? 'HEAD' : 'branch'
                    ),
                    h('span', { style: { fontWeight: 600, color: bColor } }, b.name)
                  ),
                  latestCommit && h('span', { className: 'dsh-dag-node-hash' }, latestCommit.shortHash)
                ),
                latestCommit && h('div', { className: 'dsh-git-branch-card-commit', title: latestCommit.subject },
                  `${latestCommit.author}: ${latestCommit.subject}`
                ),
                h('div', { className: 'dsh-git-branch-card-actions' },
                  !b.isHead && h('button', {
                    className: 'dsh-git-btn dsh-git-btn-primary',
                    style: { padding: '2px 8px', fontSize: 11 },
                    onClick: () => handleCheckout(b.name)
                  }, '检出 (Checkout)'),
                  !b.isHead && h('button', {
                    className: 'dsh-git-btn',
                    style: { padding: '2px 8px', fontSize: 11 },
                    onClick: () => handleMerge(b.name)
                  }, '合并到当前'),
                  h('button', {
                    className: 'dsh-git-btn',
                    style: { padding: '2px 8px', fontSize: 11 },
                    onClick: () => {
                      setSelectedBranch(b.name);
                      setViewMode('dag');
                      loadRepoData(b.name);
                    }
                  }, '拓扑图'),
                  h('button', {
                    className: 'dsh-git-btn',
                    style: { padding: '2px 8px', fontSize: 11 },
                    onClick: () => {
                      setSelectedBranch(b.name);
                      setViewMode('table');
                      loadRepoData(b.name);
                    }
                  }, '列表'),
                  !b.isHead && h('button', {
                    className: 'dsh-git-btn',
                    style: { padding: '2px 8px', fontSize: 11, color: '#f87171' },
                    onClick: () => handleDeleteBranch(b.name)
                  }, '删除')
                )
              );
            })
          )
        ),

        // Remote Branches Section
        remoteBranches.length > 0 && h('div', null,
          h('div', { className: 'dsh-git-branch-section-title' }, '远程跟踪分支 (Remote Branches)'),
          h('div', { className: 'dsh-git-branch-grid' },
            remoteBranches.map(b =>
              h('div', { key: b.name, className: 'dsh-git-branch-card' },
                h('div', { className: 'dsh-git-branch-card-header' },
                  h('span', { className: 'dsh-git-branch-card-name' },
                    h('span', { className: 'dsh-git-badge dsh-badge-remote' }, 'remote'),
                    b.name
                  )
                ),
                h('div', { className: 'dsh-git-branch-card-actions' },
                  h('button', {
                    className: 'dsh-git-btn',
                    style: { padding: '2px 8px', fontSize: 11 },
                    onClick: () => {
                      const localName = b.name.replace(/^origin\//, '');
                      setModal({ type: 'createBranch', targetCommit: b.name });
                      setModalInput(localName);
                    }
                  }, '从远程创建本地分支')
                )
              )
            )
          )
        ),

        // Tags Section
        tags.length > 0 && h('div', null,
          h('div', { className: 'dsh-git-branch-section-title' }, '标签 (Tags)'),
          h('div', { className: 'dsh-git-branch-grid' },
            tags.map(t =>
              h('div', { key: t, className: 'dsh-git-branch-card' },
                h('div', { className: 'dsh-git-branch-card-header' },
                  h('span', { className: 'dsh-git-branch-card-name' },
                    h('span', { className: 'dsh-git-badge dsh-badge-tag' }, 'tag'),
                    t
                  )
                ),
                h('div', { className: 'dsh-git-branch-card-actions' },
                  h('button', {
                    className: 'dsh-git-btn',
                    style: { padding: '2px 8px', fontSize: 11 },
                    onClick: () => handleCheckout(t)
                  }, '检出标签'),
                  h('button', {
                    className: 'dsh-git-btn',
                    style: { padding: '2px 8px', fontSize: 11, color: '#f87171' },
                    onClick: () => handleDeleteTag(t)
                  }, '删除')
                )
              )
            )
          )
        )
      );
    };

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

        // View Mode Switcher
        h('div', { className: 'dsh-git-toolbar-group' },
          h('div', { className: 'dsh-git-view-switcher' },
            h('button', {
              className: `dsh-git-view-tab ${viewMode === 'table' ? 'active' : ''}`,
              title: '列表图谱 (VSCode Git Graph 风格表格与轨道线)',
              onClick: () => setViewMode('table')
            },
              h('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
                h('line', { x1: 8, y1: 6, x2: 21, y2: 6 }),
                h('line', { x1: 8, y1: 12, x2: 21, y2: 12 }),
                h('line', { x1: 8, y1: 18, x2: 21, y2: 18 }),
                h('line', { x1: 3, y1: 6, x2: 3.01, y2: 6 }),
                h('line', { x1: 3, y1: 12, x2: 3.01, y2: 12 }),
                h('line', { x1: 3, y1: 18, x2: 3.01, y2: 18 })
              ),
              '列表图谱'
            ),
            h('button', {
              className: `dsh-git-view-tab ${viewMode === 'dag' ? 'active' : ''}`,
              title: 'DAG 拓扑节点图 (自由 2D 节点关系图谱、缩放平移、分支汇聚)',
              onClick: () => setViewMode('dag')
            },
              h('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
                h('circle', { cx: 18, cy: 5, r: 3 }),
                h('circle', { cx: 6, cy: 12, r: 3 }),
                h('circle', { cx: 18, cy: 19, r: 3 }),
                h('line', { x1: 8.59, y1: 13.51, x2: 15.42, y2: 17.49 }),
                h('line', { x1: 15.41, y1: 6.51, x2: 8.59, y2: 10.49 })
              ),
              '拓扑节点图'
            ),
            h('button', {
              className: `dsh-git-view-tab ${viewMode === 'branches' ? 'active' : ''}`,
              title: '分支拓扑网络 (查看所有分支派生状态、HEAD 及一键操作)',
              onClick: () => setViewMode('branches')
            },
              h('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
                h('line', { x1: 6, y1: 3, x2: 6, y2: 15 }),
                h('circle', { cx: 18, cy: 6, r: 3 }),
                h('circle', { cx: 6, cy: 18, r: 3 }),
                h('path', { d: 'M18 9a9 9 0 0 1-9 9' })
              ),
              '分支网络'
            )
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

      // 3. Main Area: Table View | DAG Topology View | Branches View
      h('div', { className: 'dsh-git-main-area' },
        selectedBranch !== 'ALL' && h('div', { className: 'dsh-git-filter-banner' },
          h('div', { className: 'dsh-git-filter-banner-text' },
            renderBranchIcon(),
            '当前分支视图: ',
            h('strong', { style: { color: getBranchColor(selectedBranch) } }, selectedBranch),
            ` (${filteredCommits.length} 个提交)`
          ),
          h('button', {
            className: 'dsh-git-btn',
            style: { padding: '1px 8px', fontSize: 11 },
            onClick: () => {
              setSelectedBranch('ALL');
              loadRepoData('ALL');
            }
          }, '显示所有分支')
        ),
        viewMode === 'table' && renderTableView(),
        viewMode === 'dag' && renderDagView(),
        viewMode === 'branches' && renderBranchesView(),
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
              onClick: () => {
                setSelectedCommit(null);
                setSelectedFile(null);
                setFileDiff(null);
              }
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
                      onClick: () => handleSelectFile(selectedCommit, file.path),
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

            // VS Code-Grade Diff Viewer
            h('div', { className: 'dsh-diff-container' },
              // 1. Diff Toolbar (File path, additions/deletions, copy diff)
              selectedFile && h('div', { className: 'dsh-diff-toolbar' },
                h('div', { className: 'dsh-diff-filepath' },
                  h('span', { style: { color: '#58a6ff', fontSize: 13 } }, '📄'),
                  h('span', null, selectedFile)
                ),
                h('div', { className: 'dsh-diff-stats' },
                  (() => {
                    const activeFileObj = commitDetails?.files?.find(f => f.path === selectedFile);
                    return [
                      activeFileObj?.additions > 0 && h('span', { key: 'add', className: 'dsh-diff-stat-add' }, `+${activeFileObj.additions}`),
                      activeFileObj?.deletions > 0 && h('span', { key: 'del', className: 'dsh-diff-stat-del' }, `-${activeFileObj.deletions}`)
                    ];
                  })(),
                  fileDiff && h('button', {
                    className: 'dsh-git-btn',
                    style: { padding: '1px 8px', fontSize: 11 },
                    onClick: (e) => handleCopyHash(e, fileDiff, 'Diff')
                  }, '复制 Diff')
                )
              ),

              // 2. Diff Body with Line Numbers & Table
              h('div', { className: 'dsh-git-diff-viewer' },
                loadingDiff
                  ? h('div', { className: 'dsh-diff-empty-state' },
                      h('div', { className: 'dsh-spinner' }),
                      h('span', null, '正在生成代码差异...')
                    )
                  : fileDiff === null
                    ? h('div', { className: 'dsh-diff-empty-state' },
                        h('div', { style: { fontSize: 24 } }, '📄'),
                        h('div', { style: { fontWeight: 600, color: '#c9d1d9' } }, '未选择文件'),
                        h('div', { style: { fontSize: 12 } }, '点击左侧文件查看代码改动差异')
                      )
                    : fileDiff.trim() === ''
                      ? h('div', { className: 'dsh-diff-empty-state' },
                          h('div', { style: { fontSize: 24 } }, '✨'),
                          h('div', { style: { fontWeight: 600, color: '#c9d1d9' } }, '该文件无内容变动'),
                          h('div', { style: { fontSize: 12 } }, '未发生实质文本修改或属于二进制文件')
                        )
                      : h('div', { className: 'dsh-diff-table' },
                          parseUnifiedDiff(fileDiff).map((dLine, lIdx) => {
                            if (dLine.type === 'hunk') {
                              return h('div', { key: lIdx, className: 'dsh-diff-row dsh-diff-row-hunk' },
                                h('div', { className: 'dsh-diff-hunk-content' }, dLine.raw)
                              );
                            }
                            if (dLine.type === 'meta') {
                              return h('div', { key: lIdx, className: 'dsh-diff-row dsh-diff-row-meta' },
                                h('div', null, dLine.raw)
                              );
                            }

                            let rowClass = 'dsh-diff-row';
                            if (dLine.type === 'added') rowClass += ' dsh-diff-row-added';
                            else if (dLine.type === 'removed') rowClass += ' dsh-diff-row-removed';

                            return h('div', { key: lIdx, className: rowClass },
                              h('div', { className: 'dsh-diff-num-old' },
                                dLine.oldLine !== null ? dLine.oldLine : ''
                              ),
                              h('div', { className: 'dsh-diff-num-new' },
                                dLine.newLine !== null ? dLine.newLine : ''
                              ),
                              h('div', { className: 'dsh-diff-marker' },
                                dLine.prefix || ' '
                              ),
                              h('div', { className: 'dsh-diff-code' },
                                dLine.raw || ' '
                              )
                            );
                          })
                        )
              )
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
    return h('span', null, 'ds-gitui');
  };
}


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
