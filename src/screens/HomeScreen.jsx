import React from 'react';
import { Users } from 'lucide-react';
import { ShuttleMark, Stepper } from '../components';
import { MAX_CLASSES } from '../utils/constants';
import { parseMembers } from '../utils/members';

/**
 * 入力項目画面（ホーム）
 * ・試合数 / コート数
 * ・クラス数（2以上で2クラス目以降のメンバー入力欄が増える）
 * ・各クラスのメンバー入力（1行1名）
 */
export default function HomeScreen({
  matchCount,
  setMatchCount,
  courtCount,
  setCourtCount,
  classCount,
  handleClassCountChange,
  classNames,
  updateClassName,
  classMembersText,
  updateClassMembers,
  onSubmit,
}) {
  return (
    <div>
      <div className="bm-hero">
        <div className="bm-hero-mark">
          <ShuttleMark size={56} />
        </div>
        <div className="bm-eyebrow">BADMINTON MATCHING</div>
        <h1 className="bm-title">組み合わせメーカー</h1>
        <p className="bm-subtitle">
          試合数・コート数・メンバーを入力するだけで、休憩とペアの偏りを抑えた組み合わせを自動でつくります。
        </p>
      </div>

      <div className="bm-card">
        <div className="bm-section-title">大会設定</div>
        <div className="bm-grid2">
          <Stepper
            label="試合数"
            value={matchCount}
            onChange={setMatchCount}
            min={1}
            max={30}
            hint="第1試合〜の全ラウンド数"
          />
          <Stepper
            label="コート数"
            value={courtCount}
            onChange={setCourtCount}
            min={1}
            max={12}
            hint="同時に使用するコートの面数"
          />
        </div>
      </div>

      <div className="bm-card">
        <div className="bm-section-title">クラス設定</div>
        <Stepper
          label="クラス数"
          value={classCount}
          onChange={handleClassCountChange}
          min={1}
          max={MAX_CLASSES}
          hint="初級・中級など、レベルごとに分けたい場合は増やしてください"
        />

        <div style={{ height: 18 }} />

        {Array.from({ length: classCount }).map((_, i) => {
          const members = parseMembers(classMembersText[i] || '');
          const ok = members.length >= 4;
          return (
            <div className="bm-class-block" key={i}>
              <div className="bm-class-head">
                <span className="bm-class-index">{i + 1}</span>
                <input
                  className="bm-class-name-input"
                  value={classNames[i] || ''}
                  onChange={(e) => updateClassName(i, e.target.value)}
                  placeholder={`クラス${i + 1}`}
                />
              </div>
              <textarea
                className="bm-textarea"
                placeholder={'メンバーを1行に1名ずつ入力\n例）\n山田太郎\n佐藤花子\n鈴木一郎\n田中みき'}
                value={classMembersText[i] || ''}
                onChange={(e) => updateClassMembers(i, e.target.value)}
              />
              <div className={`bm-member-count ${ok ? 'ok' : members.length > 0 ? 'bad' : ''}`}>
                <Users size={13} />
                {members.length}人入力中{!ok && '（最低4人必要です）'}
              </div>
            </div>
          );
        })}
      </div>

      <button className="bm-btn bm-btn-primary" onClick={onSubmit}>
        <ShuttleMark size={18} />
        組み合わせをつくる
      </button>
    </div>
  );
}
