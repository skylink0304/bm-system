import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/** 入力エラー時に表示するモーダル。ホーム画面・将来的な他画面からも呼び出せる共通部品。 */
export default function ErrorModal({ message, onClose }) {
  return (
    <div className="bm-modal-scrim" role="dialog" aria-modal="true">
      <div className="bm-modal-card">
        <div className="bm-modal-top" />
        <button className="bm-modal-close" onClick={onClose} aria-label="閉じる">
          <X size={18} />
        </button>
        <div className="bm-modal-icon">
          <AlertTriangle size={28} />
        </div>
        <div className="bm-modal-title">入力エラー</div>
        <p className="bm-modal-msg">{message}</p>
        <button className="bm-btn bm-btn-primary bm-modal-btn" onClick={onClose}>
          修正する
        </button>
      </div>
    </div>
  );
}
