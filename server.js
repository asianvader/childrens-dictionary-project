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
    let callApiUrl = apiUrl + searchedWord + "?key=" + apiKey;

    // make request to API
    request.get(callApiUrl, {json:true}, (err, response, data) => {
        if (err) { 
            return console.log(err);
        } 
        // check if the word exists in dictionary by existence of object in array
        else if (data.some(value => typeof value == 'object')) {
            const word = data[0].meta.id;
            const category = data[0].fl;
            const pronunciation = data[0].hwi.prs[0].mw;
            const audio = data[0].hwi.prs[0].sound.audio;
            const definition = data[0].shortdef[0];
 
            // return data
            res.json({
                word: word,
                category: category,
                pronunciation: pronunciation,
                definition: definition
            })
        } else {
            res.send(data);
        }
        
    })
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
  });