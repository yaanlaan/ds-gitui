/**
 * DeepSeek Harness Git Graph Plugin - React View Component
 * Uses React.createElement (h) for zero-dependency native execution in Cordis/Electron/Browser
 */

const COLORS = [
  '#eab308', // yellow / gold (VSCode primary trunk)
  '#38bdf8', // light blue / cyan
  '#34d399', // emerald / green
  '#f472b6', // pink
  '#a78bfa', // purple
  '#fb923c', // orange
  '#22d3ee', // teal
  '#f87171'  // coral red
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
  if (!commits || commits.length === 0) {
    return { rows: [], verticalLines: [], curves: [], maxLane: 0 };
  }

  // Normalize parents to full hashes using lookup map
  const fullMap = new Map();
  commits.forEach(c => {
    if (c.hash) fullMap.set(c.hash, c.hash);
    if (c.shortHash) fullMap.set(c.shortHash, c.hash);
    if (c.hash && c.hash.length >= 7) fullMap.set(c.hash.slice(0, 7), c.hash);
  });

  const normalizedCommits = commits.map(c => ({
    ...c,
    parents: (c.parents || []).map(p => fullMap.get(p) || p)
  }));

  const commitIndex = new Map();
  normalizedCommits.forEach((c, i) => commitIndex.set(c.hash, i));

  const lanes = []; // array of { hash, colorIndex } or null
  const rows = [];
  const rawConnections = [];
  let nextColorIndex = 0;

  for (let i = 0; i < normalizedCommits.length; i++) {
    const commit = normalizedCommits[i];
    let lane = lanes.findIndex(l => l && l.hash === commit.hash);
    let colorIdx = 0;

    if (lane === -1) {
      const freeIdx = lanes.findIndex(l => l === null);
      if (freeIdx === -1) {
        lane = lanes.length;
        colorIdx = nextColorIndex++;
        lanes.push({ hash: null, colorIndex: colorIdx });
      } else {
        lane = freeIdx;
        colorIdx = nextColorIndex++;
        lanes[lane] = { hash: null, colorIndex: colorIdx };
      }
    } else {
      colorIdx = lanes[lane].colorIndex;
    }

    rows.push({
      commit,
      lane,
      color: COLORS[colorIdx % COLORS.length],
      colorIndex: colorIdx
    });

    // Vacate current commit's slot in its lane
    lanes[lane] = null;

    // Connect to parents
    if (commit.parents && commit.parents.length > 0) {
      commit.parents.forEach((parentHash, pIdx) => {
        let pLane = lanes.findIndex(l => l && l.hash === parentHash);
        let pColorIdx = colorIdx;

        if (pLane === -1) {
          if (pIdx === 0 && lanes[lane] === null) {
            pLane = lane;
            pColorIdx = colorIdx;
            lanes[pLane] = { hash: parentHash, colorIndex: pColorIdx };
          } else {
            const freeIdx = lanes.findIndex(l => l === null);
            if (freeIdx === -1) {
              pLane = lanes.length;
              pColorIdx = nextColorIndex++;
              lanes.push({ hash: parentHash, colorIndex: pColorIdx });
            } else {
              pLane = freeIdx;
              pColorIdx = nextColorIndex++;
              lanes[pLane] = { hash: parentHash, colorIndex: pColorIdx };
            }
          }
        } else {
          pColorIdx = lanes[pLane].colorIndex;
        }

        const parentRow = commitIndex.get(parentHash);
        if (parentRow !== undefined) {
          // If fork from parent into new branch, use the branch color; if merge into parent, use parent's color
          const connectionColor = pIdx === 0
            ? (lane !== pLane ? COLORS[colorIdx % COLORS.length] : COLORS[pColorIdx % COLORS.length])
            : COLORS[pColorIdx % COLORS.length];

          rawConnections.push({
            fromRow: i,
            fromLane: lane,
            toRow: parentRow,
            toLane: pLane,
            color: connectionColor,
            isPrimary: pIdx === 0,
            isDashed: commit.isUncommitted || false
          });
        }
      });
    }

    // Trim trailing empty lanes
    while (lanes.length > 0 && lanes[lanes.length - 1] === null) {
      lanes.pop();
    }
  }

  // Decompose into continuous vertical lines and smooth S-curves
  const verticalIntervals = new Map(); // `${lane}_${color}_${isDashed}` -> [[fromRow, toRow], ...]
  const curves = [];

  function addVertical(lane, color, minR, maxR, isDashed = false) {
    if (minR >= maxR) return;
    const key = `${lane}_${color}_${isDashed}`;
    if (!verticalIntervals.has(key)) verticalIntervals.set(key, []);
    verticalIntervals.get(key).push([minR, maxR]);
  }

  rawConnections.forEach(conn => {
    if (conn.fromLane === conn.toLane) {
      addVertical(conn.fromLane, conn.color, conn.fromRow, conn.toRow, conn.isDashed);
    } else if (conn.toRow === conn.fromRow + 1) {
      curves.push({
        fromLane: conn.fromLane,
        fromRow: conn.fromRow,
        toLane: conn.toLane,
        toRow: conn.toRow,
        color: conn.color,
        isDashed: conn.isDashed
      });
    } else {
      // Transition from fromLane at fromRow into toLane at fromRow + 1
      curves.push({
        fromLane: conn.fromLane,
        fromRow: conn.fromRow,
        toLane: conn.toLane,
        toRow: conn.fromRow + 1,
        color: conn.color,
        isDashed: conn.isDashed
      });
      // Then straight line on toLane down to toRow
      addVertical(conn.toLane, conn.color, conn.fromRow + 1, conn.toRow, conn.isDashed);
    }
  });

  // Merge overlapping / contiguous vertical line intervals
  const verticalLines = [];
  verticalIntervals.forEach((intervals, key) => {
    const [laneStr, color, dashedStr] = key.split('_');
    const lane = parseInt(laneStr, 10);
    const isDashed = dashedStr === 'true';
    intervals.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    let cur = null;
    intervals.forEach(iv => {
      if (!cur) {
        cur = [iv[0], iv[1]];
      } else if (iv[0] <= cur[1]) {
        cur[1] = Math.max(cur[1], iv[1]);
      } else {
        verticalLines.push({ lane, color, isDashed, fromRow: cur[0], toRow: cur[1] });
        cur = [iv[0], iv[1]];
      }
    });
    if (cur) {
      verticalLines.push({ lane, color, isDashed, fromRow: cur[0], toRow: cur[1] });
    }
  });

  const maxLane = Math.max(
    0,
    ...rows.map(r => r.lane),
    ...verticalLines.map(v => v.lane),
    ...curves.map(c => Math.max(c.fromLane, c.toLane))
  );

  return { rows, verticalLines, curves, maxLane };
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

export function createGitGraphComponent(React) {
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
    const [viewMode, setViewMode] = useState('table'); // 'table' | 'dag' | 'branches'
    const [dagDirection, setDagDirection] = useState('vertical'); // 'vertical' | 'horizontal'
    const [dagZoom, setDagZoom] = useState(1);
    const [dagPan, setDagPan] = useState({ x: 30, y: 30 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hoveredHash, setHoveredHash] = useState(null);
    const [edgeDirection, setEdgeDirection] = useState('parent-to-child'); // 'parent-to-child' | 'child-to-parent'
    const dagContainerRef = useRef(null);

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
        let targetHash = commitOrHash;
        if (typeof commitOrHash === 'object' && commitOrHash !== null) {
          if (commitOrHash.isUncommitted || commitOrHash.hash === '*uncommitted*') {
            targetHash = '*uncommitted*';
          } else if (commitOrHash.parents && commitOrHash.parents.length > 1) {
            targetHash = `${commitOrHash.parents[0]}..${commitOrHash.hash}`;
          } else {
            targetHash = commitOrHash.hash;
          }
        } else if (typeof commitOrHash === 'string') {
          if (selectedCommit && selectedCommit.hash === commitOrHash) {
            if (selectedCommit.parents && selectedCommit.parents.length > 1) {
              targetHash = `${selectedCommit.parents[0]}..${selectedCommit.hash}`;
            }
          }
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
    }, [apiCall, selectedCommit]);

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

    const laneWidth = 14;
    const rowHeight = 24;
    const xOffset = 12;
    const svgWidth = Math.max(48, (graphData.maxLane + 1) * laneWidth + 14);
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
      const W = isVertical ? 240 : 210;
      const H = isVertical ? 68 : 64;
      const gapX = isVertical ? 40 : 50;
      const gapY = isVertical ? 32 : 30;
      const padX = 40;
      const padY = 40;

      const nodes = [];
      const nodeMap = new Map();
      let maxCol = 0;
      let maxRow = 0;

      const rows = graphData.rows;
      const total = rows.length;

      // Check if dirty for uncommitted node
      const hasUncommitted = !!repoOverview?.status?.dirty;
      const rowOffset = (hasUncommitted && isVertical) ? 1 : 0;

      if (hasUncommitted) {
        const headRow = rows.find(r => r.commit.refs.some(rf => rf.isHead)) || rows[0];
        const uncommittedCommit = {
          hash: '*uncommitted*',
          shortHash: '*uncomm*',
          subject: `未提交修改 (${repoOverview.status.stagedCount || 0} 暂存 / ${repoOverview.status.unstagedCount || 0} 未暂存)`,
          author: '工作区',
          authorEmail: '',
          date: new Date().toISOString(),
          parents: headRow ? [headRow.commit.hash] : [],
          refs: [{ name: 'WORKING TREE', isHead: false, isTag: false, isRemote: false, isUncommitted: true }],
          isUncommitted: true
        };
        const headLane = headRow ? headRow.lane : 0;
        const uncommittedX = isVertical ? (padX + headLane * (W + gapX)) : (padX + total * (W + gapX));
        const uncommittedY = isVertical ? padY : (padY + headLane * (H + gapY));

        if (!isVertical && total > maxCol) maxCol = total;
        if (headLane > (isVertical ? maxCol : maxRow)) {
          if (isVertical) maxCol = headLane;
          else maxRow = headLane;
        }

        const uncommittedNode = {
          commit: uncommittedCommit,
          lane: headLane,
          color: '#f59e0b',
          colorIndex: 99,
          x: uncommittedX,
          y: uncommittedY,
          width: W,
          height: H,
          connectors: {
            top: { x: uncommittedX + W / 2, y: uncommittedY },
            bottom: { x: uncommittedX + W / 2, y: uncommittedY + H },
            left: { x: uncommittedX, y: uncommittedY + H / 2 },
            right: { x: uncommittedX + W, y: uncommittedY + H / 2 }
          }
        };
        nodes.push(uncommittedNode);
        nodeMap.set('*uncommitted*', uncommittedNode);
        nodeMap.set('*uncomm*', uncommittedNode);
      }

      for (let i = 0; i < total; i++) {
        const row = rows[i];
        const commit = row.commit;
        const lane = row.lane;

        let x, y;
        if (isVertical) {
          x = padX + lane * (W + gapX);
          y = padY + (i + rowOffset) * (H + gapY);
          if (lane > maxCol) maxCol = lane;
          if ((i + rowOffset) > maxRow) maxRow = (i + rowOffset);
        } else {
          const col = (total - 1 - i);
          x = padX + col * (W + gapX);
          y = padY + lane * (H + gapY);
          if (col > maxCol) maxCol = col;
          if (lane > maxRow) maxRow = lane;
        }

        const node = {
          commit,
          lane,
          color: row.color,
          colorIndex: row.colorIndex,
          x,
          y,
          width: W,
          height: H,
          connectors: {
            top: { x: x + W / 2, y },
            bottom: { x: x + W / 2, y: y + H },
            left: { x, y: y + H / 2 },
            right: { x: x + W, y: y + H / 2 }
          }
        };

        nodes.push(node);
        nodeMap.set(commit.hash, node);
        if (commit.shortHash) nodeMap.set(commit.shortHash, node);
        if (commit.hash && commit.hash.length >= 7) nodeMap.set(commit.hash.slice(0, 7), node);
      }

      // Compute Directed Edges
      const edges = [];
      for (let i = 0; i < nodes.length; i++) {
        const childNode = nodes[i];
        const childCommit = childNode.commit;
        const parents = childCommit.parents || [];

        for (let pIdx = 0; pIdx < parents.length; pIdx++) {
          const pHash = parents[pIdx];
          const parentNode = nodeMap.get(pHash);
          if (!parentNode) continue;

          let p1, p2, pathD;
          if (isVertical) {
            if (edgeDirection === 'parent-to-child') {
              p1 = parentNode.connectors.top;
              p2 = childNode.connectors.bottom;
              const dy = Math.abs(p1.y - p2.y);
              const cp = Math.max(16, dy * 0.5);
              pathD = `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y - cp}, ${p2.x} ${p2.y + cp}, ${p2.x} ${p2.y}`;
            } else {
              p1 = childNode.connectors.bottom;
              p2 = parentNode.connectors.top;
              const dy = Math.abs(p2.y - p1.y);
              const cp = Math.max(16, dy * 0.5);
              pathD = `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + cp}, ${p2.x} ${p2.y - cp}, ${p2.x} ${p2.y}`;
            }
          } else {
            if (edgeDirection === 'parent-to-child') {
              p1 = parentNode.connectors.right;
              p2 = childNode.connectors.left;
              const dx = Math.abs(p2.x - p1.x);
              const cp = Math.max(20, dx * 0.5);
              pathD = `M ${p1.x} ${p1.y} C ${p1.x + cp} ${p1.y}, ${p2.x - cp} ${p2.y}, ${p2.x} ${p2.y}`;
            } else {
              p1 = childNode.connectors.left;
              p2 = parentNode.connectors.right;
              const dx = Math.abs(p1.x - p2.x);
              const cp = Math.max(20, dx * 0.5);
              pathD = `M ${p1.x} ${p1.y} C ${p1.x - cp} ${p1.y}, ${p2.x + cp} ${p2.y}, ${p2.x} ${p2.y}`;
            }
          }

          edges.push({
            id: `${childCommit.hash}-${pHash}-${pIdx}`,
            childHash: childCommit.hash,
            parentHash: pHash,
            color: childNode.color,
            isMerge: parents.length > 1,
            isDashed: childCommit.isUncommitted,
            pathD
          });
        }
      }

      const totalWidth = padX * 2 + (maxCol + 1) * (W + gapX);
      const totalHeight = padY * 2 + (maxRow + 1) * (H + gapY);

      return { nodes, edges, width: totalWidth, height: totalHeight, nodeMap };
    }, [graphData.rows, dagDirection, edgeDirection, repoOverview?.status]);

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

    const handleDagMouseDown = (e) => {
      if (e.target.closest('.dsh-dag-node') || e.target.closest('button') || e.target.closest('select') || e.target.closest('input')) {
        return;
      }
      setIsDragging(true);
      setDragStart({ x: e.clientX - dagPan.x, y: e.clientY - dagPan.y });
    };

    const handleDagMouseMove = (e) => {
      if (!isDragging) return;
      setDagPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };

    const handleDagMouseUp = () => {
      setIsDragging(false);
    };

    const handleDagWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.12 : -0.12;
      setDagZoom(z => Math.max(0.3, Math.min(2.5, +(z + delta).toFixed(2))));
    };

    const handleResetDagView = () => {
      setDagZoom(1);
      setDagPan({ x: 30, y: 30 });
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
                // 1. Vertical straight lines with subtle contrast borders
                graphData.verticalLines.map((vl, idx) => {
                  const p1 = getPt(vl.lane, vl.fromRow);
                  const p2 = getPt(vl.lane, vl.toRow);
                  const d = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
                  return h('g', { key: `vl-${idx}` },
                    h('path', {
                      d,
                      fill: 'none',
                      stroke: 'var(--dsh-layer-0, #131418)',
                      strokeWidth: 4.5,
                      strokeLinecap: 'round'
                    }),
                    h('path', {
                      d,
                      fill: 'none',
                      stroke: vl.color,
                      strokeWidth: 2,
                      strokeDasharray: vl.isDashed ? '3,3' : 'none',
                      strokeLinecap: 'round'
                    })
                  );
                }),

                // 2. Continuous S-curves across lanes with subtle contrast borders
                graphData.curves.map((c, idx) => {
                  const p1 = getPt(c.fromLane, c.fromRow);
                  const p2 = getPt(c.toLane, c.toRow);
                  const dy = p2.y - p1.y;
                  const cpOffset = dy * 0.5;
                  const d = `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + cpOffset}, ${p2.x} ${p2.y - cpOffset}, ${p2.x} ${p2.y}`;
                  return h('g', { key: `cv-${idx}` },
                    h('path', {
                      d,
                      fill: 'none',
                      stroke: 'var(--dsh-layer-0, #131418)',
                      strokeWidth: 4.5,
                      strokeLinecap: 'round'
                    }),
                    h('path', {
                      d,
                      fill: 'none',
                      stroke: c.color,
                      strokeWidth: 2,
                      strokeDasharray: c.isDashed ? '3,3' : 'none',
                      strokeLinecap: 'round'
                    })
                  );
                }),

                // 3. Commit Vertex Dots (rendered on top of paths)
                graphData.rows.map((row, idx) => {
                  const pt = getPt(row.lane, idx);
                  const commit = row.commit;
                  const isHead = commit.refs.some(r => r.isHead);
                  const isMerge = commit.parents && commit.parents.length > 1;
                  const isSelected = selectedCommit?.hash === commit.hash;
                  const isUncommitted = commit.isUncommitted;

                  return h('g', { key: `dot-${commit.hash}` },
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

                return h('div', {
                  key: commit.hash,
                  className: `dsh-git-commit-row ${isSelected ? 'selected' : ''} ${commit.isUncommitted ? 'uncommitted-row' : ''}`,
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
                    isHead && h('span', { className: 'dsh-git-badge dsh-badge-head' }, 'HEAD'),
                    commit.refs.map(ref =>
                      h('span', {
                        key: ref.name,
                        className: `dsh-git-badge ${ref.isHead ? 'dsh-badge-head' : ref.isTag ? 'dsh-badge-tag' : ref.isRemote ? 'dsh-badge-remote' : (ref.isUncommitted ? 'dsh-badge-uncommitted' : 'dsh-badge-branch')}`,
                        title: ref.name,
                        onDoubleClick: (e) => {
                          e.stopPropagation();
                          if (!ref.isTag && !ref.isHead && !ref.isUncommitted) {
                            handleCheckout(ref.name);
                          }
                        }
                      }, ref.name)
                    ),
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

      const canvasWidth = Math.max(1200, dagLayout.width + 120);
      const canvasHeight = Math.max(800, dagLayout.height + 120);

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
            }, edgeDirection === 'parent-to-child' ? '↗ 流向: 演进 (父→子)' : '↘ 流向: 引用 (子→父)')
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
            h('button', { className: 'dsh-git-btn', onClick: handleResetDagView, title: '重置缩放和位置' }, '1:1'),
            h('button', { className: 'dsh-git-btn', onClick: handleFitDagView, title: '适应视口大小' }, '适应')
          ),

          h('div', { className: 'dsh-git-dag-hint' },
            `共 ${dagLayout.nodes.length} 个节点 · 拖拽平移 · 滚轮缩放 · 悬停高亮链路`
          )
        ),

        // DAG Viewport
        h('div', {
          ref: dagContainerRef,
          className: `dsh-git-dag-viewport ${isDragging ? 'dragging' : ''}`,
          onMouseDown: handleDagMouseDown,
          onMouseMove: handleDagMouseMove,
          onMouseUp: handleDagMouseUp,
          onMouseLeave: handleDagMouseUp,
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
            // SVG Directed Edges
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
                  h('path', {
                    d: edge.pathD,
                    fill: 'none',
                    stroke: 'var(--dsh-base, #131418)',
                    strokeWidth: isRelated ? 6 : 4.5,
                    strokeLinecap: 'round'
                  }),
                  h('path', {
                    d: edge.pathD,
                    fill: 'none',
                    stroke: isRelated ? '#60a5fa' : edge.color,
                    strokeWidth: isRelated ? 3 : 2,
                    opacity: isDimmed ? 0.2 : (isRelated ? 1 : 0.75),
                    strokeDasharray: edge.isDashed ? '4,4' : (edge.isMerge ? '5,3' : 'none'),
                    strokeLinecap: 'round',
                    markerEnd: isRelated ? 'url(#dag-arrow-active)' : 'url(#dag-arrow)'
                  })
                );
              })
            ),

            // HTML Node Cards
            dagLayout.nodes.map(node => {
              const commit = node.commit;
              const isSelected = selectedCommit?.hash === commit.hash;
              const isHovered = hoveredHash === commit.hash;
              const isRelated = relatedHashes && relatedHashes.has(commit.hash) && !isHovered;
              const isDimmed = relatedHashes && !relatedHashes.has(commit.hash);
              const isHead = commit.refs.some(r => r.isHead);
              const isMerge = commit.parents && commit.parents.length > 1;

              let className = 'dsh-dag-node';
              if (isSelected) className += ' selected';
              if (isHovered) className += ' hovered';
              if (isRelated) className += ' related';
              if (isDimmed) className += ' dimmed';
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
                  borderLeftWidth: 3,
                  borderStyle: commit.isUncommitted ? 'dashed' : 'solid'
                },
                onClick: () => handleSelectCommit(commit),
                onContextMenu: (e) => handleContextMenu(e, commit),
                onMouseEnter: () => setHoveredHash(commit.hash),
                onMouseLeave: () => setHoveredHash(null)
              },
                // Vertex Dot
                h('div', {
                  className: 'dsh-dag-vertex-dot',
                  style: {
                    background: node.color,
                    left: dagDirection === 'vertical' ? '50%' : '-4px',
                    top: dagDirection === 'vertical' ? '-4px' : '50%',
                    transform: dagDirection === 'vertical' ? 'translateX(-50%)' : 'translateY(-50%)'
                  }
                }),

                // Header
                h('div', { className: 'dsh-dag-node-header' },
                  h('span', { className: 'dsh-dag-node-hash' }, commit.shortHash),
                  h('span', { className: 'dsh-dag-node-author', title: `${commit.author} <${commit.authorEmail}>` },
                    h('span', { className: 'dsh-git-author-avatar' }, (commit.author || '?')[0].toUpperCase()),
                    commit.author
                  ),
                  h('span', { className: 'dsh-dag-node-date' }, formatRelativeDate(commit.date))
                ),

                // Subject Title
                h('div', { className: 'dsh-dag-node-subject', title: commit.subject }, commit.subject),

                // Footer Badges
                h('div', { className: 'dsh-dag-node-footer' },
                  isHead && h('span', { className: 'dsh-git-badge dsh-badge-head' }, 'HEAD'),
                  isMerge && h('span', { className: 'dsh-git-badge dsh-badge-merge' }, `Merge (${commit.parents.length})`),
                  commit.refs.map(ref =>
                    h('span', {
                      key: ref.name,
                      className: `dsh-git-badge ${ref.isHead ? 'dsh-badge-head' : ref.isTag ? 'dsh-badge-tag' : ref.isRemote ? 'dsh-badge-remote' : (ref.isUncommitted ? 'dsh-badge-uncommitted' : 'dsh-badge-branch')}`,
                      title: ref.name,
                      onDoubleClick: (e) => {
                        e.stopPropagation();
                        if (!ref.isTag && !ref.isHead && !ref.isUncommitted) handleCheckout(ref.name);
                      }
                    }, ref.name)
                  )
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
              return h('div', {
                key: b.name,
                className: `dsh-git-branch-card ${b.isHead ? 'is-head' : ''}`
              },
                h('div', { className: 'dsh-git-branch-card-header' },
                  h('span', { className: 'dsh-git-branch-card-name', title: b.name },
                    h('span', { className: `dsh-git-badge ${b.isHead ? 'dsh-badge-head' : 'dsh-badge-branch'}` },
                      b.isHead ? '* HEAD' : 'branch'
                    ),
                    b.name
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

            // Diff Viewer
            h('div', { className: 'dsh-git-diff-viewer' },
              loadingDiff
                ? h('div', { style: { padding: 20, textAlign: 'center', color: '#94a3b8' } }, '正在生成代码差异...')
                : fileDiff === null
                  ? h('div', { style: { padding: 20, textAlign: 'center', color: '#94a3b8' } }, '点击左侧文件查看代码改动差异')
                  : fileDiff.trim() === ''
                    ? h('div', { style: { padding: 20, textAlign: 'center', color: '#94a3b8' } }, '该文件无内容变动或为二进制文件')
                    : fileDiff.split('\n').map((line, lIdx) => {
                        let className = 'dsh-diff-line';
                        if (line.startsWith('+') && !line.startsWith('+++')) className += ' dsh-diff-added';
                        else if (line.startsWith('-') && !line.startsWith('---')) className += ' dsh-diff-removed';
                        else if (line.startsWith('@@') || line.startsWith('diff --git')) className += ' dsh-diff-header';
                        else if (line.startsWith('index ') || line.startsWith('---') || line.startsWith('+++')) className += ' dsh-diff-meta';

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

export function createGitGraphArtwork(React) {
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

export function createGitGraphTitle(React) {
  const h = React.createElement;
  return function GitGraphTitle() {
    return h('span', null, 'ds-gitui');
  };
}
