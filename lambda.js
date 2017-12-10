(function () {
    'use strict';

    var Alexa = require("alexa-sdk");

    // Create flashcards dictionary
    var flashcardsDictionary = [
      {state: 'Alabama', capital: 'Montgomery'},
      {state: 'Alaska', capital: 'Juneau'},
      {state: 'Arizona', capital: 'Phoenix'},
      {state: 'Arkansas', capital: 'Little Rock'},
      {state: 'California', capital: 'Sacramento'},
      {state: 'Colorado', capital: 'Denver'},
      {state: 'Connecticut', capital: 'Hartford'},
      {state: 'Delaware', capital: 'Dover'},
      {state: 'Florida', capital: 'Tallahassee'},
      {state: 'Georgia', capital: 'Atlanta'},
      {state: 'Hawaii', capital: 'Honolulu'},
      {state: 'Idaho', capital: 'Boise'},
      {state: 'Illinois', capital: 'Springfield'},
      {state: 'Indiana', capital: 'Indianapolis'},
      {state: 'Iowa', capital: 'Des Moines'},
      {state: 'Kansas', capital: 'Topeka'},
      {state: 'Kentucky', capital: 'Frankfort'},
      {state: 'Louisiana', capital: 'Baton Rouge'},
      {state: 'Maine', capital: 'Augusta'},
      {state: 'Maryland', capital: 'Annapolis'},
      {state: 'Massachusetts', capital: 'Boston'},
      {state: 'Michigan', capital: 'Lansing'},
      {state: 'Minnesota', capital: 'Saint Paul'},
      {state: 'Mississippi', capital: 'Jackson'},
      {state: 'Missouri', capital: 'Jefferson City'},
      {state: 'Montana', capital: 'Helena'},
      {state: 'Nebraska', capital: 'Lincoln'},
      {state: 'Nevada', capital: 'Carson City'},
      {state: 'New Hampshire', capital: 'Concord'},
      {state: 'New Jersey', capital: 'Trenton'},
      {state: 'New Mexico', capital: 'Santa Fe'},
      {state: 'New York', capital: 'Albany'},
      {state: 'North Carolina', capital: 'Raleigh'},
      {state: 'North Dakota', capital: 'Bismarck'},
      {state: 'Ohio', capital: 'Columbus'},
      {state: 'Oklahoma', capital: 'Oklahoma City'},
      {state: 'Oregon', capital: 'Salem'},
      {state: 'Pennsylvania', capital: 'Harrisburg'},
      {state: 'Rhode Island', capital: 'Providence'},
      {state: 'South Carolina', capital: 'Columbia'},
      {state: 'South Dakota', capital: 'Pierre'},
      {state: 'Tennessee', capital: 'Nashville'},
      {state: 'Texas', capital: 'Austin'},
      {state: 'Utah', capital: 'Salt Lake City'},
      {state: 'Vermont', capital: 'Montpelier'},
      {state: 'Virginia', capital: 'Richmond'},
      {state: 'Washington', capital: 'Olympia'},
      {state: 'West Virginia', capital: 'Charleston'},
      {state: 'Wisconsin', capital: 'Madison'},
      {state: 'Wyoming', capital: 'Cheyenne'}
    ];

    var DECK_LENGTH = flashcardsDictionary.length;

    var handlers = {
        // Open US capitals flashcards
        "LaunchRequest": function () {
          if(Object.keys(this.attributes).length === 0) {
              this.attributes.flashcards = {
              'numberCorrect': 0,
              'currentFlashcardIndex': 0
            }
            var currentFlashcardIndex = this.attributes.flashcards.currentFlashcardIndex;
            var numberCorrect = this.attributes.flashcards.numberCorrect;
            var currentQuestion = flashcardsDictionary[currentFlashcardIndex].state;

            this.response
              .listen("Welcome to the United States' Capitals Flashcards skill. There are " + DECK_LENGTH + " states whose capitals you should know. Let's practice. What is the capital of " + currentQuestion + "?");
          } else {
            var currentFlashcardIndex = this.attributes.flashcards.currentFlashcardIndex;
            var numberCorrect = this.attributes.flashcards.numberCorrect;
            var currentQuestion = flashcardsDictionary[currentFlashcardIndex].state;

            this.response
              .listen("Welcome back! You\'re on question " + currentFlashcardIndex +
            " and have answered " + numberCorrect + " correctly. Let's continue. What is the capital of " + currentQuestion + "?");
          }
          this.emit(':responseReady');
        },

        // Is it {answer}?
        "AnswerIntent": function () {
          var userAnswer = this.event.request.intent.slots.answer.value.toUpperCase();
          var currentFlashcardIndex = this.attributes.flashcards.currentFlashcardIndex;
          var correctAnswer = flashcardsDictionary[currentFlashcardIndex].capital.toUpperCase();
          this.attributes.flashcards.currentFlashcardIndex++;
          var currentFlashcardIndex = this.attributes.flashcards.currentFlashcardIndex;
          var currentQuestion = flashcardsDictionary[currentFlashcardIndex].state;

          if (userAnswer == correctAnswer){
            this.attributes.flashcards.numberCorrect++;
            var numberCorrect = this.attributes.flashcards.numberCorrect;

            this.response
              .speak("Correctamundo! The answer is " + correctAnswer + ". Aye aye aye! You have gotten " + numberCorrect + " out of " + DECK_LENGTH + " questions correct. Here is your next question. What is the capital of " + currentQuestion + "?")
              .listen(currentQuestion);
          } else {
              var numberCorrect = this.attributes.flashcards.numberCorrect;
  
              this.response
                .speak("Sorry. The correct answer is " + correctAnswer + ". You have gotten " + numberCorrect + " out of " + DECK_LENGTH + " questions correct. Here is your next question. What is the capital of " + currentQuestion + "?")
                .listen(currentQuestion);
          }
          this.emit(':responseReady');
        },

        // Stop skill
        "AMAZON.StopIntent": function () {
            this.response.speak("Exiting US Capitals flashcards skill.");
            this.emit(":responseReady");
        },

        // Cancel
        "AMAZON.CancelIntent": function () {
            this.response.speak("Exiting US Capitals flashcards skill.");
            this.emit(":responseReady");
        },

        // Save state
        'SessionEndedRequest': function() {
          console.log('session ended!');
          this.emit(':saveState', true);
        }
    };

    exports.handler = function (event, context, callback) {
        var alexa = Alexa.handler(event, context);
        alexa.dynamoDBTableName = 'USCapitalsFlashcards';
        alexa.registerHandlers(handlers);
        alexa.execute();
    };
}());
