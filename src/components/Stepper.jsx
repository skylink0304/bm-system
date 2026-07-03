import React from 'react';
import { Plus, Minus } from 'lucide-react';

/** 試合数・コート数・クラス数などの入力に使う +/- 付き数値入力の共通部品。 */
export default function Stepper({ label, value, onChange, min = 1, max = 30, hint }) {
  const clamp = (v) => Math.max(min, Math.min(max, v));
  return (
    <div className="bm-stepper">
      <div className="bm-stepper-label">{label}</div>
      <div className="bm-stepper-row">
        <button
          type="button"
          className="bm-stepper-btn"
          onClick={() => onChange(clamp(value - 1))}
          aria-label={`${label}を減らす`}
        >
          <Minus size={16} />
        </button>
        <input
          className="bm-stepper-num"
          type="number"
          value={value}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            onChange(Number.isNaN(v) ? min : clamp(v));
          }}
        />
        <button
          type="button"
          className="bm-stepper-btn"
          onClick={() => onChange(clamp(value + 1))}
          aria-label={`${label}を増やす`}
        >
          <Plus size={16} />
        </button>
      </div>
      {hint && <div className="bm-stepper-hint">{hint}</div>}
    </div>
  );
}
