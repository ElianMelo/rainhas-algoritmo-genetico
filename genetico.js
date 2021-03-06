
// Tamanho da população
// // Seleção com elitismo
// // Seleção sem elitismo
// Probabilidade de cruzamento
// // Número de cortes
// Probabilidade de mutação
// Máximo de Gerações

var populationSize = 1000;
var maxGenerations = 100;
var mutationChance = 0;
var reproduceChance = 0;
var generationNow = 1;
var population = [];
var childs = [];
var populationScore = [];
var previousGeneration = 0;

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
    { x: 1, y: 0 }, // Direita
    { x: 1, y: 1 }, // Diagonal inferior direita
    { x: 0, y: 1 }, // Baixo
    { x: -1, y: 1 }, // Diagonal inferior esquerda
    { x: -1, y: 0 }, // Esquerda
]
function calcular() {
    clear();

    populationSize = $('#populationSize').val();
    maxGenerations = $('#maxGenerations').val();
    mutationChance = $('#mutationChance').val();
    reproduceChance = $('#reproduceChance').val();
    
    if(!populationSize || !maxGenerations || !mutationChance || !reproduceChance){
        alert('Preencha todos os parâmetros!')
        return;
    }

    mutationChance =  mutationChance / 100;
    reproduceChance = reproduceChance / 100;

    htmlBoard = $('#boardContainer');
    htmlBoard.html('');

    init();
}

function clear() {
    generationNow = 1;
    population = [];
    childs = [];
    populationScore = [];
    previousGeneration = 0;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNumberBetween(min,max){
    return Math.random()*(max-min+1)+min;
}

function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i + 1)) != -1) {
        indexes.push(i);
    }
    return indexes;
}

function createStyleBoard(populationToRender) {
    if(previousGeneration != generationNow) {

        boardContainer = $('#boardContainer');
        container = $('<div></div>');
    
        h1 = $('<h1>Resposta encontrada</h1>');
        h2 = $(`<h2>Geração: ${generationNow}</h2>`);
    
        container.append(h1);
        container.append(h2);
    
        htmlBoard = $('<div class="board"></div>');
    
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
    
            boardContainer.append(container);
            boardContainer.append(htmlBoard);
        }
        previousGeneration = generationNow; 
    }
}

function init() {
    generatePopulation();
   
    while(generationNow <= maxGenerations) {
        analyzeSubject();
        ordenate();
        reproduce();
        mutation();
        generationNow++;
    }

    analyzeSubject();
    ordenate();

    console.log(populationScore[populationScore.length-1].score); 
    console.log(populationScore[0].score); 
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
            console.log("Resposta encontrada. Geração: " + generationNow)
            createStyleBoard(subject);
        }

        media = (totalDist / 56) - 4;
        attacks = (1 / attacks) * 4;

        score = (media + attacks).toFixed(4);

        populationScore.push(
            {
                subject,
                score
            }
        )

    }
}

function ordenate() {
    populationScore.sort((a, b) => {
        if (a.score > b.score) {
            return 1;
        }
        if (a.score < b.score) {
            return -1;
        }
    })
    // console.log(populationScore[0]);
    // console.log(populationScore[populationScore.length-1]);
    // createStyleBoard(populationScore[populationScore.length-1].subject);
}

function reproduce() {
    childs = [];
    let half = (populationScore.length / 2) - 1;
    let end = populationScore.length - 1;
    let usedsSubjectsBetter = [];
    let usedsSubjectsWorst = [];
    while(childs.length < end) {
        let subjectBetter;
        let subjectWorst;

        do {
            subjectBetter = getRandomInt(0, half);
        } while (usedsSubjectsBetter.includes(subjectBetter))
        
        do {
            subjectWorst = getRandomInt(half + 1, end);
        } while (usedsSubjectsWorst.includes(subjectWorst))

        usedsSubjectsBetter.push(subjectBetter);
        usedsSubjectsWorst.push(subjectWorst);

        let betterSubject = populationScore[subjectBetter].subject;

        let halfSub = (betterSubject.length / 2);
        let endSub = betterSubject.length;

        let firstHalfBetter = betterSubject.slice(0, halfSub)
        let secondHalfBetter = betterSubject.slice(halfSub, endSub)
        
        let worstSubject = populationScore[subjectWorst].subject;

        halfSub = (worstSubject.length / 2);
        endSub = worstSubject.length;

        let firstHalfWorst = worstSubject.slice(0, halfSub)
        let secondHalfWorst = worstSubject.slice(halfSub, endSub)

        let coin = getRandomInt(0, 1);

        let hasReproduce = Math.random();

        if(hasReproduce < reproduceChance) {
            if(coin == 0) {
                childs.push([].concat(firstHalfBetter, secondHalfWorst));
                childs.push([].concat(firstHalfWorst, secondHalfBetter));
            } else {
                childs.push([].concat(secondHalfWorst, firstHalfBetter));
                childs.push([].concat(secondHalfBetter, firstHalfWorst));
            }
        } else {
            childs.push([].concat(firstHalfBetter, secondHalfBetter));
            childs.push([].concat(firstHalfWorst, secondHalfWorst));
        }
        
    }
}

function mutation() {

    childs.forEach((subject) => {
        let hasMutation = Math.random();

        if(hasMutation < mutationChance) {
            let queens = getAllIndexes(subject, 1);
            let queenPos = getRandomInt(0, 7);
    
            let newQueen = getRandomInt(lineRanges[queenPos][0], lineRanges[queenPos][1]);
            let oldQueen = queens[queenPos];
    
            subject[oldQueen] = 0;
            subject[newQueen] = 1;
        }
    })

    population = childs;
    populationScore = [];
}








