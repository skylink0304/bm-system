import React from 'react';

/** バドミントンのシャトルを図案化したロゴマーク。ヒーローやボタンで使い回す共通部品。 */
export default function ShuttleMark({ size = 40, className = '' }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <g opacity="0.9">
        <line x1="50" y1="8" x2="22" y2="66" stroke="var(--line-white)" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
        <line x1="50" y1="8" x2="36" y2="70" stroke="var(--line-white)" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
        <line x1="50" y1="8" x2="50" y2="72" stroke="var(--line-white)" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="8" x2="64" y2="70" stroke="var(--line-white)" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
        <line x1="50" y1="8" x2="78" y2="66" stroke="var(--line-white)" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
        <path d="M22 66 Q50 78 78 66 Q50 86 22 66 Z" fill="var(--net-lime)" opacity="0.9" />
      </g>
      <ellipse cx="50" cy="80" rx="13" ry="9" fill="var(--net-lime)" />
      <ellipse cx="50" cy="78" rx="13" ry="8" fill="none" stroke="var(--court-blue)" strokeWidth="1" opacity="0.25" />
    </svg>
  );
}
