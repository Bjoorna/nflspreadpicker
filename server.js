const express = require('express');

const app = express();

app.use(express.static('./dist/woapp'));

app.get('/*', (req,res) => 
    res.sendFile('index.html', {root: 'dist/woapp/'}),
);

app.listen(process.env.PORT || 8080);
