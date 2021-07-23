let charCount = document.getElementById('char'),
wordCount = document.getElementById('word'),
sentence = document.getElementById('sentence'),
spaces = document.getElementById('spaces'),
punctuation = document.getElementById('punctuation');
sentiment = document.getElementById('Sentiment');
grammatical = document.getElementById('gramma');

const textArea = document.querySelector('.text-entry textarea'),
processBtn = document.getElementById('process-btn');
correctBtn = document.getElementById('correct-btn');
let UIValues = [charCount, wordCount, sentence, spaces, punctuation,grammatical,sentiment];

function init() {
    UIValues.forEach(value => value.innerHTML = 0);
    
}
init();
processBtn.addEventListener('click', () => {
    let text = textArea.value;
    charCount.innerHTML = text.length;
    wordCount.innerHTML = findWord(text);
    sentence.innerHTML=findSentence(text);
    punctuation .innerHTML=findPunctuation(text);
    spaces.innerHTML=text.split(" ").length-1;
    $.ajax({
        type : "GET",
        url : "/text?val="+text,
        dataType : "text",
        // data : JSON.stringify(text),
        success : function(data){
            console.log(data);
            let a =JSON.parse(data);
            let SentimentValue = a['analysis'];
            if(SentimentValue>0){
                sentiment.innerHTML = "wow";
            }
            else if(SentimentValue<0){
                sentiment.innerHTML = "sorry";
            }
            else{
                sentiment.innerHTML = "good";
            }
        }
    });
    
 
});

correctBtn.addEventListener('click', () => {
    let text = textArea.value;
    let tempText = text.replace(/[.,!%&*;:'"-()]/g, "");
    tempText = tempText.replace(/[\r]/g, "").split(/\n/);
    let tempList = [];
    tempText.forEach(word => tempList.push(word.split(" ")));
    console.log(tempList);

    $.ajax({
        type : "GET",
        url : "/correct?val="+tempList,
        dataType : "json",
        // data : JSON.stringify(text),
        success : function(data){
            const {tokenizedReview} = data;
            console.log(tokenizedReview);
            let res="";
            for(let i=0;i<tokenizedReview.length;i++){
                res+= tokenizedReview[i] + " ";
            }
            console.log(res);
            textArea.value = res;
        }
    });

});
function findWord(text) {
    let tempText = text.replace(/[.,!%&*;:'"-()]/g, "");
    tempText = tempText.replace(/[\r]/g, "").split(/\n/);
    
    let tempList = [];
    tempText.forEach(word => tempList.push(word.split(" ")));
    
    //console.log(tempList);
    function extract(arr) {
        return arr.reduce((wordList, word)=> {
            return wordList.concat(Array.isArray(word) ? extract(word) : word);
            
        }, []);
    }
    let wordList=extract(tempList);
    return wordList.filter(char => char != '').length;
    
}

function findSentence(text) {
    const regex = /[\w|\)][.?!](\s|$)/g;
    let senCount=text.match(regex);
    return senCount ? senCount.length : 0;
    
}

function findPunctuation(text) {
    const regex = /[.,?;:!'"(){}-]/g;
    let puncCount=text.match(regex);
    return puncCount ? puncCount.length : 0;
}
var input = document.querySelector('#clear');
var textarea = document.querySelector('#output');

input.addEventListener('click', function () {
    textarea.value ='';
    charCount.innerHTML = 0;
    wordCount.innerHTML =0;
    sentence.innerHTML=0;
    punctuation .innerHTML=0;
    spaces.innerHTML=0;
}, false);

// if x<0:
// #           ans=emoji.emojize('Negative :unamused_face:')
// #           return ans
// #       elif x==0:
// #            ans=emoji.emojize('Neutral :neutral_face:')
// #            return ans
// #     #   return render_template('result.html',result = result)
// #       ans=emoji.emojize('Positive :grinning_face:')
