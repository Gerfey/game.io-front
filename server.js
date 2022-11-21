const express = require('express');

const app = express();

const PORT = process.env.PORT;

app.use(express.static('./dist'));
app.use((req, res) => res.sendFile('index.html', {root: './dist'}));

app.listen(PORT, function () {
    console.log(`Example app listening on port ${PORT}!`);
});