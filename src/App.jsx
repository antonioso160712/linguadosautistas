import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRightLeft, 
  Copy, 
  Check, 
  AlertCircle, 
  Settings, 
  X, 
  Sun, 
  Moon, 
  Trash2, 
  Sparkles, 
  History, 
  Vibrate,
  Clock,
  Contrast,
  Info,
  Dices
} from 'lucide-react';

export default function App() {
  // --- CARREGAMENTO DO LOCALSTORAGE (DISPOSITIVO) ---
  const loadLocalSettings = () => {
    try {
      const saved = localStorage.getItem('app_settings');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  };

  const savedSettings = loadLocalSettings();

  // Definições da aplicação
  const [appearance, setAppearance] = useState(savedSettings.appearance || (savedSettings.darkMode ? 'dark' : 'light'));
  const [themeColor, setThemeColor] = useState(savedSettings.themeColor || 'indigo'); 
  const [customColorHex, setCustomColorHex] = useState(savedSettings.customColorHex || '#6366f1'); 
  const [isRgbActive, setIsRgbActive] = useState(savedSettings.isRgbActive ?? false);
  const [rgbHue, setRgbHue] = useState(0);
  
  const [fontFamily, setFontFamily] = useState(savedSettings.fontFamily || 'sans'); 
  const [fontSize, setFontSize] = useState(savedSettings.fontSize || 'md'); 
  const [historyLimit, setHistoryLimit] = useState(savedSettings.historyLimit ?? 30); 
  const [autoClearOnToggle, setAutoClearOnToggle] = useState(savedSettings.autoClearOnToggle ?? false);
  const [hapticFeedback, setHapticFeedback] = useState(savedSettings.hapticFeedback ?? true);
  const [autoCopyResult, setAutoCopyResult] = useState(savedSettings.autoCopyResult ?? false);

  // Confirmação do botão Surpreender
  const [hasConfirmedSurprise, setHasConfirmedSurprise] = useState(savedSettings.hasConfirmedSurprise ?? false);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);

  // Estados derivados da aparência
  const isDark = appearance === 'dark' || appearance === 'oled';
  const isOLED = appearance === 'oled';

  // Modais e navegação de ecrãs
  const [activeTab, setActiveTab] = useState('translator'); 
  const [showConfig, setShowConfig] = useState(false);

  // Estados principais da tradução
  const [mode, setMode] = useState('encode'); 
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationStats, setTranslationStats] = useState(null);
  
  const [historyList, setHistoryList] = useState(() => {
    try {
      const savedHist = localStorage.getItem('app_history');
      let hist = savedHist ? JSON.parse(savedHist) : [];
      if (historyLimit === 0) return [];
      return hist.slice(0, historyLimit);
    } catch (e) {
      return [];
    }
  });

  const [copyStatus, setCopyStatus] = useState('idle');
  const typingTimerRef = useRef(null);
  const rgbTimerRef = useRef(null);

  // Loop RGB Secreto
  useEffect(() => {
    if (isRgbActive) {
      rgbTimerRef.current = setInterval(() => {
        setRgbHue(prev => (prev + 3) % 360);
      }, 50);
    } else {
      if (rgbTimerRef.current) clearInterval(rgbTimerRef.current);
    }
    return () => {
      if (rgbTimerRef.current) clearInterval(rgbTimerRef.current);
    };
  }, [isRgbActive]);

  // Guardar definições no dispositivo
  const updateSettings = (key, value) => {
    try {
      const current = JSON.parse(localStorage.getItem('app_settings') || '{}');
      const updated = { ...current, [key]: value };
      localStorage.setItem('app_settings', JSON.stringify(updated));
    } catch (e) {
      console.error('Erro ao guardar no dispositivo:', e);
    }
  };

  const handleAppearanceChange = (newAppearance) => {
    setAppearance(newAppearance);
    updateSettings('appearance', newAppearance);
    updateSettings('darkMode', newAppearance !== 'light');
  };

  useEffect(() => {
    if (historyLimit === 0 && activeTab === 'history') {
      setActiveTab('translator');
    }
    
    setHistoryList(prev => {
      const truncated = prev.slice(0, historyLimit);
      try {
        localStorage.setItem('app_history', JSON.stringify(truncated));
      } catch (e) {}
      return truncated;
    });
  }, [historyLimit]);

  // Cores Dinâmicas e suporte a RGB Secreto
  const rgbColorString = `hsl(${rgbHue}, 100%, 50%)`;

  const colorMap = {
    indigo: { bgBtn: 'bg-indigo-600 hover:bg-indigo-700 text-white', textAccent: isDark ? 'text-indigo-400' : 'text-indigo-600', borderFocus: 'focus:border-indigo-500', bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-indigo-950/30 border-indigo-900/50' : 'bg-indigo-50/80 border-indigo-100', textOutput: isDark ? 'text-indigo-100' : 'text-indigo-950', ringColor: 'ring-indigo-500' },
    emerald: { bgBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white', textAccent: isDark ? 'text-emerald-400' : 'text-emerald-600', borderFocus: 'focus:border-emerald-500', bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-emerald-50/80 border-emerald-100', textOutput: isDark ? 'text-emerald-100' : 'text-emerald-950', ringColor: 'ring-emerald-500' },
    violet: { bgBtn: 'bg-violet-600 hover:bg-violet-700 text-white', textAccent: isDark ? 'text-violet-400' : 'text-violet-600', borderFocus: 'focus:border-violet-500', bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-violet-950/30 border-violet-900/50' : 'bg-violet-50/80 border-violet-100', textOutput: isDark ? 'text-violet-100' : 'text-violet-950', ringColor: 'ring-violet-500' },
    rose: { bgBtn: 'bg-rose-600 hover:bg-rose-700 text-white', textAccent: isDark ? 'text-rose-400' : 'text-rose-600', borderFocus: 'focus:border-rose-500', bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-rose-950/30 border-rose-900/50' : 'bg-rose-50/80 border-rose-100', textOutput: isDark ? 'text-rose-100' : 'text-rose-950', ringColor: 'ring-rose-500' },
    amber: { bgBtn: 'bg-amber-600 hover:bg-amber-700 text-white', textAccent: isDark ? 'text-amber-400' : 'text-amber-600', borderFocus: 'focus:border-amber-500', bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-amber-950/30 border-amber-900/50' : 'bg-amber-50/80 border-amber-100', textOutput: isDark ? 'text-amber-100' : 'text-amber-950', ringColor: 'ring-amber-500' },
    cyan: { bgBtn: 'bg-cyan-600 hover:bg-cyan-700 text-white', textAccent: isDark ? 'text-cyan-400' : 'text-cyan-600', borderFocus: 'focus:border-cyan-500', bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-cyan-950/30 border-cyan-900/50' : 'bg-cyan-50/80 border-cyan-100', textOutput: isDark ? 'text-cyan-100' : 'text-cyan-950', ringColor: 'ring-cyan-500' },
    fuchsia: { bgBtn: 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white', textAccent: isDark ? 'text-fuchsia-400' : 'text-fuchsia-600', borderFocus: 'focus:border-fuchsia-500', bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-fuchsia-950/30 border-fuchsia-900/50' : 'bg-fuchsia-50/80 border-fuchsia-100', textOutput: isDark ? 'text-fuchsia-100' : 'text-fuchsia-950', ringColor: 'ring-fuchsia-500' },
    orange: { bgBtn: 'bg-orange-600 hover:bg-orange-700 text-white', textAccent: isDark ? 'text-orange-400' : 'text-orange-600', borderFocus: 'focus:border-orange-500', bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-orange-950/30 border-orange-900/50' : 'bg-orange-50/80 border-orange-100', textOutput: isDark ? 'text-orange-100' : 'text-orange-950', ringColor: 'ring-orange-500' },
    teal: { bgBtn: 'bg-teal-600 hover:bg-teal-700 text-white', textAccent: isDark ? 'text-teal-400' : 'text-teal-600', borderFocus: 'focus:border-teal-500', bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-teal-950/30 border-teal-900/50' : 'bg-teal-50/80 border-teal-100', textOutput: isDark ? 'text-teal-100' : 'text-teal-950', ringColor: 'ring-teal-500' },
    red: { bgBtn: 'bg-red-600 hover:bg-red-700 text-white', textAccent: isDark ? 'text-red-400' : 'text-red-600', borderFocus: 'focus:border-red-500', bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-red-950/30 border-red-900/50' : 'bg-red-50/80 border-red-100', textOutput: isDark ? 'text-red-100' : 'text-red-950', ringColor: 'ring-red-500' },
    lime: { bgBtn: 'bg-lime-600 hover:bg-lime-700 text-white', textAccent: isDark ? 'text-lime-400' : 'text-lime-600', borderFocus: 'focus:border-lime-500', bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-lime-950/30 border-lime-900/50' : 'bg-lime-50/80 border-lime-100', textOutput: isDark ? 'text-lime-100' : 'text-lime-950', ringColor: 'ring-lime-500' },
    sky: { bgBtn: 'bg-sky-600 hover:bg-sky-700 text-white', textAccent: isDark ? 'text-sky-400' : 'text-sky-600', borderFocus: 'focus:border-sky-500', bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-sky-950/30 border-sky-900/50' : 'bg-sky-50/80 border-sky-100', textOutput: isDark ? 'text-sky-100' : 'text-sky-950', ringColor: 'ring-sky-500' },
    pink: { bgBtn: 'bg-pink-600 hover:bg-pink-700 text-white', textAccent: isDark ? 'text-pink-400' : 'text-pink-600', borderFocus: 'focus:border-pink-500', bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-pink-950/30 border-pink-900/50' : 'bg-pink-50/80 border-pink-100', textOutput: isDark ? 'text-pink-100' : 'text-pink-950', ringColor: 'ring-pink-500' },
    bw: {
      bgBtn: isDark ? 'bg-white hover:bg-zinc-200 text-black font-extrabold' : 'bg-black hover:bg-zinc-800 text-white font-extrabold',
      textAccent: isDark ? 'text-white' : 'text-black',
      borderFocus: isDark ? 'focus:border-white' : 'focus:border-black',
      bgOutput: isOLED ? 'bg-black border-zinc-800 text-white' : isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-100 border-zinc-300 text-black',
      textOutput: isDark ? 'text-white' : 'text-black',
      ringColor: isDark ? 'ring-white' : 'ring-black'
    },
    custom: {
      bgBtn: 'theme-custom-bg theme-custom-hover font-bold',
      textAccent: 'theme-custom-text',
      borderFocus: 'theme-custom-border',
      bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-zinc-900/40 border-zinc-700/50' : 'bg-zinc-50 border-zinc-200',
      textOutput: isDark ? 'text-white' : 'text-zinc-950',
      ringColor: 'theme-custom-ring'
    }
  };

  const currentColor = isRgbActive ? {
    bgBtn: 'theme-rgb-bg theme-rgb-hover font-bold text-white',
    textAccent: 'theme-rgb-text',
    borderFocus: 'theme-rgb-border',
    bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-zinc-900/40 border-zinc-700/50' : 'bg-zinc-50 border-zinc-200',
    textOutput: isDark ? 'text-white' : 'text-zinc-950',
    ringColor: 'theme-rgb-ring'
  } : (colorMap[themeColor] || colorMap.indigo);

  // Executar Surpreender (Randomiza fonte, tamanhos e cores predefinidas)
  const triggerSurprise = () => {
    triggerHaptic(30);
    const fonts = ['sans', 'mono', 'serif', 'playful', 'retro', 'typewriter'];
    const sizes = ['sm', 'md', 'lg', 'xl'];
    const colors = ['indigo', 'emerald', 'violet', 'rose', 'amber', 'cyan', 'fuchsia', 'orange', 'teal', 'red', 'lime', 'sky', 'pink', 'bw'];

    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    setFontFamily(randomFont);
    setFontSize(randomSize);
    setThemeColor(randomColor);
    setIsRgbActive(false);

    updateSettings('fontFamily', randomFont);
    updateSettings('fontSize', randomSize);
    updateSettings('themeColor', randomColor);
    updateSettings('isRgbActive', false);
  };

  const handleSurpriseClick = () => {
    if (!hasConfirmedSurprise) {
      setShowSurpriseModal(true);
    } else {
      triggerSurprise();
    }
  };

  const confirmSurpriseFirstTime = () => {
    setHasConfirmedSurprise(true);
    updateSettings('hasConfirmedSurprise', true);
    setShowSurpriseModal(false);
    triggerSurprise();
  };

  const saveTranslationToHistory = (input, output, currentMode) => {
    if (historyLimit === 0) return;

    const newItem = {
      id: Date.now().toString(),
      input,
      output,
      mode: currentMode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedHistory = [newItem, ...historyList].slice(0, historyLimit);
    setHistoryList(updatedHistory);

    try {
      localStorage.setItem('app_history', JSON.stringify(updatedHistory));
    } catch (e) {}
  };

  const clearHistory = () => {
    setHistoryList([]);
    try {
      localStorage.removeItem('app_history');
    } catch (e) {}
  };

  const triggerHaptic = (pattern = 10) => {
    if (hapticFeedback && typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(pattern);
      } catch (e) {}
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, []);

  const toggleMode = () => {
    triggerHaptic(15);
    setMode(prev => prev === 'encode' ? 'decode' : 'encode');
    if (autoClearOnToggle) {
      setInputText('');
      setOutputText('');
    } else {
      setInputText(outputText);
      setOutputText(inputText);
    }
    setCopyStatus('idle');
    setTranslationStats(null);
  };

  const shiftChar = (c, dir) => {
    if (c >= 'a' && c <= 'z') {
      let code = c.charCodeAt(0) - 97 + dir;
      if (code < 0) code += 26;
      if (code > 25) code -= 26;
      return String.fromCharCode(code + 97);
    }
    if (c >= 'A' && c <= 'Z') {
      let code = c.charCodeAt(0) - 65 + dir;
      if (code < 0) code += 26;
      if (code > 25) code -= 26;
      return String.fromCharCode(code + 65);
    }
    if (c >= '0' && c <= '9') {
      let code = c.charCodeAt(0) - 48 + dir;
      if (code < 0) code += 10;
      if (code > 9) code -= 10;
      return String.fromCharCode(code + 48);
    }
    return c;
  };

  const applyCasePattern = (sourceString, targetString) => {
    let result = '';
    for (let i = 0; i < sourceString.length; i++) {
      const char = sourceString[i];
      const isUpper = char === char.toUpperCase() && char !== char.toLowerCase();
      if (isUpper) {
        result += targetString[i].toUpperCase();
      } else {
        result += targetString[i].toLowerCase();
      }
    }
    return result;
  };

  const translateWord = (word, isEncode) => {
    if (isEncode) {
      const shifted = word.split('').map(c => shiftChar(c, -1)).join('');
      const reversed = shifted.split('').reverse().join('');
      return applyCasePattern(word, reversed);
    } else {
      const reversed = word.split('').reverse().join('');
      const withCase = applyCasePattern(word, reversed);
      const shifted = withCase.split('').map(c => shiftChar(c, 1)).join('');
      return shifted;
    }
  };

  const getEstimatedTime = (text) => {
    if (!text) return '0s';
    const totalMs = text.length * 25;
    if (totalMs < 1000) {
      return `~${totalMs}ms`;
    }
    return `~${(totalMs / 1000).toFixed(2)}s`;
  };

  const handleTranslate = () => {
    if (!inputText.trim()) {
      setOutputText('');
      setTranslationStats(null);
      return;
    }

    triggerHaptic(20);
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setIsTranslating(true);
    setOutputText('');
    setCopyStatus('idle');
    setTranslationStats(null);

    const startTime = performance.now();

    const textWithoutAccents = inputText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const regex = /([a-zA-Z0-9]+)/g;
    const fullResult = textWithoutAccents.replace(regex, (match) => {
      return translateWord(match, mode === 'encode');
    });

    const randomVariationFactor = 1 + (Math.random() * 0.2 - 0.1);
    const calculatedInterval = Math.max(10, Math.round(25 * randomVariationFactor));

    let index = 0;
    typingTimerRef.current = setInterval(() => {
      if (index < fullResult.length) {
        setOutputText(fullResult.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingTimerRef.current);
        const endTime = performance.now();
        const durationInMs = Math.round(endTime - startTime);
        const durationFormatted = durationInMs >= 1000 
          ? `${(durationInMs / 1000).toFixed(2)}s` 
          : `${durationInMs}ms`;

        setIsTranslating(false);
        triggerHaptic([30, 50, 30]);
        
        setTranslationStats({
          count: fullResult.length,
          words: inputText.trim().split(/\s+/).length,
          timeTaken: durationFormatted
        });

        saveTranslationToHistory(inputText, fullResult, mode);

        if (autoCopyResult) {
          copyToClipboard(fullResult);
        }
      }
    }, calculatedInterval);
  };

  const copyToClipboard = async (textToCopy = outputText) => {
    if (!textToCopy || isTranslating) return;
    
    triggerHaptic(15);
    const handleSuccess = () => {
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 3000);
    };

    const handleFailure = () => {
      setCopyStatus('failed');
      setTimeout(() => setCopyStatus('idle'), 4000);
    };

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
        handleSuccess();
        return;
      }
      throw new Error('Clipboard API indisponível');
    } catch (err) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) handleSuccess();
        else handleFailure();
      } catch (fallbackErr) {
        handleFailure();
      }
    }
  };

  const testHaptic = () => {
    triggerHaptic([50, 50, 50]);
  };

  // Mapeamento de Fontes (com as duas novas: Retro e Typewriter)
  const fontStyleMap = {
    sans: 'font-sans',
    mono: 'font-mono',
    serif: 'font-serif',
    playful: 'font-playful',
    retro: 'font-retro',
    typewriter: 'font-typewriter'
  };

  const fontSizeClass = {
    sm: 'text-sm leading-relaxed',
    md: 'text-base leading-relaxed',
    lg: 'text-xl leading-relaxed',
    xl: 'text-2xl leading-relaxed'
  }[fontSize] || 'text-base leading-relaxed';

  const pageBgClass = isOLED 
    ? 'bg-black text-white' 
    : isDark 
      ? 'dark bg-zinc-950 text-zinc-100' 
      : 'bg-zinc-100 text-zinc-900';

  const cardBgClass = isOLED
    ? 'bg-black border border-zinc-800 shadow-none'
    : isDark
      ? 'bg-zinc-900 border border-zinc-800 shadow-xl'
      : 'bg-white shadow-xl';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${fontStyleMap[fontFamily] || 'font-sans'} ${pageBgClass}`}>
      
      {/* Estilos CSS para fontes customizadas e Modo RGB Secreto */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Press+Start+2P&family=Special+Elite&display=swap');
        
        .font-playful {
          font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif !important;
        }
        .font-retro {
          font-family: 'Press Start 2P', monospace !important;
          font-size: 0.85em !important;
        }
        .font-typewriter {
          font-family: 'Special Elite', monospace !important;
        }
        
        /* Cores Personalizadas */
        .theme-custom-bg { background-color: ${customColorHex} !important; color: #ffffff !important; }
        .theme-custom-hover:hover { filter: brightness(0.85) !important; }
        .theme-custom-text { color: ${customColorHex} !important; }
        .theme-custom-border:focus { border-color: ${customColorHex} !important; }
        .theme-custom-ring { 
          --tw-ring-color: ${customColorHex} !important; 
          box-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important; 
        }

        /* Cores RGB Secreto Animado */
        .theme-rgb-bg { background-color: ${rgbColorString} !important; color: #ffffff !important; transition: background-color 0.05s linear; }
        .theme-rgb-hover:hover { filter: brightness(0.9) !important; }
        .theme-rgb-text { color: ${rgbColorString} !important; transition: color 0.05s linear; }
        .theme-rgb-border:focus { border-color: ${rgbColorString} !important; }
        .theme-rgb-ring { 
          --tw-ring-color: ${rgbColorString} !important; 
          box-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important; 
        }
      `}</style>

      <div className={`w-full max-w-lg rounded-3xl flex flex-col relative transition-colors duration-300 p-6 sm:p-8 ${cardBgClass}`}>
        
        {/* Botão de Definições */}
        <button
          onClick={() => {
            triggerHaptic(10);
            setShowConfig(true);
          }}
          title="Definições"
          className={`absolute top-6 left-6 p-2 rounded-2xl transition-transform active:scale-95 ${
            isOLED 
              ? 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800' 
              : isDark 
                ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' 
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          <Settings size={22} />
        </button>

        {/* Botão de Surpreender (🎲) - Canto Superior Direito */}
        <button
          onClick={handleSurpriseClick}
          title="Surpreender (Randomizar personalização)"
          className={`absolute top-6 right-6 p-2 rounded-2xl transition-transform active:scale-95 ${
            isOLED 
              ? 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800' 
              : isDark 
                ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' 
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          <Dices size={22} />
        </button>

        {/* Alternador de Histórico / Tradutor */}
        <div className="flex justify-center mb-6">
          <div className={`flex p-1 rounded-2xl ${isOLED ? 'bg-zinc-900 border border-zinc-800' : isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
            <button
              onClick={() => {
                triggerHaptic(10);
                setActiveTab('translator');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'translator' ? `${currentColor.bgBtn} shadow` : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-800'}`}
            >
              Tradutor
            </button>
            {historyLimit > 0 && (
              <button
                onClick={() => {
                  triggerHaptic(10);
                  setActiveTab('history');
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${activeTab === 'history' ? `${currentColor.bgBtn} shadow` : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-800'}`}
              >
                <History size={14} /> Histórico ({historyList.length})
              </button>
            )}
          </div>
        </div>

        {/* ABA TRADUTOR */}
        {activeTab === 'translator' && (
          <>
            <h1 className="text-3xl font-bold text-center mb-6 tracking-tight">
              Tradutor
            </h1>

            {/* Banner OLED */}
            {isOLED && (
              <div className="mb-4 p-2.5 rounded-2xl border border-zinc-800 bg-zinc-950 flex items-center gap-2 text-xs opacity-90 animate-fade-in">
                <Info size={16} className="text-white shrink-0" />
                <span><strong>Modo OLED:</strong> Fundo preto absoluto (#000000) para estética e pretos verdadeiros.</span>
              </div>
            )}

            {/* Caixa de Entrada de Texto */}
            <div className="relative mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-60">
                  {mode === 'encode' ? 'Do idioma normal' : 'Do idioma inventado'}
                </label>

                {inputText.length > 0 && (
                  <span className="text-[11px] font-medium opacity-70 flex items-center gap-1">
                    <Clock size={12} className={currentColor.textAccent} />
                    Estimado: {getEstimatedTime(inputText)}
                  </span>
                )}
              </div>

              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={mode === 'encode' ? 'língua normal' : 'nossa língua'}
                  className={`w-full h-36 p-4 pr-12 rounded-2xl resize-none focus:outline-none border-2 transition-all ${fontSizeClass} placeholder-opacity-40 ${
                    isOLED
                      ? 'bg-black border-zinc-800 placeholder-zinc-600 text-white ' + currentColor.borderFocus
                      : isDark 
                        ? 'bg-zinc-800/50 border-zinc-700/60 placeholder-zinc-500 text-white ' + currentColor.borderFocus 
                        : 'bg-zinc-50 border-zinc-200 placeholder-zinc-400 text-zinc-900 ' + currentColor.borderFocus
                  }`}
                />
                
                {inputText && (
                  <button
                    onClick={() => {
                      triggerHaptic(10);
                      setInputText('');
                      setOutputText('');
                      setTranslationStats(null);
                    }}
                    title="Apagar texto"
                    className={`absolute top-3 right-3 p-2 rounded-xl transition-all active:scale-90 ${
                      isDark ? 'bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-700' : 'bg-zinc-200/70 text-zinc-500 hover:text-red-500 hover:bg-zinc-200'
                    }`}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Barra de Ações */}
            <div className="flex gap-3 mb-4 w-full h-14">
              <button
                onClick={toggleMode}
                disabled={isTranslating}
                title="Trocar idioma"
                className={`w-[20%] flex items-center justify-center rounded-2xl transition-all active:scale-95 ${
                  isOLED 
                    ? 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800' 
                    : isDark 
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' 
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
                }`}
              >
                <ArrowRightLeft strokeWidth={2.5} size={22} />
              </button>
              
              <button
                onClick={handleTranslate}
                disabled={isTranslating || !inputText.trim()}
                className={`w-[80%] flex items-center justify-center font-bold text-lg rounded-2xl transition-all shadow-md active:scale-[0.98] ${currentColor.bgBtn} ${
                  (isTranslating || !inputText.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isTranslating ? (
                  <span className="flex items-center gap-2">
                    <Sparkles size={20} className="animate-spin" /> A traduzir...
                  </span>
                ) : (
                  'Traduzir'
                )}
              </button>
            </div>

            {/* Saída de Texto */}
            <div className="relative mt-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-60 block">
                  {mode === 'encode' ? 'Para o idioma inventado' : 'Para o idioma normal'}
                </label>

                {copyStatus === 'failed' && (
                  <span className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle size={14} /> Selecione e copie manualmente
                  </span>
                )}
              </div>
              
              <div className="relative">
                <textarea
                  readOnly
                  value={outputText}
                  placeholder="O resultado aparecerá aqui..."
                  className={`w-full h-36 p-4 rounded-2xl resize-none focus:outline-none pr-14 border-2 transition-all ${fontSizeClass} ${currentColor.bgOutput}`}
                />
                
                {/* Botão Copiar */}
                <button
                  onClick={() => copyToClipboard()}
                  title="Copiar texto"
                  disabled={!outputText || isTranslating}
                  className={`absolute bottom-3 right-3 p-2.5 rounded-xl transition-all flex items-center justify-center ${
                    !outputText || isTranslating
                      ? isDark ? 'opacity-30 cursor-not-allowed bg-zinc-800 text-zinc-500' : 'opacity-30 cursor-not-allowed bg-zinc-200 text-zinc-400'
                      : copyStatus === 'success'
                        ? 'bg-green-500 text-white shadow-md' 
                        : copyStatus === 'failed'
                          ? 'bg-red-500 text-white shadow-md animate-pulse'
                          : isOLED
                            ? 'bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-800 active:scale-95'
                            : isDark 
                              ? 'bg-zinc-800 text-zinc-200 shadow-sm hover:bg-zinc-700 active:scale-95'
                              : 'bg-white text-zinc-700 shadow-sm hover:shadow-md hover:scale-105 active:scale-95'
                  }`}
                >
                  {isTranslating ? (
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  ) : copyStatus === 'success' ? (
                    <Check size={20} strokeWidth={3} />
                  ) : copyStatus === 'failed' ? (
                    <AlertCircle size={20} strokeWidth={2.5} />
                  ) : (
                    <Copy size={20} strokeWidth={2.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Detalhes de Conclusão da Tradução */}
            {translationStats && (
              <div className="mt-3 text-center text-xs font-medium opacity-80 animate-fade-in flex items-center justify-center gap-1.5 flex-wrap">
                <Sparkles size={14} className={currentColor.textAccent} />
                <span>
                  Traduzidos <strong>{translationStats.count}</strong> caracteres ({translationStats.words} palavras) em <strong>{translationStats.timeTaken}</strong>
                </span>
              </div>
            )}
          </>
        )}

        {/* ABA HISTÓRICO */}
        {activeTab === 'history' && historyLimit > 0 && (
          <div className="flex flex-col h-full min-h-[380px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <History size={20} className={currentColor.textAccent} /> Histórico Recente
              </h2>
              {historyList.length > 0 && (
                <button
                  onClick={() => {
                    triggerHaptic(15);
                    clearHistory();
                  }}
                  className="text-xs text-red-500 hover:underline flex items-center gap-1 font-medium"
                >
                  <Trash2 size={14} /> Limpar tudo
                </button>
              )}
            </div>

            {historyList.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 py-12">
                <History size={48} className="mb-2" />
                <p className="text-sm font-medium">Nenhuma tradução guardada no histórico.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {historyList.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all flex justify-between items-start gap-3 ${
                      isOLED 
                        ? 'bg-black border-zinc-800' 
                        : isDark 
                          ? 'bg-zinc-800/60 border-zinc-700/60' 
                          : 'bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-600'}`}>
                          {item.mode === 'encode' ? 'Normal → Inventado' : 'Inventado → Normal'}
                        </span>
                        <span className="text-[10px] opacity-40">{item.timestamp}</span>
                      </div>
                      <p className="text-xs opacity-70 truncate mb-0.5">Entrada: {item.input}</p>
                      <p className="text-sm font-semibold truncate">{item.output}</p>
                    </div>

                    <button
                      onClick={() => copyToClipboard(item.output)}
                      title="Copiar resultado"
                      className={`p-2 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm ${isDark ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700' : 'bg-white text-zinc-600 hover:bg-zinc-100'}`}
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Modal de Confirmação Surpreender (Aparece só na 1ª vez) */}
      {showSurpriseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center ${isOLED ? 'bg-black border border-zinc-800 text-white' : isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}>
            <h3 className="text-lg font-bold mb-2 flex items-center justify-center gap-2">
              <Dices size={24} className={currentColor.textAccent} /> Modo Surpresa!
            </h3>
            <p className="text-xs opacity-80 mb-6 leading-relaxed">
              Isto irá randomizar instantaneamente as cores, tamanhos e fontes da aplicação de forma criativa. Deseja prosseguir?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSurpriseModal(false)}
                className="flex-1 py-2.5 rounded-2xl font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={confirmSurpriseFirstTime}
                className={`flex-1 py-2.5 rounded-2xl font-bold text-xs ${currentColor.bgBtn}`}
              >
                Sim, surpreender!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up / Modal de Definições */}
      {showConfig && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto transition-colors ${
            isOLED 
              ? 'bg-black border border-zinc-800 text-white' 
              : isDark 
                ? 'bg-zinc-900 border border-zinc-800 text-white' 
                : 'bg-white text-zinc-900'
          }`}>
            
            {/* Cabeçalho Modal */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings size={22} className={currentColor.textAccent} /> Definições
              </h2>
              <button 
                onClick={() => {
                  triggerHaptic(10);
                  setShowConfig(false);
                }}
                className={`p-1.5 rounded-xl transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200' : 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600'}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Conteúdo das Opções */}
            <div className="space-y-5">
              
              {/* Opção 1: Aparência */}
              <div>
                <p className="font-semibold text-sm mb-1">Aparência</p>
                <p className="text-xs opacity-60 mb-2">Escolha o estilo do tema do ecrã</p>
                
                <div className={`grid grid-cols-3 gap-1 p-1 rounded-2xl ${isOLED ? 'bg-zinc-950 border border-zinc-800' : isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                  <button
                    onClick={() => {
                      triggerHaptic(10);
                      handleAppearanceChange('light');
                    }}
                    className={`py-2 px-2 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs font-semibold ${appearance === 'light' ? 'bg-white text-zinc-900 shadow' : 'text-zinc-400'}`}
                  >
                    <Sun size={15} /> Claro
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic(10);
                      handleAppearanceChange('dark');
                    }}
                    className={`py-2 px-2 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs font-semibold ${appearance === 'dark' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400'}`}
                  >
                    <Moon size={15} /> Escuro
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic(10);
                      handleAppearanceChange('oled');
                    }}
                    className={`py-2 px-2 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs font-semibold ${appearance === 'oled' ? 'bg-black text-white border border-zinc-700 shadow' : 'text-zinc-400'}`}
                  >
                    <Contrast size={15} /> OLED
                  </button>
                </div>
              </div>

              {/* Opção 2: Cor de Destaque (Com segredo RGB no Color Picker) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-sm">Cor de Destaque</p>
                  {isRgbActive && (
                    <span className="text-[10px] font-bold text-emerald-400 animate-pulse">✨ RGB Secreto Ativo!</span>
                  )}
                </div>
                <p className="text-xs opacity-60 mb-3">Dica: Clique e segure na roda de cor para ativar o RGB secreto.</p>
                
                <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                  {[
                    { id: 'indigo', bg: 'bg-indigo-600' },
                    { id: 'emerald', bg: 'bg-emerald-600' },
                    { id: 'violet', bg: 'bg-violet-600' },
                    { id: 'rose', bg: 'bg-rose-600' },
                    { id: 'amber', bg: 'bg-amber-600' },
                    { id: 'cyan', bg: 'bg-cyan-600' },
                    { id: 'fuchsia', bg: 'bg-fuchsia-600' },
                    { id: 'orange', bg: 'bg-orange-600' },
                    { id: 'teal', bg: 'bg-teal-600' },
                    { id: 'red', bg: 'bg-red-600' },
                    { id: 'lime', bg: 'bg-lime-600' },
                    { id: 'sky', bg: 'bg-sky-600' },
                    { id: 'pink', bg: 'bg-pink-600' },
                    { id: 'bw', isSplit: true },
                    { id: 'custom', isPicker: true }
                  ].map(c => {
                    if (c.isSplit) {
                      return (
                        <button
                          key={c.id}
                          title="Preto & Branco Adaptável"
                          onClick={() => {
                            triggerHaptic(10);
                            setIsRgbActive(false);
                            setThemeColor('bw');
                            updateSettings('themeColor', 'bw');
                            updateSettings('isRgbActive', false);
                          }}
                          className={`w-8 h-8 rounded-xl relative overflow-hidden transition-transform active:scale-95 border border-zinc-500/40 flex items-center justify-center ${
                            !isRgbActive && themeColor === 'bw' ? 'ring-2 ring-offset-2 ' + (isDark ? 'ring-offset-zinc-900 ring-white' : 'ring-offset-white ring-black') : 'opacity-80 hover:opacity-100'
                          }`}
                        >
                          <div className="absolute inset-0 flex">
                            <div className="w-1/2 h-full bg-black" />
                            <div className="w-1/2 h-full bg-white" />
                          </div>
                          {!isRgbActive && themeColor === 'bw' && (
                            <Check size={16} strokeWidth={3} className="relative z-10 text-emerald-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                          )}
                        </button>
                      );
                    }

                    if (c.isPicker) {
                      return (
                        <div
                          key={c.id}
                          title="Clique para escolher cor ou segure para ativar o RGB Secreto"
                          onMouseDown={() => {
                            // Se segurar por mais de 500ms ativa o RGB secreto
                            window._rgbPressTimer = setTimeout(() => {
                              setIsRgbActive(true);
                              updateSettings('isRgbActive', true);
                              triggerHaptic([50, 50, 100]);
                            }, 600);
                          }}
                          onMouseUp={() => {
                            if (window._rgbPressTimer) clearTimeout(window._rgbPressTimer);
                          }}
                          onTouchStart={() => {
                            window._rgbPressTimer = setTimeout(() => {
                              setIsRgbActive(true);
                              updateSettings('isRgbActive', true);
                              triggerHaptic([50, 50, 100]);
                            }, 600);
                          }}
                          onTouchEnd={() => {
                            if (window._rgbPressTimer) clearTimeout(window._rgbPressTimer);
                          }}
                          className={`cursor-pointer w-8 h-8 rounded-xl relative overflow-hidden transition-transform active:scale-95 border border-zinc-500/40 flex items-center justify-center ${
                            isRgbActive || themeColor === 'custom' ? 'ring-2 ring-offset-2 ' + (isDark ? 'ring-offset-zinc-900 ring-white' : 'ring-offset-white ring-black') : 'opacity-80 hover:opacity-100'
                          }`}
                          style={{ background: isRgbActive ? rgbColorString : 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}
                        >
                          <input
                            type="color"
                            className="absolute opacity-0 w-12 h-12 cursor-pointer"
                            value={customColorHex}
                            onChange={(e) => {
                              if (window._rgbPressTimer) clearTimeout(window._rgbPressTimer);
                              triggerHaptic(10);
                              setIsRgbActive(false);
                              setThemeColor('custom');
                              setCustomColorHex(e.target.value);
                              updateSettings('themeColor', 'custom');
                              updateSettings('customColorHex', e.target.value);
                              updateSettings('isRgbActive', false);
                            }}
                          />
                          {(isRgbActive || themeColor === 'custom') && (
                            <Check size={16} strokeWidth={3} className="relative z-10 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                          )}
                        </div>
                      );
                    }

                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          triggerHaptic(10);
                          setIsRgbActive(false);
                          setThemeColor(c.id);
                          updateSettings('themeColor', c.id);
                          updateSettings('isRgbActive', false);
                        }}
                        className={`w-8 h-8 rounded-xl ${c.bg} transition-transform active:scale-95 flex items-center justify-center text-white ${
                          !isRgbActive && themeColor === c.id ? 'ring-2 ring-offset-2 ' + (isDark ? 'ring-offset-zinc-900 ' : 'ring-offset-white ') + currentColor.ringColor : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        {!isRgbActive && themeColor === c.id && <Check size={16} strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Opção 3: Estilo da Fonte (Com 6 opções agora) */}
              <div>
                <p className="font-semibold text-sm mb-1">Estilo da Fonte</p>
                <p className="text-xs opacity-60 mb-2">Alterne a tipografia da aplicação</p>
                <div className={`grid grid-cols-2 gap-2 p-1 rounded-2xl ${isOLED ? 'bg-zinc-950 border border-zinc-800' : isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                  {[
                    { id: 'sans', label: 'Padrão (Sans)' },
                    { id: 'mono', label: 'Código (Mono)' },
                    { id: 'serif', label: 'Elegante (Serif)' },
                    { id: 'playful', label: 'Divertida (Comic)' },
                    { id: 'retro', label: 'Retro (Pixel)' },
                    { id: 'typewriter', label: 'Máquina (Type)' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => {
                        triggerHaptic(10);
                        setFontFamily(f.id);
                        updateSettings('fontFamily', f.id);
                      }}
                      className={`py-2 px-2 rounded-xl transition-all text-xs font-semibold text-center ${f.id === 'playful' ? 'font-playful' : f.id === 'retro' ? 'font-retro' : f.id === 'typewriter' ? 'font-typewriter' : ''} ${fontFamily === f.id ? (isDark ? 'bg-zinc-700 text-white shadow' : 'bg-white text-zinc-900 shadow') : 'text-zinc-400'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opção 4: Tamanho do Texto */}
              <div>
                <p className="font-semibold text-sm mb-1">Tamanho do Texto</p>
                <p className="text-xs opacity-60 mb-2">Ajuste o tamanho das letras nas caixas</p>
                <div className={`grid grid-cols-4 gap-1 p-1 rounded-2xl ${isOLED ? 'bg-zinc-950 border border-zinc-800' : isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                  {[
                    { id: 'sm', label: 'Pequeno' },
                    { id: 'md', label: 'Médio' },
                    { id: 'lg', label: 'Grande' },
                    { id: 'xl', label: 'Enorme' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        triggerHaptic(10);
                        setFontSize(s.id);
                        updateSettings('fontSize', s.id);
                      }}
                      className={`py-1.5 px-2 rounded-xl transition-all text-xs font-semibold text-center ${fontSize === s.id ? (isDark ? 'bg-zinc-700 text-white shadow' : 'bg-white text-zinc-900 shadow') : 'text-zinc-400'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opção 5: Limite do Histórico */}
              <div>
                <p className="font-semibold text-sm mb-1">Limite do Histórico</p>
                <p className="text-xs opacity-60 mb-2">Quantidade guardada (Off esconde o menu)</p>
                <div className={`grid grid-cols-5 gap-1 p-1 rounded-2xl ${isOLED ? 'bg-zinc-950 border border-zinc-800' : isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                  {[
                    { id: 0, label: 'Off' },
                    { id: 10, label: '10' },
                    { id: 30, label: '30' },
                    { id: 50, label: '50' },
                    { id: 100, label: '100' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        triggerHaptic(10);
                        setHistoryLimit(s.id);
                        updateSettings('historyLimit', s.id);
                      }}
                      className={`py-1.5 px-1 rounded-xl transition-all text-xs font-semibold text-center ${historyLimit === s.id ? (isDark ? 'bg-zinc-700 text-white shadow' : 'bg-white text-zinc-900 shadow') : 'text-zinc-400'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opção 6: Vibração Háptica */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">Vibração Háptica</p>
                  <p className="text-xs opacity-60">Feedback tátil ao tocar botões</p>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={testHaptic}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-xl transition-colors ${isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-200 text-zinc-600 hover:text-black'}`}
                  >
                    Testar
                  </button>
                  <button
                    onClick={() => {
                      const val = !hapticFeedback;
                      setHapticFeedback(val);
                      if (val) triggerHaptic(30);
                      updateSettings('hapticFeedback', val);
                    }}
                    className={`p-2 rounded-xl transition-colors ${hapticFeedback ? (isDark ? 'bg-indigo-950 text-indigo-300' : 'bg-indigo-100 text-indigo-700') : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-400')}`}
                  >
                    <Vibrate size={20} />
                  </button>
                </div>
              </div>

              {/* Opção 7: Copiar Automaticamente */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">Copiar Automaticamente</p>
                  <p className="text-xs opacity-60">Copia o resultado assim que traduz</p>
                </div>
                <button
                  onClick={() => {
                    triggerHaptic(10);
                    const val = !autoCopyResult;
                    setAutoCopyResult(val);
                    updateSettings('autoCopyResult', val);
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative p-1 ${autoCopyResult ? currentColor.bgBtn : (isDark ? 'bg-zinc-700' : 'bg-zinc-300')}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${autoCopyResult ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Opção 8: Limpeza Automática */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">Limpar ao Alternar</p>
                  <p className="text-xs opacity-60">Apaga os textos ao inverter o modo</p>
                </div>
                <button
                  onClick={() => {
                    triggerHaptic(10);
                    const val = !autoClearOnToggle;
                    setAutoClearOnToggle(val);
                    updateSettings('autoClearOnToggle', val);
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative p-1 ${autoClearOnToggle ? currentColor.bgBtn : (isDark ? 'bg-zinc-700' : 'bg-zinc-300')}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${autoClearOnToggle ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

            </div>

            {/* Botão Fechar Modal */}
            <button
              onClick={() => {
                triggerHaptic(10);
                setShowConfig(false);
              }}
              className={`w-full mt-8 py-3 rounded-2xl font-bold transition-all shadow-sm active:scale-95 ${currentColor.bgBtn}`}
            >
              Concluído
            </button>

          </div>
        </div>
      )}

      {/* Texto de Versão - Canto Inferior Direito */}
      <div className={`fixed bottom-2 right-3 text-[11px] font-mono pointer-events-none select-none opacity-50 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
        v2.4.0
      </div>

    </div>
  );
          }  const [fontSize, setFontSize] = useState(savedSettings.fontSize || 'md'); // 'sm' | 'md' | 'lg' | 'xl'
  const [autoClearOnToggle, setAutoClearOnToggle] = useState(savedSettings.autoClearOnToggle ?? false);
  const [hapticFeedback, setHapticFeedback] = useState(savedSettings.hapticFeedback ?? true);
  const [autoCopyResult, setAutoCopyResult] = useState(savedSettings.autoCopyResult ?? false);

  // Estados derivados da aparência
  const isDark = appearance === 'dark' || appearance === 'oled';
  const isOLED = appearance === 'oled';

  // Modais e navegação de ecrãs
  const [activeTab, setActiveTab] = useState('translator'); // 'translator' | 'history'
  const [showConfig, setShowConfig] = useState(false);

  // Estados principais da tradução
  const [mode, setMode] = useState('encode'); // 'encode' = Normal -> Inventado, 'decode' = Inventado -> Normal
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationStats, setTranslationStats] = useState(null);
  
  // Carrega histórico guardado no dispositivo
  const [historyList, setHistoryList] = useState(() => {
    try {
      const savedHist = localStorage.getItem('app_history');
      return savedHist ? JSON.parse(savedHist) : [];
    } catch (e) {
      return [];
    }
  });

  // Controlo de estado da cópia
  const [copyStatus, setCopyStatus] = useState('idle');

  // Ref para controlar animação de dactilografia
  const typingTimerRef = useRef(null);

  // Guardar definições no dispositivo
  const updateSettings = (key, value) => {
    try {
      const current = JSON.parse(localStorage.getItem('app_settings') || '{}');
      const updated = { ...current, [key]: value };
      localStorage.setItem('app_settings', JSON.stringify(updated));
    } catch (e) {
      console.error('Erro ao guardar no dispositivo:', e);
    }
  };

  // Alterar aparência
  const handleAppearanceChange = (newAppearance) => {
    setAppearance(newAppearance);
    updateSettings('appearance', newAppearance);
    updateSettings('darkMode', newAppearance !== 'light');
  };

  // Paleta de cores dinâmicas (10 opções)
  const colorMap = {
    indigo: {
      bgBtn: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      textAccent: isDark ? 'text-indigo-400' : 'text-indigo-600',
      borderFocus: 'focus:border-indigo-500',
      bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-indigo-950/30 border-indigo-900/50' : 'bg-indigo-50/80 border-indigo-100',
      textOutput: isDark ? 'text-indigo-100' : 'text-indigo-950',
      ringColor: 'ring-indigo-500'
    },
    emerald: {
      bgBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      textAccent: isDark ? 'text-emerald-400' : 'text-emerald-600',
      borderFocus: 'focus:border-emerald-500',
      bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-emerald-50/80 border-emerald-100',
      textOutput: isDark ? 'text-emerald-100' : 'text-emerald-950',
      ringColor: 'ring-emerald-500'
    },
    violet: {
      bgBtn: 'bg-violet-600 hover:bg-violet-700 text-white',
      textAccent: isDark ? 'text-violet-400' : 'text-violet-600',
      borderFocus: 'focus:border-violet-500',
      bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-violet-950/30 border-violet-900/50' : 'bg-violet-50/80 border-violet-100',
      textOutput: isDark ? 'text-violet-100' : 'text-violet-950',
      ringColor: 'ring-violet-500'
    },
    rose: {
      bgBtn: 'bg-rose-600 hover:bg-rose-700 text-white',
      textAccent: isDark ? 'text-rose-400' : 'text-rose-600',
      borderFocus: 'focus:border-rose-500',
      bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-rose-950/30 border-rose-900/50' : 'bg-rose-50/80 border-rose-100',
      textOutput: isDark ? 'text-rose-100' : 'text-rose-950',
      ringColor: 'ring-rose-500'
    },
    amber: {
      bgBtn: 'bg-amber-600 hover:bg-amber-700 text-white',
      textAccent: isDark ? 'text-amber-400' : 'text-amber-600',
      borderFocus: 'focus:border-amber-500',
      bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-amber-950/30 border-amber-900/50' : 'bg-amber-50/80 border-amber-100',
      textOutput: isDark ? 'text-amber-100' : 'text-amber-950',
      ringColor: 'ring-amber-500'
    },
    cyan: {
      bgBtn: 'bg-cyan-600 hover:bg-cyan-700 text-white',
      textAccent: isDark ? 'text-cyan-400' : 'text-cyan-600',
      borderFocus: 'focus:border-cyan-500',
      bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-cyan-950/30 border-cyan-900/50' : 'bg-cyan-50/80 border-cyan-100',
      textOutput: isDark ? 'text-cyan-100' : 'text-cyan-950',
      ringColor: 'ring-cyan-500'
    },
    fuchsia: {
      bgBtn: 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white',
      textAccent: isDark ? 'text-fuchsia-400' : 'text-fuchsia-600',
      borderFocus: 'focus:border-fuchsia-500',
      bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-fuchsia-950/30 border-fuchsia-900/50' : 'bg-fuchsia-50/80 border-fuchsia-100',
      textOutput: isDark ? 'text-fuchsia-100' : 'text-fuchsia-950',
      ringColor: 'ring-fuchsia-500'
    },
    orange: {
      bgBtn: 'bg-orange-600 hover:bg-orange-700 text-white',
      textAccent: isDark ? 'text-orange-400' : 'text-orange-600',
      borderFocus: 'focus:border-orange-500',
      bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-orange-950/30 border-orange-900/50' : 'bg-orange-50/80 border-orange-100',
      textOutput: isDark ? 'text-orange-100' : 'text-orange-950',
      ringColor: 'ring-orange-500'
    },
    teal: {
      bgBtn: 'bg-teal-600 hover:bg-teal-700 text-white',
      textAccent: isDark ? 'text-teal-400' : 'text-teal-600',
      borderFocus: 'focus:border-teal-500',
      bgOutput: isOLED ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-teal-950/30 border-teal-900/50' : 'bg-teal-50/80 border-teal-100',
      textOutput: isDark ? 'text-teal-100' : 'text-teal-950',
      ringColor: 'ring-teal-500'
    },
    bw: {
      bgBtn: isDark 
        ? 'bg-white hover:bg-zinc-200 text-black font-extrabold' 
        : 'bg-black hover:bg-zinc-800 text-white font-extrabold',
      textAccent: isDark ? 'text-white' : 'text-black',
      borderFocus: isDark ? 'focus:border-white' : 'focus:border-black',
      bgOutput: isOLED 
        ? 'bg-black border-zinc-800 text-white' 
        : isDark 
          ? 'bg-zinc-950 border-zinc-800 text-white' 
          : 'bg-zinc-100 border-zinc-300 text-black',
      textOutput: isDark ? 'text-white' : 'text-black',
      ringColor: isDark ? 'ring-white' : 'ring-black'
    }
  };

  const currentColor = colorMap[themeColor] || colorMap.indigo;

  // Guarda no Histórico Local
  const saveTranslationToHistory = (input, output, currentMode) => {
    const newItem = {
      id: Date.now().toString(),
      input,
      output,
      mode: currentMode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updatedHistory = [newItem, ...historyList].slice(0, 30);
    setHistoryList(updatedHistory);

    try {
      localStorage.setItem('app_history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Erro ao guardar histórico local:', e);
    }
  };

  const clearHistory = () => {
    setHistoryList([]);
    try {
      localStorage.removeItem('app_history');
    } catch (e) {}
  };

  // Vibração Háptica (Retorna true se a API foi chamada com sucesso)
  const triggerHaptic = (pattern = 10) => {
    if (hapticFeedback && typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try {
        return window.navigator.vibrate(pattern);
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, []);

  const toggleMode = () => {
    triggerHaptic(15);
    setMode(prev => prev === 'encode' ? 'decode' : 'encode');
    if (autoClearOnToggle) {
      setInputText('');
      setOutputText('');
    } else {
      setInputText(outputText);
      setOutputText(inputText);
    }
    setCopyStatus('idle');
    setTranslationStats(null);
  };

  const shiftChar = (c, dir) => {
    if (c >= 'a' && c <= 'z') {
      let code = c.charCodeAt(0) - 97 + dir;
      if (code < 0) code += 26;
      if (code > 25) code -= 26;
      return String.fromCharCode(code + 97);
    }
    if (c >= 'A' && c <= 'Z') {
      let code = c.charCodeAt(0) - 65 + dir;
      if (code < 0) code += 26;
      if (code > 25) code -= 26;
      return String.fromCharCode(code + 65);
    }
    if (c >= '0' && c <= '9') {
      let code = c.charCodeAt(0) - 48 + dir;
      if (code < 0) code += 10;
      if (code > 9) code -= 10;
      return String.fromCharCode(code + 48);
    }
    return c;
  };

  const applyCasePattern = (sourceString, targetString) => {
    let result = '';
    for (let i = 0; i < sourceString.length; i++) {
      const char = sourceString[i];
      const isUpper = char === char.toUpperCase() && char !== char.toLowerCase();
      if (isUpper) {
        result += targetString[i].toUpperCase();
      } else {
        result += targetString[i].toLowerCase();
      }
    }
    return result;
  };

  const translateWord = (word, isEncode) => {
    if (isEncode) {
      const shifted = word.split('').map(c => shiftChar(c, -1)).join('');
      const reversed = shifted.split('').reverse().join('');
      return applyCasePattern(word, reversed);
    } else {
      const reversed = word.split('').reverse().join('');
      const withCase = applyCasePattern(word, reversed);
      const shifted = withCase.split('').map(c => shiftChar(c, 1)).join('');
      return shifted;
    }
  };

  const getEstimatedTime = (text) => {
    if (!text) return '0s';
    const totalMs = text.length * 25;
    if (totalMs < 1000) {
      return `~${totalMs}ms`;
    }
    return `~${(totalMs / 1000).toFixed(2)}s`;
  };

  const handleTranslate = () => {
    if (!inputText.trim()) {
      setOutputText('');
      setTranslationStats(null);
      return;
    }

    triggerHaptic(20);
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setIsTranslating(true);
    setOutputText('');
    setCopyStatus('idle');
    setTranslationStats(null);

    const startTime = performance.now();

    const textWithoutAccents = inputText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const regex = /([a-zA-Z0-9]+)/g;
    const fullResult = textWithoutAccents.replace(regex, (match) => {
      return translateWord(match, mode === 'encode');
    });

    const randomVariationFactor = 1 + (Math.random() * 0.2 - 0.1);
    const calculatedInterval = Math.max(10, Math.round(25 * randomVariationFactor));

    let index = 0;
    typingTimerRef.current = setInterval(() => {
      if (index < fullResult.length) {
        setOutputText(fullResult.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingTimerRef.current);
        const endTime = performance.now();
        const durationInMs = Math.round(endTime - startTime);
        const durationFormatted = durationInMs >= 1000 
          ? `${(durationInMs / 1000).toFixed(2)}s` 
          : `${durationInMs}ms`;

        setIsTranslating(false);
        triggerHaptic([30, 50, 30]);
        
        setTranslationStats({
          count: fullResult.length,
          words: inputText.trim().split(/\s+/).length,
          timeTaken: durationFormatted
        });

        saveTranslationToHistory(inputText, fullResult, mode);

        if (autoCopyResult) {
          copyToClipboard(fullResult);
        }
      }
    }, calculatedInterval);
  };

  const copyToClipboard = async (textToCopy = outputText) => {
    if (!textToCopy || isTranslating) return;
    
    triggerHaptic(15);
    const handleSuccess = () => {
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 3000);
    };

    const handleFailure = () => {
      setCopyStatus('failed');
      setTimeout(() => setCopyStatus('idle'), 4000);
    };

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
        handleSuccess();
        return;
      }
      throw new Error('Clipboard API indisponível');
    } catch (err) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) handleSuccess();
        else handleFailure();
      } catch (fallbackErr) {
        handleFailure();
      }
    }
  };

  // Estilo da fonte
  const fontStyleMap = {
    sans: 'font-sans',
    mono: 'font-mono',
    serif: 'font-serif',
    playful: 'font-playful'
  };

  // Tamanho do texto
  const fontSizeClass = {
    sm: 'text-sm leading-relaxed',
    md: 'text-base leading-relaxed',
    lg: 'text-xl leading-relaxed',
    xl: 'text-2xl leading-relaxed'
  }[fontSize] || 'text-base leading-relaxed';

  // Classes de fundo da página
  const pageBgClass = isOLED 
    ? 'bg-black text-white' 
    : isDark 
      ? 'dark bg-zinc-950 text-zinc-100' 
      : 'bg-zinc-100 text-zinc-900';

  // Classes do cartão principal
  const cardBgClass = isOLED
    ? 'bg-black border border-zinc-800 shadow-none'
    : isDark
      ? 'bg-zinc-900 border border-zinc-800 shadow-xl'
      : 'bg-white shadow-xl';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${fontStyleMap[fontFamily] || 'font-sans'} ${pageBgClass}`}>
      
      {/* Import de fonte descontraída para a opção Divertida */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
        .font-playful {
          font-family: 'Comic Neue', 'Comic Sans MS', 'Chalkboard SE', cursive, sans-serif !important;
        }
      `}</style>

      <div className={`w-full max-w-lg rounded-3xl flex flex-col relative transition-colors duration-300 p-6 sm:p-8 ${cardBgClass}`}>
        
        {/* Botão de Definições */}
        <button
          onClick={() => {
            triggerHaptic(10);
            setShowConfig(true);
          }}
          title="Definições"
          className={`absolute top-6 left-6 p-2 rounded-2xl transition-transform active:scale-95 ${
            isOLED 
              ? 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800' 
              : isDark 
                ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' 
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          <Settings size={22} />
        </button>

        {/* Alternador de Histórico / Tradutor */}
        <div className="flex justify-center mb-6">
          <div className={`flex p-1 rounded-2xl ${isOLED ? 'bg-zinc-900 border border-zinc-800' : isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
            <button
              onClick={() => {
                triggerHaptic(10);
                setActiveTab('translator');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'translator' ? `${currentColor.bgBtn} shadow` : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-800'}`}
            >
              Tradutor
            </button>
            <button
              onClick={() => {
                triggerHaptic(10);
                setActiveTab('history');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${activeTab === 'history' ? `${currentColor.bgBtn} shadow` : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-800'}`}
            >
              <History size={14} /> Histórico ({historyList.length})
            </button>
          </div>
        </div>

        {/* ABA TRADUTOR */}
        {activeTab === 'translator' && (
          <>
            <h1 className="text-3xl font-bold text-center mb-6 tracking-tight">
              Tradutor
            </h1>

            {/* Banner explicativo do Modo OLED quando ativo */}
            {isOLED && (
              <div className="mb-4 p-2.5 rounded-2xl border border-zinc-800 bg-zinc-950 flex items-center gap-2 text-xs opacity-90 animate-fade-in">
                <Info size={16} className="text-white shrink-0" />
                <span><strong>Modo OLED:</strong> Fundo preto absoluto (#000000) para estética e pretos verdadeiros.</span>
              </div>
            )}

            {/* Caixa de Entrada de Texto */}
            <div className="relative mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-60">
                  {mode === 'encode' ? 'Do idioma normal' : 'Do idioma inventado'}
                </label>

                {inputText.length > 0 && (
                  <span className="text-[11px] font-medium opacity-70 flex items-center gap-1">
                    <Clock size={12} className={currentColor.textAccent} />
                    Estimado: {getEstimatedTime(inputText)}
                  </span>
                )}
              </div>

              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={mode === 'encode' ? 'língua normal' : 'nossa língua'}
                  className={`w-full h-36 p-4 pr-12 rounded-2xl resize-none focus:outline-none border-2 transition-all ${fontSizeClass} placeholder-opacity-40 ${
                    isOLED
                      ? 'bg-black border-zinc-800 placeholder-zinc-600 text-white ' + currentColor.borderFocus
                      : isDark 
                        ? 'bg-zinc-800/50 border-zinc-700/60 placeholder-zinc-500 text-white ' + currentColor.borderFocus 
                        : 'bg-zinc-50 border-zinc-200 placeholder-zinc-400 text-zinc-900 ' + currentColor.borderFocus
                  }`}
                />
                
                {inputText && (
                  <button
                    onClick={() => {
                      triggerHaptic(10);
                      setInputText('');
                      setOutputText('');
                      setTranslationStats(null);
                    }}
                    title="Limpar texto"
                    className={`absolute top-3 right-3 p-2 rounded-xl transition-all active:scale-90 ${
                      isDark ? 'bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-700' : 'bg-zinc-200/70 text-zinc-500 hover:text-red-500 hover:bg-zinc-200'
                    }`}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Barra de Ações: Botão 20% (Trocar) e Botão 80% (Traduzir) */}
            <div className="flex gap-3 mb-4 w-full h-14">
              <button
                onClick={toggleMode}
                disabled={isTranslating}
                title="Trocar idioma"
                className={`w-[20%] flex items-center justify-center rounded-2xl transition-all active:scale-95 ${
                  isOLED 
                    ? 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800' 
                    : isDark 
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' 
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
                }`}
              >
                <ArrowRightLeft strokeWidth={2.5} size={22} />
              </button>
              
              <button
                onClick={handleTranslate}
                disabled={isTranslating || !inputText.trim()}
                className={`w-[80%] flex items-center justify-center font-bold text-lg rounded-2xl transition-all shadow-md active:scale-[0.98] ${currentColor.bgBtn} ${
                  (isTranslating || !inputText.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isTranslating ? (
                  <span className="flex items-center gap-2">
                    <Sparkles size={20} className="animate-spin" /> A traduzir...
                  </span>
                ) : (
                  'Traduzir'
                )}
              </button>
            </div>

            {/* Saída de Texto */}
            <div className="relative mt-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-60 block">
                  {mode === 'encode' ? 'Para o idioma inventado' : 'Para o idioma normal'}
                </label>

                {copyStatus === 'failed' && (
                  <span className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle size={14} /> Selecione e copie manualmente
                  </span>
                )}
              </div>
              
              <div className="relative">
                <textarea
                  readOnly
                  value={outputText}
                  placeholder="O resultado aparecerá aqui..."
                  className={`w-full h-36 p-4 rounded-2xl resize-none focus:outline-none pr-14 border-2 transition-all ${fontSizeClass} ${currentColor.bgOutput}`}
                />
                
                {/* Botão Copiar */}
                <button
                  onClick={() => copyToClipboard()}
                  title="Copiar texto"
                  disabled={!outputText || isTranslating}
                  className={`absolute bottom-3 right-3 p-2.5 rounded-xl transition-all flex items-center justify-center ${
                    !outputText || isTranslating
                      ? isDark ? 'opacity-30 cursor-not-allowed bg-zinc-800 text-zinc-500' : 'opacity-30 cursor-not-allowed bg-zinc-200 text-zinc-400'
                      : copyStatus === 'success'
                        ? 'bg-green-500 text-white shadow-md' 
                        : copyStatus === 'failed'
                          ? 'bg-red-500 text-white shadow-md animate-pulse'
                          : isOLED
                            ? 'bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-800 active:scale-95'
                            : isDark 
                              ? 'bg-zinc-800 text-zinc-200 shadow-sm hover:bg-zinc-700 active:scale-95'
                              : 'bg-white text-zinc-700 shadow-sm hover:shadow-md hover:scale-105 active:scale-95'
                  }`}
                >
                  {isTranslating ? (
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  ) : copyStatus === 'success' ? (
                    <Check size={20} strokeWidth={3} />
                  ) : copyStatus === 'failed' ? (
                    <AlertCircle size={20} strokeWidth={2.5} />
                  ) : (
                    <Copy size={20} strokeWidth={2.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Detalhes de Conclusão da Tradução */}
            {translationStats && (
              <div className="mt-3 text-center text-xs font-medium opacity-80 animate-fade-in flex items-center justify-center gap-1.5 flex-wrap">
                <Sparkles size={14} className={currentColor.textAccent} />
                <span>
                  Traduzidos <strong>{translationStats.count}</strong> caracteres ({translationStats.words} palavras) em <strong>{translationStats.timeTaken}</strong>
                </span>
              </div>
            )}
          </>
        )}

        {/* ABA HISTÓRICO */}
        {activeTab === 'history' && (
          <div className="flex flex-col h-full min-h-[380px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <History size={20} className={currentColor.textAccent} /> Histórico Recente
              </h2>
              {historyList.length > 0 && (
                <button
                  onClick={() => {
                    triggerHaptic(15);
                    clearHistory();
                  }}
                  className="text-xs text-red-500 hover:underline flex items-center gap-1 font-medium"
                >
                  <Trash2 size={14} /> Limpar tudo
                </button>
              )}
            </div>

            {historyList.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 py-12">
                <History size={48} className="mb-2" />
                <p className="text-sm font-medium">Nenhuma tradução guardada no histórico.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {historyList.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all flex justify-between items-start gap-3 ${
                      isOLED 
                        ? 'bg-black border-zinc-800' 
                        : isDark 
                          ? 'bg-zinc-800/60 border-zinc-700/60' 
                          : 'bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-600'}`}>
                          {item.mode === 'encode' ? 'Normal → Inventado' : 'Inventado → Normal'}
                        </span>
                        <span className="text-[10px] opacity-40">{item.timestamp}</span>
                      </div>
                      <p className="text-xs opacity-70 truncate mb-0.5">Entrada: {item.input}</p>
                      <p className="text-sm font-semibold truncate">{item.output}</p>
                    </div>

                    <button
                      onClick={() => copyToClipboard(item.output)}
                      title="Copiar resultado"
                      className={`p-2 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm ${isDark ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700' : 'bg-white text-zinc-600 hover:bg-zinc-100'}`}
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Pop-up / Modal de Definições */}
      {showConfig && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto transition-colors ${
            isOLED 
              ? 'bg-black border border-zinc-800 text-white' 
              : isDark 
                ? 'bg-zinc-900 border border-zinc-800 text-white' 
                : 'bg-white text-zinc-900'
          }`}>
            
            {/* Cabeçalho Modal */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings size={22} className={currentColor.textAccent} /> Definições
              </h2>
              <button 
                onClick={() => {
                  triggerHaptic(10);
                  setShowConfig(false);
                }}
                className={`p-1.5 rounded-xl transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200' : 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600'}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Conteúdo das Opções */}
            <div className="space-y-5">
              
              {/* Opção 1: Modo de Aparência (Claro / Escuro / OLED) */}
              <div>
                <p className="font-semibold text-sm mb-1">Aparência</p>
                <p className="text-xs opacity-60 mb-2">Escolha o estilo do tema do ecra</p>
                
                <div className={`grid grid-cols-3 gap-1 p-1 rounded-2xl ${isOLED ? 'bg-zinc-950 border border-zinc-800' : isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                  <button
                    onClick={() => {
                      triggerHaptic(10);
                      handleAppearanceChange('light');
                    }}
                    className={`py-2 px-2 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs font-semibold ${appearance === 'light' ? 'bg-white text-zinc-900 shadow' : 'text-zinc-400'}`}
                  >
                    <Sun size={15} /> Claro
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic(10);
                      handleAppearanceChange('dark');
                    }}
                    className={`py-2 px-2 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs font-semibold ${appearance === 'dark' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400'}`}
                  >
                    <Moon size={15} /> Escuro
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic(10);
                      handleAppearanceChange('oled');
                    }}
                    className={`py-2 px-2 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs font-semibold ${appearance === 'oled' ? 'bg-black text-white border border-zinc-700 shadow' : 'text-zinc-400'}`}
                  >
                    <Contrast size={15} /> OLED
                  </button>
                </div>

                {/* Explicativo do Modo OLED quando selecionado nas definições */}
                {appearance === 'oled' && (
                  <div className="mt-2 p-2.5 rounded-xl border border-zinc-800 bg-black text-zinc-300 text-xs flex items-start gap-2 animate-fade-in">
                    <Info size={16} className="text-white shrink-0 mt-0.5" />
                    <p>
                      <strong>Modo OLED (0,0,0):</strong> Projetado para estética e pretos verdadeiros, desligando os pixeis em ecrãs OLED/AMOLED.
                    </p>
                  </div>
                )}
              </div>

              {/* Opção 2: Cor de Destaque */}
              <div>
                <p className="font-semibold text-sm mb-1">Cor de Destaque</p>
                <p className="text-xs opacity-60 mb-3">Personalize a cor dos botões e elementos</p>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {[
                    { id: 'indigo', bg: 'bg-indigo-600' },
                    { id: 'emerald', bg: 'bg-emerald-600' },
                    { id: 'violet', bg: 'bg-violet-600' },
                    { id: 'rose', bg: 'bg-rose-600' },
                    { id: 'amber', bg: 'bg-amber-600' },
                    { id: 'cyan', bg: 'bg-cyan-600' },
                    { id: 'fuchsia', bg: 'bg-fuchsia-600' },
                    { id: 'orange', bg: 'bg-orange-600' },
                    { id: 'teal', bg: 'bg-teal-600' },
                    { id: 'bw', isSplit: true }
                  ].map(c => {
                    if (c.isSplit) {
                      return (
                        <button
                          key={c.id}
                          title="Preto & Branco Adaptável"
                          onClick={() => {
                            triggerHaptic(10);
                            setThemeColor('bw');
                            updateSettings('themeColor', 'bw');
                          }}
                          className={`w-8 h-8 rounded-xl relative overflow-hidden transition-transform active:scale-95 border border-zinc-500/40 flex items-center justify-center ${
                            themeColor === 'bw' ? 'ring-2 ring-offset-2 ' + (isDark ? 'ring-offset-zinc-900 ring-white' : 'ring-offset-white ring-black') : 'opacity-80 hover:opacity-100'
                          }`}
                        >
                          <div className="absolute inset-0 flex">
                            <div className="w-1/2 h-full bg-black" />
                            <div className="w-1/2 h-full bg-white" />
                          </div>
                          {themeColor === 'bw' && (
                            <Check size={16} strokeWidth={3} className="relative z-10 text-emerald-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                          )}
                        </button>
                      );
                    }

                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          triggerHaptic(10);
                          setThemeColor(c.id);
                          updateSettings('themeColor', c.id);
                        }}
                        className={`w-8 h-8 rounded-xl ${c.bg} transition-transform active:scale-95 flex items-center justify-center text-white ${
                          themeColor === c.id ? 'ring-2 ring-offset-2 ' + (isDark ? 'ring-offset-zinc-900 ' : 'ring-offset-white ') + currentColor.ringColor : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        {themeColor === c.id && <Check size={16} strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Opção 3: Estilo da Fonte */}
              <div>
                <p className="font-semibold text-sm mb-1">Estilo da Fonte</p>
                <p className="text-xs opacity-60 mb-2">Alterne a tipografia da aplicação</p>
                <div className={`grid grid-cols-2 gap-2 p-1 rounded-2xl ${isOLED ? 'bg-zinc-950 border border-zinc-800' : isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                  {[
                    { id: 'sans', label: 'Padrão (Sans)' },
                    { id: 'mono', label: 'Código (Mono)' },
                    { id: 'serif', label: 'Elegante (Serif)' },
                    { id: 'playful', label: 'Divertida (Comic)' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => {
                        triggerHaptic(10);
                        setFontFamily(f.id);
                        updateSettings('fontFamily', f.id);
                      }}
                      className={`py-2 px-3 rounded-xl transition-all text-xs font-semibold text-center ${f.id === 'playful' ? 'font-playful' : ''} ${fontFamily === f.id ? (isDark ? 'bg-zinc-700 text-white shadow' : 'bg-white text-zinc-900 shadow') : 'text-zinc-400'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opção 4: Tamanho do Texto */}
              <div>
                <p className="font-semibold text-sm mb-1">Tamanho do Texto</p>
                <p className="text-xs opacity-60 mb-2">Ajuste o tamanho das letras nas caixas de texto</p>
                <div className={`grid grid-cols-4 gap-1 p-1 rounded-2xl ${isOLED ? 'bg-zinc-950 border border-zinc-800' : isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                  {[
                    { id: 'sm', label: 'Pequeno' },
                    { id: 'md', label: 'Médio' },
                    { id: 'lg', label: 'Grande' },
                    { id: 'xl', label: 'Enorme' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        triggerHaptic(10);
                        setFontSize(s.id);
                        updateSettings('fontSize', s.id);
                      }}
                      className={`py-1.5 px-2 rounded-xl transition-all text-xs font-semibold text-center ${fontSize === s.id ? (isDark ? 'bg-zinc-700 text-white shadow' : 'bg-white text-zinc-900 shadow') : 'text-zinc-400'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opção 5: Vibração Háptica */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">Vibração Háptica</p>
                    <p className="text-xs opacity-60">Feedback tátil ao tocar botões (Android / APK)</p>
                  </div>
                  <button
                    onClick={() => {
                      const val = !hapticFeedback;
                      setHapticFeedback(val);
                      if (val) triggerHaptic(30);
                      updateSettings('hapticFeedback', val);
                    }}
                    className={`p-2 rounded-xl transition-colors ${hapticFeedback ? (isDark ? 'bg-indigo-950 text-indigo-300' : 'bg-indigo-100 text-indigo-700') : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-400')}`}
                  >
                    <Vibrate size={20} />
                  </button>
                </div>

                {/* Botão de teste para quando for exportado */}
                {hapticFeedback && (
                  <button
                    onClick={() => {
                      const success = triggerHaptic([40, 60, 40]);
                      if (!success) {
                        setCopyStatus('failed');
                        setTimeout(() => setCopyStatus('idle'), 3000);
                      }
                    }}
                    className={`text-xs py-1.5 px-3 rounded-xl font-medium border border-dashed transition-all active:scale-95 text-center flex items-center justify-center gap-1.5 ${
                      isDark ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-300 text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <Vibrate size={14} className={currentColor.textAccent} /> Testar Vibração no Dispositivo
                  </button>
                )}
              </div>

              {/* Opção 6: Copiar Automaticamente ao Concluir */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">Copiar Automaticamente</p>
                  <p className="text-xs opacity-60">Copia o resultado assim que traduz</p>
                </div>
                <button
                  onClick={() => {
                    triggerHaptic(10);
                    const val = !autoCopyResult;
                    setAutoCopyResult(val);
                    updateSettings('autoCopyResult', val);
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative p-1 ${autoCopyResult ? currentColor.bgBtn : (isDark ? 'bg-zinc-700' : 'bg-zinc-300')}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${autoCopyResult ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Opção 7: Limpeza Automática ao Alternar */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">Limpar ao Alternar</p>
                  <p className="text-xs opacity-60">Apaga os textos ao inverter modo</p>
                </div>
                <button
                  onClick={() => {
                    triggerHaptic(10);
                    const val = !autoClearOnToggle;
                    setAutoClearOnToggle(val);
                    updateSettings('autoClearOnToggle', val);
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative p-1 ${autoClearOnToggle ? currentColor.bgBtn : (isDark ? 'bg-zinc-700' : 'bg-zinc-300')}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${autoClearOnToggle ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

            </div>

            {/* Botão Fechar Modal */}
            <button
              onClick={() => {
                triggerHaptic(10);
                setShowConfig(false);
              }}
              className={`w-full mt-8 py-3 rounded-2xl font-bold transition-all shadow-sm active:scale-95 ${currentColor.bgBtn}`}
            >
              Concluído
            </button>

          </div>
        </div>
      )}

      {/* Texto de Versão - Canto Inferior Direito */}
      <div className={`fixed bottom-2 right-3 text-[11px] font-mono pointer-events-none select-none opacity-50 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
        v2.1.0
      </div>

    </div>
  );
}
