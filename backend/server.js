const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/test', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/login', (req, res) => {
    
    // const formData = req.body;
    // console.log(formData);
    console.log('get request');
    console.log(req.body);
    res.status(201).json(req.body);
  });

app.listen(5000, () => console.log('Server is up and running'));