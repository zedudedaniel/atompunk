const express = require('express');
const app = express();
const port = 3000;

app.get('/', function (req, res) {
    res.send('Such an unreasonable request! Never contact me again. I will call the police if you do.');
});

app.use(express.static('public'));

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`)
});