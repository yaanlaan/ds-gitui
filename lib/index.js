/**
 * DeepSeek Harness Git Graph Plugin - Host Entry
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as gitService from './git-service.js';

export const name = 'dsh-plugin-git-graph';

export const inject = ['webServer', 'clientModules'];

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
  const logger = ctx.logger ? ctx.logger('git-graph') : console;
  logger.info('[dsh-plugin-git-graph] Host plugin initializing...');

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

          // Target cwd: from body or query, or fallback to process.cwd()
          const targetCwd = payload.cwd || parsedUrl.searchParams.get('cwd') || process.cwd();

          try {
            switch (action) {
              case 'overview': {
                const overview = await gitService.getRepoOverview(targetCwd);
                return sendJson(res, 200, { success: true, data: overview });
              }

              case 'log': {
                const branch = parsedUrl.searchParams.get('branch') || payload.branch || 'ALL';
                const maxCount = parseInt(parsedUrl.searchParams.get('maxCount') || payload.maxCount || '300', 10);
                const logResult = await gitService.getCommitLog(targetCwd, { branch, maxCount });
                return sendJson(res, 200, { success: logResult.ok, ...logResult });
              }

              case 'commit-details': {
                const hash = parsedUrl.searchParams.get('hash') || payload.hash;
                if (!hash) return sendJson(res, 400, { success: false, error: 'Commit hash is required' });
                const details = await gitService.getCommitDetails(targetCwd, hash);
                return sendJson(res, 200, { success: details.ok, ...details });
              }

              case 'diff': {
                const hash = parsedUrl.searchParams.get('hash') || payload.hash;
                const file = parsedUrl.searchParams.get('file') || payload.file;
                if (!hash || !file) return sendJson(res, 400, { success: false, error: 'hash and file are required' });
                const diff = await gitService.getFileDiff(targetCwd, hash, file);
                return sendJson(res, 200, { success: diff.ok, ...diff });
              }

              case 'stage': {
                const files = payload.files || [];
                const result = await gitService.stageFiles(targetCwd, files);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'unstage': {
                const files = payload.files || [];
                const result = await gitService.unstageFiles(targetCwd, files);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'commit': {
                const message = payload.message || '';
                const result = await gitService.commitChanges(targetCwd, message);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'checkout': {
                const target = payload.target;
                if (!target) return sendJson(res, 400, { success: false, error: 'Target is required' });
                const result = await gitService.checkoutTarget(targetCwd, target);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'create-branch': {
                const { branchName, startPoint } = payload;
                if (!branchName) return sendJson(res, 400, { success: false, error: 'Branch name is required' });
                const result = await gitService.createBranch(targetCwd, branchName, startPoint);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'delete-branch': {
                const { branchName, force } = payload;
                if (!branchName) return sendJson(res, 400, { success: false, error: 'Branch name is required' });
                const result = await gitService.deleteBranch(targetCwd, branchName, force);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'merge': {
                const { branchName } = payload;
                if (!branchName) return sendJson(res, 400, { success: false, error: 'Branch name is required' });
                const result = await gitService.mergeBranch(targetCwd, branchName);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'create-tag': {
                const { tagName, commitHash, message } = payload;
                if (!tagName) return sendJson(res, 400, { success: false, error: 'Tag name is required' });
                const result = await gitService.createTag(targetCwd, tagName, commitHash, message);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'delete-tag': {
                const { tagName } = payload;
                if (!tagName) return sendJson(res, 400, { success: false, error: 'Tag name is required' });
                const result = await gitService.deleteTag(targetCwd, tagName);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'fetch': {
                const result = await gitService.fetchRemotes(targetCwd);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'pull': {
                const result = await gitService.pullCurrent(targetCwd);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'push': {
                const result = await gitService.pushCurrent(targetCwd);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'reset': {
                const { hash, mode } = payload;
                if (!hash) return sendJson(res, 400, { success: false, error: 'Hash is required' });
                const result = await gitService.resetToCommit(targetCwd, hash, mode || 'mixed');
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'revert': {
                const { hash } = payload;
                if (!hash) return sendJson(res, 400, { success: false, error: 'Hash is required' });
                const result = await gitService.revertCommit(targetCwd, hash);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'cherry-pick': {
                const { hash } = payload;
                if (!hash) return sendJson(res, 400, { success: false, error: 'Hash is required' });
                const result = await gitService.cherryPickCommit(targetCwd, hash);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'stash-list': {
                const result = await gitService.stashList(targetCwd);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'stash-save': {
                const message = payload.message || '';
                const result = await gitService.stashSave(targetCwd, message);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              case 'stash-pop': {
                const index = payload.index || 0;
                const result = await gitService.stashPop(targetCwd, index);
                return sendJson(res, 200, { success: result.ok, ...result });
              }

              default:
                return sendJson(res, 404, { success: false, error: `Unknown action: ${action}` });
            }
          } catch (err) {
            logger.error('[dsh-plugin-git-graph] Error handling action %s:', action, err);
            return sendJson(res, 500, { success: false, error: err.message || 'Internal server error' });
          }
        }
      });
    }, 'dsh-plugin-git-graph: api route');
    logger.info('[dsh-plugin-git-graph] Mounted /api/git-graph route');
  }

  if (ctx.clientModules) {
    try {
      ctx.clientModules.rebuilt('dsh-plugin-git-graph');
      logger.info('[dsh-plugin-git-graph] Notified clientModules rebuild');
    } catch (e) {
      logger.warn('[dsh-plugin-git-graph] Could not notify clientModules:', e);
    }
  }
}
