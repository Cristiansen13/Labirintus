document.getElementById('combined_form').addEventListener('submit', function(event) {
    event.preventDefault();

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

    if (sx < 1 || sx > l) {
        alert(`Start X must be between 1 and ${l}.`);

        //return; // Stops the form from submitting if validation fails
    }

    // Fac JSON object
    const user = {
        lines: l,
        columns: c,
        start_x: sx,
        start_y: sy,
        end_x: ex,
        end_y: ey,
        density: d
    };

    const userJSON = JSON.stringify(user);

    // Trimit JSON la server
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
});

// Function to fetch user data from the backend
function fetchUserData() {
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
}