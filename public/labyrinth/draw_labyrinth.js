// const LABYRINTH_CONFIG = {
//     rows: 50,
//     columns: 50,
// };

let start_x, start_y, end_x, end_y, rows, columns, matrix;

const cellColors = {
    empty: "#e0e0e0",
    wall: "#333333",
    start: "#4CAF50",
    end: "#f44336",
    path: "#2196F3",
    done: "#db9b07",
};

// const { rows, columns } = LABYRINTH_CONFIG;

let pathLength = 0;
let startTime;

function fetchJSONData(name) {
    return fetch(name)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .catch((error) => console.error("Unable to fetch data:", error));
}

function generateLabyrinth() {
    const labyrinth = [];

    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < columns; j++) {
            switch (matrix[i][j]) {
                case 0: {
                    row.push("empty");
                    break;
                }
                case 1: {
                    row.push("wall");
                    break;
                }
                case 2: {
                    row.push("empty");
                    pathLength++;
                    break;
                }
                default: {
                    console.log("caca");
                    break;
                }
            }
        }
        labyrinth.push(row);
    }

    labyrinth[start_x][start_y] = "start";
    labyrinth[end_x][end_y] = "end";

    return labyrinth;
}

async function generatePath(labyrinth) {
    let currentRow = start_x;
    let currentCol = start_y;
    let found = Array.from({ length: rows }, () => Array(columns).fill(false));

    for (let i = 0; i < pathLength; i++) {
        let x = currentRow;
        let y = currentCol;
        found[x][y] = true;
        if (x + 1 < rows && !found[x + 1][y] && matrix[x + 1][y] === 2) {
            found[x + 1][y] = true;
            currentRow = x + 1;
        } else if (
            y + 1 < columns &&
            !found[x][y + 1] &&
            matrix[x][y + 1] === 2
        ) {
            found[x][y + 1] = true;
            currentCol = y + 1;
        } else if (x - 1 >= 0 && !found[x - 1][y] && matrix[x - 1][y] === 2) {
            found[x - 1][y] = true;
            currentRow = x - 1;
        } else if (y - 1 >= 0 && !found[x][y - 1] && matrix[x][y - 1] === 2) {
            found[x][y - 1] = true;
            currentCol = y - 1;
        }

        await new Promise((resolve) => setTimeout(resolve, 50));
        if (
            labyrinth[currentRow][currentCol] !== "start" &&
            labyrinth[currentRow][currentCol] !== "end"
        ) {
            updateCell(currentRow, currentCol, "path");
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
    return pathLength;
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
    try {
        const labyrinth_data = await fetchJSONData("sample.json");
        console.log(labyrinth_data);

        // Initialize labyrinth variables
        start_x = labyrinth_data.start_x;
        start_y = labyrinth_data.start_y;
        end_x = labyrinth_data.end_x;
        end_y = labyrinth_data.end_y;
        rows = labyrinth_data.lines;
        columns = labyrinth_data.columns;
        matrix = labyrinth_data.matrix;

        console.log(rows, columns, matrix);

        startTime = new Date();
        const labyrinth = generateLabyrinth();
        renderLabyrinth(labyrinth);
        resizeLabyrinth();
        await generatePath(labyrinth);
    } catch (error) {
        console.error("Error initializing labyrinth:", error);
    }
}

window.addEventListener("load", initLabyrinth);
window.addEventListener("resize", resizeLabyrinth);

async function toggleDiv(name) {
    // Get random number between 2000 and 3000
    const randomTime = Math.floor(Math.random() * 1000) + 2000;

    // Show the div for that amount of time
    await new Promise((resolve) => setTimeout(resolve, randomTime));

    // Hide the div
    const div = document.getElementById(name);
    div.classList.toggle("hidden");
}
