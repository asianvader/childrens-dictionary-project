require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request');

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// render HTML
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// api url
const apiUrl = "https://www.dictionaryapi.com/api/v3/references/sd2/json/"; 
const apiKey = process.env.API_KEY;

// take word from form 
app.post('/search', (req, res, next) => {
    const searchedWord = req.body.search;
    console.log(searchedWord);
    let callApiUrl = apiUrl + searchedWord + "?key=" + apiKey;

    // make request to API
    request.get(callApiUrl, {json:true}, (err, response, data) => {
        if (err) {
            return console.log(err);
        }
        let word = data;
        console.log(data);
        // return data
        res.send(data)
    })
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
  });