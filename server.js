const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const fs = require("fs");
const port = 6969;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, 'public')));

//app.get('/', (req, res) => {
//res.status(200).send('<h1>berica</h1>')
//})

//app.listen(port, () => console.log(`Porneste serverul <3 pe portul: ${port}`))

// Serve static files from the 'public' directory
app.use("/public", express.static(path.join(__dirname, "public")));

// Disable caching for the JSON file
app.get("/public/userDataResponse.json", (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.sendFile(path.join(__dirname, "public", "userDataResponse.json"));
});

// Define a route for the index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Trimit datele despre labirint cu POST
app.post("/", (req, res) => {
    // Parse data from the request
    const { lines, columns, start_x, start_y, end_x, end_y, density, history } =
        req.body;

    if (typeof density === "number") {
        // Perform operations if it's a number
        console.log(density);
    } else {
        console.log(`Value is of type ${typeof density}: ${density}`);
        console.log(density);
    }

    // Convert data to integers
    const user = {
        density: parseInt(density, 10),
        lines: parseInt(lines, 10),
        columns: parseInt(columns, 10),
        start_x: parseInt(start_x, 10),
        start_y: parseInt(start_y, 10),
        end_x: parseInt(end_x, 10),
        end_y: parseInt(end_y, 10),
        history: parseInt(history, 10),
    };

    console.log("Got the data:", user);
    //res.send('Data received and processed!');
    const userJSON = JSON.stringify(user);
    console.log("JSON:", userJSON);
    fs.writeFile("userData.json", userJSON, (err) => {
        if (err) {
            console.error("Error writing to file:", err);
            res.status(500).send("Error writing data to file.");
            return;
        }
        console.log("userData.json filled");
        const i =
            "Prepare to face the Minotaur! Don't forget, Theseus, use the thread from Ariadne. It will" +
            " take you back to her";
        //res.send(i);
        const htmlResponse = `
            <html>
            <body>
                <p>Prepare to face the Minotaur! Don't forget, Theseus, use the thread from Ariadne. It will take you back to her.</p>
                <button onclick="window.location.href='http://localhost:6969/public/labyrinth/labyrinth.html'">Go to Labyrinth</button>
            </body>
            </html>
        `;
        res.send(htmlResponse);
    });
});

app.get("/labyrinth", (req, res) => {
    res.sendFile("/public/labyrinth/labyrinth.html");
    console.log("userData.json sent2");
});

app.listen(port, () => {
    console.log(`'Alearga' fratele pe http://localhost:${port}`);
});
