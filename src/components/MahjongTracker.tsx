import React, { useState } from 'react';

const SEAT_THEMES = [
  { border: 'border-red-600', bg: 'bg-red-50', text: 'text-red-700', active: 'ring-red-400' },
  { border: 'border-blue-600', bg: 'bg-blue-50', text: 'text-blue-700', active: 'ring-blue-400' },
  { border: 'border-green-700', bg: 'bg-green-50', text: 'text-green-800', active: 'ring-green-400' },
  { border: 'border-orange-600', bg: 'bg-orange-50', text: 'text-orange-700', active: 'ring-orange-400' },
];

export default function MahjongTracker() {
  const [scores, setScores] = useState(Array(4).fill(0));
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  const [windOffsets, setWindOffsets] = useState([0, 1, 2, 3]);
  const [dealerStreak, setDealerStreak] = useState(0);
  const [history, setHistory] = useState<{scores: number[], winds: number[], streak: number}[]>([]);
  
  const [pointsInput, setPointsInput] = useState('');
  const [winnerIdx, setWinnerIdx] = useState<number | null>(null);
  const [loserIdx, setLoserIdx] = useState<number | 'all' | null>(null);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [modalView, setModalView] = useState<'main' | 'mission' | 'ivan'>('main'); 
  const [dealerPointsEnabled, setDealerPointsEnabled] = useState(true);

  const getWindName = (windVal: number) => ['East (Dealer)', 'South', 'West', 'North'][windVal];
  const currentDealerBonus = 1 + (2 * dealerStreak);
  const currentEastIdx = windOffsets.indexOf(0);

  const handleTransaction = () => {
    if (winnerIdx === null || loserIdx === null || !pointsInput) return;
    let baseAmt = parseInt(pointsInput);
    if (isNaN(baseAmt)) return;

    const isDealerInvolved = (winnerIdx === currentEastIdx || loserIdx === currentEastIdx || (loserIdx === 'all' && winnerIdx !== currentEastIdx));
    const extra = (dealerPointsEnabled && isDealerInvolved) ? currentDealerBonus : 0;
    
    setHistory(prev => [...prev, { scores: [...scores], winds: [...windOffsets], streak: dealerStreak }]);

    const nextScores = [...scores];
    const totalAward = baseAmt + extra;

    if (loserIdx === 'all') {
      scores.forEach((_, i) => {
        if (i === winnerIdx) nextScores[i] += totalAward * 3;
        else nextScores[i] -= totalAward;
      });
    } else {
      nextScores[winnerIdx] += totalAward;
      nextScores[loserIdx as number] -= totalAward;
    }

    if (winnerIdx !== currentEastIdx) {
      setDealerStreak(0);
      setWindOffsets(prev => prev.map(val => (val + 3) % 4));
    } else {
      setDealerStreak(prev => prev + 1);
    }

    setScores(nextScores);
    setPointsInput('');
    setWinnerIdx(null);
    setLoserIdx(null);
  };

  return (
    // Added overflow-y-auto to allow scrolling on small devices
    <div className="relative flex flex-col w-full max-w-lg mx-auto bg-slate-100 font-sans text-slate-900 min-h-screen overflow-y-auto">
      
      {/* Top Header - Reduced Padding */}
      <div className="sticky top-0 z-30 flex justify-between items-center p-3 bg-white border-b border-slate-200">
        <div className="flex flex-col text-left">
          <h1 className="font-black text-base uppercase tracking-tight leading-none text-slate-800">Mission Mahjong!</h1>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Score Tracker</span>
        </div>

        {dealerPointsEnabled && (
          <div className="flex items-center bg-red-50 border border-red-100 px-2 py-0.5 rounded-full shadow-inner">
            <span className="text-[9px] font-black text-red-700 uppercase mr-2 font-mono text-xs">RD {dealerStreak + 1}</span>
            <span className="text-[9px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">+{currentDealerBonus}</span>
          </div>
        )}

        <button onClick={() => setIsSettingsOpen(true)} className="p-1 text-lg active:scale-110 transition-transform">⚙️</button>
      </div>

      {/* Selectable Scorecards - Tightened Gaps and Padding */}
      <div className="grid grid-cols-2 gap-2 p-3">
        {scores.map((score, i) => {
          const isCurrentEast = windOffsets[i] === 0;
          const isWinner = winnerIdx === i;

          return (
            <div 
              key={i} 
              onClick={() => setWinnerIdx(isWinner ? null : i)}
              className={`relative p-3 rounded-2xl border-2 bg-white transition-all cursor-pointer shadow-sm select-none active:scale-95 ${
                isWinner 
                  ? `${SEAT_THEMES[i].border} ring-2 ${SEAT_THEMES[i].active} z-10` 
                  : 'border-transparent opacity-90'
              }`}
            >
              {isCurrentEast && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[7px] font-black px-2 py-0.5 rounded-full shadow-md z-20 whitespace-nowrap">
                  DEALER
                </div>
              )}

              <input 
                className="w-full font-black text-sm bg-transparent border-none p-0 focus:ring-0 mb-0 pointer-events-auto"
                value={playerNames[i]}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  const n = [...playerNames]; n[i] = e.target.value; setPlayerNames(n);
                }}
              />
              <p className={`text-[8px] font-bold uppercase tracking-widest ${SEAT_THEMES[i].text}`}>
                {getWindName(windOffsets[i])}
              </p>
              
              <div className="mt-1 flex items-baseline text-left">
                <span className={`text-2xl font-mono font-black ${score < 0 ? 'text-red-600' : score > 0 ? 'text-emerald-600' : 'text-slate-300'}`}>
                  {score > 0 ? `+${score}` : score}
                </span>
                {isWinner && <span className="ml-2 text-sm">🏆</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Control Panel - Adjusted Padding and Margins for Mobile */}
      <div className="flex-grow bg-white mx-2 rounded-t-[32px] shadow-2xl p-5 border-x border-t border-slate-200">
        <div className="mb-4 relative text-left">
          <label className="block ml-4 mb-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Points</label>
          <input 
            type="number" inputMode="numeric" placeholder="0"
            className="w-full text-4xl p-3 rounded-2xl bg-slate-50 border-2 border-slate-100 text-center font-mono font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
            value={pointsInput}
            onChange={(e) => setPointsInput(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {playerNames.map((name, i) => (
            <button 
              key={i} 
              disabled={winnerIdx === i}
              onClick={() => setLoserIdx(i)}
              className={`py-3 rounded-xl font-black border-2 text-[10px] uppercase transition-all ${
                loserIdx === i 
                  ? 'bg-red-600 border-red-700 text-white shadow-lg' 
                  : 'bg-slate-50 border-slate-100 text-slate-400 disabled:opacity-5'
              }`}
            >
              {name || `P${i+1}`} Discarded
            </button>
          ))}
          <button 
            onClick={() => setLoserIdx('all')}
            className={`col-span-2 py-3 rounded-xl font-black border-2 uppercase text-[9px] tracking-widest ${
              loserIdx === 'all' ? 'bg-blue-600 border-blue-700 text-white shadow-lg' : 'bg-white border-slate-200 border-dashed text-slate-300'
            }`}
          >
            Self-Picked (Tsumo)
          </button>
        </div>

        <button 
          onClick={handleTransaction}
          disabled={winnerIdx === null || loserIdx === null || !pointsInput}
          className="w-full py-4 bg-slate-900 text-white disabled:bg-slate-100 disabled:text-slate-200 rounded-[20px] font-black text-xl uppercase shadow-xl mb-3 transition-all active:scale-95"
        >
          Record Score
        </button>

        <button 
          onClick={() => {
            if (history.length > 0) {
              const last = history[history.length-1];
              setScores(last.scores);
              setWindOffsets(last.winds);
              setDealerStreak(last.streak);
              setHistory(prev => prev.slice(0, -1));
            }
          }}
          disabled={history.length === 0}
          className="w-full text-slate-300 text-[9px] font-black uppercase tracking-widest disabled:opacity-0 mb-4"
        >
          ← Undo Last
        </button>
      </div>

      {/* Settings Modal - Remains full-screen capable */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-end bg-slate-900/60 backdrop-blur-sm p-4">
           <div className="w-full bg-white rounded-[32px] p-6 shadow-2xl max-h-[85vh] overflow-y-auto text-left">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black uppercase tracking-tight">Settings</h2>
                <button onClick={() => {setIsSettingsOpen(false); setModalView('main');}} className="text-2xl text-slate-300 p-2">✕</button>
              </div>

              {modalView === 'main' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="font-black uppercase text-xs">Dealer Points</span>
                    <input type="checkbox" className="w-6 h-6 rounded-lg accent-red-600" checked={dealerPointsEnabled} onChange={(e) => setDealerPointsEnabled(e.target.checked)}/>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="font-black uppercase text-xs">Dealer Streak</span>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setDealerStreak(Math.max(0, dealerStreak-1))} className="w-8 h-8 rounded-full border-2 border-slate-200 font-bold active:bg-slate-50">–</button>
                      <span className="text-base font-black w-4 text-center">{dealerStreak + 1}</span>
                      <button onClick={() => setDealerStreak(dealerStreak+1)} className="w-8 h-8 rounded-full border-2 border-slate-200 font-bold active:bg-slate-50">+</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                    <button onClick={() => setModalView('mission')} className="py-3 bg-slate-100 text-slate-600 rounded-xl font-bold uppercase text-[9px] tracking-widest">ℹ️ Mission</button>
                    <button onClick={() => setModalView('ivan')} className="py-3 bg-slate-100 text-slate-600 rounded-xl font-bold uppercase text-[9px] tracking-widest">👤 Ivan</button>
                  </div>

                  <button onClick={() => setIsSettingsOpen(false)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase shadow-lg">Done</button>
                  <button onClick={() => confirm("Reset all scores?") && window.location.reload()} className="w-full py-2 text-red-300 font-bold uppercase text-[9px] tracking-widest text-center">Reset Game</button>
                </div>
              )}

              {modalView === 'mission' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-base font-black uppercase text-red-600 mb-2">Mission: Mahjong!</h3>
                  <p className="text-slate-600 leading-relaxed text-xs mb-4">
                    Based in Las Vegas, Mission: Mahjong! fosters community connection by providing free, welcoming spaces to learn and play Chinese style mahjong.
                  </p>
                  <a href="https://missionmahjong.com/" target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-blue-600 text-white text-center rounded-xl font-black uppercase text-xs shadow-md mb-4 active:scale-95 transition-all">Visit website</a>
                  <button onClick={() => setModalView('main')} className="w-full py-2 text-slate-400 font-bold uppercase text-[9px] tracking-widest border border-slate-100 rounded-xl text-center">Back</button>
                </div>
              )}

              {modalView === 'ivan' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-base font-black uppercase text-slate-800 mb-2">Ivan — Developer</h3>
                  <p className="text-slate-600 leading-relaxed text-xs mb-4">
                    Hi, I'm <strong>Ivan</strong>. I'm a developer and Mahjong enthusiast. I built this tracker for Mission Mahjong events, but I hope groups everywhere find this useful.
                  </p>
                  <a href="https://itsjustivan.com/" target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-slate-900 text-white text-center rounded-xl font-black uppercase text-xs shadow-md mb-4 active:scale-95 transition-all">Visit itsjustivan.com</a>
                  <button onClick={() => setModalView('main')} className="w-full py-2 text-slate-400 font-bold uppercase text-[9px] tracking-widest border border-slate-100 rounded-xl text-center mb-2">Back</button>
                  <div className="text-center"><span className="text-[9px] font-mono font-bold text-slate-200">v1.0.0</span></div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}