/* ---------------------------------------------------------
   Utility: shuffle / pair-key
--------------------------------------------------------- */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pairKey(pair) {
  return [...pair].slice().sort().join('|');
}

/* ---------------------------------------------------------
   Core scheduling algorithm
   - avoids the same person resting two rounds in a row (best effort)
   - avoids the same partnership pair appearing two rounds in a row (best effort)
   - tracks cumulative rest counts per member
--------------------------------------------------------- */
export function generateSchedule(members, rounds, courtSetting) {
  const n = members.length;
  const restCounts = {};
  members.forEach((m) => (restCounts[m] = 0));

  const capacity = Math.min(courtSetting, Math.floor(n / 4));
  if (capacity <= 0) return { schedule: [], restCounts, capacity: 0 };

  let lastResters = new Set();
  let lastPairs = new Set();
  const schedule = [];

  for (let r = 1; r <= rounds; r++) {
    const playingCount = capacity * 4;
    const restingCount = n - playingCount;

    // --- choose who rests this round ---
    let pool = members.filter((m) => !lastResters.has(m));
    pool = shuffle(pool).sort((a, b) => restCounts[a] - restCounts[b]);

    let resters;
    if (pool.length >= restingCount) {
      resters = pool.slice(0, restingCount);
    } else {
      const forced = shuffle(members.filter((m) => lastResters.has(m))).sort(
        (a, b) => restCounts[a] - restCounts[b]
      );
      resters = [...pool, ...forced.slice(0, restingCount - pool.length)];
    }
    const restersSet = new Set(resters);
    const playingBase = members.filter((m) => !restersSet.has(m));

    // --- form partnerships, trying to avoid repeating last round's pairs ---
    let pairs = [];
    for (let attempt = 0; attempt < 80; attempt++) {
      const shuffled = shuffle(playingBase);
      const candidate = [];
      for (let i = 0; i < shuffled.length; i += 2) {
        candidate.push([shuffled[i], shuffled[i + 1]]);
      }
      const conflict = candidate.some((p) => lastPairs.has(pairKey(p)));
      if (!conflict || attempt === 79) {
        pairs = candidate;
        break;
      }
    }

    // --- assign partnerships to courts, 2 partnerships per court ---
    const shuffledPairs = shuffle(pairs);
    const courts = [];
    for (let c = 0; c < capacity; c++) {
      courts.push({
        courtNo: c + 1,
        teamA: shuffledPairs[c * 2],
        teamB: shuffledPairs[c * 2 + 1],
      });
    }

    schedule.push({ roundNo: r, courts, resting: resters });

    resters.forEach((m) => (restCounts[m] += 1));
    lastResters = restersSet;
    lastPairs = new Set(pairs.map(pairKey));
  }

  return { schedule, restCounts, capacity };
}
