let currentTab = 'review';
let currentDifficulty = 1;
let currentAnswer = null;
let score = 0;

// --- Code Protection Mechanisms ---
// Prevent common dev tools shortcuts
document.addEventListener('keydown', function(e) {
    // Disable F12
    if(e.keyCode == 123) {
        e.preventDefault();
        return false;
    }
    // Disable Ctrl+Shift+I / Cmd+Option+I
    if(e.ctrlKey && e.shiftKey && e.keyCode == 73) {
        e.preventDefault();
        return false;
    }
    // Disable Ctrl+Shift+J / Cmd+Option+J
    if(e.ctrlKey && e.shiftKey && e.keyCode == 74) {
        e.preventDefault();
        return false;
    }
    // Disable Ctrl+Shift+C / Cmd+Option+C
    if(e.ctrlKey && e.shiftKey && e.keyCode == 67) {
        e.preventDefault();
        return false;
    }
    // Disable Ctrl+U / Cmd+U (View Source)
    if(e.ctrlKey && e.keyCode == 85) {
        e.preventDefault();
        return false;
    }
    // Disable Ctrl+S / Cmd+S (Save Page)
    if(e.ctrlKey && e.keyCode == 83) {
        e.preventDefault();
        return false;
    }
});

// Periodic debugger detection
setInterval(function() {
    let before = new Date().getTime();
    debugger;
    let after = new Date().getTime();
    if (after - before > 100) {
        // Dev tools is likely open, we could redirect or clear content
        // document.body.innerHTML = 'Developer tools detected. Access denied.';
    }
}, 2000);

// Handle UI Tab Switching
function switchTab(tab) {
    currentTab = tab;
    document.getElementById('section-review').classList.toggle('hidden', tab !== 'review');
    document.getElementById('section-practice').classList.toggle('hidden', tab !== 'practice');
    document.getElementById('section-vocabulary').classList.toggle('hidden', tab !== 'vocabulary');
    
    const reviewTab = document.getElementById('tab-review');
    const practiceTab = document.getElementById('tab-practice');
    const vocabTab = document.getElementById('tab-vocabulary');
    
    const activeClass = "pb-2 tab-active text-lg transition-colors";
    const inactiveClass = "pb-2 tab-inactive text-lg transition-colors";

    reviewTab.className = tab === 'review' ? activeClass : inactiveClass;
    practiceTab.className = tab === 'practice' ? activeClass : inactiveClass;
    vocabTab.className = tab === 'vocabulary' ? activeClass : inactiveClass;

    if (tab === 'practice' && !currentAnswer) {
        generateQuestion();
    } else if (tab === 'vocabulary' && vocabCards.length === 0) {
        initVocabGame();
    }
}

// Handle Difficulty Selection
function setDifficulty(level) {
    currentDifficulty = level;
    
    const styles = {
        1: { active: "bg-green-500 text-white shadow-lg transform hover:scale-105 hover:bg-green-600", default: "bg-gray-100 text-gray-600 shadow hover:bg-green-500 hover:text-white" },
        2: { active: "bg-amber-500 text-white shadow-lg transform hover:scale-105 hover:bg-amber-600", default: "bg-gray-100 text-gray-600 shadow hover:bg-amber-500 hover:text-white" },
        3: { active: "bg-rose-500 text-white shadow-lg transform hover:scale-105 hover:bg-rose-600", default: "bg-gray-100 text-gray-600 shadow hover:bg-rose-500 hover:text-white" }
    };
    
    for(let i=1; i<=3; i++) {
        const btn = document.getElementById(`btn-lvl-${i}`);
        let baseClass = "px-8 py-3 rounded-full font-bold transition focus:outline-none focus:ring-4 ";
        
        if (i === level) {
            btn.className = baseClass + styles[i].active + (i===1 ? " focus:ring-green-200" : i===2 ? " focus:ring-amber-200" : " focus:ring-rose-200");
        } else {
            btn.className = baseClass + styles[i].default;
        }
    }
    
    generateQuestion();
}

// Math Utility
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate Dynamic Question
function generateQuestion() {
    // Reset UI State
    document.getElementById('answer-input').value = '';
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('next-btn').classList.add('hidden');
    document.getElementById('answer-area').classList.remove('hidden');
    
    // Choose Topic Randomly
    const topics = ['cylinder_cone', 'proportion', 'scale', 'inverse_prop'];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    let qText = '';
    let qTopic = '';
    
    if (topic === 'cylinder_cone') {
        qTopic = "🏷️ 几何：圆柱与圆锥 (计算时 π 取 3.14)";
        let r = rand(2, 10);
        let h = rand(3, 12);
        
        if (currentDifficulty === 1) {
            qText = `已知一个圆柱的底面半径 \\( r = ${r} \\) 厘米，高 \\( h = ${h} \\) 厘米。求这个圆柱的体积是多少立方厘米？`;
            currentAnswer = (3.14 * r * r * h).toFixed(2);
        } else if (currentDifficulty === 2) {
            qText = `已知一个圆锥的底面半径 \\( r = ${r} \\) 厘米，高 \\( h = ${h} \\) 厘米。求这个圆锥的体积是多少立方厘米？(保留两位小数)`;
            currentAnswer = ((1/3) * 3.14 * r * r * h).toFixed(2);
        } else {
            qText = `已知一个圆柱的底面半径 \\( r = ${r} \\) 厘米，高 \\( h = ${h} \\) 厘米。求这个圆柱的表面积是多少平方厘米？(保留两位小数)`;
            let s_side = 2 * 3.14 * r * h;
            let s_base = 3.14 * r * r;
            currentAnswer = (s_side + 2 * s_base).toFixed(2);
        }
    } 
    else if (topic === 'proportion') {
        qTopic = "🏷️ 代数：比例与内外项";
        if (currentDifficulty === 1) {
            let a = rand(2, 10);
            let b = rand(2, 10);
            let c = a * rand(2, 5);
            let d = (b * c) / a; 
            qText = `解比例： \\( ${a} : ${b} = ${c} : x \\)，求外项 \\( x \\) 的值。`;
            currentAnswer = d.toFixed(2);
        } else if (currentDifficulty === 2) {
            let a = rand(1, 9) + 0.5;
            let b = rand(2, 8);
            let x = rand(3, 10);
            let d = (b * x) / a;
            qText = `解比例： \\( ${a} : ${b} = x : ${d.toFixed(2)} \\)，求内项 \\( x \\) 的值。`;
            currentAnswer = x.toFixed(2);
        } else {
            let a = rand(2, 6);
            let b = rand(3, 8);
            let ans = rand(2, 10); // True value of x
            let c = a * ans + a; // Represents a(x+1)
            let rightVal = (c * b) / a; 
            qText = `解复杂比例方程： \\( (x + 1) : ${b} = ${c} : ${a * b} \\)，求 \\( x \\) 的值。`;
            currentAnswer = (c/a - 1).toFixed(2);
        }
    } 
    else if (topic === 'scale') {
        qTopic = "🏷️ 应用：比例尺";
        if (currentDifficulty === 1) {
            let mapDist = rand(2, 10);
            let scaleFactor = rand(2, 9) * 1000;
            qText = `在一幅比例尺为 1 : ${scaleFactor} 的地图上，量得两地的距离是 ${mapDist} 厘米。这两地的实际距离是多少米？`;
            currentAnswer = ((mapDist * scaleFactor) / 100).toFixed(2);
        } else if (currentDifficulty === 2) {
            let actualDistKm = rand(10, 100); 
            let scaleFactor = rand(2, 5) * 100000; 
            qText = `甲乙两地相距 ${actualDistKm} 千米，在一幅比例尺为 1 : ${scaleFactor} 的地图上，这两地之间的图上距离是多少厘米？`;
            currentAnswer = ((actualDistKm * 100000) / scaleFactor).toFixed(2);
        } else {
            let scaleFactor = rand(10, 50); // represents 1 : (scaleFactor*100)
            let actualL = rand(10, 30); // meters
            let actualW = rand(5, 15); // meters
            qText = `一个长方形操场长 ${actualL} 米，宽 ${actualW} 米。如果画在比例尺为 1 : ${scaleFactor * 100} 的图纸上，图纸上这个操场的面积是多少平方厘米？(保留两位小数)`;
            let mapL = (actualL * 100) / (scaleFactor * 100);
            let mapW = (actualW * 100) / (scaleFactor * 100);
            currentAnswer = (mapL * mapW).toFixed(2);
        }
    } 
    else if (topic === 'inverse_prop') {
        qTopic = "🏷️ 应用：解反比例方程";
        if (currentDifficulty === 1) {
            let x1 = rand(2, 10);
            let y1 = rand(10, 30);
            let x2 = rand(2, 8);
            qText = `已知 \\( x \\) 和 \\( y \\) 成反比例，当 \\( x = ${x1} \\) 时，\\( y = ${y1} \\)。求当 \\( x = ${x2} \\) 时，\\( y \\) 的值是多少？(保留两位小数)`;
            currentAnswer = ((x1 * y1) / x2).toFixed(2);
        } else if (currentDifficulty === 2) {
            let speed1 = rand(4, 8) * 10;
            let time1 = rand(2, 6);
            let speed2 = speed1 + 20;
            qText = `一辆汽车从甲地开往乙地，每小时行 ${speed1} 千米，${time1} 小时到达。如果想加快速度，每小时行 ${speed2} 千米，需要多少小时到达？(保留两位小数)`;
            currentAnswer = ((speed1 * time1) / speed2).toFixed(2);
        } else {
            let workers1 = rand(5, 15);
            let days1 = rand(10, 20);
            let addWorkers = rand(2, 5);
            qText = `修一条路，原计划每天由 ${workers1} 人修，${days1} 天可以修完。如果增加 ${addWorkers} 人，且每人每天工作效率不变，需要多少天才能修完？(保留两位小数)`;
            currentAnswer = ((workers1 * days1) / (workers1 + addWorkers)).toFixed(2);
        }
    }
    
    // Update DOM
    document.getElementById('q-topic').innerHTML = qTopic;
    document.getElementById('q-text').innerHTML = qText;
    
    // Typeset MathJax
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
    
    // Focus input
    document.getElementById('answer-input').focus();
}

// Handle Submit Answer
function checkAnswer() {
    let userAns = document.getElementById('answer-input').value;
    if (userAns.trim() === '') return;
    
    userAns = parseFloat(userAns).toFixed(2);
    let correctAns = parseFloat(currentAnswer).toFixed(2);
    
    const feedback = document.getElementById('feedback');
    feedback.classList.remove('hidden');
    document.getElementById('answer-area').classList.add('hidden');
    document.getElementById('next-btn').classList.remove('hidden');
    
    // Allow small float tolerance (e.g. 0.05)
    if (Math.abs(userAns - correctAns) < 0.05) {
        feedback.innerHTML = "✅ 回答正确！太棒了！继续保持！";
        feedback.className = "mt-6 font-bold text-xl px-6 py-4 rounded-xl text-center w-full max-w-lg bg-green-100 text-green-700 border border-green-200";
        score += currentDifficulty * 10;
        
        // Animate score update
        const scoreEl = document.getElementById('score');
        scoreEl.innerText = score;
        scoreEl.classList.add('scale-125', 'text-green-500');
        setTimeout(() => scoreEl.classList.remove('scale-125', 'text-green-500'), 300);
        
    } else {
        feedback.innerHTML = `❌ 回答错误。<br><span class="text-lg font-normal mt-2 block">正确答案是：<strong>${correctAns}</strong></span>`;
        feedback.className = "mt-6 font-bold text-xl px-6 py-4 rounded-xl text-center w-full max-w-lg bg-red-100 text-red-700 border border-red-200";
    }
}

// Handle Enter Key
document.getElementById('answer-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// --- Vocabulary Game Logic ---
const vocabDictionary = {
    1: [ // Level 1: Basic Math Terms (Shapes & Simple operations)
        { zh: "圆柱", en: "Cylinder" },
        { zh: "圆锥", en: "Cone" },
        { zh: "圆", en: "Circle" },
        { zh: "三角形", en: "Triangle" },
        { zh: "正方形", en: "Square" },
        { zh: "长方形", en: "Rectangle" },
        { zh: "面积", en: "Area" },
        { zh: "体积", en: "Volume" },
        { zh: "加法", en: "Addition" },
        { zh: "减法", en: "Subtraction" },
        { zh: "乘法", en: "Multiplication" },
        { zh: "除法", en: "Division" },
        { zh: "半径", en: "Radius" },
        { zh: "直径", en: "Diameter" }
    ],
    2: [ // Level 2: Grade 6 Specific Core (Proportions, Equations, Surface Area) - Expanded for reshuffling
        { zh: "比例", en: "Proportion" },
        { zh: "比", en: "Ratio" },
        { zh: "方程", en: "Equation" },
        { zh: "表面积", en: "Surface Area" },
        { zh: "侧面积", en: "Lateral Area" },
        { zh: "底面积", en: "Base Area" },
        { zh: "内项", en: "Inner Terms" },
        { zh: "外项", en: "Outer Terms" },
        { zh: "分数", en: "Fraction" },
        { zh: "小数", en: "Decimal" },
        { zh: "百分数", en: "Percentage" },
        { zh: "周长", en: "Perimeter" },
        { zh: "未知数", en: "Unknown" },
        { zh: "等式", en: "Equality" },
        { zh: "倒数", en: "Reciprocal" },
        { zh: "公约数", en: "Common Divisor" },
        { zh: "公倍数", en: "Common Multiple" },
        { zh: "质数", en: "Prime Number" },
        { zh: "合数", en: "Composite Number" },
        { zh: "乘积", en: "Product" },
        { zh: "商", en: "Quotient" },
        { zh: "因数", en: "Factor" },
        { zh: "正方体", en: "Cube" },
        { zh: "长方体", en: "Cuboid" }
    ],
    3: [ // Level 3: Advanced & Applied (Scale, Inverse proportion) - Spelling Mode
        { zh: "比例尺", en: "Scale" },
        { zh: "正比例", en: "Direct Proportion" },
        { zh: "反比例", en: "Inverse Proportion" },
        { zh: "实际距离", en: "Actual Distance" },
        { zh: "图上距离", en: "Map Distance" },
        { zh: "常量", en: "Constant" },
        { zh: "变量", en: "Variable" },
        { zh: "圆周率", en: "Pi" },
        { zh: "轴对称", en: "Axis Symmetry" },
        { zh: "坐标系", en: "Coordinate System" },
        { zh: "横轴", en: "X-axis" },
        { zh: "纵轴", en: "Y-axis" },
        { zh: "统计图", en: "Statistical Chart" },
        { zh: "扇形", en: "Sector" },
        { zh: "平均数", en: "Average" },
        { zh: "中位数", en: "Median" },
        { zh: "众数", en: "Mode" },
        { zh: "概率", en: "Probability" },
        { zh: "几何", en: "Geometry" },
        { zh: "代数", en: "Algebra" }
    ]
};

let currentVocabLevel = 1;
let vocabCards = [];
let firstCard = null;
let secondCard = null;
let matchedPairs = 0;
let lockBoard = false;
let gameTimer = null;
let gameSeconds = 0;
let PAIRS_PER_GAME = 8; // Number of pairs to show

// Tracking for Level 2 Reshuffle
let availableL2Dict = [];
let activeL2Pairs = [];

// Tracking for Level 3 Spelling
let spellingQueue = [];
let currentSpellingWord = null;

function setVocabDifficulty(level) {
    currentVocabLevel = level;
    
    const styles = {
        1: { active: "bg-green-500 text-white shadow-lg transform hover:scale-105 hover:bg-green-600", default: "bg-gray-100 text-gray-600 shadow hover:bg-green-500 hover:text-white" },
        2: { active: "bg-amber-500 text-white shadow-lg transform hover:scale-105 hover:bg-amber-600", default: "bg-gray-100 text-gray-600 shadow hover:bg-amber-500 hover:text-white" },
        3: { active: "bg-rose-500 text-white shadow-lg transform hover:scale-105 hover:bg-rose-600", default: "bg-gray-100 text-gray-600 shadow hover:bg-rose-500 hover:text-white" }
    };
    
    for(let i=1; i<=3; i++) {
        const btn = document.getElementById(`btn-vocab-lvl-${i}`);
        let baseClass = "px-6 py-2 rounded-full font-bold transition focus:outline-none focus:ring-4 text-sm md:text-base ";
        
        if (i === level) {
            btn.className = baseClass + styles[i].active + (i===1 ? " focus:ring-green-200" : i===2 ? " focus:ring-amber-200" : " focus:ring-rose-200");
        } else {
            btn.className = baseClass + styles[i].default;
        }
    }
    
    // Level 1: 6 pairs (12 cards), Level 2: 12 pairs (24 cards), Level 3: 10 spelling words
    if (level === 1) PAIRS_PER_GAME = 6;
    else if (level === 2) PAIRS_PER_GAME = 12;
    else PAIRS_PER_GAME = 10;
    
    initVocabGame();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initVocabGame() {
    const board = document.getElementById('vocab-board');
    const spellBoard = document.getElementById('spelling-board');
    const overlay = document.getElementById('game-overlay');
    
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    
    // Timer
    clearInterval(gameTimer);
    gameSeconds = 0;
    document.getElementById('game-timer').innerText = `0s`;
    gameTimer = setInterval(() => {
        gameSeconds++;
        document.getElementById('game-timer').innerText = `${gameSeconds}s`;
    }, 1000);

    // Initialize Level 3
    if (currentVocabLevel === 3) {
        // Init Spelling Mode
        board.classList.add('hidden');
        spellBoard.classList.remove('hidden');
        spellBoard.classList.add('flex');
        
        let shuffledDict = [...vocabDictionary[3]];
        shuffleArray(shuffledDict);
        spellingQueue = shuffledDict.slice(0, PAIRS_PER_GAME);
        matchedPairs = 0;
        document.getElementById('game-progress').innerText = `0 / ${PAIRS_PER_GAME}`;
        
        nextSpellingWord();
    } else {
        // Init Matching Mode
        spellBoard.classList.add('hidden');
        spellBoard.classList.remove('flex');
        board.classList.remove('hidden');
        board.innerHTML = '';
        
        // Adjust grid based on pairs
        if (PAIRS_PER_GAME === 6) {
            board.className = "grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl min-h-[400px] max-w-3xl mx-auto";
        } else {
            board.className = "grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-4 bg-slate-50 rounded-xl min-h-[400px]";
        }

        // Reset state
        matchedPairs = 0;
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        document.getElementById('game-progress').innerText = `0 / ${PAIRS_PER_GAME}`;
        
        // Pick random words from current level
        let shuffledDict = [...vocabDictionary[currentVocabLevel]];
        shuffleArray(shuffledDict);
        
        if (currentVocabLevel === 2) {
            availableL2Dict = shuffledDict.slice(PAIRS_PER_GAME); // Reserve unused words
            activeL2Pairs = shuffledDict.slice(0, PAIRS_PER_GAME);
        } else {
            activeL2Pairs = shuffledDict.slice(0, PAIRS_PER_GAME);
        }
        
        renderMatchingBoard();
    }
}

function renderMatchingBoard() {
    const board = document.getElementById('vocab-board');
    board.innerHTML = '';
    vocabCards = [];
    
    // Add active unmatched pairs
    activeL2Pairs.forEach((word, index) => {
        if (!word.matched) {
            vocabCards.push({ id: index, text: word.zh, type: 'zh', matchId: index, wordRef: word });
            vocabCards.push({ id: index + PAIRS_PER_GAME, text: word.en, type: 'en', matchId: index, wordRef: word });
        }
    });
    
    shuffleArray(vocabCards);
    
    // Calculate total matched cards to render them as locked place holders
    const totalMatchedCards = (PAIRS_PER_GAME * 2) - vocabCards.length;
    let renderedMatched = 0;
    
    // Create an array to hold all slots
    const allSlots = new Array(PAIRS_PER_GAME * 2).fill(null);
    
    // Fill matched slots first (just empty space to keep grid consistent)
    for(let i=0; i<totalMatchedCards; i++) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'vocab-card bg-green-50 h-20 md:h-24 rounded-xl border-2 border-green-100 flex items-center justify-center opacity-50 select-none';
        emptyEl.innerHTML = '✔️';
        allSlots[i] = emptyEl;
    }
    
    // Fill the rest with active cards
    vocabCards.forEach((card, i) => {
        const cardEl = document.createElement('div');
        const textClass = currentVocabLevel === 2 ? 'text-sm md:text-base' : 'text-lg';
        cardEl.className = `vocab-card bg-white h-20 md:h-24 rounded-xl shadow-sm border-2 border-slate-200 flex items-center justify-center font-bold text-gray-700 cursor-pointer transition transform hover:-translate-y-1 hover:shadow-md select-none ${textClass} text-center px-2`;
        cardEl.dataset.id = card.id;
        cardEl.dataset.matchId = card.matchId;
        cardEl.dataset.type = card.type;
        cardEl.innerText = card.text;
        
        cardEl.addEventListener('click', flipCard);
        allSlots[totalMatchedCards + i] = cardEl;
    });
    
    // We want to keep matched cards at the end of the grid, so shuffle only the active cards part
    // Actually, shuffle all slots so empty slots are randomly distributed (optional)
    // For now, let's keep empty slots at the beginning
    
    allSlots.forEach(slot => {
        if(slot) board.appendChild(slot);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    if (this.classList.contains('matched')) return;

    this.classList.add('bg-blue-100', 'border-blue-400', 'text-blue-800');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.matchId === secondCard.dataset.matchId;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.classList.remove('bg-blue-100', 'border-blue-400', 'text-blue-800');
    secondCard.classList.remove('bg-blue-100', 'border-blue-400', 'text-blue-800');
    
    firstCard.classList.add('matched', 'bg-green-100', 'border-green-400', 'text-green-700', 'opacity-70', 'scale-95');
    secondCard.classList.add('matched', 'bg-green-100', 'border-green-400', 'text-green-700', 'opacity-70', 'scale-95');
    
    // Mark as matched for L2 reshuffle logic
    const wordRef1 = vocabCards.find(c => c.id == firstCard.dataset.id).wordRef;
    if (wordRef1) wordRef1.matched = true;

    matchedPairs++;
    document.getElementById('game-progress').innerText = `${matchedPairs} / ${PAIRS_PER_GAME}`;
    
    resetBoard();
    
    if (matchedPairs === PAIRS_PER_GAME) {
        gameOver();
    }
}

function unflipCards() {
    lockBoard = true;
    
    firstCard.classList.remove('bg-blue-100', 'border-blue-400', 'text-blue-800');
    secondCard.classList.remove('bg-blue-100', 'border-blue-400', 'text-blue-800');
    
    firstCard.classList.add('bg-red-100', 'border-red-400', 'text-red-800');
    secondCard.classList.add('bg-red-100', 'border-red-400', 'text-red-800');

    setTimeout(() => {
        firstCard.classList.remove('bg-red-100', 'border-red-400', 'text-red-800');
        secondCard.classList.remove('bg-red-100', 'border-red-400', 'text-red-800');
        
        // Level 2 Reshuffle Logic
        if (currentVocabLevel === 2) {
            reshuffleLevel2();
        }
        
        resetBoard();
    }, 800);
}

function reshuffleLevel2() {
    // Replace the unmatched pair with a new one if available
    const wordRef1 = vocabCards.find(c => c.id == firstCard.dataset.id).wordRef;
    const matchId = firstCard.dataset.matchId;
    
    // Remove the failed pair from active pairs
    activeL2Pairs = activeL2Pairs.filter(w => w !== wordRef1);
    
    // If we have backup words, add a new one, otherwise keep the old one
    if (availableL2Dict.length > 0) {
        const newWord = availableL2Dict.pop();
        activeL2Pairs.push(newWord);
        // Put the failed word back into the available pool
        availableL2Dict.push(wordRef1);
        shuffleArray(availableL2Dict);
    } else {
        activeL2Pairs.push(wordRef1); // Keep it if no backups
    }
    
    // Re-render board (matched cards will be ignored and we'll keep them on screen but in their old DOM positions)
    // Wait, replacing DOM completely is easier, but we need to preserve matched cards visually.
    // Let's just re-render everything
    renderMatchingBoard();
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// --- Level 3 Spelling Logic ---

function nextSpellingWord() {
    if (spellingQueue.length === 0) {
        gameOver();
        return;
    }
    
    currentSpellingWord = spellingQueue.shift();
    document.getElementById('spell-zh').innerText = currentSpellingWord.zh;
    document.getElementById('spell-input').value = '';
    document.getElementById('spell-input').focus();
    
    const feedback = document.getElementById('spell-feedback');
    feedback.innerText = '';
    feedback.className = 'mt-6 text-xl font-bold h-8 transition-opacity opacity-0';
}

function checkSpelling() {
    if (currentVocabLevel !== 3) return;
    
    const input = document.getElementById('spell-input').value.trim().toLowerCase();
    const correct = currentSpellingWord.en.toLowerCase();
    const feedback = document.getElementById('spell-feedback');
    
    if (input === correct) {
        feedback.innerText = "✅ 拼写正确！";
        feedback.className = "mt-6 text-xl font-bold h-8 transition-opacity opacity-100 text-green-600";
        matchedPairs++;
        document.getElementById('game-progress').innerText = `${matchedPairs} / ${PAIRS_PER_GAME}`;
        
        setTimeout(() => {
            nextSpellingWord();
        }, 1000);
    } else {
        feedback.innerText = "❌ 拼写错误，请再试一次";
        feedback.className = "mt-6 text-xl font-bold h-8 transition-opacity opacity-100 text-red-600";
        
        // Shake animation
        const inputEl = document.getElementById('spell-input');
        inputEl.classList.add('translate-x-2');
        setTimeout(() => inputEl.classList.replace('translate-x-2', '-translate-x-2'), 100);
        setTimeout(() => inputEl.classList.replace('-translate-x-2', 'translate-x-2'), 200);
        setTimeout(() => inputEl.classList.remove('translate-x-2'), 300);
    }
}

function skipSpelling() {
    const feedback = document.getElementById('spell-feedback');
    feedback.innerText = `💡 正确拼写是: ${currentSpellingWord.en}`;
    feedback.className = "mt-6 text-xl font-bold h-8 transition-opacity opacity-100 text-amber-600";
    
    // Push it back to queue so they have to try again later
    spellingQueue.push(currentSpellingWord);
    
    setTimeout(() => {
        nextSpellingWord();
    }, 2500);
}

document.getElementById('spell-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkSpelling();
    }
});

// --- Common Game Logic ---
function gameOver() {
    clearInterval(gameTimer);
    setTimeout(() => {
        document.getElementById('vocab-board').classList.add('hidden');
        const overlay = document.getElementById('game-overlay');
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');
        
        const levelNames = { 1: "「级别 1」", 2: "「级别 2」", 3: "「级别 3」" };
        document.getElementById('final-level').innerText = levelNames[currentVocabLevel];
        document.getElementById('final-time').innerText = gameSeconds;
    }, 500);
}