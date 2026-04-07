let currentTab = 'review';
let currentDifficulty = 1;
let currentAnswer = null;
let score = 0;

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
    2: [ // Level 2: Grade 6 Specific Core & Expanded Vocabulary (200 items)
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
        { zh: "整数", en: "Integer" },
        { zh: "正数", en: "Positive Number" },
        { zh: "负数", en: "Negative Number" },
        { zh: "绝对值", en: "Absolute Value" },
        { zh: "有理数", en: "Rational Number" },
        { zh: "偶数", en: "Even Number" },
        { zh: "奇数", en: "Odd Number" },
        { zh: "质数", en: "Prime Number" },
        { zh: "合数", en: "Composite Number" },
        { zh: "因数", en: "Factor" },
        { zh: "倍数", en: "Multiple" },
        { zh: "最大公因数", en: "Greatest Common Factor" },
        { zh: "最小公倍数", en: "Least Common Multiple" },
        { zh: "倒数", en: "Reciprocal" },
        { zh: "分子", en: "Numerator" },
        { zh: "分母", en: "Denominator" },
        { zh: "真分数", en: "Proper Fraction" },
        { zh: "假分数", en: "Improper Fraction" },
        { zh: "带分数", en: "Mixed Number" },
        { zh: "约分", en: "Simplify" },
        { zh: "通分", en: "Common Denominator" },
        { zh: "算术", en: "Arithmetic" },
        { zh: "加法", en: "Addition" },
        { zh: "减法", en: "Subtraction" },
        { zh: "乘法", en: "Multiplication" },
        { zh: "除法", en: "Division" },
        { zh: "和", en: "Sum" },
        { zh: "差", en: "Difference" },
        { zh: "积", en: "Product" },
        { zh: "商", en: "Quotient" },
        { zh: "余数", en: "Remainder" },
        { zh: "被加数", en: "Addend" },
        { zh: "被减数", en: "Minuend" },
        { zh: "减数", en: "Subtrahend" },
        { zh: "被乘数", en: "Multiplicand" },
        { zh: "乘数", en: "Multiplier" },
        { zh: "被除数", en: "Dividend" },
        { zh: "除数", en: "Divisor" },
        { zh: "幂", en: "Power" },
        { zh: "底数", en: "Base" },
        { zh: "指数", en: "Exponent" },
        { zh: "几何", en: "Geometry" },
        { zh: "点", en: "Point" },
        { zh: "线", en: "Line" },
        { zh: "线段", en: "Line Segment" },
        { zh: "角", en: "Angle" },
        { zh: "顶点", en: "Vertex" },
        { zh: "锐角", en: "Acute Angle" },
        { zh: "直角", en: "Right Angle" },
        { zh: "钝角", en: "Obtuse Angle" },
        { zh: "三角形", en: "Triangle" },
        { zh: "正方形", en: "Square" },
        { zh: "圆", en: "Circle" },
        { zh: "圆心", en: "Center" },
        { zh: "半径", en: "Radius" },
        { zh: "直径", en: "Diameter" },
        { zh: "扇形", en: "Sector" },
        { zh: "圆周率", en: "Pi" },
        { zh: "面积", en: "Area" },
        { zh: "体积", en: "Volume" },
        { zh: "容积", en: "Capacity" },
        { zh: "长方体", en: "Rectangular Prism" },
        { zh: "正方体", en: "Cube" },
        { zh: "圆柱体", en: "Cylinder" },
        { zh: "圆锥体", en: "Cone" },
        { zh: "球体", en: "Sphere" },
        { zh: "统计学", en: "Statistics" },
        { zh: "数据", en: "Data" },
        { zh: "总体", en: "Population" },
        { zh: "样本", en: "Sample" },
        { zh: "平均数", en: "Mean" },
        { zh: "中位数", en: "Median" },
        { zh: "众数", en: "Mode" },
        { zh: "图表", en: "Chart" },
        { zh: "条形图", en: "Bar Graph" },
        { zh: "折线图", en: "Line Graph" },
        { zh: "饼图", en: "Pie Chart" },
        { zh: "散点图", en: "Scatter Plot" },
        { zh: "长度", en: "Length" },
        { zh: "宽度", en: "Width" },
        { zh: "高度", en: "Height" },
        { zh: "深度", en: "Depth" },
        { zh: "毫米", en: "Millimeter" },
        { zh: "厘米", en: "Centimeter" },
        { zh: "分米", en: "Decimeter" },
        { zh: "米", en: "Meter" },
        { zh: "千米", en: "Kilometer" },
        { zh: "克", en: "Gram" },
        { zh: "千克", en: "Kilogram" },
        { zh: "吨", en: "Ton" },
        { zh: "毫升", en: "Milliliter" },
        { zh: "升", en: "Liter" },
        { zh: "秒", en: "Second" },
        { zh: "分钟", en: "Minute" },
        { zh: "小时", en: "Hour" },
        { zh: "角度", en: "Degree" },
        { zh: "利润", en: "Profit" },
        { zh: "亏损", en: "Loss" },
        { zh: "折扣", en: "Discount" },
        { zh: "本金", en: "Principal" },
        { zh: "利息", en: "Interest" },
        { zh: "利率", en: "Interest Rate" },
        { zh: "比例尺", en: "Scale" },
        { zh: "正比例", en: "Direct Proportion" },
        { zh: "反比例", en: "Inverse Proportion" }
    ],
    3: [ // Level 3: Grade 6 appropriate spelling (High frequency, easier to spell)
        { zh: "圆", en: "Circle" },
        { zh: "面积", en: "Area" },
        { zh: "体积", en: "Volume" },
        { zh: "比", en: "Ratio" },
        { zh: "比例", en: "Proportion" },
        { zh: "总数", en: "Total" },
        { zh: "数字", en: "Number" },
        { zh: "长度", en: "Length" },
        { zh: "高度", en: "Height" },
        { zh: "宽度", en: "Width" },
        { zh: "一半", en: "Half" },
        { zh: "数据", en: "Data" },
        { zh: "图表", en: "Chart" },
        { zh: "速度", en: "Speed" },
        { zh: "时间", en: "Time" },
        { zh: "等于", en: "Equal" },
        { zh: "距离", en: "Distance" },
        { zh: "整数", en: "Integer" },
        { zh: "偶数", en: "Even" },
        { zh: "奇数", en: "Odd" },
        { zh: "加", en: "Add" },
        { zh: "减", en: "Subtract" },
        { zh: "乘", en: "Multiply" },
        { zh: "除", en: "Divide" },
        { zh: "和", en: "Sum" },
        { zh: "差", en: "Difference" },
        { zh: "积", en: "Product" },
        { zh: "商", en: "Quotient" },
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
        { zh: "整数", en: "Integer" },
        { zh: "正数", en: "Positive Number" },
        { zh: "负数", en: "Negative Number" },
        { zh: "绝对值", en: "Absolute Value" },
        { zh: "有理数", en: "Rational Number" },
        { zh: "偶数", en: "Even Number" },
        { zh: "奇数", en: "Odd Number" },
        { zh: "质数", en: "Prime Number" },
        { zh: "合数", en: "Composite Number" },
        { zh: "因数", en: "Factor" },
        { zh: "倍数", en: "Multiple" },
        { zh: "最大公因数", en: "Greatest Common Factor" },
        { zh: "最小公倍数", en: "Least Common Multiple" },
        { zh: "倒数", en: "Reciprocal" },
        { zh: "分子", en: "Numerator" },
        { zh: "分母", en: "Denominator" },
        { zh: "真分数", en: "Proper Fraction" },
        { zh: "假分数", en: "Improper Fraction" },
        { zh: "带分数", en: "Mixed Number" },
        { zh: "约分", en: "Simplify" },
        { zh: "通分", en: "Common Denominator" },
        { zh: "算术", en: "Arithmetic" },
        { zh: "加法", en: "Addition" },
        { zh: "减法", en: "Subtraction" },
        { zh: "乘法", en: "Multiplication" }
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

// Spelling game state
let spellingWords = [];
let currentSpellIndex = 0;
let spellScore = 0;

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
    
    // Level 1: 6 pairs, Level 2: 10 pairs (dynamic), Level 3: 10 words (spelling)
    PAIRS_PER_GAME = level === 1 ? 6 : 10;
    
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
    const spellingBoard = document.getElementById('spelling-board');
    const overlay = document.getElementById('game-overlay');
    const progressContainer = document.getElementById('progress-container');
    const toast = document.getElementById('vocab-toast');
    
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    toast.classList.add('hidden');
    
    // Timer setup
    clearInterval(gameTimer);
    gameSeconds = 0;
    document.getElementById('game-timer').innerText = `0s`;
    gameTimer = setInterval(() => {
        gameSeconds++;
        document.getElementById('game-timer').innerText = `${gameSeconds}s`;
    }, 1000);

    if (currentVocabLevel === 3) {
        // --- LEVEL 3: Spelling Mode ---
        board.classList.add('hidden');
        spellingBoard.classList.remove('hidden');
        spellingBoard.classList.add('flex');
        progressContainer.classList.add('hidden'); // Hide matching progress
        
        // Pick random words for spelling
        let shuffledDict = [...vocabDictionary[3]];
        shuffleArray(shuffledDict);
        spellingWords = shuffledDict.slice(0, PAIRS_PER_GAME);
        
        currentSpellIndex = 0;
        spellScore = 0;
        document.getElementById('spell-score').innerText = '0';
        document.getElementById('spell-feedback').classList.add('hidden');
        
        loadNextSpellingWord();
        
    } else {
        // --- LEVEL 1 & 2: Matching Mode ---
        board.classList.remove('hidden');
        spellingBoard.classList.add('hidden');
        spellingBoard.classList.remove('flex');
        progressContainer.classList.remove('hidden');
        board.innerHTML = '';
        
        // Adjust grid based on pairs
        if (PAIRS_PER_GAME === 6) {
            board.className = "grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl min-h-[400px] max-w-3xl mx-auto";
        } else {
            // 10 pairs (20 cards)
            board.className = "grid grid-cols-4 md:grid-cols-5 gap-3 p-4 bg-slate-50 rounded-xl min-h-[400px]";
        }

        // Reset state
        matchedPairs = 0;
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        document.getElementById('game-progress').innerText = `0 / ${PAIRS_PER_GAME}`;
        
        // Pick random words
        let shuffledDict = [...vocabDictionary[currentVocabLevel]];
        shuffleArray(shuffledDict);
        let selectedWords = shuffledDict.slice(0, PAIRS_PER_GAME);
        
        renderCards(selectedWords);
    }
}

function renderCards(wordsList) {
    const board = document.getElementById('vocab-board');
    board.innerHTML = '';
    vocabCards = [];
    
    wordsList.forEach((word, index) => {
        vocabCards.push({ id: word.en + '_zh', text: word.zh, type: 'zh', matchId: word.en });
        vocabCards.push({ id: word.en + '_en', text: word.en, type: 'en', matchId: word.en });
    });
    
    shuffleArray(vocabCards);
    
    vocabCards.forEach(card => {
        const cardEl = document.createElement('div');
        // Make text slightly smaller for grid-cols-5
        const textSize = PAIRS_PER_GAME === 10 ? 'text-sm md:text-base' : 'text-lg';
        cardEl.className = `vocab-card bg-white h-20 md:h-24 rounded-xl shadow-sm border-2 border-slate-200 flex items-center justify-center ${textSize} font-bold text-gray-700 cursor-pointer transition transform hover:-translate-y-1 hover:shadow-md select-none text-center px-2`;
        cardEl.dataset.id = card.id;
        cardEl.dataset.matchId = card.matchId;
        cardEl.dataset.type = card.type;
        cardEl.innerText = card.text;
        
        cardEl.addEventListener('click', flipCard);
        board.appendChild(cardEl);
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
    
    firstCard.classList.add('matched', 'bg-green-100', 'border-green-400', 'text-green-700', 'opacity-0', 'pointer-events-none');
    secondCard.classList.add('matched', 'bg-green-100', 'border-green-400', 'text-green-700', 'opacity-0', 'pointer-events-none');
    
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
        
        if (currentVocabLevel === 2) {
            handleLevel2Shuffle();
        } else {
            resetBoard();
        }
    }, 800);
}

function handleLevel2Shuffle() {
    const toast = document.getElementById('vocab-toast');
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2000);

    // Find all unmatched words currently on board
    let unmatchedIds = new Set();
    document.querySelectorAll('.vocab-card:not(.matched)').forEach(card => {
        unmatchedIds.add(card.dataset.matchId);
    });

    // Replace 1 pair with a new random one from dictionary that isn't already on board or matched
    let allDictWords = vocabDictionary[2];
    let matchedIds = new Set(Array.from(document.querySelectorAll('.vocab-card.matched')).map(c => c.dataset.matchId));
    
    let availableNewWords = allDictWords.filter(w => !unmatchedIds.has(w.en) && !matchedIds.has(w.en));
    
    let currentUnmatchedWords = allDictWords.filter(w => unmatchedIds.has(w.en));
    
    if (availableNewWords.length > 0 && currentUnmatchedWords.length > 0) {
        // Remove one existing unmatched pair
        let wordToRemove = currentUnmatchedWords[Math.floor(Math.random() * currentUnmatchedWords.length)];
        currentUnmatchedWords = currentUnmatchedWords.filter(w => w.en !== wordToRemove.en);
        
        // Add one new pair
        let wordToAdd = availableNewWords[Math.floor(Math.random() * availableNewWords.length)];
        currentUnmatchedWords.push(wordToAdd);
    }
    
    // Re-render only unmatched cards (keep empty slots for matched ones)
    const board = document.getElementById('vocab-board');
    
    // Create new DOM elements for matched cards (using outerHTML drops event listeners)
    let matchedCardsHTML = [];
    let matchedNodes = [];
    document.querySelectorAll('.vocab-card.matched').forEach(c => {
        matchedNodes.push(c.cloneNode(true)); // cloneNode drops listeners, but they are pointer-events-none anyway
    });
    
    let newCardsData = [];
    currentUnmatchedWords.forEach(word => {
        newCardsData.push({ id: word.en + '_zh', text: word.zh, type: 'zh', matchId: word.en });
        newCardsData.push({ id: word.en + '_en', text: word.en, type: 'en', matchId: word.en });
    });
    
    shuffleArray(newCardsData);
    
    // Clear board and append
    board.innerHTML = '';
    
    // Put matched cards back
    matchedNodes.forEach(node => {
        board.appendChild(node);
    });
    
    // Put new unmatched cards
    newCardsData.forEach(card => {
        const cardEl = document.createElement('div');
        const textSize = PAIRS_PER_GAME === 10 ? 'text-sm md:text-base' : 'text-lg';
        cardEl.className = `vocab-card bg-white h-20 md:h-24 rounded-xl shadow-sm border-2 border-slate-200 flex items-center justify-center ${textSize} font-bold text-gray-700 cursor-pointer transition transform hover:-translate-y-1 hover:shadow-md select-none text-center px-2`;
        cardEl.dataset.id = card.id;
        cardEl.dataset.matchId = card.matchId;
        cardEl.dataset.type = card.type;
        cardEl.innerText = card.text;
        cardEl.addEventListener('click', flipCard);
        board.appendChild(cardEl);
    });
    
    // Shuffle DOM elements to mix matched (empty spaces) and unmatched
    let allNodes = Array.from(board.children);
    shuffleArray(allNodes);
    board.innerHTML = '';
    allNodes.forEach(node => board.appendChild(node));

    resetBoard();
}
    
// --- Level 3 Spelling Logic ---
function loadNextSpellingWord() {
    if (currentSpellIndex >= PAIRS_PER_GAME) {
        gameOver();
        return;
    }
    
    const wordObj = spellingWords[currentSpellIndex];
    document.getElementById('spell-zh-word').innerText = wordObj.zh;
    document.getElementById('spell-input').value = '';
    document.getElementById('spell-input').focus();
    document.getElementById('spell-feedback').classList.add('hidden');
}

function checkSpelling() {
    const inputEl = document.getElementById('spell-input');
    const userSpelling = inputEl.value.trim().toLowerCase();
    
    if (!userSpelling) return;
    
    const currentWord = spellingWords[currentSpellIndex];
    const correctSpelling = currentWord.en.toLowerCase();
    
    const feedback = document.getElementById('spell-feedback');
    feedback.classList.remove('hidden');
    
    if (userSpelling === correctSpelling) {
        feedback.innerHTML = "✅ 拼写正确！";
        feedback.className = "mt-6 font-bold text-xl px-6 py-4 rounded-xl text-center w-full max-w-md bg-green-100 text-green-700 border border-green-200";
        spellScore += 10;
        
        // Animate score update
        const scoreEl = document.getElementById('spell-score');
        scoreEl.innerText = spellScore;
        scoreEl.classList.add('scale-125', 'text-green-500');
        setTimeout(() => scoreEl.classList.remove('scale-125', 'text-green-500'), 300);
        
        setTimeout(() => {
            currentSpellIndex++;
            loadNextSpellingWord();
        }, 1000);
        
    } else {
        feedback.innerHTML = `❌ 拼写错误。<br><span class="text-lg font-normal mt-2 block">正确拼写是：<strong>${currentWord.en}</strong></span>`;
        feedback.className = "mt-6 font-bold text-xl px-6 py-4 rounded-xl text-center w-full max-w-md bg-red-100 text-red-700 border border-red-200";
        
        setTimeout(() => {
            currentSpellIndex++;
            loadNextSpellingWord();
        }, 3000);
    }
}

document.getElementById('spell-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkSpelling();
    }
});

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function gameOver() {
    clearInterval(gameTimer);
    setTimeout(() => {
        document.getElementById('vocab-board').classList.add('hidden');
        document.getElementById('spelling-board').classList.add('hidden');
        document.getElementById('spelling-board').classList.remove('flex');
        
        const overlay = document.getElementById('game-overlay');
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');
        
        const levelNames = { 1: "「级别 1 (基础配对)」", 2: "「级别 2 (进阶配对)」", 3: "「级别 3 (拼写挑战)」" };
        document.getElementById('final-level').innerText = levelNames[currentVocabLevel];
        document.getElementById('final-time').innerText = gameSeconds;
        
        // Optionally show spell score
        if (currentVocabLevel === 3) {
            document.getElementById('final-time').parentElement.innerHTML = `你用时 <span id="final-time" class="font-bold text-blue-600">${gameSeconds}</span> 秒完成了 <span id="final-level" class="font-bold">${levelNames[3]}</span>。<br>得分：<span class="text-2xl text-rose-600 font-bold mt-2 inline-block">${spellScore}</span> / ${PAIRS_PER_GAME * 10}`;
        } else {
            document.getElementById('final-time').parentElement.innerHTML = `你用时 <span id="final-time" class="font-bold text-blue-600">${gameSeconds}</span> 秒完成了 <span id="final-level" class="font-bold">${levelNames[currentVocabLevel]}</span> 的词汇匹配。`;
        }
    }, 500);
}