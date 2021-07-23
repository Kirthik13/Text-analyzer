const express = require('express');
const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
const SW = require('stopword');
const SpellCorrector = require('spelling-corrector');
const app = express();
const path = require("path");

const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

app.use(express.static(path.join(__dirname, 'Public')));

app.get('/', function (req, res) {
    res.sendFile("index.html");
    console.log("hi");
});

app.get("/text", function (req, res) {
    const text = req.query.val;
    //console.log(text);
    const lexedReview = aposToLexForm(text);
    const casedReview = lexedReview.toLowerCase();
    const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

    const { WordTokenizer } = natural;
    const tokenizer = new WordTokenizer();
    const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);
    tokenizedReview.forEach((word, index) => {
        tokenizedReview[index] = spellCorrector.correct(word);
    })
    const filteredReview = SW.removeStopwords(tokenizedReview);
    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const analysis = analyzer.getSentiment(filteredReview);
    res.status(200).json({ analysis });
});

app.get("/correct",function(req,res){
    const text = req.query.val;
    const lexedReview = aposToLexForm(text);
    const casedReview = lexedReview.toLowerCase();
    console.log(spellCorrector.correct(casedReview[2]));
    const { WordTokenizer } = natural;
    const tokenizer = new WordTokenizer();
    const tokenizedReview = tokenizer.tokenize(casedReview);
    tokenizedReview.forEach((word, index) => {
        tokenizedReview[index] = spellCorrector.correct(word);
    })
    res.status(200).json({ tokenizedReview });
});
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('myapp listening on port ' + port);
});

