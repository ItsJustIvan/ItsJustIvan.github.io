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

  // Constants for point logic
  const currentDealerBonus = baseDealerPoint + (2 * dealerStreak);
  const currentEastIdx = windOffsets.indexOf(0);

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

  const saveToHistory = () => {
    setHistory(prev => [...prev, { scores: [...scores], winds: [...windOffsets], streak: dealerStreak, roundWind: roundWindIdx }]);
  };

  const rotateDealer = () => {
    setDealerStreak(0);
    setWindOffsets(prev => prev.map(val => (val + (playerCount - 1)) % playerCount));
    if (currentEastIdx === playerCount - 1) {
      setRoundWindIdx(prev => (prev + 1) % 4);
    }
  };

  const handleDeadHand = () => {
    saveToHistory();
    if (dealerPointsEnabled) setDealerStreak(prev => prev + 1);
    setWinnerIdx(null);
    setLoserIdx(null);
    setShowControls(false);
  };

  const handleTransaction = () => {
    if (winnerIdx === null || loserIdx === null || !pointsInput) return;
    const baseAmt = parseInt(pointsInput);
    if (isNaN(baseAmt)) return;

    saveToHistory();

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
{/* 2. Subheader - Large Status Chips */}
      <div className={`flex-none grid grid-cols-2 gap-2 px-3 py-3 border-b bg-opacity-95 backdrop-blur-md ${theme.header}`}>
        <div className={`flex items-center justify-center gap-3 py-2 rounded-2xl border-2 ${darkMode ? 'border-blue-900 bg-blue-900/20' : 'border-blue-100 bg-blue-50'}`}>
          <span className={`text-3xl font-black ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{WINDS[roundWindIdx].char}</span>
          <div className="flex flex-col">
            <span className={`text-[10px] font-black uppercase tracking-widest ${theme.textMuted} leading-none`}>Round</span>
            <span className="text-sm font-black uppercase">{WINDS[roundWindIdx].name}</span>
          </div>
        </div>
        
        {dealerPointsEnabled ? (
          <div className={`flex items-center justify-center gap-3 py-2 rounded-2xl border-2 ${darkMode ? 'border-emerald-900 bg-emerald-900/20' : 'border-emerald-100 bg-emerald-50'}`}>
            <div className="flex flex-col items-end">
              <span className={`text-[10px] font-black uppercase tracking-widest ${theme.textMuted} leading-none`}>Streak</span>
              <span className="text-sm font-black uppercase">{dealerStreak + 1}</span>
            </div>
            <div className="bg-emerald-600 text-white px-2 py-1 rounded-lg text-lg font-black shadow-sm">
              +{currentDealerBonus}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center opacity-20">
            <span className="text-[10px] font-black uppercase italic">Bonuses Off</span>
          </div>
        )}
      </div>

{/* 3. Main Grid - Optimized for Legibility */}
      <main className={`flex-1 grid gap-3 p-3 min-h-0 ${playerCount <= 2 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {scores.map((score, i) => {
          const isCurrentEast = windOffsets[i] === 0;
          const isWinner = winnerIdx === i;
          return (
            <div 
              key={i} 
              onClick={() => { 
                if (winnerIdx === i) { 
                  setWinnerIdx(null); 
                  setLoserIdx(null); 
                  setShowControls(false); 
                } else { 
                  setWinnerIdx(i); 
                  setLoserIdx(null); 
                  setShowControls(true); 
                } 
              }} 
              className={`relative p-4 rounded-[2rem] border-4 transition-all duration-300 cursor-pointer flex flex-col items-center justify-between overflow-hidden ${theme.card} 
                ${isWinner ? `${SEAT_THEMES[i].border} ring-8 ${SEAT_THEMES[i].active} ${SEAT_THEMES[i].glow} z-20 scale-[1.03]` : 'z-10 border-transparent shadow-sm'}`}
            >
              {/* Winner Badge - Larger & Centered Top */}
              {isWinner && (
                <div className={`absolute top-0 left-0 right-0 py-1.5 flex justify-center ${SEAT_THEMES[i].bg} text-white text-[10px] font-black uppercase tracking-[0.2em] animate-in slide-in-from-top duration-300`}>
                  Selected Winner
                </div>
              )}

              {/* Top Row: Name and Wind Side-by-Side */}
              <div className={`w-full flex justify-between items-start ${isWinner ? 'mt-4' : 'mt-0'}`}>
                <div className="flex flex-col text-left flex-1 mr-2">
                  <input 
                    className={`font-black text-lg bg-transparent border-none p-0 focus:ring-0 w-full mb-0.5 leading-none`} 
                    value={playerNames[i]} 
                    onClick={(e) => e.stopPropagation()} 
                    onChange={(e) => { 
                      const n = [...playerNames]; 
                      n[i] = e.target.value; 
                      setPlayerNames(n); 
                    }} 
                  />
                  <div className="flex items-center gap-2">
                    <span className={`text-xl font-black ${SEAT_THEMES[i].text}`}>{WINDS[windOffsets[i] % 4].char}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted}`}>{WINDS[windOffsets[i] % 4].name}</span>
                  </div>
                </div>

                {/* Dealer Tag - More prominent */}
                {isCurrentEast && (
                  <div className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase shadow-sm">
                    Dealer
                  </div>
                )}
              </div>

              {/* Center Element: The Score */}
              <div className="flex-1 flex items-center justify-center py-4">
                <span className={`text-7xl font-mono font-black tracking-tighter leading-none transition-all duration-500 
                  ${score < 0 ? 'text-red-600' : score > 0 ? 'text-emerald-600' : darkMode ? 'text-zinc-600' : 'text-slate-300'}`}>
                  {score}
                </span>
              </div>

              {/* Bottom Row: Visual Feedback Label */}
              <div className="w-full text-center">
                 <div className={`h-1.5 w-12 rounded-full mx-auto ${isWinner ? SEAT_THEMES[i].bg : 'bg-transparent'}`} />
              </div>
            </div>
          );
        })}
      </main>

{/* 4. Footer with Improved Status & Chevron */}
      <footer className={`flex-none p-4 border-t bg-white dark:bg-zinc-900 ${theme.panel} z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]`}>
        <div className="max-w-lg mx-auto flex flex-col gap-3">
          
          {/* Header Area with Label and Chevron */}
          <div 
            onClick={() => setShowControls(!showControls)} 
            className="flex justify-between items-center px-1 cursor-pointer group"
          >
            <label className={`text-[9px] font-black uppercase tracking-[0.2em] ${theme.textMuted} group-hover:text-blue-500 transition-colors`}>
              Point Value
            </label>
            
            {/* The Interactive Chevron */}
            <div className={`text-sm transition-transform duration-300 ${showControls ? 'rotate-180' : 'rotate-0'} ${theme.textMuted}`}>
              ▲
            </div>
          </div>
          
          {/* Collapsible Content */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showControls ? 'max-h-[500px] opacity-100 mb-2' : 'max-h-0 opacity-0 mb-0'}`}>
            <div className="flex flex-col gap-4 pt-2">
              
              {/* 1:3:1 RATIO STEPPER */}
              <div className="grid grid-cols-5 gap-2">
                <button 
                  onClick={() => setPointsInput(String(Math.max(0, parseInt(pointsInput || '0') - 1)))} 
                  className={`col-span-1 h-14 rounded-2xl flex items-center justify-center text-2xl font-black border-2 ${theme.settingRow} active:scale-90 transition-transform`}
                >
                  -
                </button>
                <input 
                  type="number" 
                  inputMode="numeric" 
                  className={`col-span-3 text-4xl h-14 rounded-2xl border-2 text-center font-mono font-black outline-none ${theme.input} focus:border-blue-500 transition-all`} 
                  value={pointsInput} 
                  onChange={(e) => setPointsInput(e.target.value)} 
                />
                <button 
                  onClick={() => setPointsInput(String(parseInt(pointsInput || '0') + 1))} 
                  className={`col-span-1 h-14 rounded-2xl flex items-center justify-center text-2xl font-black border-2 ${theme.settingRow} active:scale-90 transition-transform`}
                >
                  +
                </button>
              </div>

              {/* Status & Player Selection Area */}
              <div className="flex flex-col gap-2">
                {/* Status moved here: Top-Left of the player buttons */}
                {winnerIdx !== null && (
                  <div className="px-1 text-left">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest animate-in fade-in slide-in-from-left-2 duration-300">
                      {loserIdx === null ? "Who Discarded?" : "Ready to Record"}
                    </span>
                  </div>
                )}

                <div className={`grid gap-2 ${playerCount <= 2 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {playerNames.map((name, i) => (
                    <button 
                      key={i} 
                      disabled={winnerIdx === i} 
                      onClick={() => setLoserIdx(i)} 
                      className={`py-4 rounded-xl font-black border-2 text-[10px] uppercase transition-all active:scale-95 ${loserIdx === i ? 'bg-red-600 border-red-700 text-white shadow-lg' : `${theme.buttonGhost} disabled:opacity-5`}`}
                    >
                      {name}
                    </button>
                  ))}
                  <button 
                    onClick={() => setLoserIdx('all')} 
                    className={`col-span-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 border ${loserIdx === 'all' ? 'bg-blue-600 border-blue-700 text-white shadow-lg' : `bg-transparent border-dashed ${darkMode ? 'border-zinc-700 text-zinc-500' : 'border-slate-300 text-slate-400'}`}`}
                  >
                    Self-picked (All Pay)
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Actions */}
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={handleDeadHand} 
              className={`col-span-1 py-4 rounded-2xl font-black text-[10px] uppercase border transition-all active:scale-95 ${theme.buttonGhost}`}
            >
              Dead Hand
            </button>
            <button 
              onClick={handleTransaction} 
              disabled={winnerIdx === null || loserIdx === null || !pointsInput} 
              className={`col-span-2 py-4 rounded-2xl font-black text-xs uppercase shadow-xl transition-all active:scale-95 disabled:opacity-20 ${theme.primaryBtn}`}
            >
              Record Score
            </button>
          </div>
        </div>
      </footer>

{/* 5. Settings Modal - High Legibility Version */}
      {isSettingsOpen && (
        <div onClick={() => setIsSettingsOpen(false)} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
          <div onClick={(e) => e.stopPropagation()} className={`w-full max-w-sm rounded-[40px] p-6 shadow-2xl border-4 ${theme.modal} animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]`}>
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 text-left">
              <button 
                onClick={() => settingsView === 'main' ? setIsSettingsOpen(false) : setSettingsView('main')}
                className="flex flex-col items-start"
              >
                <div className="flex items-center gap-2">
                  {settingsView !== 'main' && <span className="text-blue-600 text-2xl">←</span>}
                  <h2 className="font-black text-3xl uppercase tracking-tighter">
                    {settingsView === 'main' ? 'Menu' : settingsView === 'about-app' ? 'Mission' : 'The Dev'}
                  </h2>
                </div>
                <div className="h-1.5 w-12 rounded-full bg-blue-600 mt-1" />
              </button>
              <button onClick={() => setIsSettingsOpen(false)} className="w-12 h-12 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-2xl font-bold">✕</button>
            </div>

            {settingsView === 'main' ? (
              <div className="flex flex-col gap-4">
                
                {/* Reset - Made very obvious */}
                <button onClick={() => { if(confirm("Reset everything to zero?")) { setScores(Array(playerCount).fill(0)); setHistory([]); setDealerStreak(0); setIsSettingsOpen(false); }}} 
                  className="w-full py-5 rounded-3xl bg-red-600 text-white font-black text-lg uppercase shadow-lg active:scale-95 transition-all">
                  Reset Match
                </button>

                {/* Big Stepper Controls */}
                <div className="space-y-4 py-2">
                  {[
                    { label: 'Player Count', val: playerCount, set: (v: number) => setPlayerCount(Math.max(1, Math.min(4, v))) },
                    { label: 'Dealer Bonus', val: baseDealerPoint, set: setBaseDealerPoint, hidden: !dealerPointsEnabled }
                  ].map((item, idx) => !item.hidden && (
                    <div key={idx} className="flex flex-col gap-2">
                      <label className="text-xs font-black uppercase opacity-60 ml-2">{item.label}</label>
                      <div className={`flex items-center justify-between rounded-3xl p-2 border-2 ${theme.settingRow}`}>
                        <button onClick={() => item.set(item.val - 1)} className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-700 shadow-sm text-3xl font-black">-</button>
                        <span className="text-3xl font-black font-mono">{item.val}</span>
                        <button onClick={() => item.set(item.val + 1)} className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-700 shadow-sm text-3xl font-black">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Toggles - Bigger Hit Area */}
                <button onClick={() => setDarkMode(!darkMode)} className={`w-full p-5 rounded-3xl border-2 flex justify-between items-center ${theme.settingRow}`}>
                  <span className="font-black text-sm uppercase tracking-widest">Dark Mode</span>
                  <div className={`w-14 h-8 rounded-full relative transition-colors ${darkMode ? 'bg-blue-600' : 'bg-zinc-300'}`}>
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
                  </div>
                </button>

                {/* Navigation Links - Full Width List */}
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-xs font-black uppercase opacity-60 ml-2">Information</label>
                  <button onClick={() => setSettingsView('about-app')} className={`w-full p-5 rounded-3xl border-2 flex justify-between items-center ${theme.settingRow} font-black text-sm uppercase`}>
                    <span>About Mission Mahjong</span>
                    <span>→</span>
                  </button>
                  <button onClick={() => setSettingsView('about-ivan')} className={`w-full p-5 rounded-3xl border-2 flex justify-between items-center ${theme.settingRow} font-black text-sm uppercase`}>
                    <span>About The Developer</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Submenu Content Area */
              <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-300">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-zinc-700">
                  {settingsView === 'about-app' ? (
                    <div className="space-y-4">
                      <p className="text-lg leading-snug font-medium">Based in Las Vegas, <span className="font-black text-blue-600">Mission: Mahjong!</span> fosters community connection by providing free, welcoming spaces to learn and play.</p>
                      <a href="https://missionmahjong.com/" target="_blank" className="block w-full py-4 bg-emerald-600 text-white rounded-2xl text-center font-black text-sm uppercase tracking-widest shadow-lg">Visit Website</a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black">I</div>
                         <h3 className="font-black text-2xl">Ivan</h3>
                      </div>
                      <p className="text-lg leading-snug">I build clean tools for niche communities. This tracker is designed to make game night easier for everyone.</p>
                      <a href="https://itsjustivan.com/" target="_blank" className="block w-full py-4 bg-purple-600 text-white rounded-2xl text-center font-black text-sm uppercase tracking-widest shadow-lg">Check me out!</a>
                    </div>
                  )}
                </div>
                <button onClick={() => setSettingsView('main')} className="w-full py-5 rounded-3xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black text-sm uppercase">Go Back</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}