export const GIT_GRAPH_STYLES = `
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
  padding: 0 6px;
  height: 18px;
  line-height: 18px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 9px;
  white-space: nowrap;
}

.dsh-badge-branch {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.4);
}

.dsh-badge-head {
  background: rgba(59, 130, 246, 0.25);
  color: #93c5fd;
  border: 1px solid #3b82f6;
  font-weight: 600;
}

.dsh-badge-remote {
  background: rgba(147, 51, 234, 0.15);
  color: #c084fc;
  border: 1px solid rgba(147, 51, 234, 0.4);
}

.dsh-badge-tag {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.dsh-badge-uncommitted {
  background: rgba(239, 68, 68, 0.15);
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

.dsh-diff-meta {
  color: #6e7681;
  font-style: italic;
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
