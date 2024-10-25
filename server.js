const express = require ('express')
const bodyParser = require('body-parser');
const app = express()
const fs = require('fs');
const port = 6969

app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, 'public')));

//app.get('/', (req, res) => {
//res.status(200).send('<h1>berica</h1>')
//})

//app.listen(port, () => console.log(`Porneste serverul <3 pe portul: ${port}`))


// Trimit datele despre labirint cu POST
app.post('/', (req, res) => {
    // Parse data from the request
    const { lines, columns, start_x, start_y, end_x, end_y, density } = req.body;
    // Convert data to integers
    const user = {
        lines: parseInt(lines, 10),
        columns: parseInt(columns, 10),
        start_x: parseInt(start_x, 10),
        start_y: parseInt(start_y, 10),
        end_x: parseInt(end_x, 10),
        end_y: parseInt(end_y, 10),
        density: parseInt(density, 10),
    };

    console.log('Got the data:', user);
    //res.send('Data received and processed!');
    const userJSON = JSON.stringify(user)
    console.log('JSON:', userJSON);
    fs.writeFile('userData.json', userJSON, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            res.status(500).send('Error writing data to file.');
            return;
        }
        console.log('userData.json filled');
        var i = "Prepare to face the Minotaur! Don't forget, Theseus, use the thread from Ariadne. It will" +
            " take you back to her";
        res.send(i);
    });
});

// Iau datele despre labirint ca sa pot sa generez desenul
app.get('/userdata', (req, res) => {
    fs.readFile('userData.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading data from file.'); // Send error response
        }

        // Le fac json response
        const jsonData = JSON.parse(data);
        console.log('userData.json sent');

        // Trimit la client
        res.json(jsonData);

    });
});



app.listen(port, () => {
    console.log(`'Alearga' fratele pe http://localhost:${port}`);
});
