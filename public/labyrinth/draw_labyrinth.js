const LABYRINTH_CONFIG = {
    rows: 8,
    columns: 8,
};

const cellColors = {
    empty: "#e0e0e0",
    wall: "#333333",
    start: "#4CAF50",
    end: "#f44336",
    path: "#2196F3",
    done: "#db9b07",
};

const { rows, columns } = LABYRINTH_CONFIG;
let pathLength = 0;
let startTime;

function generateLabyrinth() {
    const labyrinth = [];

    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < columns; j++) {
            if (i === 0 || i === rows - 1 || j === 0 || j === columns - 1) {
                row.push("wall");
            } else {
                row.push("empty");
            }
        }
        labyrinth.push(row);
    }

    labyrinth[1][1] = "start";
    labyrinth[rows - 2][columns - 2] = "end";

    return labyrinth;
}

async function generatePath(labyrinth) {
    let currentRow = 1;
    let currentCol = 1;

    while (currentRow < rows - 2 || currentCol < columns - 2) {
        await new Promise((resolve) => setTimeout(resolve, 30));

        if (currentRow < rows - 2 && Math.random() < 0.5) {
            currentRow++;
        } else if (currentCol < columns - 2) {
            currentCol++;
        }

        if (labyrinth[currentRow][currentCol] === "empty") {
            labyrinth[currentRow][currentCol] = "path";
            updateCell(currentRow, currentCol, "path");
        }

        if (currentRow === rows - 2 && currentCol === columns - 2) {
            break;
        }
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (labyrinth[i][j] === "done" || labyrinth[i][j] === "path") {
                pathLength++;
            }
        }
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (labyrinth[i][j] === "path") {
                labyrinth[i][j] = "done";
                updateCell(i, j, "done");
            }
        }
    }

    displayResults();
}

function renderLabyrinth(labyrinth) {
    const labyrinthElement = document.getElementById("labyrinth");

    labyrinthElement.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    labyrinthElement.innerHTML = "";

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.id = `cell-${i}-${j}`;
            cell.style.backgroundColor = cellColors[labyrinth[i][j]];
            labyrinthElement.appendChild(cell);
        }
    }
}

function updateCell(row, col, type) {
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (cell) {
        cell.style.backgroundColor = cellColors[type];
    }
}

function resizeLabyrinth() {
    const labyrinthElement = document.getElementById("labyrinth");
    const { rows, columns } = LABYRINTH_CONFIG;
    const aspectRatio = columns / rows;

    let width = window.innerWidth * 0.95;
    let height = window.innerHeight * 0.85; // Reduced to make room for results

    if (width / height > aspectRatio) {
        width = height * aspectRatio;
    } else {
        height = width / aspectRatio;
    }

    labyrinthElement.style.width = `${width}px`;
    labyrinthElement.style.height = `${height}px`;
}

function displayResults() {
    const endTime = new Date();
    const totalTime = (endTime - startTime) / 1000; // Convert to seconds

    const resultsElement = document.getElementById("results");
    resultsElement.innerHTML = `
        <p>Path Length: ${pathLength}</p>
        <p>Total Time: ${totalTime.toFixed(2)} seconds</p>
    `;
}

async function initLabyrinth() {
    startTime = new Date();
    const labyrinth = generateLabyrinth();
    renderLabyrinth(labyrinth);
    resizeLabyrinth();
    await generatePath(labyrinth);
}

window.addEventListener("load", initLabyrinth);
window.addEventListener("resize", resizeLabyrinth);
