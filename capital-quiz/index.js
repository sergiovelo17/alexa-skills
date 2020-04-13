'use strict';

var Alexa = require('alexa-sdk');

var flashcardsDictionary = [
  {
    state: 'California',
    capital: 'Sacramento'
  },
  {
    state: 'Hawaii',
    capital: 'Honolulu'
  },
  {
    state: 'Florida',
    capital: 'Tallahassee'
  },
  {
    state: 'Georgia',
    capital: 'Atlanta'
  },
  {
    state: 'Arizona',
    capital: 'Pheonix'
  },
  {
    state: 'New York',
    capital: 'Albany'
  },
  {
    state: 'Texas',
    capital: 'Austin'
  },
  {
    state: 'Utah',
    capital: 'Salt Lake City'
  },
  {
    state: 'Nebraska',
    capital: 'Lincoln'
  },
  {
    state: 'Massachusetts',
    capital: 'Boston'
  },
  {
    state: 'Colorado',
    capital: 'Denver'
  },
  {
    state: 'Illinois',
    capital: 'Springfield'
  }
  
];

var DECK_LENGTH = flashcardsDictionary.length;

var handlers = {

  // Open Codecademy Flashcards
  'LaunchRequest': function() {
    if(Object.keys(this.attributes).length === 0){
      this.attributes.flashcards = {
        'numberCorrect': 0,
        'currentFlashcardIndex': 0
      }
      this.response.speak(AskQuestion(this.attributes)).listen(AskQuestion(this.attributes));
    }else{
      var numberCorrect = this.attributes.flashcards.numberCorrect;
      var currentFlashcardIndex = this.attributes.flashcards.currentFlashcardIndex;
      this.response.speak('Welcome back to Flashcards. You are on question ' + currentFlashcardIndex + ' and have answered ' + numberCorrect + ' correctly.' + AskQuestion(this.attributes)).listen(AskQuestion(this.attributes));
    }
    this.emit(':responseReady')
  },

  // User gives an answer
  'AnswerIntent': function() {
    if(this.request.intent.slots.answer.value === flashcardsDictionary[this.attributes.flashcards.currentFlashcardIndex].capital){
      this.attributes.flashcards.currentFlashcardIndex++;
      this.attributes.flashcards.numberCorrect++;
      this.response.speak('Correct! Next question... ' + AskQuestion(this.attributes)).listen(AskQuestion(this.attributes));
    }else{
      this.attributes.flashcards.currentFlashcardIndex++;
      this.response.speak('Wrong, the correct answer was ' + flashcardsDictionary[this.attributes.flashcards.currentFlashcardIndex-1].capital + '. Time for next question... ' + AskQuestion(this.attributes)).listen(AskQuestion(this.attributes));
    }
  },


  // Stop
  'AMAZON.StopIntent': function() {
    this.response.speak('Ok, let\'s play again soon.');
    this.emit(':responseReady');
  },

  // Cancel
  'AMAZON.CancelIntent': function() {
    this.response.speak('Ok, let\'s play again soon.');
    this.emit(':responseReady');
  },

  // Save state
  'SessionEndedRequest': function() {
    console.log('session ended!');
    this.emit(':saveState', true);
  }

};

// Test my {language} knowledge
var AskQuestion = function(attributes) {
  var currentFlashcardIndex = attributes.flashcards.currentFlashcardIndex;

  if (currentFlashcardIndex >= DECK_LENGTH) {
    return 'No questions remaining.';
  } else {
    var currentState = flashcardsDictionary[currentFlashcardIndex].state;
    return 'What is the capital of ' + currentState + '?';
  }

};

  exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context, callback);
    alexa.dynamoDBTableName = 'CapitalQuiz'
    alexa.registerHandlers(handlers);
    alexa.execute();
  };