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

    rule = false;
    for(const [index, b] of population[0].entries()) {
        
        if([8, 16, 24, 32, 40, 48, 56].includes(index)) {
            rule = !rule;
        }

        let black = '';

        if(rule) {
            black = index % 2 == 0 ? '' : 'black';
        } else {
            black = index % 2 == 0 ? 'black' : '';
        }
        

        if(b == 0) {
            box = $(`<div class='box ${black}'></div>`);
        } else {
            box = $(`<div class='box ${black}'></div>`);
            img = $("<img src='./queen.png'>")
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



