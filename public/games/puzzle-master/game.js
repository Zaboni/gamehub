// Game state
let currentLevel = 1;
let score = 0;
let moves = 0;
let startTime = Date.now();
let gameTimer = null;
let selectedTiles = [];
let currentPuzzle = null;
let hintsUsed = 0;

// Puzzle types and generators
const puzzleTypes = {
    NUMBER_SEQUENCE: 'number_sequence',
    PATTERN_MATCHING: 'pattern_matching',
    LOGIC_GRID: 'logic_grid',
    COLOR_SEQUENCE: 'color_sequence',
    MATH_PUZZLE: 'math_puzzle'
};

// Puzzle definitions for each level
const puzzles = [
    // Level 1: Simple number sequence
    {
        type: puzzleTypes.NUMBER_SEQUENCE,
        instruction: "Complete the number sequence",
        detail: "Find the missing number in the pattern",
        grid: [2, 4, 6, '?', 10, 12],
        answer: [8],
        gridSize: { cols: 6, rows: 1 },
        options: [7, 8, 9, 10]
    },
    
    // Level 2: Pattern matching
    {
        type: puzzleTypes.PATTERN_MATCHING,
        instruction: "Find the matching pattern",
        detail: "Select the tile that completes the pattern",
        grid: ['🔴', '🔵', '🔴', '🔵', '🔴', '?'],
        answer: ['🔵'],
        gridSize: { cols: 6, rows: 1 },
        options: ['🔴', '🔵', '🟡', '🟢']
    },
    
    // Level 3: Math puzzle
    {
        type: puzzleTypes.MATH_PUZZLE,
        instruction: "Solve the equation",
        detail: "Find the missing number to complete the equation",
        grid: [3, '+', 5, '=', '?'],
        answer: [8],
        gridSize: { cols: 5, rows: 1 },
        options: [6, 7, 8, 9]
    },
    
    // Level 4: Color sequence
    {
        type: puzzleTypes.COLOR_SEQUENCE,
        instruction: "Complete the color pattern",
        detail: "What color comes next in the sequence?",
        grid: ['🟥', '🟦', '🟥', '🟦', '🟥', '?'],
        answer: ['🟦'],
        gridSize: { cols: 6, rows: 1 },
        options: ['🟥', '🟦', '🟨', '🟩']
    },
    
    // Level 5: Logic grid
    {
        type: puzzleTypes.LOGIC_GRID,
        instruction: "Complete the logic grid",
        detail: "Find the pattern in rows and columns",
        grid: [
            '⭐', '⭐', '🌙',
            '🌙', '⭐', '⭐',
            '⭐', '?', '🌙'
        ],
        answer: ['🌙'],
        gridSize: { cols: 3, rows: 3 },
        options: ['⭐', '🌙', '☀️', '🌟']
    },
    
    // Level 6: Advanced number sequence
    {
        type: puzzleTypes.NUMBER_SEQUENCE,
        instruction: "Find the pattern in the sequence",
        detail: "Each number follows a mathematical rule",
        grid: [1, 4, 9, 16, '?', 36],
        answer: [25],
        gridSize: { cols: 6, rows: 1 },
        options: [20, 23, 25, 28]
    },
    
    // Level 7: Complex pattern
    {
        type: puzzleTypes.PATTERN_MATCHING,
        instruction: "Identify the complex pattern",
        detail: "Look for the repeating sequence",
        grid: ['A', 'B', 'C', 'A', 'B', 'C', 'A', '?'],
        answer: ['B'],
        gridSize: { cols: 8, rows: 1 },
        options: ['A', 'B', 'C', 'D']
    },
    
    // Level 8: Math sequence
    {
        type: puzzleTypes.MATH_PUZZLE,
        instruction: "Solve the mathematical pattern",
        detail: "Find the rule connecting the numbers",
        grid: [2, 6, 18, '?', 162],
        answer: [54],
        gridSize: { cols: 5, rows: 1 },
        options: [48, 54, 60, 66]
    }
];

// Initialize game
function initGame() {
    startTime = Date.now();
    startTimer();
    loadLevel(currentLevel);
}

// Timer functions
function startTimer() {
    gameTimer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('timerDisplay').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function stopTimer() {
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
}

// Load level
function loadLevel(level) {
    if (level > puzzles.length) {
        completeGame();
        return;
    }
    
    currentPuzzle = puzzles[level - 1];
    selectedTiles = [];
    moves = 0;
    hintsUsed = 0;
    
    updateDisplay();
    createPuzzleGrid();
    updateInstructions();
    
    // Reset buttons
    document.getElementById('checkBtn').style.display = 'inline-block';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('hintBtn').disabled = false;
}

// Create puzzle grid
function createPuzzleGrid() {
    const grid = document.getElementById('puzzleGrid');
    const puzzle = currentPuzzle;
    
    // Set grid layout
    grid.style.gridTemplateColumns = `repeat(${puzzle.gridSize.cols}, 1fr)`;
    grid.innerHTML = '';
    
    // Create tiles
    puzzle.grid.forEach((item, index) => {
        const tile = document.createElement('div');
        tile.className = 'puzzle-tile';
        tile.dataset.index = index;
        
        if (item === '?') {
            // This is a question tile - make it selectable
            tile.textContent = '?';
            tile.classList.add('question-tile');
            tile.onclick = () => showOptions(index);
        } else {
            // Regular tile
            tile.textContent = item;
            tile.onclick = null;
        }
        
        grid.appendChild(tile);
    });
}

// Show options for question tile
function showOptions(tileIndex) {
    const tile = document.querySelector(`[data-index="${tileIndex}"]`);
    const puzzle = currentPuzzle;
    
    // Create options container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    optionsContainer.style.cssText = `
        position: absolute;
        background: white;
        border: 2px solid #2196f3;
        border-radius: 8px;
        padding: 10px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 5px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    // Position options near the tile
    const rect = tile.getBoundingClientRect();
    optionsContainer.style.left = rect.left + 'px';
    optionsContainer.style.top = (rect.bottom + 10) + 'px';
    
    // Create option buttons
    puzzle.options.forEach(option => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'puzzle-tile';
        optionBtn.textContent = option;
        optionBtn.style.minHeight = '40px';
        optionBtn.onclick = () => selectOption(tileIndex, option, optionsContainer);
        optionsContainer.appendChild(optionBtn);
    });
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
        position: absolute;
        top: -10px;
        right: -10px;
        background: #f44336;
        color: white;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        cursor: pointer;
        font-size: 12px;
    `;
    closeBtn.onclick = () => document.body.removeChild(optionsContainer);
    optionsContainer.appendChild(closeBtn);
    
    // Remove existing options
    const existing = document.querySelector('.options-container');
    if (existing) {
        document.body.removeChild(existing);
    }
    
    document.body.appendChild(optionsContainer);
}

// Select option
function selectOption(tileIndex, option, optionsContainer) {
    const tile = document.querySelector(`[data-index="${tileIndex}"]`);
    tile.textContent = option;
    tile.classList.add('selected');
    
    selectedTiles[tileIndex] = option;
    moves++;
    updateDisplay();
    
    document.body.removeChild(optionsContainer);
}

// Check answer
function checkAnswer() {
    if (selectedTiles.length === 0) {
        alert('Please select an answer first!');
        return;
    }
    
    const puzzle = currentPuzzle;
    let correct = true;
    
    // Check each selected answer
    puzzle.grid.forEach((item, index) => {
        if (item === '?' && selectedTiles[index] !== undefined) {
            const tile = document.querySelector(`[data-index="${index}"]`);
            if (puzzle.answer.includes(selectedTiles[index])) {
                tile.classList.remove('selected');
                tile.classList.add('correct');
            } else {
                tile.classList.remove('selected');
                tile.classList.add('incorrect');
                correct = false;
            }
        }
    });
    
    if (correct) {
        // Calculate score based on level, moves, and hints
        const baseScore = currentLevel * 100;
        const moveBonus = Math.max(0, 50 - moves * 5);
        const hintPenalty = hintsUsed * 20;
        const levelScore = baseScore + moveBonus - hintPenalty;
        
        score += Math.max(levelScore, 10);
        updateDisplay();
        
        document.getElementById('checkBtn').style.display = 'none';
        document.getElementById('nextBtn').style.display = 'inline-block';
        
        // Show success message
        setTimeout(() => {
            alert(`Correct! +${levelScore} points`);
        }, 500);
    } else {
        alert('Not quite right. Try again!');
        // Reset incorrect tiles after a delay
        setTimeout(() => {
            document.querySelectorAll('.incorrect').forEach(tile => {
                tile.classList.remove('incorrect');
                tile.textContent = '?';
                const index = parseInt(tile.dataset.index);
                selectedTiles[index] = undefined;
            });
        }, 1000);
    }
}

// Show hint
function showHint() {
    const puzzle = currentPuzzle;
    let hintText = '';
    
    switch (puzzle.type) {
        case puzzleTypes.NUMBER_SEQUENCE:
            if (currentLevel === 1) {
                hintText = 'The numbers increase by 2 each time';
            } else if (currentLevel === 6) {
                hintText = 'These are perfect squares: 1², 2², 3², 4², ?², 6²';
            } else if (currentLevel === 8) {
                hintText = 'Each number is multiplied by 3';
            }
            break;
        case puzzleTypes.PATTERN_MATCHING:
            hintText = 'Look for the repeating pattern in the sequence';
            break;
        case puzzleTypes.MATH_PUZZLE:
            if (currentLevel === 3) {
                hintText = 'Simple addition: 3 + 5 = ?';
            }
            break;
        case puzzleTypes.COLOR_SEQUENCE:
            hintText = 'The colors alternate in a simple pattern';
            break;
        case puzzleTypes.LOGIC_GRID:
            hintText = 'Each row and column should have the same number of each symbol';
            break;
    }
    
    if (hintText) {
        alert('Hint: ' + hintText);
        hintsUsed++;
        document.getElementById('hintBtn').disabled = true;
    }
}

// Next level
function nextLevel() {
    currentLevel++;
    loadLevel(currentLevel);
}

// Update display
function updateDisplay() {
    document.getElementById('levelDisplay').textContent = currentLevel;
    document.getElementById('scoreDisplay').textContent = score;
    document.getElementById('movesDisplay').textContent = moves;
}

// Update instructions
function updateInstructions() {
    const puzzle = currentPuzzle;
    document.getElementById('instructionText').textContent = puzzle.instruction;
    document.getElementById('instructionDetail').textContent = puzzle.detail;
}

// Complete game
function completeGame() {
    stopTimer();
    const finalTime = document.getElementById('timerDisplay').textContent;
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalTime').textContent = finalTime;
    document.getElementById('gameComplete').style.display = 'block';
}

// Restart game
function restartGame() {
    currentLevel = 1;
    score = 0;
    moves = 0;
    selectedTiles = [];
    hintsUsed = 0;
    
    document.getElementById('gameComplete').style.display = 'none';
    
    stopTimer();
    startTime = Date.now();
    startTimer();
    
    loadLevel(currentLevel);
}

// Initialize game when page loads
window.addEventListener('load', () => {
    initGame();
});