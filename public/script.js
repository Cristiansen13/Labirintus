document
    .getElementById("combined_form")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        // Extrag datele
        const lines = document.getElementById("lines").value;
        const columns = document.getElementById("columns").value;
        const start_x = document.getElementById("start_x").value;
        const start_y = document.getElementById("start_y").value;
        const end_x = document.getElementById("end_x").value;
        const end_y = document.getElementById("end_y").value;
        const density = document.getElementById("density").value;
        const history = document.getElementById("history").value;
        document.getElementById("history").value = 0;

        const l = parseInt(lines, 10);
        const c = parseInt(columns, 10);
        const sx = parseInt(start_x, 10);
        const sy = parseInt(start_y, 10);
        const ex = parseInt(end_x, 10);
        const ey = parseInt(end_y, 10);
        const d = parseInt(density, 10);
        const h = parseInt(history, 10);
        //const operatiunea = 100;

        // Fac JSON object
        const user = {
            //operatiunea: operatiunea,
            density: d,
            lines: l,
            columns: c,
            start_x: sx,
            start_y: sy,
            end_x: ex,
            end_y: ey,
            history: h,
        };

        const userJSON = JSON.stringify(user);

        document.getElementById('combined_form').reset();

        // Trimit JSON la server
        fetch("/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: userJSON,
        })
            .then((response) => response.text())
            .then((data) => console.log(data))
            .catch((error) => console.error("Error:", error));
    });

/*document.getElementById('ancient').addEventListener('submit', function(event) {
    event.preventDefault();

    // Set density as a number
    // Extrag datele
    const lines = document.getElementById('lines').value;
    const columns = document.getElementById('columns').value;
    const start_x = document.getElementById('start_x').value;
    const start_y = document.getElementById('start_y').value;
    const end_x = document.getElementById('end_x').value;
    const end_y = document.getElementById('end_y').value;
    const density = document.getElementById('density').value;

    const l = parseInt(lines, 10);
    const c = parseInt(columns, 10);
    const sx = parseInt(start_x, 10);
    const sy = parseInt(start_y, 10);
    const ex = parseInt(end_x, 10);
    const ey = parseInt(end_y, 10);
    const d = parseInt(density, 10);

    // Create JSON object
    const user = {
        density: density,
    };

    const userJSON = JSON.stringify(user);

    // Send JSON to server
    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: userJSON
    })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
});*/

// Function to fetch user data from the backend
/*function fetchUserData() {
    fetch('/userdata') // This is the endpoint you're calling
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Received data from backend:', data);
            alert(JSON.stringify(data, null, 2)); // For example, show it in an alert
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayUserData(data) {
    const displayDiv = document.getElementById('data-display');
    displayDiv.innerHTML = ''; // Clear previous data

    // Create a string to hold the formatted data
    let output = '<h2>Last Labyrinth Data:</h2>';
    output += `<p>Lines: ${data.lines}</p>`;
    output += `<p>Columns: ${data.columns}</p>`;
    output += `<p>Start X: ${data.start_x}</p>`;
    output += `<p>Start Y: ${data.start_y}</p>`;
    output += `<p>End X: ${data.end_x}</p>`;
    output += `<p>End Y: ${data.end_y}</p>`;
    output += `<p>Density: ${data.density}</p>`;

    displayDiv.innerHTML = output; // Update the display div with the data
}*/

// function setRandomValues() {
//     console.log("Setting random values");
//
//     const rand_lines = Math.floor(Math.random() * 91) + 10;
//     document.getElementById("lines").value = rand_lines;
//
//     const rand_columns = Math.floor(Math.random() * 91) + 10;
//     document.getElementById("columns").value = rand_columns;
//
//     const rand_start_x = Math.floor(Math.random() * rand_lines);
//     document.getElementById("start_x").value = rand_start_x;
//
//     const rand_start_y = Math.floor(Math.random() * rand_columns);
//     document.getElementById("start_y").value = rand_start_y;
//
//     const rand_end_x = Math.floor(Math.random() * rand_lines);
//     document.getElementById("end_x").value = rand_end_x;
//
//     const rand_end_y = Math.floor(Math.random() * rand_columns);
//     document.getElementById("end_y").value = rand_end_y;
//
//     const rand_density = Math.floor(Math.random() * 41);
//     document.getElementById("density").value = rand_density;
// }
