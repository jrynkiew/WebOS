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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/', (req, res) => {
  console.log(req.body);
  res.send("test");
  //console.log(JSON.stringify(req.body));
  //res.send({requestBody: JSON.stringify(req.body)});
  //console.log({requestBody: req.body});
  //res.json({requestBody: req.body});
});

app.get('/', (req, res) => {
  
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

/*app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);*/
