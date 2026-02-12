
import React, { useEffect, useRef, useState, useMemo } from 'react';
import StarryBackground from './components/StarryBackground';
import { TarotCardView } from './components/TarotCardView';
import { CARD_BACK_IMAGE, TAROT_DECK, TRANSLATIONS } from './constants';
import { DeckCard, GameState, Language, DrawEffect, BackgroundMode } from './types';
import gsap from 'gsap';

// --- ICONS ---
const GearIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

export default function App() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [deck, setDeck] = useState<DeckCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<DeckCard[]>([]);
  const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);
  const [rotationOffset, setRotationOffset] = useState(0);
  
  // Drawing State
  const [drawStep, setDrawStep] = useState(0); // 0, 1, 2 (for 3 cards)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('zh');
  const [drawEffect, setDrawEffect] = useState<DrawEffect>('resonance');
  
  // Background State - Defaulting to White as requested
  const [bgMode, setBgMode] = useState<BackgroundMode>('white');

  const t = TRANSLATIONS[language];

  // Theme Constants based on mode
  const isLight = bgMode === 'white';
  const theme = useMemo(() => {
    return {
       textMain: isLight ? 'text-slate-900' : 'text-amber-100',
       textSub: isLight ? 'text-slate-600' : 'text-slate-400',
       accent: isLight ? 'text-amber-700' : 'text-amber-500',
       bg: isLight ? 'bg-slate-50' : 'bg-black',
       modalBg: isLight ? 'bg-white/90 border-slate-200 text-slate-900' : 'bg-slate-900/90 border-amber-500/30 text-white',
       buttonBg: isLight ? 'bg-slate-200/50 hover:bg-amber-100 border-slate-300' : 'bg-black/40 hover:bg-amber-900/20 border-amber-600/50',
       panelBg: isLight ? 'bg-white/70 border-amber-500/20 shadow-xl' : 'bg-slate-950/60 border-amber-500/30 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.8)]',
       phaseTitleBorder: isLight ? 'border-amber-700/30' : 'border-amber-500/30',
    };
  }, [isLight]);

  // --- INITIALIZATION ---

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const rawDeck: DeckCard[] = TAROT_DECK.map((card, i) => ({
      ...card,
      uniqueId: `deck-${i}`,
      isReversed: Math.random() > 0.5 
    }));
    setDeck(rawDeck);
  }, []);

  // --- GAME LOGIC ---

  const startGame = () => {
    setGameState('shuffling');
    setTimeout(() => {
      setDeck(prevDeck => {
        const newDeck = [...prevDeck];
        for (let i = newDeck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
        }
        return newDeck;
      });
      setGameState('drawing');
      setDrawStep(0);
    }, 2500); 
  };

  const handleDrawCard = () => {
    if (selectedCards.length >= 3) return;
    const availableCards = deck.filter(c => !selectedCards.find(s => s.uniqueId === c.uniqueId));
    const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
    const newSelection = [...selectedCards, randomCard];
    setSelectedCards(newSelection);
    if (newSelection.length === 3) {
      setTimeout(() => setGameState('revealing'), 1000);
      setTimeout(() => setGameState('reading'), 2500);
    } else {
      setDrawStep(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setSelectedCards([]);
    setFocusedCardIndex(null);
    setGameState('shuffling');
    setTimeout(() => {
        setDeck(prevDeck => {
            const newDeck = [...prevDeck];
            for (let i = newDeck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
            }
            return newDeck;
        });
        setGameState('drawing');
        setDrawStep(0);
    }, 1500);
  };

  useEffect(() => {
    if (gameState === 'drawing') {
      let animId: number;
      const loop = () => {
        setRotationOffset(prev => (prev + 0.1) % 360);
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(animId);
    } else {
      setRotationOffset(0);
    }
  }, [gameState]);


  // --- CARD POSITIONING LOGIC ---
  const getCardPosition = (index: number) => {
    const isMobile = windowWidth < 768;
    const isLandscape = windowWidth > windowHeight;
    const isShort = windowHeight < 700;

    if (gameState === 'intro') {
        const seed = index * 123.45;
        const rot = ((seed % 100) / 100 - 0.5); 
        const x = ((seed * 2 % 100) / 100 - 0.5) * 4; 
        const y = ((seed * 3 % 100) / 100 - 0.5) * 4;
        const zOffset = index * 0.2; 
        return { x: x, y: y - zOffset, rotation: rot, zIndex: index, scale: 1 };
    }
    if (gameState === 'shuffling') {
        const radius = Math.min(windowWidth, windowHeight) * 0.4;
        const seed = index * 999;
        const r = Math.sqrt((seed % 100) / 100) * radius;
        const theta = (seed % 360) * (Math.PI / 180);
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        const rot = (seed % 360); 
        return { x, y, rotation: rot, zIndex: index, scale: 1 };
    }
    
    // Spread Logic (Drawing, Revealing, Reading for unselected cards)
    // Rotating tighter circle
    
    const base = Math.min(windowWidth, windowHeight);
    const radius = isMobile
      ? Math.max(180, Math.min(280, base * 0.62))
      : Math.max(320, Math.min(520, base * 0.85));
    
    // Full circle distribution
    const totalAngle = 360;
    const angleStep = totalAngle / deck.length;
    
    // index 0 at top (0 deg) + rotation
    const angleDeg = (index * angleStep) + rotationOffset;
    const angleRad = (angleDeg * Math.PI) / 180;
    
    const x = radius * Math.sin(angleRad);
    
    // Vertical Offset Calculation
    // Adjust y so the top of the circle is visible and nicely positioned
    let verticalOffset = 0;
    
    if (isMobile) {
      verticalOffset = isLandscape
        ? -base * 0.28
        : -base * 0.18;
    } else if (isLandscape && isShort) {
      verticalOffset = -base * 0.12;
    } else {
      verticalOffset = base * 0.06;
    }

    const y = (radius - (radius * Math.cos(angleRad))) + verticalOffset;
    
    return { x, y, rotation: angleDeg, zIndex: index, scale: 1 };
  };

  const getReadingPosition = (slotIndex: number) => {
    const isMobile = windowWidth < 768;
    const isLandscape = windowWidth > windowHeight;
    const spacing = isMobile ? Math.min(120, windowWidth * 0.28) : 250;
    const xOffset = (slotIndex - 1) * spacing;
    const yPos = isMobile
      ? (isLandscape ? windowHeight * -0.16 : windowHeight * -0.20)
      : windowHeight * -0.25;
    return { x: xOffset, y: yPos, rotation: 0, zIndex: 2000 + slotIndex };
  };

  // --- RENDER ---
  const isLandscape = windowWidth > windowHeight;
  const isShort = windowHeight < 700;
  const isMobile = windowWidth < 768;

  return (
    <div className={`relative w-full h-[100svh] min-h-[100svh] overflow-hidden font-sans transition-colors duration-700 ${theme.bg} ${theme.textMain}`}>
      
      {/* Backgrounds */}
      {bgMode === 'starry' && <StarryBackground />}
      
      {/* SETTINGS UI */}
      <div
        className="absolute z-[9999]"
        style={{
          top: 'calc(1.25rem + env(safe-area-inset-top))',
          right: 'calc(1.25rem + env(safe-area-inset-right))',
        }}
      >
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className={`p-2 rounded-full transition-all ${isLight ? 'text-slate-600 hover:bg-slate-200' : 'text-amber-500/70 hover:text-amber-100 hover:bg-white/10'}`}
        >
          <GearIcon />
        </button>
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm rounded-xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] ${theme.modalBg}`}>
            <div className={`flex justify-between items-center mb-6 border-b pb-4 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <h3 className={`text-xl font-serif ${theme.accent}`}>{t.settings}</h3>
              <button onClick={() => setIsSettingsOpen(false)} className={`${isLight ? 'text-slate-400 hover:text-slate-600' : 'text-slate-400 hover:text-white'}`}>
                <CloseIcon />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* LANGUAGE */}
              <div className="flex justify-between items-center">
                <span className={theme.textSub}>{t.language}</span>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setLanguage('zh')} 
                        className={`px-3 py-1 text-xs rounded border transition-colors ${language === 'zh' ? 'bg-amber-600 border-amber-600 text-white' : (isLight ? 'border-slate-300 text-slate-500' : 'border-slate-600 text-slate-400')}`}
                    >
                        中文
                    </button>
                    <button 
                        onClick={() => setLanguage('en')} 
                        className={`px-3 py-1 text-xs rounded border transition-colors ${language === 'en' ? 'bg-amber-600 border-amber-600 text-white' : (isLight ? 'border-slate-300 text-slate-500' : 'border-slate-600 text-slate-400')}`}
                    >
                        EN
                    </button>
                </div>
              </div>

              {/* BACKGROUND */}
              <div className="space-y-3">
                 <span className={`${theme.textSub} block mb-2`}>{t.background}</span>
                 <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'white', label: t.bgWhite },
                      { id: 'black', label: t.bgBlack },
                      // Starry background option removed
                    ].map(bg => (
                       <label key={bg.id} className={`flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${bgMode === bg.id ? (isLight ? 'bg-slate-100 border-amber-500 ring-1 ring-amber-500' : 'bg-amber-900/30 border-amber-600/60') : (isLight ? 'bg-white border-slate-200 hover:bg-slate-50' : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800')}`}>
                           <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${bgMode === bg.id ? 'border-amber-500' : (isLight ? 'border-slate-300' : 'border-slate-500')}`}>
                              {bgMode === bg.id && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                           </div>
                           <input 
                              type="radio" 
                              name="bgMode" 
                              value={bg.id} 
                              checked={bgMode === bg.id}
                              onChange={() => setBgMode(bg.id as BackgroundMode)}
                              className="hidden"
                           />
                           <span className={`text-xs ${bgMode === bg.id ? (isLight ? 'text-slate-900 font-bold' : 'text-amber-100') : (isLight ? 'text-slate-500' : 'text-slate-400')}`}>{bg.label}</span>
                       </label>
                    ))}
                 </div>
              </div>

              {/* DRAW EFFECT */}
              <div className="space-y-3">
                 <span className={`${theme.textSub} block mb-2`}>{t.drawEffect}</span>
                 <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'resonance', label: t.effectResonance },
                      { id: 'stardust', label: t.effectStardust },
                      { id: 'abyss', label: t.effectAbyss },
                      { id: 'thread', label: t.effectThread },
                    ].map(effect => (
                       <label key={effect.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${drawEffect === effect.id ? (isLight ? 'bg-slate-100 border-amber-500' : 'bg-amber-900/30 border-amber-600/60') : (isLight ? 'bg-white border-slate-200 hover:bg-slate-50' : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800')}`}>
                           <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${drawEffect === effect.id ? 'border-amber-500' : (isLight ? 'border-slate-300' : 'border-slate-500')}`}>
                              {drawEffect === effect.id && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                           </div>
                           <input 
                              type="radio" 
                              name="drawEffect" 
                              value={effect.id} 
                              checked={drawEffect === effect.id}
                              onChange={() => setDrawEffect(effect.id as DrawEffect)}
                              className="hidden"
                           />
                           <span className={`text-sm ${drawEffect === effect.id ? (isLight ? 'text-slate-900' : 'text-amber-100') : (isLight ? 'text-slate-500' : 'text-slate-400')}`}>{effect.label}</span>
                       </label>
                    ))}
                 </div>
              </div>

            </div>

            <div className={`mt-8 pt-4 border-t text-center text-xs ${isLight ? 'border-slate-200 text-slate-400' : 'border-white/10 text-slate-500'}`}>
              Lumina Tarot v2.3
            </div>
          </div>
        </div>
      )}

      {/* --- INTRO SCREEN --- */}
      {gameState === 'intro' && (
        <div className={`absolute inset-0 z-[100] flex items-center justify-center px-4 ${isLight ? 'bg-gradient-to-b from-white via-white/90 to-white/70' : 'bg-gradient-to-b from-black via-black/80 to-black/60'}`}>
          <div className="w-full max-w-md sm:max-w-xl flex flex-col items-center text-center gap-6">
            <div className="relative w-44 h-72 sm:w-56 sm:h-80">
              <img
                src={CARD_BACK_IMAGE}
                alt=""
                className={`w-full h-full object-cover rounded-2xl shadow-2xl border ${isLight ? 'border-slate-200' : 'border-amber-700/30'}`}
                draggable={false}
              />
              <div className={`absolute inset-0 rounded-2xl ${isLight ? 'bg-gradient-to-b from-white/10 via-transparent to-black/20' : 'bg-gradient-to-b from-black/10 via-transparent to-black/40'}`} />
            </div>

            <div className={`w-full rounded-2xl px-6 py-5 backdrop-blur-md border ${isLight ? 'bg-white/75 border-slate-200 text-slate-900' : 'bg-black/40 border-white/10 text-white'}`}>
              <h1 className={`text-4xl sm:text-6xl font-serif tracking-[0.18em] ${theme.accent}`}>
                {t.title}
              </h1>
              <p className={`mt-3 text-sm sm:text-base leading-relaxed ${theme.textSub}`}>
                {t.subtitle}
              </p>
            </div>

            <button
              onClick={startGame}
              className={`px-10 py-3 border text-base sm:text-lg hover:scale-[1.03] active:scale-[0.99] transition-all tracking-[0.25em] font-serif rounded-full ${isLight ? 'border-amber-600 text-amber-700 hover:bg-amber-50' : 'border-amber-600/50 text-amber-200/90 hover:bg-amber-900/20 hover:border-amber-400'}`}
            >
              {t.start}
            </button>
          </div>
        </div>
      )}

      {/* --- TITLE DURING GAMEPLAY --- */}
      {gameState !== 'intro' && (
        <div className={`absolute top-0 left-0 w-full flex justify-center py-6 z-30 transition-opacity duration-1000 ${gameState === 'reading' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
             <h1 className={`text-2xl font-serif tracking-[0.5em] uppercase pointer-events-none ${isLight ? 'text-slate-300' : 'text-amber-500/30'}`}>
                {t.title}
             </h1>
        </div>
      )}

      {/* --- GAME AREA --- */}
      <div className="absolute inset-0 flex items-center justify-center perspective-1000 overflow-hidden">
        
        {/* --- DECK RENDER --- */}
        <div className="relative w-0 h-0 transition-transform duration-[10s] ease-linear">
             {gameState !== 'intro' && deck.map((card, index) => {
                 const selectionIndex = selectedCards.findIndex(c => c.uniqueId === card.uniqueId);
                 const isSelected = selectionIndex !== -1;
                 const isHidden = gameState === 'reading' && !isSelected;

                 let pos = { x: 0, y: 0, rotation: 0, zIndex: 0 };
                 if (isSelected) {
                    pos = getReadingPosition(selectionIndex);
                 } else {
                    pos = getCardPosition(index);
                 }

                 return (
                    <div 
                        key={card.uniqueId} 
                        className={`transition-opacity duration-1000 ${isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        <TarotCardView 
                            id={`card-${index}`}
                            index={index}
                            card={card}
                            isFlipped={gameState === 'reading' || gameState === 'revealing'} 
                            isSelected={isSelected}
                            isHovered={false} 
                            hoverProgress={0}
                            position={pos}
                            drawEffect={drawEffect}
                            {...(isSelected && gameState === 'reading' ? { onClick: () => setFocusedCardIndex(selectionIndex) } : {})}
                        />
                    </div>
                 );
             })}
        </div>

        {/* --- DRAW BUTTON --- */}
        {gameState === 'drawing' && (
          <div
            className="absolute z-[6000] flex flex-col items-center gap-3 transition-all duration-300 px-4"
            style={{
              bottom: `calc(${(isLandscape || isShort) ? '1.25rem' : '4.5rem'} + env(safe-area-inset-bottom))`,
            }}
          >
            {isMobile && (
              <h2 className={`text-base font-serif tracking-[0.2em] drop-shadow-sm border-b pb-1 ${theme.textMain} ${theme.phaseTitleBorder} opacity-90`}>
                {drawStep === 0 ? t.past : drawStep === 1 ? t.present : t.future}
              </h2>
            )}

            <div className="relative flex items-center justify-center">
              <button
                onClick={handleDrawCard}
                className={`group relative px-8 py-3 backdrop-blur-md border font-serif tracking-[0.2em] rounded-full transition-all duration-300 shadow-lg ${theme.buttonBg} ${isLight ? 'text-slate-800' : 'text-amber-200/90'}`}
              >
                <span className="relative z-10 text-sm">{t.drawCard}</span>
              </button>

              {!isMobile && (
                <div className="absolute left-full pl-6 whitespace-nowrap animate-in fade-in slide-in-from-left-4 duration-500">
                  <h2 className={`text-lg sm:text-2xl font-serif tracking-[0.2em] drop-shadow-md border-b pb-1 ${theme.textMain} ${theme.phaseTitleBorder} opacity-90`}>
                    {drawStep === 0 ? t.past : drawStep === 1 ? t.present : t.future}
                  </h2>
                </div>
              )}
            </div>

            <p className={`text-xs tracking-widest ${theme.textSub}`}>{t.drawPrompt}</p>
          </div>
        )}

        {/* --- READING PHASE LABELS --- */}
        {gameState === 'reading' && selectedCards.length === 3 && (
            <div className="absolute w-full h-full pointer-events-none">
                {['past', 'present', 'future'].map((key, i) => {
                     const pos = getReadingPosition(i);
                     // @ts-ignore
                     const label = t[key];
                     return (
                         <div 
                            key={key}
                            className={`absolute text-[10px] uppercase tracking-[0.4em] font-medium text-center w-40 transition-all duration-1000 delay-500 opacity-0 animate-[fadeIn_1s_forwards] ${theme.textSub}`}
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y - 180}px))`, 
                            }}
                         >
                             {label}
                         </div>
                     );
                })}
            </div>
        )}

        {/* --- RESULTS PANEL --- */}
        {gameState === 'reading' && selectedCards.length === 3 && (
             <>
                 <div
                   className="absolute bottom-0 left-0 w-full flex justify-center items-end px-4 pointer-events-none z-[6000]"
                   style={{
                     height: (isLandscape || isShort) ? '70svh' : '50svh',
                     paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom))',
                   }}
                 >
                     {focusedCardIndex !== null ? (
                         <div className={`max-w-2xl w-full text-center space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 pointer-events-auto backdrop-blur-xl p-5 sm:p-8 rounded-2xl border overflow-y-auto h-full custom-scrollbar ${theme.panelBg}`}>
                            
                            <h2 className={`text-2xl sm:text-3xl font-serif tracking-wider drop-shadow-sm sticky top-0 py-2 z-10 ${theme.textMain}`}>
                                {language === 'zh' ? selectedCards[focusedCardIndex].name : selectedCards[focusedCardIndex].nameEn}
                                {selectedCards[focusedCardIndex].isReversed && (
                                    <span className={`text-sm ml-3 font-normal tracking-normal align-middle ${theme.textSub}`}>
                                        {language === 'zh' ? '· 逆位' : '· Reversed'}
                                    </span>
                                )}
                            </h2>

                            <div className="flex flex-wrap justify-center gap-2 mb-4">
                                {(selectedCards[focusedCardIndex].isReversed 
                                    ? (selectedCards[focusedCardIndex].keywordsReversed || []) 
                                    : selectedCards[focusedCardIndex].keywordsUpright
                                ).map(k => (
                                    <span key={k} className={`px-3 py-1 border text-xs tracking-wide uppercase ${isLight ? 'bg-amber-100 border-amber-200 text-amber-800' : 'bg-amber-900/20 border-amber-700/30 text-amber-400'}`}>{k}</span>
                                ))}
                            </div>
                            
                            {selectedCards[focusedCardIndex].cardDescription && (
                                <div className={`text-sm leading-relaxed font-light text-justify px-4 mb-6 p-4 rounded-sm border-l-2 ${isLight ? 'text-slate-700 bg-slate-50 border-amber-300' : 'text-slate-400/90 bg-black/20 border-amber-900/50'}`}>
                                    <h4 className={`font-bold mb-2 text-[10px] tracking-[0.2em] uppercase ${theme.accent}`}>{t.interpretation}</h4>
                                    {selectedCards[focusedCardIndex].cardDescription}
                                </div>
                            )}

                            <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto mb-6"></div>
                            
                            <div className={`text-sm sm:text-base leading-7 sm:leading-8 font-light text-justify px-1 sm:px-2 whitespace-pre-wrap font-sans ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                                {selectedCards[focusedCardIndex].isReversed 
                                    ? selectedCards[focusedCardIndex].meaningReversed 
                                    : selectedCards[focusedCardIndex].meaningUpright}
                            </div>
                         </div>
                     ) : (
                         <div className={`text-xs tracking-[0.3em] uppercase font-serif animate-pulse mb-12 px-8 py-3 rounded-full backdrop-blur-sm border ${isLight ? 'text-slate-500 border-slate-300 bg-white/50' : 'text-amber-500/60 bg-black/40 border-amber-900/20'}`}>
                             {t.clickToRead}
                         </div>
                     )}
                 </div>

                <div
                  className={`absolute bottom-0 left-0 w-full flex items-center justify-center z-[6100] ${isLight ? 'bg-gradient-to-t from-white via-white/90 to-transparent' : 'bg-gradient-to-t from-black via-black/90 to-transparent'}`}
                  style={{
                    height: 'calc(4rem + env(safe-area-inset-bottom))',
                    paddingBottom: 'env(safe-area-inset-bottom)',
                  }}
                >
                    <button 
                        onClick={resetGame}
                        className={`font-bold tracking-[0.2em] text-[10px] sm:text-xs transition-all uppercase px-6 py-2 rounded flex items-center gap-2 group ${isLight ? 'text-slate-500 hover:text-amber-600' : 'text-slate-500 hover:text-amber-200'}`}
                    >
                        <RefreshIcon />
                        <span className="group-hover:underline decoration-amber-800 underline-offset-4">{t.newReading}</span>
                    </button>
                </div>
             </>
        )}

      </div>
    </div>
  );
}
