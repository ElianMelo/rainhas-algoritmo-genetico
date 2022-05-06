function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let populationSize = 10;
let population = [];

lineRanges = [
    [0, 7],
    [8, 15],
    [16, 23],
    [24, 31],
    [32, 39],
    [40, 47],
    [48, 55],
    [56, 63]
]

function createStyleBoard() {
    htmlBoard = $("#board");

    for(b of population[0]) {
        if(b == 0) {
            box = $("<div class='box'></div>");
        } else {
            box = $("<div class='box'></div>");
            img = $("<img src='https://thumbs.dreamstime.com/b/vector-outline-queen-chess-icon-white-background-176235459.jpg'>")
            box.append(img);
        }
        htmlBoard.append(box);
    }
}

function generatePopulation() {
    for (let i = 0; i < populationSize; i++) {
        let board = new Array(64).fill(0);
        let filledColumn = [];
        lineNow = 0;
        while (filledColumn.length < 8){
            let currentQueen;
            let col;
            do {
                currentQueen = getRandomInt(lineRanges[lineNow][0], lineRanges[lineNow][1]);
                col = currentQueen - lineRanges[lineNow][0];
            } while(filledColumn.includes(col))
            filledColumn.push(col);
            board[currentQueen] = 1;
            lineNow += 1;
        }
        population.push(board);
    }
    
    createStyleBoard();
    console.log(population);
}

generatePopulation();



