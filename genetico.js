function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i + 1)) != -1) {
        indexes.push(i);
    }
    return indexes;
}

// Tamanho da população
// Seleção com elitismo
// Seleção sem elitismo
// Probabilidade de cruzamento
// Número de cortes
// Probabilidade de mutação
// Máximo de Gerações

var populationSize = 50000;
var population = [];

var lineRanges = [
    [0, 7],
    [8, 15],
    [16, 23],
    [24, 31],
    [32, 39],
    [40, 47],
    [48, 55],
    [56, 63]
]

var directionsSum = [
    { x: -1, y: -1 }, // Diagonal superior esquerda
    { x: 0, y: -1 }, // Cima
    { x: 1, y: -1 }, // Diagonal superior direita
    { x: 1, y: 1 }, // Diagonal inferior direita
    { x: 0, y: 1 }, // Baixo
    { x: -1, y: 1 }, // Diagonal inferior esquerda
]

var thebest = [];

function createStyleBoard(populationToRender) {
    htmlBoard = $("#board");

    rule = false;
    for (const [index, b] of populationToRender.entries()) {

        if ([8, 16, 24, 32, 40, 48, 56].includes(index)) {
            rule = !rule;
        }

        let black = '';

        if (rule) {
            black = index % 2 == 0 ? '' : 'black';
        } else {
            black = index % 2 == 0 ? 'black' : '';
        }


        if (b == 0) {
            box = $(`<div class='box ${black}'></div>`);
        } else {
            box = $(`<div class='box ${black}' id=${index}></div>`);
            img = $("<img src='./queen.png'>")
            box.append(img);
        }
        htmlBoard.append(box);
    }
}

function init() {
    generatePopulation();
}

function generatePopulation() {
    for (let i = 0; i < populationSize; i++) {
        let board = new Array(64).fill(0);
        let filledColumn = [];
        lineNow = 0;
        while (filledColumn.length < 8) {
            let currentQueen;
            let col;
            do {
                currentQueen = getRandomInt(lineRanges[lineNow][0], lineRanges[lineNow][1]);
                col = currentQueen - lineRanges[lineNow][0];
            } while (filledColumn.includes(col))
            filledColumn.push(col);
            board[currentQueen] = 1;
            lineNow += 1;
        }
        population.push(board);
    }

    // createStyleBoard(population[0]);
    analyzeSubject();
}

function analyzeSubject() {
    for (let subject of population) {
        let queens = getAllIndexes(subject, 1);

        let queensCord = [];
        for (queen of queens) {
            let x = queen % 8;
            let y = Math.floor(queen / 8);
            let cord = {
                x, y
            }
            queensCord.push(cord);
        }

        let attacks = 0;
        let totalDist = 0;
        let dist;
        let media;
        for (cord of queensCord) {

            for (others of queensCord) {
                if (cord.x == others.x && cord.y == others.y) {
                    continue;
                }
                dist = Math.sqrt(Math.pow((others.x - cord.x), 2) + Math.pow((others.y - cord.y), 2))
                totalDist += dist;
            }

            for (let dir of directionsSum) {
                let valid = true;
                let newCord = {
                    x: cord.x + dir.x,
                    y: cord.y + dir.y
                }
                while (valid) {
                    if (newCord.x < 0 || newCord.x > 7 || newCord.y < 0 || newCord.y > 7) {
                        valid = false;
                        continue;
                    }
                    let position = (newCord.y * 8) + newCord.x;
                    let hasQueen = subject[position] == 1;
                    if (hasQueen) {
                        attacks += 1;
                        box = $(`#${position}`).addClass('red');
                        valid = false;
                        continue;
                    }

                    newCord = {
                        x: newCord.x + dir.x,
                        y: newCord.y + dir.y
                    }
                }
            }


        }

        if(attacks == 0) {
            console.log("Encontrou");
        }

        media = (totalDist / 56) - 4;
        attacks = (1 / attacks) * 4;

        pontuacao = (media + attacks).toFixed(4);

        thebest.push(
            {
                subject,
                pontuacao
            }
        )

    }
    ordenate();
}

function ordenate() {
    thebest.sort((a, b) => {
        if (a.pontuacao > b.pontuacao) {
            return 1;
        }
        if (a.pontuacao < b.pontuacao) {
            return -1;
        }
    })
    console.log(thebest[0]);
    console.log(thebest[thebest.length-1]);
    createStyleBoard(thebest[thebest.length-1].subject);
}

init();






