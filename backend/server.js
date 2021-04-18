'use strict';

const https = require('https')
const express = require('express');
const cors = require('cors');
const { exec } = require("child_process");
const fs = require('fs');

// Constants
const PORT = 443;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(cors());

app.get('/', (req, res) => {
  //res.send('Hello World');
  exec("./ioctl bc info", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        res.send(error.message);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        res.send(stderr);
        return;
    }
    res.send(stdout);
    console.log(`stdout: ${stdout}`);
  });

});


https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(PORT, HOST);

//app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
