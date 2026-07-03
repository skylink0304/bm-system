import React from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { NetDivider } from '../components';

/**
 * 試合表示画面
 * ・第1試合〜の順にラウンドカードを表示
 * ・各ラウンドのコートごとの対戦カード、休憩者の表示
 * ・クラスが複数ある場合はタブで切り替え
 * ・メンバーごとの休憩回数まとめ
 */
export default function MatchScreen({ results, activeClass, setActiveClass, onBack, onRegenerate }) {
  if (!results || results.length === 0) return null;
  const current = results[activeClass];

  return (
    <div>
      <div className="bm-match-header">
        <h1 className="bm-match-title">組み合わせ結果</h1>
        <div className="bm-header-actions">
          <button className="bm-btn bm-btn-ghost" onClick={onRegenerate}>
            <RefreshCw size={15} />
            再生成
          </button>
          <button className="bm-btn bm-btn-ghost" onClick={onBack}>
            <ArrowLeft size={15} />
            入力へ戻る
          </button>
        </div>
      </div>

      {results.length > 1 && (
        <div className="bm-tabs">
          {results.map((r, i) => (
            <button
              key={i}
              className={`bm-tab ${i === activeClass ? 'active' : ''}`}
              onClick={() => setActiveClass(i)}
            >
              {r.name}
            </button>
          ))}
        </div>
      )}

      {current.members.length - current.capacity * 4 >= 0 && (
        <div className="bm-capacity-note">
          {current.name}：メンバー{current.members.length}人 / 使用コート{current.capacity}面（各ラウンド
          {current.capacity * 4}人が試合、{current.members.length - current.capacity * 4}人が休憩）
        </div>
      )}

      {current.schedule.map((round, idx) => (
        <div className="bm-round-card" key={round.roundNo} style={{ animationDelay: `${idx * 40}ms` }}>
          <div className="bm-round-badge">
            <span className="bm-round-num">{round.roundNo}</span>
            <span className="bm-round-label">試合目</span>
          </div>
          <div className="bm-round-body">
            <div className="bm-courts">
              {round.courts.map((c) => (
                <div className="bm-court-box" key={c.courtNo}>
                  <div className="bm-court-label">COURT {c.courtNo}</div>
                  <div className="bm-team">
                    {c.teamA[0]} ・ {c.teamA[1]}
                  </div>
                  <NetDivider />
                  <div className="bm-team">
                    {c.teamB[0]} ・ {c.teamB[1]}
                  </div>
                </div>
              ))}
            </div>
            {round.resting.length > 0 && (
              <div className="bm-rest-row">
                <span className="bm-rest-tag">REST</span>
                {round.resting.map((m) => (
                  <span className="bm-chip" key={m}>
                    {m}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="bm-card" style={{ marginTop: 24 }}>
        <div className="bm-section-title">休憩回数まとめ</div>
        {Object.entries(current.restCounts)
          .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ja'))
          .map(([name, count]) => {
            const max = Math.max(1, ...Object.values(current.restCounts));
            return (
              <div className="bm-summary-row" key={name}>
                <div className="bm-summary-name">{name}</div>
                <div className="bm-summary-bar-track">
                  <div className="bm-summary-bar-fill" style={{ width: `${(count / max) * 100}%` }} />
                </div>
                <div className="bm-summary-count">{count}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
