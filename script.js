    let solution = [];
    let timerInterval;
    let seconds = 0;
    let lives = 3;
    function startTimer() {
        clearInterval(timerInterval);
        seconds = 0;
        document.getElementById("timer").innerText = "⏱ Time: 00:00";
        timerInterval = setInterval(() => {
            seconds++;

let mins = Math.floor(seconds / 60);
let secs = seconds % 60;

document.getElementById("timer").innerText =
`⏱ Time: ${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
        }, 1000);
    }

    function generateFullBoard() {
        solution = Array(9).fill().map(() => Array(9).fill(0));

        function isValid(board, row, col, num) {
            for (let i = 0; i < 9; i++) {
                if (board[row][i] === num || board[i][col] === num)
                    return false;
            }

            let boxRow = Math.floor(row / 3) * 3;
            let boxCol = Math.floor(col / 3) * 3;

            for (let r = 0; r < 3; r++)
                for (let c = 0; c < 3; c++)
                    if (board[boxRow + r][boxCol + c] === num)
                        return false;

            return true;
        }

        function fillBoard(board) {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (board[row][col] === 0) {
                        let nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
                        for (let num of nums) {
                            if (isValid(board, row, col, num)) {
                                board[row][col] = num;
                                if (fillBoard(board))
                                    return true;
                                board[row][col] = 0;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        }

        fillBoard(solution);
    }
function isSafe(board, row, col, num) {

    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) return false;
        if (board[i][col] === num) return false;
    }

    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(col / 3) * 3;

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[boxRow + r][boxCol + c] === num)
                return false;
        }
    }

    return true;
}

function countSolutions(board) {

    let bestRow = -1;
    let bestCol = -1;
    let minChoices = 10;

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {

            if (board[row][col] === "") {

                let choices = 0;

                for (let num = 1; num <= 9; num++) {
                    if (isSafe(board, row, col, num))
                        choices++;
                }

                if (choices === 0)
                    return 0;

                if (choices < minChoices) {
                    minChoices = choices;
                    bestRow = row;
                    bestCol = col;
                }
            }
        }
    }

    if (bestRow === -1)
        return 1;

    let total = 0;

    for (let num = 1; num <= 9; num++) {

        if (isSafe(board, bestRow, bestCol, num)) {

            board[bestRow][bestCol] = num;

            total += countSolutions(board);

            if (total > 1) {
                board[bestRow][bestCol] = "";
                return total;
            }

            board[bestRow][bestCol] = "";
        }
    }

    return total;
}
    function removeCells(difficulty) {

    let puzzle = solution.map(row => row.slice());

    let cells = [];

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            cells.push({row,col});
        }
    }

    cells.sort(() => Math.random() - 0.5);

    let removed = 0;

    for (let cell of cells) {

        if (removed >= difficulty)
            break;

        let row = cell.row;
        let col = cell.col;

        let backup = puzzle[row][col];

        puzzle[row][col] = "";

        let copy = puzzle.map(r => r.slice());

        if (countSolutions(copy) !== 1) {

            puzzle[row][col] = backup;

        } else {

            removed++;

        }

    }

    return puzzle;

}

    function drawBoard(puzzle) {
        const container = document.getElementById("sudoku");
        container.innerHTML = "";

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                let input = document.createElement("input");
                input.maxLength = 1;

                if (puzzle[row][col] !== "") {
                    input.value = puzzle[row][col];
                    input.readOnly = true;
                    input.classList.add("fixed");
                }

                input.dataset.row = row;
                input.dataset.col = col;

            input.addEventListener("focus",function(){

                highlightCells(this);

});

                if (row % 3 === 0)
                input.style.borderTop = "3px solid black";

                if (col % 3 === 0)
                input.style.borderLeft = "3px solid black";

                if (row === 8)
                input.style.borderBottom = "3px solid black";

                if (col === 8)
                input.style.borderRight = "3px solid black";
                
    input.addEventListener("keydown", function (e) {

    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {

        e.preventDefault();

        let row = parseInt(this.dataset.row);
        let col = parseInt(this.dataset.col);

        switch (e.key) {
            case "ArrowUp":
                row--;
                break;

            case "ArrowDown":
                row++;
                break;

            case "ArrowLeft":
                col--;
                break;

            case "ArrowRight":
                col++;
                break;
        }

        if (row >= 0 && row < 9 && col >= 0 && col < 9) {

            const next = document.querySelector(
                `input[data-row="${row}"][data-col="${col}"]`
            );

            if (next)
                next.focus();
        }

        return;
    }

    if (!this.readOnly && /^[1-9]$/.test(e.key)) {
        this.value = "";
    }

}); 

    input.addEventListener("input", function () {

    this.value = this.value.replace(/[^1-9]/g, "");

    if(this.value!=""){

        let row=parseInt(this.dataset.row);
        let col=parseInt(this.dataset.col);

        if(parseInt(this.value)!==solution[row][col]){

            lives--;

            document.getElementById("lives").innerHTML=
            "❤️".repeat(lives)+"🤍".repeat(3-lives);

            this.value="";

            if(lives===0){

                clearInterval(timerInterval);

                alert("💀 Game Over!");

                startGame();

                return;
            }
        }
    }

    checkWin();

});

                container.appendChild(input);
            }
        }
    }

    function highlightCells(selectedInput){

const inputs=document.querySelectorAll("#sudoku input");

inputs.forEach(cell=>{
cell.classList.remove("selected");
cell.classList.remove("highlight");
cell.classList.remove("same-number");
});

let row=parseInt(selectedInput.dataset.row);
let col=parseInt(selectedInput.dataset.col);

inputs.forEach(cell=>{

let r=parseInt(cell.dataset.row);
let c=parseInt(cell.dataset.col);

if(r===row||c===col)
cell.classList.add("highlight");

let box1=Math.floor(r/3);
let box2=Math.floor(c/3);

let box3=Math.floor(row/3);
let box4=Math.floor(col/3);

if(box1===box3&&box2===box4)
cell.classList.add("highlight");

});

selectedInput.classList.add("selected");

if(selectedInput.value!=""){

inputs.forEach(cell=>{

if(cell.value===selectedInput.value)
cell.classList.add("same-number");

});

selectedInput.classList.add("selected");

}

}

    function checkWin() {
        const inputs = document.querySelectorAll("#sudoku input");

        for (let input of inputs) {
            let row = input.dataset.row;
            let col = input.dataset.col;
            if (input.value == "" || parseInt(input.value) !== solution[row][col])
                return;
        }

        clearInterval(timerInterval);
        let mins=Math.floor(seconds/60);
let secs=seconds%60;

let current=
`${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

let difficulty=document.getElementById("difficulty").value;

let best=localStorage.getItem("best_"+difficulty);

if(best==null||seconds<
(parseInt(best.split(":")[0])*60+
parseInt(best.split(":")[1]))){

localStorage.setItem("best_"+difficulty,current);
loadBestTime();

}
       
    setTimeout(() => {
        alert(`🎉 You Won in ${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}!`);
},100);
    }

    function loadBestTime(){

    let difficulty=document.getElementById("difficulty").value;

    let best=localStorage.getItem("best_"+difficulty);

    if(best==null){

        document.getElementById("bestTime").innerHTML=
        "🏆 Best Time: --:--";

    }else{

        document.getElementById("bestTime").innerHTML=
        "🏆 Best Time: "+best;

    }

}

    function startGame() {
        lives = 3;
        document.getElementById("lives").innerHTML = "❤️❤️❤️";
        generateFullBoard();
        let difficulty = parseInt(document.getElementById("difficulty").value);
        let puzzle = removeCells(difficulty);
        drawBoard(puzzle);
        loadBestTime();
        startTimer();
    }

    startGame();