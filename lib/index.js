/**
 * DeepSeek Harness Git Graph Plugin (ds-gitui) - Host Entry
 */
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import * as gitService from './git-service.js';

async function getGit() {
  try {
    return await import(`./git-service.js?t=${Date.now()}`);
  } catch {
    return gitService;
  }
}

export const name = 'ds-gitui';

export const inject = ['webServer', 'clientModules'];

function resolveWorkspacePath(explicitCwd, sessionId) {
  if (explicitCwd && existsSync(explicitCwd)) {
    return explicitCwd;
  }
  try {
    const wsFile = join(homedir(), '.dsh', 'storages', 'workspace.json');
    if (existsSync(wsFile)) {
      const data = JSON.parse(readFileSync(wsFile, 'utf8'));
      const workspaces = data?.tables?.workspaces || {};
      if (sessionId) {
        for (const ws of Object.values(workspaces)) {
          if (ws.sessionIds && ws.sessionIds.includes(sessionId)) {
            return ws.path;
          }
        }
      }
      const list = Object.values(workspaces).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      if (list.length > 0 && list[0].path) {
        return list[0].path;
      }
    }
  } catch (err) {}
  return explicitCwd || process.cwd();
}

function sendJson(res, statusCode, data) {
  const json = JSON.stringify(data);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(json);
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 10 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

export function apply(ctx) {
  const logger = ctx.logger ? ctx.logger('ds-gitui') : console;
  logger.info('[ds-gitui] Host plugin initializing...');

  if (ctx.webServer) {
    ctx.effect(() => {
      return ctx.webServer.register({
        kind: 'prefix',
        path: '/api/git-graph',
        handler: async (req, res) => {
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.end();
            return;
          }

          const parsedUrl = new URL(req.url, 'http://localhost');
          const pathname = parsedUrl.pathname;
          const action = pathname.replace(/^\/api\/git-graph\/?/, '').split('/')[0] || '';

          let payload = {};
          if (req.method === 'POST') {
            try {
              payload = await readBody(req);
            } catch (err) {
              return sendJson(res, 400, { success: false, error: err.message });
            }
          }

          // Target cwd: from body or query, or auto-resolved from session/workspace
          const explicitCwd = payload.cwd || parsedUrl.searchParams.get('cwd');
          const sessionId = payload.sessionId || parsedUrl.searchParams.get('sessionId');
          const targetCwd = resolveWorkspacePath(explicitCwd, sessionId);

          const git = await getGit();

          try {
            switch (action) {
              case 'workspaces': {
                const wsList = [];
                try {
                  const wsFile = join(homedir(), '.dsh', 'storages', 'workspace.json');
                  if (existsSync(wsFile)) {
                    const data = JSON.parse(readFileSync(wsFile, 'utf8'));
                    const workspaces = data?.tables?.workspaces || {};
                    for (const [id, ws] of Object.entries(workspaces)) {
                      wsList.push({ id, path: ws.path, title: ws.title, sessionIds: ws.sessionIds, updatedAt: ws.updatedAt });
                    }
                  }
                } catch (e) {}
                return sendJson(res, 200, { success: true, workspaces: wsList, currentCwd: targetCwd });
              }

              case 'overview': {
                const overview = await git.getRepoOverview(targetCwd);
                return sendJson(res, 200, { success: true, data: overview });
              }

              case 'log': {
                const branch = parsedUrl.searchParams.get('branch') || payload.branch || 'ALL';
                const maxCount = parseInt(parsedUrl.searchParams.get('maxCount') || payload.maxCount || '300', 10);
                const logResult = await git.getCommitLog(targetCwd, { branch, maxCount });
                return sendJson(res, 200, { success: logResult.ok, ...logResult });
              }

              case 'commit-details': {
                const hash = parsedUrl.searchParams.get('hash') || payload.hash;
                if (!hash) return sendJson(res, 400, { success: false, error: 'Commit hash is required' });
                const details = await git.getCommitDetails(targetCwd, hash);
                return sendJson(res, 200, { success: details.ok, ...details });
              }

              case 'diff': {
                const hash = parsedUrl.searchParams.get('hash') || payload.hash;
                const file = parsedUrl.searchParams.get('file') || payload.file;
                if (!hash || !file) return sendJson(res, 400, { success: false, error: 'hash and file are required' });
                const diff = await git.getFileDiff(targetCwd, hash, file);
                return sendJson(res, 200, { success: diff.ok, ...diff });
              }

              case 'stage': {
                const files = payload.files || [];
                const result = await git.stageFiles(targetCwd, files);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'unstage': {
                const files = payload.files || [];
                const result = await git.unstageFiles(targetCwd, files);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'commit': {
                const message = payload.message || '';
                const result = await git.commitChanges(targetCwd, message);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'checkout': {
                const target = payload.target;
                if (!target) return sendJson(res, 400, { success: false, error: 'Target is required' });
                const result = await git.checkoutTarget(targetCwd, target);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'create-branch': {
                const { branchName, startPoint } = payload;
                if (!branchName) return sendJson(res, 400, { success: false, error: 'Branch name is required' });
                const result = await git.createBranch(targetCwd, branchName, startPoint);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'delete-branch': {
                const { branchName, force } = payload;
                if (!branchName) return sendJson(res, 400, { success: false, error: 'Branch name is required' });
                const result = await git.deleteBranch(targetCwd, branchName, force);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'merge': {
                const { branchName } = payload;
                if (!branchName) return sendJson(res, 400, { success: false, error: 'Branch name is required' });
                const result = await git.mergeBranch(targetCwd, branchName);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'create-tag': {
                const { tagName, commitHash, message } = payload;
                if (!tagName) return sendJson(res, 400, { success: false, error: 'Tag name is required' });
                const result = await git.createTag(targetCwd, tagName, commitHash, message);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'delete-tag': {
                const { tagName } = payload;
                if (!tagName) return sendJson(res, 400, { success: false, error: 'Tag name is required' });
                const result = await git.deleteTag(targetCwd, tagName);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'fetch': {
                const result = await git.fetchRemotes(targetCwd);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'pull': {
                const result = await git.pullCurrent(targetCwd);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'push': {
                const result = await git.pushCurrent(targetCwd);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'reset': {
                const { hash, mode } = payload;
                if (!hash) return sendJson(res, 400, { success: false, error: 'Hash is required' });
                const result = await git.resetToCommit(targetCwd, hash, mode || 'mixed');
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'revert': {
                const { hash } = payload;
                if (!hash) return sendJson(res, 400, { success: false, error: 'Hash is required' });
                const result = await git.revertCommit(targetCwd, hash);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'cherry-pick': {
                const { hash } = payload;
                if (!hash) return sendJson(res, 400, { success: false, error: 'Hash is required' });
                const result = await git.cherryPickCommit(targetCwd, hash);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'stash-list': {
                const result = await git.stashList(targetCwd);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'stash-save': {
                const message = payload.message || '';
                const result = await git.stashSave(targetCwd, message);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'stash-pop': {
                const index = payload.index || 0;
                const result = await git.stashPop(targetCwd, index);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              default:
                return sendJson(res, 404, { success: false, error: `Unknown action: ${action}` });
            }
          } catch (err) {
            logger.error('[ds-gitui] Error handling action %s:', action, err);
            return sendJson(res, 500, { success: false, error: err.message || 'Internal server error' });
          }
        }
      });
    }, 'ds-gitui: api route');
    logger.info('[ds-gitui] Mounted /api/git-graph route');
  }

  if (ctx.clientModules) {
    try {
      ctx.clientModules.rebuilt('ds-gitui');
      logger.info('[ds-gitui] Notified clientModules rebuild');
    } catch (e) {
      logger.warn('[ds-gitui] Could not notify clientModules:', e);
    }
  }
}
