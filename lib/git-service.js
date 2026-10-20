import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const execFileAsync = promisify(execFile);

/**
 * Run git command with arguments in specified directory
 */
export async function runGit(cwd, args, options = {}) {
  try {
    const { stdout, stderr } = await execFileAsync('git', args, {
      cwd,
      maxBuffer: 20 * 1024 * 1024,
      encoding: 'utf8',
      windowsHide: true,
      ...options
    });
    return { ok: true, stdout: stdout.trim(), stderr: stderr.trim() };
  } catch (error) {
    return {
      ok: false,
      error: error.stderr?.trim() || error.message || 'Git execution error',
      code: error.code
    };
  }
}

/**
 * Check if the directory is a git repository
 */
export async function checkIsGitRepo(cwd) {
  const res = await runGit(cwd, ['rev-parse', '--is-inside-work-tree']);
  if (!res.ok || res.stdout !== 'true') {
    return { isRepo: false, root: null };
  }
  const rootRes = await runGit(cwd, ['rev-parse', '--show-toplevel']);
  return {
    isRepo: true,
    root: rootRes.ok ? rootRes.stdout : cwd
  };
}

/**
 * Get basic repository info: branch, remotes, status
 */
export async function getRepoOverview(cwd) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) {
    return { isRepo: false };
  }

  const root = isRepoCheck.root;

  // Current branch
  let currentBranch = 'HEAD';
  const branchRes = await runGit(root, ['symbolic-ref', '--short', 'HEAD']);
  if (branchRes.ok && branchRes.stdout) {
    currentBranch = branchRes.stdout;
  } else {
    // Detached head
    const headRes = await runGit(root, ['rev-parse', '--short', 'HEAD']);
    currentBranch = headRes.ok ? `(HEAD detached at ${headRes.stdout})` : 'HEAD';
  }

  // All branches
  const branches = [];
  const branchListRes = await runGit(root, [
    'branch',
    '-a',
    '--format=%(refname)|%(refname:short)|%(HEAD)|%(upstream:short)|%(objectname:short)'
  ]);
  if (branchListRes.ok && branchListRes.stdout) {
    for (const line of branchListRes.stdout.split('\n')) {
      if (!line.trim()) continue;
      const [refname, name, isHead, upstream, commitHash] = line.split('|');
      const isRemote = refname.startsWith('refs/remotes/');
      branches.push({
        ref: refname,
        name,
        isRemote,
        isHead: isHead.trim() === '*',
        upstream: upstream || null,
        commitHash
      });
    }
  }

  // Remotes
  const remotes = [];
  const remoteRes = await runGit(root, ['remote', '-v']);
  if (remoteRes.ok && remoteRes.stdout) {
    const seen = new Set();
    for (const line of remoteRes.stdout.split('\n')) {
      const parts = line.split(/\s+/);
      if (parts.length >= 2 && !seen.has(parts[0])) {
        seen.add(parts[0]);
        remotes.push({ name: parts[0], url: parts[1] });
      }
    }
  }

  // Tags
  const tags = [];
  const tagRes = await runGit(root, ['tag', '-l', '--sort=-creatordate']);
  if (tagRes.ok && tagRes.stdout) {
    for (const t of tagRes.stdout.split('\n')) {
      if (t.trim()) tags.push(t.trim());
    }
  }

  // Working tree status summary
  const statusRes = await runGit(root, ['status', '--porcelain=v1']);
  const dirty = statusRes.ok && statusRes.stdout.length > 0;
  let stagedCount = 0;
  let unstagedCount = 0;
  let untrackedCount = 0;

  if (dirty) {
    for (const line of statusRes.stdout.split('\n')) {
      if (line.length < 2) continue;
      const x = line[0];
      const y = line[1];
      if (x === '?' && y === '?') {
        untrackedCount++;
      } else {
        if (x !== ' ' && x !== '?') stagedCount++;
        if (y !== ' ') unstagedCount++;
      }
    }
  }

  return {
    isRepo: true,
    root,
    currentBranch,
    branches,
    remotes,
    tags,
    status: {
      dirty,
      stagedCount,
      unstagedCount,
      untrackedCount
    }
  };
}

/**
 * Parse refs from git log %d output like (HEAD -> main, origin/main, tag: v1.0)
 */
function parseDecorations(decorationsStr) {
  if (!decorationsStr) return [];
  const str = decorationsStr.trim().replace(/^\(|\)$/g, '');
  if (!str) return [];

  const tokens = str.split(',').map(s => s.trim()).filter(Boolean);
  const refs = [];

  for (const token of tokens) {
    if (token.startsWith('HEAD -> ')) {
      refs.push({ type: 'head', name: 'HEAD' });
      refs.push({ type: 'branch', name: token.slice(8) });
    } else if (token === 'HEAD') {
      refs.push({ type: 'head', name: 'HEAD' });
    } else if (token.startsWith('tag: ')) {
      refs.push({ type: 'tag', name: token.slice(5) });
    } else if (token.includes('/')) {
      refs.push({ type: 'remote', name: token });
    } else {
      refs.push({ type: 'branch', name: token });
    }
  }
  return refs;
}

/**
 * Get commit log with graph structure
 */
export async function getCommitLog(cwd, options = {}) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) {
    return { ok: false, error: 'Not a git repository' };
  }
  const root = isRepoCheck.root;
  const maxCount = options.maxCount || 300;
  const branchFilter = options.branch;

  const logArgs = [
    'log',
    '--topo-order',
    '--date=iso-strict',
    `--pretty=format:%H|%h|%p|%an|%ae|%at|%ad|%s|%d`,
    `-n`,
    String(maxCount)
  ];

  if (branchFilter && branchFilter !== 'ALL') {
    logArgs.push(branchFilter);
  } else {
    logArgs.push('--all');
  }

  const logRes = await runGit(root, logArgs);
  if (!logRes.ok) {
    // Maybe an empty repository with no commits yet
    const statusRes = await runGit(root, ['status', '--porcelain=v1']);
    return {
      ok: true,
      commits: [],
      hasUncommitted: statusRes.ok && statusRes.stdout.length > 0,
      isEmpty: true
    };
  }

  const lines = logRes.stdout.split('\n');
  const commits = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split('|');
    if (parts.length < 8) continue;

    const hash = parts[0];
    const shortHash = parts[1];
    const parentList = parts[2] ? parts[2].split(' ').filter(Boolean) : [];
    const author = parts[3];
    const email = parts[4];
    const timestamp = parseInt(parts[5], 10) * 1000;
    const dateStr = parts[6];
    const subject = parts[7];
    const decorations = parts.slice(8).join('|');

    const refs = parseDecorations(decorations);

    commits.push({
      hash,
      shortHash,
      parents: parentList,
      author,
      email,
      timestamp,
      date: dateStr,
      subject,
      refs,
      isHead: refs.some(r => r.type === 'head')
    });
  }

  // Check if there are uncommitted changes
  const statusRes = await runGit(root, ['status', '--porcelain=v1']);
  const hasUncommitted = statusRes.ok && statusRes.stdout.trim().length > 0;

  if (hasUncommitted && commits.length > 0) {
    const headCommit = commits.find(c => c.isHead) || commits[0];
    commits.unshift({
      hash: '*uncommitted*',
      shortHash: '*uncomm*',
      parents: headCommit ? [headCommit.hash] : [],
      author: 'You',
      email: '',
      timestamp: Date.now(),
      date: new Date().toISOString(),
      subject: '未提交的修改 (Uncommitted changes)',
      refs: [{ type: 'uncommitted', name: 'Worktree' }],
      isHead: false,
      isUncommitted: true
    });
  }

  return {
    ok: true,
    commits,
    hasUncommitted,
    isEmpty: commits.length === 0
  };
}

/**
 * Get details of a single commit, including changed files
 */
export async function getCommitDetails(cwd, hash) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) {
    return { ok: false, error: 'Not a git repository' };
  }
  const root = isRepoCheck.root;

  if (hash === '*uncommitted*') {
    // Uncommitted changes details
    const statusRes = await runGit(root, ['status', '--porcelain=u']);
    if (!statusRes.ok) return { ok: false, error: statusRes.error };

    const files = [];
    for (const line of statusRes.stdout.split('\n')) {
      if (line.length < 3) continue;
      const x = line[0];
      const y = line[1];
      const filePath = line.slice(3).trim();

      let status = 'modified';
      let staged = false;

      if (x === '?' && y === '?') {
        status = 'untracked';
      } else {
        if (x !== ' ') {
          staged = true;
          status = x === 'A' ? 'added' : x === 'D' ? 'deleted' : x === 'R' ? 'renamed' : 'modified';
        } else if (y !== ' ') {
          staged = false;
          status = y === 'M' ? 'modified' : y === 'D' ? 'deleted' : 'modified';
        }
      }

      files.push({
        path: filePath,
        status,
        staged,
        additions: 0,
        deletions: 0
      });
    }

    return {
      ok: true,
      details: {
        hash: '*uncommitted*',
        shortHash: '*uncomm*',
        subject: '未提交的修改 (Uncommitted changes)',
        body: '工作区或暂存区中尚未提交的文件改动',
        author: 'Current User',
        email: '',
        date: new Date().toISOString(),
        parents: [],
        files
      }
    };
  }

  // Real commit details
  // 1. Commit message body
  const bodyRes = await runGit(root, ['show', '-s', '--format=%B', hash]);
  const fullMessage = bodyRes.ok ? bodyRes.stdout : '';

  // 2. Commit meta
  const metaRes = await runGit(root, [
    'show',
    '-s',
    '--format=%an|%ae|%ad|%P',
    '--date=iso-strict',
    hash
  ]);
  let author = '';
  let email = '';
  let date = '';
  let parents = [];
  if (metaRes.ok && metaRes.stdout) {
    const parts = metaRes.stdout.split('|');
    author = parts[0] || '';
    email = parts[1] || '';
    date = parts[2] || '';
    parents = parts[3] ? parts[3].split(' ').filter(Boolean) : [];
  }

  // 3. Changed files & stats (numstat)
  const numstatRes = await runGit(root, ['show', '--numstat', '--format=', hash]);
  const statusMap = new Map();

  // Status code (A, M, D, R)
  const nameStatusRes = await runGit(root, ['diff-tree', '--no-commit-id', '--name-status', '-r', hash]);
  if (nameStatusRes.ok && nameStatusRes.stdout) {
    for (const line of nameStatusRes.stdout.split('\n')) {
      const parts = line.split('\t');
      if (parts.length >= 2) {
        const statusCode = parts[0][0];
        const filePath = parts[parts.length - 1];
        const status = statusCode === 'A' ? 'added' : statusCode === 'D' ? 'deleted' : statusCode === 'R' ? 'renamed' : 'modified';
        statusMap.set(filePath, status);
      }
    }
  }

  const files = [];
  if (numstatRes.ok && numstatRes.stdout) {
    for (const line of numstatRes.stdout.split('\n')) {
      const parts = line.split('\t');
      if (parts.length >= 3) {
        const adds = parts[0] === '-' ? 0 : parseInt(parts[0], 10) || 0;
        const dels = parts[1] === '-' ? 0 : parseInt(parts[1], 10) || 0;
        const filePath = parts[2];
        const status = statusMap.get(filePath) || 'modified';
        files.push({
          path: filePath,
          status,
          additions: adds,
          deletions: dels
        });
      }
    }
  }

  return {
    ok: true,
    details: {
      hash,
      shortHash: hash.slice(0, 7),
      subject: fullMessage.split('\n')[0] || '',
      body: fullMessage,
      author,
      email,
      date,
      parents,
      files
    }
  };
}

/**
 * Get unified diff for a single file in a commit or uncommitted worktree
 */
export async function getFileDiff(cwd, hash, filePath) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) {
    return { ok: false, error: 'Not a git repository' };
  }
  const root = isRepoCheck.root;

  if (hash === '*uncommitted*') {
    // Try unstaged diff first
    let diffRes = await runGit(root, ['diff', '--', filePath]);
    if (!diffRes.ok || !diffRes.stdout) {
      // Try staged diff
      diffRes = await runGit(root, ['diff', '--cached', '--', filePath]);
    }
    if (!diffRes.ok || !diffRes.stdout) {
      // Untracked file: read full content as newly added
      try {
        const content = await readFile(join(root, filePath), 'utf8');
        const lines = content.split('\n');
        const fakeDiff = [
          `--- /dev/null`,
          `+++ b/${filePath}`,
          `@@ -0,0 +1,${lines.length} @@`,
          ...lines.map(l => `+${l}`)
        ].join('\n');
        return { ok: true, diff: fakeDiff };
      } catch (e) {
        return { ok: true, diff: 'Binary or unavailable file.' };
      }
    }
    return { ok: true, diff: diffRes.stdout };
  }

  // Real commit diff
  const diffRes = await runGit(root, ['show', hash, '--', filePath]);
  if (!diffRes.ok) {
    return { ok: false, error: diffRes.error };
  }
  return { ok: true, diff: diffRes.stdout };
}

/**
 * Stage files (git add)
 */
export async function stageFiles(cwd, files) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) return { ok: false, error: 'Not a git repo' };
  const root = isRepoCheck.root;

  if (!files || files.length === 0 || files.includes('.')) {
    return runGit(root, ['add', '-A']);
  }
  return runGit(root, ['add', '--', ...files]);
}

/**
 * Unstage files (git restore --staged)
 */
export async function unstageFiles(cwd, files) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) return { ok: false, error: 'Not a git repo' };
  const root = isRepoCheck.root;

  if (!files || files.length === 0 || files.includes('.')) {
    return runGit(root, ['restore', '--staged', '.']);
  }
  return runGit(root, ['restore', '--staged', '--', ...files]);
}

/**
 * Commit staged changes
 */
export async function commitChanges(cwd, message) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) return { ok: false, error: 'Not a git repo' };
  const root = isRepoCheck.root;

  if (!message || !message.trim()) {
    return { ok: false, error: 'Commit message cannot be empty' };
  }
  return runGit(root, ['commit', '-m', message.trim()]);
}

/**
 * Checkout branch or commit
 */
export async function checkoutTarget(cwd, target) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) return { ok: false, error: 'Not a git repo' };
  const root = isRepoCheck.root;

  return runGit(root, ['checkout', target]);
}

/**
 * Create a new branch
 */
export async function createBranch(cwd, branchName, startPoint) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) return { ok: false, error: 'Not a git repo' };
  const root = isRepoCheck.root;

  const args = ['branch', branchName.trim()];
  if (startPoint) args.push(startPoint);
  return runGit(root, args);
}

/**
 * Delete a branch
 */
export async function deleteBranch(cwd, branchName, force = false) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) return { ok: false, error: 'Not a git repo' };
  const root = isRepoCheck.root;

  return runGit(root, ['branch', force ? '-D' : '-d', branchName]);
}

/**
 * Merge a branch into current HEAD
 */
export async function mergeBranch(cwd, branchName) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) return { ok: false, error: 'Not a git repo' };
  const root = isRepoCheck.root;

  return runGit(root, ['merge', branchName]);
}

/**
 * Create tag
 */
export async function createTag(cwd, tagName, commitHash, message) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) return { ok: false, error: 'Not a git repo' };
  const root = isRepoCheck.root;

  const args = ['tag'];
  if (message && message.trim()) {
    args.push('-a', tagName.trim(), '-m', message.trim());
  } else {
    args.push(tagName.trim());
  }
  if (commitHash) args.push(commitHash);

  return runGit(root, args);
}

/**
 * Delete tag
 */
export async function deleteTag(cwd, tagName) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) return { ok: false, error: 'Not a git repo' };
  const root = isRepoCheck.root;

  return runGit(root, ['tag', '-d', tagName.trim()]);
}

/**
 * Git Fetch
 */
export async function fetchRemotes(cwd) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) return { ok: false, error: 'Not a git repo' };
  const root = isRepoCheck.root;

  return runGit(root, ['fetch', '--all', '--prune']);
}

/**
 * Git Pull
 */
export async function pullCurrent(cwd) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) return { ok: false, error: 'Not a git repo' };
  const root = isRepoCheck.root;

  return runGit(root, ['pull']);
}

/**
 * Git Push
 */
export async function pushCurrent(cwd) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) return { ok: false, error: 'Not a git repo' };
  const root = isRepoCheck.root;

  return runGit(root, ['push']);
}

/**
 * Git Reset (soft, mixed, hard)
 */
export async function resetToCommit(cwd, commitHash, mode = 'mixed') {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) return { ok: false, error: 'Not a git repo' };
  const root = isRepoCheck.root;

  return runGit(root, ['reset', `--${mode}`, commitHash]);
}

/**
 * Git Revert
 */
export async function revertCommit(cwd, commitHash) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) return { ok: false, error: 'Not a git repo' };
  const root = isRepoCheck.root;

  return runGit(root, ['revert', '--no-edit', commitHash]);
}

/**
 * Git Cherry-pick
 */
export async function cherryPickCommit(cwd, commitHash) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) return { ok: false, error: 'Not a git repo' };
  const root = isRepoCheck.root;

  return runGit(root, ['cherry-pick', commitHash]);
}

/**
 * Git Stash list
 */
export async function stashList(cwd) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) return { ok: false, error: 'Not a git repo' };
  const root = isRepoCheck.root;

  const res = await runGit(root, ['stash', 'list']);
  if (!res.ok) return res;

  const stashes = [];
  for (const line of res.stdout.split('\n')) {
    if (!line.trim()) continue;
    const match = line.match(/^(stash@\{(\d+)\}):\s*(.*)$/);
    if (match) {
      stashes.push({
        ref: match[1],
        index: parseInt(match[2], 10),
        message: match[3]
      });
    }
  }
  return { ok: true, stashes };
}

/**
 * Git Stash save
 */
export async function stashSave(cwd, message) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) return { ok: false, error: 'Not a git repo' };
  const root = isRepoCheck.root;

  const args = ['stash', 'push'];
  if (message && message.trim()) {
    args.push('-m', message.trim());
  }
  return runGit(root, args);
}

/**
 * Git Stash pop
 */
export async function stashPop(cwd, index = 0) {
  const isRepoCheck = await checkIsGitRepo(cwd);
  if (!isRepoCheck.isRepo) return { ok: false, error: 'Not a git repo' };
  const root = isRepoCheck.root;

  return runGit(root, ['stash', 'pop', `stash@{${index}}`]);
}
