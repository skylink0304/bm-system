import React from 'react';

/** ネットを模した区切り線。試合表示画面のチーム間セパレーターとして使う共通部品。 */
export default function NetDivider({ label = 'VS' }) {
  return (
    <div className="bm-net">
      <span className="bm-net-line" />
      <span className="bm-net-dot" />
      <span className="bm-net-label">{label}</span>
      <span className="bm-net-dot" />
      <span className="bm-net-line" />
    </div>
  );
}
