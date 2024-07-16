"use strict";

const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
let dropInterval = level();
let isGameRunning = false;

context.scale(20, 20);

// Cargar y dibujar la imagen de fondo
const backgroundImage = new Image();
backgroundImage.src = 'fondoTetris.jpg';  // Cambia esta ruta por la de tu imagen

backgroundImage.onload = function() {
    drawBackgroundImage();
};

function drawBackgroundImage() {
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Función para determinar el nivel de juego
function level() {
    const selectElement = document.getElementById('level');
    const selectedValue = selectElement.value;
    if (selectedValue === 'hard') {
        return 60;
    } else if (selectedValue === 'normal') {
        return 120;
    } else if (selectedValue === 'easy') {
        return 250;
    } else {
        return 0;
    }
}

// Función para crear una matriz
function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

// Función para crear las piezas del Tetrimino
function createPiece(type) {
    if (type === "I") {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === "L") {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    } else if (type === "J") {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
    } else if (type === "O") {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === "Z") {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === "S") {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === "T") {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
}

// Función para dibujar una matriz con bordes
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const color = colors[value];
                context.fillStyle = color;
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
                context.lineJoin = "round";
                context.strokeStyle = 'black';
                context.lineWidth = 0.1;
                context.strokeRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

// Función para fusionar el Tetrimino con la arena
function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

// Función para rotar una matriz
function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0) {
        matrix.forEach((row) => row.reverse());
    } else {
        matrix.reverse();
    }
}

// Función para verificar colisiones
function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

const colors = [
    null,
    "#ff0d72",
    "#0dc2ff",
    "#0dff72",
    "#f538ff",
    "#ff8e0d",
    "#ffe138",
    "#3877ff",
];

const arena = createMatrix(12, 20);
const player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0,
};

let dropCounter = 0;
let lastTime = 0;
let isPaused = false;
let animationId;

// Función para iniciar/reiniciar el juego
function startGame() {
    if (!isGameRunning) {
        playerReset();
        updateScore();
        update();
        pauseButton.disabled = false;
        startButton.innerText = "Reiniciar";
        isGameRunning = true;
    } else {
        player.score = 0;  // Reiniciar la puntuación al reiniciar el juego
    }
    playerReset();
    updateScore();
    context.clearRect(0, 0, canvas.width, canvas.height);
    arena.forEach((row) => row.fill(0));
    dropInterval = level();
}

const startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);

// Función para pausar/reanudar el juego
function pauseGame() {
    isPaused = !isPaused;
    if (isPaused) {
        cancelAnimationFrame(animationId);
        pauseButton.innerText = "Reanudar";
    } else {
        update();
        pauseButton.innerText = "Pausar";
    }
}

const pauseButton = document.getElementById("pauseButton");
pauseButton.addEventListener("click", pauseGame);

const stopButton = document.getElementById("stopButton");
stopButton.addEventListener("click", stopGame);

// Función para detener el juego
function stopGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    arena.forEach((row) => row.fill(0));
    playerReset();
    player.score = 0;
    updateScore();
    pauseButton.disabled = true;
    isGameRunning = false;
    startButton.innerHTML = "Iniciar Juego";
    pauseButton.innerHTML = "Pausar";
    pauseButton.disabled = true;
    isPaused = false;
    cancelAnimationFrame(animationId);
}

// Función para reiniciar el jugador
function playerReset() {
    const pieces = "TJLOSZI";
    player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
    player.pos.y = 0;
    player.pos.x = ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
    if (collide(arena, player)) {
        arena.forEach((row) => row.fill(0));
    }
}

// Función para actualizar la puntuación en la página web
function updateScore() {
    document.getElementById("score").innerText = "Puntuación: " + player.score;
}

// Evento para manejar la entrada del teclado
document.addEventListener("keydown", (event) => {
    if (event.keyCode === 37) { // Flecha izquierda
        playerMove(-1);
    } else if (event.keyCode === 39) { // Flecha derecha
        playerMove(1);
    } else if (event.keyCode === 40) { // Flecha hacia abajo
        playerDrop();
    } else if (event.keyCode === 38) { // Flecha hacia arriba
        playerRotate(1); // Girar en sentido horario al presionar la flecha hacia arriba
    } else if (event.keyCode === 81) { // Tecla 'Q'
        playerRotate(-1); // Girar en sentido antihorario al presionar 'Q'
    }
});

// Función para iniciar el ciclo de juego
function update(time = 0) {
    if (!isPaused) {
        const deltaTime = time - lastTime;
        dropCounter += deltaTime;
        if (dropCounter > dropInterval) {
            playerDrop();
        }
        lastTime = time;
        draw();
    }
    animationId = requestAnimationFrame(update);
}

// Función para mover al jugador horizontalmente
function playerMove(offset) {
    player.pos.x += offset;
    if (collide(arena, player)) {
        player.pos.x -= offset;
    }
}

// Función para dejar caer el Tetrimino del jugador
function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        if (player.pos.y <= 1) {
            gameOver();
            return;
        }
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

// Función para manejar el fin del juego
function gameOver() {
    alert('Juego Terminado! Tu puntuación fue: ' + player.score);
    stopGame();
}

// Función para rotar el Tetrimino del jugador
function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

// Función para manejar la limpieza de filas completas
function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

// Función para dibujar el estado del juego
function draw() {
    drawBackgroundImage(); // Dibuja la imagen de fondo antes de dibujar el estado del juego
    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}

// Iniciar el juego cuando se cargue la página
