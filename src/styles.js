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
`;
