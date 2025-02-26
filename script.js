// DOM Elements
const wordElement = document.getElementById("word");
const wrongLettersElement = document.getElementById("wrong-letters");
const playAgainButton = document.getElementById("play-button");
const retryButton = document.getElementById("retry-button"); // Retry Button
const resetButton = document.getElementById("reset-button"); // Reset Button
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const finalMessageRevealWord = document.getElementById("final-message-reveal-word");
const figureParts = document.querySelectorAll(".figure-part");
const letterInput = document.getElementById("letter-input");

// Sound Effects
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

// Original word list
const originalWords = [
  "care",
  "compassion",
  "innovation",
  "prosperity",
  "sustainability",
  "trust",
];

// Working word list (will be modified during the game)
let words = [...originalWords]; // Create a copy of the original list

let selectedWord = words[Math.floor(Math.random() * words.length)];

let playable = true;

const correctLetters = [];
const wrongLetters = [];

// Track the number of words guessed correctly
let wordsGuessed = 0;

// Function to update the button text
function updateButtonText() {
  if (wordsGuessed === originalWords.length) {
    playAgainButton.innerText = "Play Again"; // All words guessed
  } else {
    playAgainButton.innerText = "Next Word"; // More words to guess
  }
}

// Function to handle correct word guess
function handleCorrectGuess() {
  if (wordsGuessed === originalWords.length - 1) {
    // Last word guessed
    finalMessage.innerText = "CONGRATULATIONS! YOU GUESSED ALL 6 WORDS! AMAZINGGGGGGG 🥳🥳🥳🥳🥳🥳🥳🥳";
    finalMessageRevealWord.innerText = "";
    playAgainButton.innerText = "Play Again"; // Change button text
    resetButton.style.display = "none"; // Hide the reset button
  } else {
    finalMessage.innerText = "Congratulations! You won! 😃🥳🥳🥶";
    finalMessageRevealWord.innerText = "";
    playAgainButton.innerText = "Next Word"; // Change button text
  }
  popup.style.display = "flex";
  playable = false;

  // Remove the guessed word from the list
  const wordIndex = words.indexOf(selectedWord);
  if (wordIndex > -1) {
    words.splice(wordIndex, 1); // Remove the word from the list
  }

  wordsGuessed++; // Increment the number of words guessed
}

// Display the word
function displayWord() {
  wordElement.innerHTML = `
    ${selectedWord
      .split("")
      .map(
        (letter) => `
      <span class="letter">
        ${letter === " " ? "&nbsp;" : correctLetters.includes(letter) ? letter : ""}
      </span>
    `
      )
      .join("")}
  `;

  const innerWord = wordElement.innerText.replace(/\n/g, "");
  if (innerWord === selectedWord) {
    handleCorrectGuess(); // Handle correct guess
  }
}

// Update the wrong letters
function updateWrongLettersElement() {
  wrongLettersElement.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`).join(", ")}
  `;

  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;
    index < errors
      ? (part.style.display = "block")
      : (part.style.display = "none");
  });

  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = "Unfortunately you lost. booooo 👎😕";
    finalMessageRevealWord.innerText = `...the word was: ${selectedWord}`;
    popup.style.display = "flex";
    playable = false;
  }
}

// Show notification
function showNotification() {
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

// Event listener for letter input
letterInput.addEventListener("input", (e) => {
  if (playable) {
    const letter = e.target.value.toLowerCase();
    if (letter >= "a" && letter <= "z") {
      if (selectedWord.includes(letter)) {
        if (!correctLetters.includes(letter)) {
          correctLetters.push(letter);
          displayWord();
          correctSound.play(); // Play correct sound
        } else {
          showNotification();
        }
      } else {
        if (!wrongLetters.includes(letter)) {
          wrongLetters.push(letter);
          updateWrongLettersElement();
          wrongSound.play(); // Play wrong sound
        } else {
          showNotification();
        }
      }
    }
    // Clear the input field after processing
    e.target.value = "";
  }
});

// Event listener for the retry button
retryButton.addEventListener("click", () => {
  correctLetters.splice(0); // Clear correct letters
  wrongLetters.splice(0); // Clear wrong letters
  displayWord();
  updateWrongLettersElement();
  popup.style.display = "none";
  playable = true;
});

// Event listener for the reset button
resetButton.addEventListener("click", () => {
  resetGame();
});

// Event listener for the play again/next word button
playAgainButton.addEventListener("click", () => {
  if (wordsGuessed === originalWords.length) {
    // All words guessed, reset the game
    resetGame();
    wordsGuessed = 0; // Reset the counter
    resetButton.style.display = "block"; // Show the reset button again
  } else {
    // Load the next word
    if (words.length > 0) {
      selectedWord = words[Math.floor(Math.random() * words.length)];
      correctLetters.splice(0);
      wrongLetters.splice(0);
      displayWord();
      updateWrongLettersElement();
      popup.style.display = "none";
      playable = true;
    }
  }
  updateButtonText(); // Update the button text
});

// Function to reset the game completely
function resetGame() {
  words = [...originalWords]; // Restore the original word list
  selectedWord = words[Math.floor(Math.random() * words.length)];
  correctLetters.splice(0);
  wrongLetters.splice(0);
  displayWord();
  updateWrongLettersElement();
  popup.style.display = "none";
  playable = true;
}

// Initialize the button text
updateButtonText();

// Initialize the game
displayWord();
