//creating a timer variable
let timer = document.getElementById("timer");
let totalGameTimeElement = document.getElementById("totalGameTime");
let second = 0,
  minute = 0,
  hour = 0;

timer.innerHTML = "0 mins 0 secs";

startTimer();

function createNewCard() {
  // Step 1: Create a new div element and assign it to a variable called cardElement.
  // Step 2: Add the "card" class to the variable 'cardElement' from the previous step.
  // Step 3: Write the HTML for the children of the card element (card-down and card-up) as a normal string and assign it as the innerHTML of cardElement.
  // Step 4: Return the cardElement.

  let cardElement = document.createElement("div");
  cardElement.classList.add("card");
  cardElement.innerHTML = `<div class="card-down"></div>
    <div class="card-up"></div>`;
  return cardElement;
}
createNewCardTest();

function appendNewCard(parentElement) {
  // Create a new card by calling createNewCard() and assign it to a variable named cardElement.
  // Append the card element to the parentElement (making the card element a "child").
  // Return the card element.

  let cardElement = createNewCard();
  parentElement.appendChild(cardElement);
  return cardElement;
}
appendNewCardTest();

function shuffleCardImageClasses() {
  //Create a new array that contains two of each image class string in order (e.g. "image-1", "image-1", "image-2", "image-2"...). Store the array in a variable called 'cardClasses'.

  let cardClasses = [
    "image-1",
    "image-1",
    "image-2",
    "image-2",
    "image-3",
    "image-3",
    "image-4",
    "image-4",
    "image-5",
    "image-5",
    "image-6",
    "image-6",
  ];

  //Using underscore.js library to shuffle cards
  //Return the shuffled array of class names.

  cardClasses = _.shuffle(cardClasses);
  return cardClasses;
}

shuffleCardImageClassesTest();

function createCards(parentElement, shuffledImageClasses) {
  // Make an empty array to hold our card objects.
  let cardObjects = [];

  //Write a for loop that loops 12 times to create the 12 cards we need.
  for (let i = 0; i < 12; i++) {
    //Use appendNewCard to create/append a new card and store the result in a variable.
    let newCard = appendNewCard(parentElement);
    //Add an image class to the new card element using shuffledImageClasses[i].
    newCard.classList.add(shuffledImageClasses[i]);
    /* 
			Append a new object to the card object array. The object should contain these properties:
				"index" -- Which iteration of the loop this is.
				"element" -- The DOM element for the card.
				"imageClass" -- The string of the image class on the card. 
		*/
    let card = {
      index: i,
      element: newCard,
      imageClass: shuffledImageClasses[i],
    };
    cardObjects.push(card);
  }
  //Return the array of 12 card objects.
  return cardObjects;
}
createCardsTest();

function doCardsMatch(cardObject1, cardObject2) {
  if (cardObject1.imageClass == cardObject2.imageClass) {
    return true;
  } else {
    return false;
  }
}
doCardsMatchTest();

/* 
	The 'counters' object below is used as a dictionary to store our counter names and their respective values. Do you remember using objects as dictionaries? If not, go back to that lecture in TBHQ to review. This object is empty for now but we'll fill it up in the following function. 
*/
let counters = {};

function incrementCounter(counterName, parentElement) {
  // If the 'counterName' property is not defined in the 'counters' object, initialize it with a value of 0.
  if (counters[counterName] === undefined) {
    counters[counterName] = 0;
  }
  //Increment the counter for 'counterName'.
  counters[counterName]++;
  //Change the HTML within 'parentElement' to display the new counter value.
  parentElement.innerHTML = counters[counterName];
}
incrementCounterTest();

/* 
	The 'onCardFlipped' function below will be called each time the user flips a card. The 'lastCardFlipped' variable is used to remember the first card flipped while we wait for the user to flip another card. We need to keep track of this value to determine if the two cards flipped match or not. 'lastCardFlipped' should be reset to 'null' each time a second card is flipped. 
*/
let lastCardFlipped = null;

function onCardFlipped(newlyFlippedCard) {
  //Add one to the flip counter UI.
  let parentElement = document.getElementById("flip-count");
  incrementCounter("flips", parentElement);

  //If this is the first card flipped, note that using the 'lastCardFlipped' variable and return (nothing else to do).
  // Now we know there are two cards flipped that should be stored in 'lastCardFlipped' and 'newlyFlippedCard'.

  if (lastCardFlipped === null) {
    lastCardFlipped = newlyFlippedCard;
    return;
  }
  //If the cards don't match, remove the "flipped" class from each, reset 'lastCardFlipped', and use a 'return' to exit the function.
  if (!doCardsMatch(lastCardFlipped, newlyFlippedCard)) {
    lastCardFlipped.element.classList.remove("flipped");
    newlyFlippedCard.element.classList.remove("flipped");
    lastCardFlipped = null;
    return;
  }

  // Now we have two matching cards.
  // Increment the match counter and optionally add a "glow" effect to the matching cards.

  let parentElement2 = document.getElementById("match-count");
  incrementCounter("matches", parentElement2);
  newlyFlippedCard.element.classList.add("border-glow");
  lastCardFlipped.element.classList.add("border-glow");
  newlyFlippedCard.element.classList.add("glow");
  lastCardFlipped.element.classList.add("glow");

  //Play either the win audio or match audio based on whether the user has the number of matches needed to win.
  if (counters["matches"] === 6) {
    winAudio.play();
    endGame();
  } else {
    matchAudio.play();
  }

  //Reset 'lastCardFlipped'
  lastCardFlipped = null;
}

// Adds a Timer function to be displayed. ----------------------------------

function startTimer() {
  interval = setInterval(function () {
    timer.innerHTML = `${minute} mins ${second} secs`;
    second++;
    if (second == 60) {
      minute++;
      second = 0;
    }
    if (minute == 60) {
      hour++;
      minute = 0;
    }
  }, 1000);
}

//Function used to create a div element give it a class, and display a banner letting the user
//know the game has ended and they won.  This function gets called when calling the winAudio funciton in above if statement.
//Banner displays the time user took to complete game.

function endGame() {
  let endingGameBanner = document.createElement("div");
  let gameEndContainer = document.getElementById("game-container");
  let totalGameTime = timer.innerHTML;
  endingGameBanner.innerHTML = `<span class="end-text">Congrats! You Won! <br>Can you beat your last time of:  ${totalGameTime} ? </span>`;
  endingGameBanner.classList.add("end-game");
  gameEndContainer.appendChild(endingGameBanner);
}

// The code below sets up the game - don't change it!
let cardObjects = createCards(document.getElementById("card-container"), shuffleCardImageClasses());

if (cardObjects != null) {
  for (let i = 0; i < cardObjects.length; i++) {
    flipCardWhenClicked(cardObjects[i]);
  }
}
