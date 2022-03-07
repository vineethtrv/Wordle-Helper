
import { COLLECTION } from './data.js';
let includeLetters; 
let excludeLetters;
let correctLetters = [null, null, null, null, null];
const inPresent = document.getElementById('input-present');
const inAbsent = document.getElementById('input-absent');


const generateSuggestion = (collection) =>{
    let wordEl = '';
    let length = collection.length > 500 ? 500 : collection.length;

    for (let i = 0; i < length; i++){
        let letters = '';
        for (let l = 0; l < 5; l++){
            const letter = collection[i][l];
            const incSty = includeLetters && includeLetters.includes(letter)? 'incSty': '';
            const crtSty = correctLetters.includes(letter) ? 'crtSty': '';


            letters += `<i class="${incSty + crtSty}"> ${letter} </i>`
        }
        wordEl += `<span class="word">${letters}</span>`
    }
    document.getElementById('results').innerHTML = wordEl;
}

const preventKeys = (e , n) => {
    if (!(e.key.match(/^[A-Za-z]+$/)
        && e.target.value.length < n
        || e.key === 'Backspace'
        || e.code === "Backspace"
        || e.keyCode === 8
    )
    ) {
        e.preventDefault();
    }
}


const validateKeys = (e , n) => {
    preventKeys(e , n);
    // prevent Duplicate
    if (
            e.key.length === 1 && 
            includeLetters && 
            includeLetters.includes(e.key) ||
            
            e.key.length === 1 && 
            excludeLetters &&
            excludeLetters.includes(e.key)
        ){
        e.preventDefault();
    }
}


const wordFilter = ()=> {

    let wordsList = COLLECTION;

    // Letters in correct position
    if (correctLetters){
        correctLetters.forEach( (latter , i) => {
            if (latter){
                wordsList = wordsList.filter(word => word[i] == latter )
            }
        })
    }


    // Letters can be excluded from the word
    if (excludeLetters){
        wordsList =   wordsList.filter(word => {
            for (let i = 0; i < excludeLetters.length; i++) {
                if (word.includes(excludeLetters[i])) {
                       return false
                   }
                if (excludeLetters.length === i + 1) {
                    return true
                }
               }
           })
    }
        
    // Letters anywhere in word but not in correct position
    if (includeLetters) {
         wordsList =   wordsList.filter(word => {
                for (let i = 0; i < includeLetters.length; i++) {
                    if (!word.includes(includeLetters[i])) {
                        return false
                    }
                    if (includeLetters.length === i + 1) {
                        return true
                    }
                }
            })
    }
    
   
    //    console.log(wordsList);
   generateSuggestion(wordsList)

}


// Include event
inPresent.addEventListener('keydown', e => validateKeys(e, 5));
inPresent.addEventListener('input', (e) => {
    includeLetters = e.target.value.replace(/[.,\s]/g, '').toLowerCase();
    wordFilter();
})

// Exclude event
inAbsent.addEventListener('keydown', e => validateKeys(e, 22));
inAbsent.addEventListener('input', (e) => {
    excludeLetters = e.target.value.replace(/[.,\s]/g, '').toLowerCase();
    wordFilter();
})


document.querySelectorAll("#form-correct input").forEach(correctInput => {
    correctInput.addEventListener('keydown', e => preventKeys(e, 1));
    
    correctInput.addEventListener('input', (e) => {
        correctLetters[parseInt(e.target.dataset.index)] = e.target.value.toLowerCase();
        wordFilter();
    });

});




// First Load the
generateSuggestion(COLLECTION)