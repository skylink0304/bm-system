import React, { useState } from 'react';
import './App.css';
import { ErrorModal } from './components';
import HomeScreen from './screens/HomeScreen';
import MatchScreen from './screens/MatchScreen';
import { generateSchedule } from './utils/scheduler';
import { parseMembers } from './utils/members';
import { CLASS_DEFAULT_NAMES } from './utils/constants';

/**
 * アプリ本体。
 * 入力画面（HomeScreen）と試合表示画面（MatchScreen）の状態管理・画面遷移のみを担当し、
 * 見た目や個別ロジックは components / screens / utils に切り出している。
 */
export default function App() {
  const [screen, setScreen] = useState('home'); // 'home' | 'match'
  const [matchCount, setMatchCount] = useState(6);
  const [courtCount, setCourtCount] = useState(2);
  const [classCount, setClassCount] = useState(1);
  const [classNames, setClassNames] = useState([CLASS_DEFAULT_NAMES[0]]);
  const [classMembersText, setClassMembersText] = useState(['']);
  const [errorMsg, setErrorMsg] = useState(null);
  const [results, setResults] = useState(null);
  const [activeClass, setActiveClass] = useState(0);
  const [snapshot, setSnapshot] = useState(null); // 再生成用に直近の入力を保持

  function handleClassCountChange(next) {
    const num = Math.max(1, Math.min(6, next));
    setClassCount(num);
    setClassNames((prev) => {
      const arr = [...prev];
      while (arr.length < num) arr.push(CLASS_DEFAULT_NAMES[arr.length] || `クラス${arr.length + 1}`);
      arr.length = num;
      return arr;
    });
    setClassMembersText((prev) => {
      const arr = [...prev];
      while (arr.length < num) arr.push('');
      arr.length = num;
      return arr;
    });
  }

  function updateClassName(i, name) {
    setClassNames((prev) => {
      const arr = [...prev];
      arr[i] = name;
      return arr;
    });
  }

  function updateClassMembers(i, text) {
    setClassMembersText((prev) => {
      const arr = [...prev];
      arr[i] = text;
      return arr;
    });
  }

  function runGeneration(mCount, cCount, classesData) {
    return classesData.map((cd) => {
      const { schedule, restCounts, capacity } = generateSchedule(cd.members, mCount, cCount);
      return { name: cd.name, members: cd.members, schedule, restCounts, capacity };
    });
  }

  function handleSubmit() {
    const mCount = Number(matchCount);
    const cCount = Number(courtCount);

    if (!mCount || mCount < 1) {
      setErrorMsg('試合数は1以上を入力してください。');
      return;
    }
    if (!cCount || cCount < 1) {
      setErrorMsg('コート数は1以上を入力してください。');
      return;
    }

    const classesData = [];
    for (let i = 0; i < classCount; i++) {
      const members = parseMembers(classMembersText[i] || '');
      if (members.length < 4) {
        setErrorMsg(
          `「${classNames[i] || `クラス${i + 1}`}」の人数が足りません。バドミントンは1コート4人で対戦するため、最低4人のメンバーが必要です。現在の入力は${members.length}人です。`
        );
        return;
      }
      const dup = members.filter((m, idx) => members.indexOf(m) !== idx);
      if (dup.length > 0) {
        setErrorMsg(
          `「${classNames[i] || `クラス${i + 1}`}」に同じ名前が複数入力されています(例:${dup[0]})。名前を区別できるよう修正してください。`
        );
        return;
      }
      classesData.push({ name: classNames[i] || `クラス${i + 1}`, members });
    }

    const resultsData = runGeneration(mCount, cCount, classesData);
    setResults(resultsData);
    setSnapshot({ mCount, cCount, classesData });
    setActiveClass(0);
    setErrorMsg(null);
    setScreen('match');
  }

  function handleRegenerate() {
    if (!snapshot) return;
    const resultsData = runGeneration(snapshot.mCount, snapshot.cCount, snapshot.classesData);
    setResults(resultsData);
  }

  return (
    <div className="bm-app">
      <div className="bm-shell">
        {screen === 'home' ? (
          <HomeScreen
            matchCount={matchCount}
            setMatchCount={setMatchCount}
            courtCount={courtCount}
            setCourtCount={setCourtCount}
            classCount={classCount}
            handleClassCountChange={handleClassCountChange}
            classNames={classNames}
            updateClassName={updateClassName}
            classMembersText={classMembersText}
            updateClassMembers={updateClassMembers}
            onSubmit={handleSubmit}
          />
        ) : (
          <MatchScreen
            results={results}
            activeClass={activeClass}
            setActiveClass={setActiveClass}
            onBack={() => setScreen('home')}
            onRegenerate={handleRegenerate}
          />
        )}
      </div>

      {errorMsg && <ErrorModal message={errorMsg} onClose={() => setErrorMsg(null)} />}
    </div>
  );
}
