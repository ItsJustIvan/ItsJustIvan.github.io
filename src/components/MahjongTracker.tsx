import React, { useState, useEffect } from 'react';

const SEAT_THEMES = [
  { border: 'border-red-600', text: 'text-red-700 dark:text-red-400', bg: 'bg-red-500', active: 'ring-red-400', glow: 'shadow-[0_0_20px_rgba(220,38,38,0.3)]' },
  { border: 'border-blue-600', text: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-500', active: 'ring-blue-400', glow: 'shadow-[0_0_20px_rgba(37,99,235,0.3)]' },
  { border: 'border-green-700', text: 'text-green-800 dark:text-green-400', bg: 'bg-green-500', active: 'ring-green-400', glow: 'shadow-[0_0_20px_rgba(21,128,61,0.3)]' },
  { border: 'border-orange-600', text: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-500', active: 'ring-orange-400', glow: 'shadow-[0_0_20px_rgba(234,88,12,0.3)]' },
];

const WINDS = [
  { name: 'East', char: '東' },
  { name: 'South', char: '南' },
  { name: 'West', char: '西' },
  { name: 'North', char: '北' }
];

export default function MahjongTracker() {
  const [playerCount, setPlayerCount] = useState(4);
  const [scores, setScores] = useState(Array(4).fill(0));
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  const [windOffsets, setWindOffsets] = useState([0, 1, 2, 3]);
  const [dealerStreak, setDealerStreak] = useState(0);
  const [baseDealerPoint, setBaseDealerPoint] = useState(1);
  const [roundWindIdx, setRoundWindIdx] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  
  const [pointsInput, setPointsInput] = useState('3');
  const [winnerIdx, setWinnerIdx] = useState<number | null>(null);
  const [loserIdx, setLoserIdx] = useState<number | 'all' | null>(null);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsView, setSettingsView] = useState<'main' | 'about-app' | 'about-ivan'>('main');
  const [darkMode, setDarkMode] = useState(false);
  const [dealerPointsEnabled, setDealerPointsEnabled] = useState(true);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    setScores(prev => {
      const next = [...prev];
      if (next.length < playerCount) return [...next, ...Array(playerCount - next.length).fill(0)];
      return next.slice(0, playerCount);
    });
    setPlayerNames(prev => {
      const next = [...prev];
      if (next.length < playerCount) {
        const added = Array.from({length: playerCount - next.length}, (_, i) => `Player ${next.length + i + 1}`);
        return [...next, ...added];
      }
      return next.slice(0, playerCount);
    });
    setWindOffsets(Array.from({length: playerCount}, (_, i) => i));
  }, [playerCount]);

  const theme = {
    wrapper: darkMode ? 'dark' : '',
    pageBg: darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-100 text-slate-900',
    card: darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-transparent',
    header: darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200',
    panel: darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200',
    input: darkMode ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-slate-50 border-slate-100 text-slate-900',
    textMuted: darkMode ? 'text-zinc-500' : 'text-slate-400',
    buttonGhost: darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-slate-50 border-slate-100 text-slate-400',
    modal: darkMode ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-white text-slate-900 border-white',
    primaryBtn: darkMode ? 'bg-zinc-100 text-zinc-900' : 'bg-slate-900 text-white',
    settingRow: darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-200',
    stepperBtn: darkMode ? 'bg-zinc-700 active:bg-zinc-600' : 'bg-white shadow-sm active:bg-slate-100',
  };

  const currentDealerBonus = baseDealerPoint + (2 * dealerStreak);
  const currentEastIdx = windOffsets.indexOf(0);

  // ROTATION LOGIC
  const rotateDealer = () => {
    setDealerStreak(0);
    // In Mahjong, if the dealer loses, the winds rotate one position to the left
    setWindOffsets(prev => prev.map(val => (val + (playerCount - 1)) % playerCount));
    // Check if the East seat has completed a full loop back to the first player to change Round Wind
    if (currentEastIdx === playerCount - 1) {
      setRoundWindIdx(prev => (prev + 1) % 4);
    }
  };

  const handleTransaction = () => {
    if (winnerIdx === null || loserIdx === null || !pointsInput) return;
    const baseAmt = parseInt(pointsInput);
    if (isNaN(baseAmt)) return;

    setHistory(prev => [...prev, { scores: [...scores], winds: [...windOffsets], streak: dealerStreak, roundWind: roundWindIdx }]);

    const nextScores = [...scores];
    const isDealerWinner = winnerIdx === currentEastIdx;
    const bonus = dealerPointsEnabled ? currentDealerBonus : 0;

    if (loserIdx === 'all') {
      scores.forEach((_, i) => {
        if (i === winnerIdx) return;
        let payment = baseAmt + (isDealerWinner || i === currentEastIdx ? bonus : 0);
        nextScores[i] -= payment;
        nextScores[winnerIdx] += payment;
      });
    } else {
      const isDealerInvolved = (winnerIdx === currentEastIdx || loserIdx === currentEastIdx);
      const totalAward = baseAmt + (isDealerInvolved ? bonus : 0);
      nextScores[winnerIdx] += totalAward;
      nextScores[loserIdx as number] -= totalAward;
    }

    if (winnerIdx !== currentEastIdx) {
      rotateDealer();
    } else {
      setDealerStreak(prev => prev + 1);
    }

    setScores(nextScores);
    setPointsInput('3'); 
    setWinnerIdx(null);
    setLoserIdx(null);
    setShowControls(false);
  };

  return (
    <div className={`${theme.wrapper} fixed inset-0 h-screen w-screen overflow-hidden ${theme.pageBg} transition-colors duration-300 font-sans flex flex-col`}>
      
      {/* 1. Header */}
      <header className={`flex-none flex justify-between items-center px-4 py-3 border-b ${theme.header}`}>
        <div className="flex flex-col text-left">
          <h1 className="font-black text-lg uppercase tracking-tighter leading-none">Mission Mahjong!</h1>
          <span className={`text-[9px] font-bold uppercase tracking-[0.3em] ${theme.textMuted}`}>Scorecard</span>
        </div>
        <div className="flex gap-2">
           <button onClick={() => { if (history.length > 0) { const last = history[history.length-1]; setScores(last.scores); setWindOffsets(last.winds); setDealerStreak(last.streak); setRoundWindIdx(last.roundWind); setHistory(prev => prev.slice(0, -1)); } }} 
             className={`p-2 text-sm ${history.length === 0 ? 'opacity-10' : 'opacity-100'}`}>↩️</button>
           <button onClick={() => { setSettingsView('main'); setIsSettingsOpen(true); }} className="p-2 text-lg">⚙️</button>
        </div>
      </header>

      {/* 2. Subheader */}
      <div className={`flex-none flex items-center justify-between px-4 py-2 border-b bg-opacity-80 backdrop-blur-md ${theme.header}`}>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-black ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{WINDS[roundWindIdx].char}</span>
          <span className={`text-[9px] font-black uppercase tracking-widest ${theme.textMuted}`}>{WINDS[roundWindIdx].name} Round</span>
        </div>
        {dealerPointsEnabled && (
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-black uppercase tracking-widest ${theme.textMuted}`}>Streak {dealerStreak + 1}</span>
            <div className="bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[10px] font-black">+{currentDealerBonus}</div>
          </div>
        )}
      </div>

      {/* 3. Main Grid */}
      <main className={`flex-1 grid gap-2 p-2 min-h-0 ${playerCount <= 2 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {scores.map((score, i) => {
          const isCurrentEast = windOffsets[i] === 0;
          const isWinner = winnerIdx === i;
          return (
            <div key={i} onClick={() => { if (winnerIdx === i) { setWinnerIdx(null); setLoserIdx(null); setShowControls(false); } else { setWinnerIdx(i); setLoserIdx(null); setShowControls(true); } }} 
              className={`relative p-3 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${theme.card} ${isWinner ? `${SEAT_THEMES[i].border} ring-4 ${SEAT_THEMES[i].active} ${SEAT_THEMES[i].glow} z-20 scale-[1.02]` : 'z-10 opacity-90'}`}
            >
              {isWinner && <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full ${SEAT_THEMES[i].bg} text-white text-[8px] font-black uppercase tracking-widest animate-bounce`}>Winner</div>}
              <div className="flex flex-col">
                <input className={`font-black text-sm bg-transparent border-none p-0 focus:ring-0 w-full mb-0.5`} value={playerNames[i]} onClick={(e) => e.stopPropagation()} onChange={(e) => { const n = [...playerNames]; n[i] = e.target.value; setPlayerNames(n); }} />
                <div className="flex items-center gap-1">
                  {/* Clickable Wind for Manual Rotation */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); rotateDealer(); }}
                    className={`text-xs font-bold px-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${SEAT_THEMES[i].text}`}
                  >
                    {WINDS[windOffsets[i] % 4].char}
                  </button>
                  {isCurrentEast && <div className="bg-red-600 text-white text-[8px] font-black px-1 rounded uppercase">D</div>}
                </div>
              </div>
              <div className="flex justify-end items-end">
                <span className={`text-4xl font-mono font-black tracking-tighter leading-none ${score < 0 ? 'text-red-600' : score > 0 ? 'text-emerald-600' : theme.textMuted}`}>{score}</span>
              </div>
            </div>
          );
        })}
      </main>

      <footer className={`flex-none p-4 border-t bg-white dark:bg-zinc-900 ${theme.panel} z-40`}>
        <div className="max-w-lg mx-auto flex flex-col gap-3">
          <div onClick={() => setShowControls(!showControls)} className="flex justify-between items-center px-1 cursor-pointer">
            <label className={`text-[9px] font-black uppercase tracking-[0.2em] ${theme.textMuted}`}>Points Setup</label>
            {winnerIdx !== null && <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest animate-pulse">{loserIdx === null ? "Who Discarded?" : "Ready"}</span>}
          </div>
          <div className={`overflow-hidden transition-all duration-500 ${showControls ? 'max-h-[500px] opacity-100 mb-2' : 'max-h-0 opacity-0 mb-0'}`}>
            <div className="flex flex-col gap-3 pt-2">
              <input type="number" inputMode="numeric" className={`w-full text-4xl p-3 rounded-2xl border-2 text-center font-mono font-black outline-none ${theme.input} focus:border-blue-500 transition-all`} value={pointsInput} onChange={(e) => setPointsInput(e.target.value)} />
              <div className={`grid gap-2 ${playerCount <= 2 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {playerNames.map((name, i) => (
                  <button key={i} disabled={winnerIdx === i} onClick={() => setLoserIdx(i)} className={`py-4 rounded-xl font-black border-2 text-[10px] uppercase transition-all active:scale-95 ${loserIdx === i ? 'bg-red-600 border-red-700 text-white shadow-lg' : `${theme.buttonGhost} disabled:opacity-5`}`}>{name}</button>
                ))}
                <button onClick={() => setLoserIdx('all')} className={`col-span-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 border ${loserIdx === 'all' ? 'bg-blue-600 border-blue-700 text-white shadow-lg' : `bg-transparent border-dashed ${darkMode ? 'border-zinc-700 text-zinc-500' : 'border-slate-300 text-slate-400'}`}`}>Self-picked</button>
              </div>
            </div>
          </div>
          <button onClick={handleTransaction} disabled={winnerIdx === null || loserIdx === null || !pointsInput} className={`w-full py-4 rounded-2xl font-black text-lg uppercase shadow-xl transition-all active:scale-95 disabled:opacity-20 ${theme.primaryBtn}`}>Record Score</button>
        </div>
      </footer>

{/* 5. Settings Modal */}
      {isSettingsOpen && (
        <div 
          // 1. CLICK TO CLOSE HANDLER ON THE BACKDROP
          onClick={() => setIsSettingsOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
        >
          <div 
            // 2. STOP PROPAGATION SO CLICKING INSIDE DOESN'T CLOSE
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm rounded-[40px] p-8 shadow-2xl border-4 ${theme.modal} animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]`}
          >
            
            <div className="flex justify-between items-center mb-8 flex-none text-left">
              <div>
                <h2 className="font-black text-2xl uppercase tracking-tighter leading-none">Settings</h2>
                <div className={`h-1 w-8 rounded-full mt-1 bg-blue-600`} />
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-xl active:scale-90 transition-transform">✕</button>
            </div>

            <div className="flex flex-col gap-6">
              
              {/* 1. RESET BUTTON */}
              <button 
                onClick={() => { if(confirm("Reset all scores and streaks?")) { setScores(Array(playerCount).fill(0)); setHistory([]); setDealerStreak(0); setIsSettingsOpen(false); }}} 
                className="w-full py-4 rounded-2xl bg-red-600/10 text-red-600 font-black text-xs uppercase border border-red-600/20 active:scale-95 transition-transform"
              >
                Reset Match
              </button>

              {/* 2. DEALER BONUS */}
              <div className={`flex flex-col gap-4 rounded-3xl p-4 border transition-all duration-300 ${dealerPointsEnabled ? 'border-emerald-500/50 bg-emerald-500/5' : theme.settingRow}`}>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs uppercase tracking-widest">Dealer Bonus</span>
                  <button onClick={() => setDealerPointsEnabled(!dealerPointsEnabled)} className={`w-12 h-6 rounded-full relative transition-colors ${dealerPointsEnabled ? 'bg-emerald-600' : 'bg-zinc-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${dealerPointsEnabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
                {dealerPointsEnabled && (
                  <div className="space-y-4 text-left animate-in slide-in-from-top-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase opacity-40">Base Points</label>
                      <div className="flex items-center justify-between">
                        <button onClick={() => setBaseDealerPoint(Math.max(0, baseDealerPoint - 1))} className="text-xl px-4 py-1 font-black text-emerald-600">-</button>
                        <span className="text-lg font-black font-mono">{baseDealerPoint}</span>
                        <button onClick={() => setBaseDealerPoint(baseDealerPoint + 1)} className="text-xl px-4 py-1 font-black text-emerald-600">+</button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase opacity-40">Dealer Streak</label>
                      <div className="flex items-center justify-between">
                        <button onClick={() => setDealerStreak(Math.max(0, dealerStreak - 1))} className="text-xl px-4 py-1 font-black text-emerald-600">-</button>
                        <span className="text-lg font-black font-mono">{dealerStreak}</span>
                        <button onClick={() => setDealerStreak(dealerStreak + 1)} className="text-xl px-4 py-1 font-black text-emerald-600">+</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. ROUND WIND */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase opacity-50 tracking-widest text-left">Round Wind</label>
                <div className={`flex items-center justify-between rounded-3xl p-1.5 border ${theme.settingRow}`}>
                  <button onClick={() => setRoundWindIdx(prev => (prev - 1 + 4) % 4)} className={`w-10 h-10 rounded-2xl font-black text-xl transition-all ${theme.stepperBtn}`}>-</button>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black">{WINDS[roundWindIdx].char}</span>
                    <span className="text-[10px] font-black uppercase opacity-40">{WINDS[roundWindIdx].name}</span>
                  </div>
                  <button onClick={() => setRoundWindIdx(prev => (prev + 1) % 4)} className={`w-10 h-10 rounded-2xl font-black text-xl transition-all ${theme.stepperBtn}`}>+</button>
                </div>
              </div>

              {/* 4. PLAYER COUNT */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase opacity-50 tracking-widest text-left">Player Count</label>
                <div className={`flex items-center justify-between rounded-3xl p-1.5 border ${theme.settingRow}`}>
                  <button onClick={() => setPlayerCount(Math.max(1, playerCount - 1))} className={`w-10 h-10 rounded-2xl font-black text-xl transition-all ${theme.stepperBtn}`}>-</button>
                  <span className="text-xl font-black font-mono">{playerCount}</span>
                  <button onClick={() => setPlayerCount(Math.min(4, playerCount + 1))} className={`w-10 h-10 rounded-2xl font-black text-xl transition-all ${theme.stepperBtn}`}>+</button>
                </div>
              </div>

              {/* 5. ROTATE SEATS */}
              <button 
                onClick={() => { rotateDealer(); setIsSettingsOpen(false); }}
                className={`w-full p-4 rounded-2xl flex justify-between items-center border ${theme.settingRow} font-bold text-xs uppercase tracking-widest active:bg-zinc-100 dark:active:bg-zinc-800 transition-colors`}
              >
                <span>Rotate Dealer Seat</span>
                <span className="opacity-50">🔄</span>
              </button>

              <hr className="opacity-10" />

              {/* 6. NIGHT MODE */}
              <div className="flex justify-between items-center px-2">
                <span className="font-bold text-xs uppercase tracking-widest">Night Mode</span>
                <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-blue-600' : 'bg-zinc-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {/* 7. ABOUT BUTTONS */}
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setSettingsView('about-app')} className={`p-3 rounded-2xl border ${theme.settingRow} font-bold text-[10px] uppercase`}>Mission</button>
                <button onClick={() => setSettingsView('about-ivan')} className={`p-3 rounded-2xl border ${theme.settingRow} font-bold text-[10px] uppercase`}>Dev</button>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}