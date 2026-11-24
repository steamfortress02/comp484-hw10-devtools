$(function () {
  // Initialize the dashboard with the pet's starting stats and a welcome notification.
  checkAndUpdatePetInfoInHtml();
  showPetNotification("Meowth, dat's right! Whaddaya got for me today, boss?");

  // Starter button click handlers
  $('.treat-button').click(clickedTreatButton);
  $('.play-button').click(clickedPlayButton);
  $('.exercise-button').click(clickedExerciseButton);

  /*
   * UNIQUE jQuery METHOD #1: .on()
   * Documentation: https://api.jquery.com/on/
   *
   * How .on() is used here:
   * .on(events, handler) attaches one or more event handler functions to the
   * selected elements. Unlike .click() (which is a shorthand for a single event),
   * .on() is jQuery's unified event-binding method that supports any DOM event
   * (such as 'click', 'mouseenter', 'keydown', or multiple space-separated events)
   * and optional event delegation.
   *
   * Here we use .on('click', ...) to bind:
   * 1. Our new action button (.nap-button) to clickedNapButton
   * 2. The clear button (.clear-notification-button) to clearPetNotification
   * 3. The pet image (.pet-image) to clickedPetImage for an interactive bonus
   * 4. The sound toggle button (.sound-toggle-button) to toggleSound
   */
  $('.nap-button').on('click', clickedNapButton);
  $('.clear-notification-button').on('click', clearPetNotification);
  $('.pet-image').on('click', clickedPetImage);
  $('.sound-toggle-button').on('click', toggleSound);

  // HW10 DevTools diagnostics and debugging bindings
  $('.bonus-treat-button').on('click', clickedBonusTreatButton);
  $('.demo-info-button').on('click', logInfoDemo);
  $('.demo-warn-button').on('click', logWarningDemo);
  $('.demo-error-button').on('click', logErrorDemo);
  $('.demo-table-button').on('click', logTableDemo);
  $('.demo-group-button').on('click', logGroupDemo);
  $('.demo-custom-button').on('click', logCustomDemo);
  $('.demo-all-logs-button').on('click', runAllConsoleLogs);
  $('.demo-404-button').on('click', trigger404Demo);
  $('.demo-typeerror-button').on('click', triggerTypeErrorDemo);
  $('.demo-violation-button').on('click', triggerViolationDemo);

  // Log initial startup banner and pet status to the Console
  logCustomDemo();
  console.info('[GigaPet Info] Dashboard initialized for ' + pet_info.name, {
    weight: pet_info.weight,
    happiness: pet_info.happiness,
    energy: pet_info.energy
  });
});

// Object holding the pet's core attributes and the new energy attribute
var pet_info = {
  name: "Meowth",
  weight: 9,
  happiness: 5,
  energy: 80
};

// Tracks whether synthesized retro sound effects are enabled
var soundEnabled = true;

// Arrays of authentic Meowth dialogue for each interaction
var meowthQuotes = {
  treat: [
    "Ooh, snacks! Keep 'em comin' and I might even share my shiny coins!",
    "Now you're talkin'! A star like me deserves top-shelf Poké Puffs!",
    "Munch, munch... Hey, dis ain't half bad, boss!"
  ],
  play: [
    "Hey, watch the charm on my forehead! ...Okay, dat yarn was kinda fun.",
    "Haha! Nobody's faster than Meowth when I'm on a roll!",
    "Catchin' laser dots? Piece of cake for a feline genius like me!"
  ],
  exercise: [
    "Ugh, why am I runnin' when I ain't even chasin' a Pikachu?!",
    "Whoa, slow down! My little paws weren't built for marathons!",
    "Huff... puff... Dis better pay off with extra treats later!"
  ],
  nap: [
    "Purrr... A catnap beats workin' any day of da week, meow.",
    "Zzz... Dreamin' of piles of golden Pay Day coins... Zzz...",
    "Ahhh, dat's the stuff. Ready to scheme again, boss!"
  ],
  pet: [
    "Mrrrrow~ Okay, right behind da ears... don't tell anybody I like dat!",
    "Hey! Watch the whiskers... alright, alright, keep scratchin'.",
    "Purrrrr... You're not too bad for a human, boss."
  ]
};

// Keeps track of the last quote index per action so Meowth cycles through lines
var quoteIndices = {
  treat: 0,
  play: 0,
  exercise: 0,
  nap: 0,
  pet: 0
};

/**
 * Returns the next Meowth quote from the action's array, or a special condition
 * message if Meowth is completely out of energy or at minimum weight.
 * @param {string} action - The action key in meowthQuotes.
 * @returns {string} The comment from Meowth.
 */
function getMeowthQuote(action) {
  if (pet_info.energy === 0 && action !== 'nap') {
    return "Whoa, I'm beat! My batteries are at 0%—how about a Nap, boss?";
  }
  if (pet_info.weight === 0 && (action === 'exercise' || action === 'play')) {
    return "Hey, I'm light as a feather already! Feed me a Treat before I blow away!";
  }

  var quotes = meowthQuotes[action];
  var index = quoteIndices[action] % quotes.length;
  quoteIndices[action] += 1;
  return quotes[index];
}

/**
 * Gives the pet a treat: increases happiness and weight.
 */
function clickedTreatButton() {
  pet_info.happiness += 2;
  pet_info.weight += 1;
  checkAndUpdatePetInfoInHtml();
  triggerPetAnimation('animate-bounce');
  playPetSound(587);
  showPetNotification(getMeowthQuote('treat'));
}

/**
 * Plays with the pet: increases happiness while reducing weight and energy.
 */
function clickedPlayButton() {
  pet_info.happiness += 3;
  pet_info.weight -= 1;
  pet_info.energy -= 10;
  checkAndUpdatePetInfoInHtml();
  triggerPetAnimation('animate-bounce');
  playPetSound(659);
  showPetNotification(getMeowthQuote('play'));
}

/**
 * Exercises the pet: reduces happiness, weight, and energy.
 * Also emits practical DevTools warning/error diagnostics when energy is low or depleted.
 */
function clickedExerciseButton() {
  if (pet_info.energy === 0) {
    console.error('[GigaPet Error] Invalid action: Meowth cannot exercise with 0% energy!');
  }
  pet_info.happiness -= 1;
  pet_info.weight -= 1;
  pet_info.energy -= 10;
  checkAndUpdatePetInfoInHtml();
  if (pet_info.energy > 0 && pet_info.energy <= 20) {
    console.warn('[GigaPet Warning] Meowth energy is low (' + pet_info.energy + '%). Click Nap soon!');
  }
  triggerPetAnimation('animate-bounce');
  playPetSound(330);
  showPetNotification(getMeowthQuote('exercise'));
}

/**
 * New behavior correlated with the Nap button: restores energy and boosts happiness.
 */
function clickedNapButton() {
  pet_info.energy += 25;
  pet_info.happiness += 1;
  checkAndUpdatePetInfoInHtml();
  triggerPetAnimation('animate-snooze');
  playPetSound(440);
  showPetNotification(getMeowthQuote('nap'));
}

/**
 * Bonus interaction bound with .on(): clicking the pet image gives gentle pets.
 */
function clickedPetImage() {
  pet_info.happiness += 1;
  checkAndUpdatePetInfoInHtml();
  triggerPetAnimation('animate-bounce');
  playPetSound(587);
  showPetNotification(getMeowthQuote('pet'));
}

/**
 * Toggles synthesized sound effects on or off.
 */
function toggleSound() {
  soundEnabled = !soundEnabled;
  $('.sound-toggle-button').text(soundEnabled ? "Sound: On" : "Sound: Off");
  var btn = document.querySelector('.sound-toggle-button');
  if (btn) {
    btn.setAttribute('aria-pressed', String(soundEnabled));
  }
}

/**
 * Triggers a CSS keyframe animation on the pet image element.
 * @param {string} animationClass - CSS class name ('animate-bounce' or 'animate-snooze').
 */
function triggerPetAnimation(animationClass) {
  var img = document.querySelector('.pet-image');
  if (!img) {
    return;
  }
  img.classList.remove('animate-bounce', 'animate-snooze');
  // Force reflow so the same animation can replay on consecutive clicks
  void img.offsetWidth;
  img.classList.add(animationClass);
}

var audioCtx = null;

/**
 * Plays a short retro beep at the given frequency using the Web Audio API.
 * @param {number} frequency - Pitch of the beep in Hz.
 */
function playPetSound(frequency) {
  if (!soundEnabled) {
    return;
  }
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  var osc = audioCtx.createOscillator();
  osc.frequency.value = frequency;
  osc.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

/**
 * Clears the visual pet notification area using jQuery's .empty() method.
 */
function clearPetNotification() {
  /*
   * UNIQUE jQuery METHOD #2: .empty()
   * Documentation: https://api.jquery.com/empty/
   *
   * How .empty() is used here:
   * .empty() removes all child nodes and text content from the matched DOM
   * element(s), while keeping the element itself (and its styling/event handlers)
   * intact in the page. Unlike .remove(), which deletes the element itself,
   * .empty() leaves the .pet-notification container ready for future messages.
   */
  $('.pet-notification').empty();
}

/**
 * Updates the visual notification banner with a comment from the pet.
 * Uses .empty() to clear any previous content before writing the new message.
 * (No console.log() or alert() is used.)
 * @param {string} message - The comment from the pet to display.
 */
function showPetNotification(message) {
  $('.pet-notification').empty().text(message);
}

/**
 * Validates pet_info values and updates the HTML dashboard.
 */
function checkAndUpdatePetInfoInHtml() {
  checkWeightAndHappinessBeforeUpdating();
  updatePetInfoInHtml();
}

/**
 * Ensures key pet_info values never drop below zero (and caps energy at 100).
 */
function checkWeightAndHappinessBeforeUpdating() {
  if (pet_info.weight < 0) {
    pet_info.weight = 0;
  }
  if (pet_info.happiness < 0) {
    pet_info.happiness = 0;
  }
  if (pet_info.energy < 0) {
    pet_info.energy = 0;
  } else if (pet_info.energy > 100) {
    pet_info.energy = 100;
  }
}

/**
 * Computes Meowth's current mood label based on energy, weight, and happiness.
 * @returns {string} Mood description.
 */
function getPetMood() {
  if (pet_info.energy === 0) {
    return "Exhausted (Needs a Nap!)";
  }
  if (pet_info.weight === 0) {
    return "Hangry (Needs a Treat!)";
  }
  if (pet_info.happiness >= 12) {
    return "Purr-fectly Ecstatic!";
  }
  if (pet_info.happiness >= 5) {
    return "Feelin' Groovy";
  }
  return "Grumpy Cat";
}

/**
 * Renders the current pet_info values, mood, and energy bar into the HTML dashboard.
 */
function updatePetInfoInHtml() {
  $('.name').text(pet_info['name']);
  $('.weight').text(pet_info['weight']);
  $('.happiness').text(pet_info['happiness']);
  $('.energy').text(pet_info['energy']);
  $('.mood').text(getPetMood());

  var energyBar = document.querySelector('.energy-bar-fill');
  if (energyBar) {
    energyBar.style.width = pet_info.energy + '%';
  }
}

/* ==========================================================================
 * HW10: Chrome DevTools Console Logging, Browser Diagnostics & Debugging
 * ========================================================================== */

// Structured pet action metadata displayed using console.table()
var petActionTable = [
  { action: 'Treat',    happiness: '+2', weight: '+1', energy: '0',   soundHz: 587 },
  { action: 'Play',     happiness: '+3', weight: '-1', energy: '-10', soundHz: 659 },
  { action: 'Exercise', happiness: '-1', weight: '-1', energy: '-10', soundHz: 330 },
  { action: 'Nap',      happiness: '+1', weight: '0',  energy: '+25', soundHz: 440 }
];

/**
 * Feeds bonus treats based on the numeric input field.
 * Fixed: parses the string input value as a base-10 integer before adding.
 */
function clickedBonusTreatButton() {
  var currentHappiness = pet_info.happiness;
  // FIXED (HW10 Debugging Demo): Convert string input to an integer with parseInt()
  // before adding so 5 + 3 = 8 instead of string concatenation ("53").
  var bonusTreats = parseInt(document.getElementById('bonus-treat-count').value, 10);
  if (isNaN(bonusTreats) || bonusTreats < 1) {
    bonusTreats = 1;
  }
  var newHappiness = currentHappiness + bonusTreats;
  pet_info.happiness = newHappiness;
  pet_info.weight += 1;
  checkAndUpdatePetInfoInHtml();
  triggerPetAnimation('animate-bounce');
  playPetSound(587);
  showPetNotification("Nice! " + bonusTreats + " bonus treats boosted my happiness to " + pet_info.happiness + "!");
}

/**
 * Part 2.1 - Log Info: Demonstrates console.info() and console.log().
 */
function logInfoDemo() {
  console.info('[GigaPet Info] Current Meowth status:', {
    name: pet_info.name,
    weight: pet_info.weight,
    happiness: pet_info.happiness,
    energy: pet_info.energy
  });
  console.log('[GigaPet Log] Mood check:', getPetMood());
}

/**
 * Part 2.1 - Log Warning: Demonstrates console.warn().
 */
function logWarningDemo() {
  console.warn('[GigaPet Warning] Meowth energy is running low (' + pet_info.energy + '%). Click Nap soon!');
}

/**
 * Part 2.1 - Log Error: Demonstrates console.error().
 */
function logErrorDemo() {
  console.error('[GigaPet Error] Invalid action: Meowth cannot sprint with 0% energy!');
}

/**
 * Part 2.1 - Log Table: Demonstrates console.table() on structured project data.
 */
function logTableDemo() {
  console.table(petActionTable);
}

/**
 * Part 2.1 - Log Group: Demonstrates console.group() and console.groupEnd().
 */
function logGroupDemo() {
  console.group('Meowth State Snapshot (' + getPetMood() + ')');
  console.log('Name:', pet_info.name);
  console.log('Weight (lbs):', pet_info.weight);
  console.log('Happiness (purrs/min):', pet_info.happiness);
  console.log('Energy (%):', pet_info.energy);
  console.groupEnd();
}

/**
 * Part 2.1 - Log Custom: Demonstrates custom CSS-styled console output with %c.
 */
function logCustomDemo() {
  console.log(
    '%c Meowth Giga Pet %c DevTools Diagnostics Active ',
    'background: #f59e0b; color: #0f172a; font-weight: bold; font-size: 13px; padding: 4px 10px; border-radius: 4px 0 0 4px;',
    'background: #1e293b; color: #fef3c7; font-weight: bold; font-size: 13px; padding: 4px 10px; border-radius: 0 4px 4px 0;'
  );
}

/**
 * Convenience helper to emit all six console log types together for filtering demos.
 */
function runAllConsoleLogs() {
  logCustomDemo();
  logInfoDemo();
  logWarningDemo();
  logErrorDemo();
  logGroupDemo();
  logTableDemo();
}

/**
 * Part 2.2 - 404 Network Error: Requests a non-existent file so the browser logs a 404 error.
 */
function trigger404Demo() {
  fetch('api/missing-meowth-treats.json');
}

/**
 * Part 2.2 - TypeError: Invokes a method on undefined so the browser logs an Uncaught TypeError.
 */
function triggerTypeErrorDemo() {
  var uninitializedToy = undefined;
  // Intentionally invoke a method on undefined to trigger a browser-logged TypeError
  uninitializedToy.squeak();
}

/**
 * Part 2.2 - Violation: Blocks the main thread (~350ms) inside a click handler so
 * Chrome logs a [Violation] 'click' handler took XXXms diagnostic (visible at Verbose level).
 */
function triggerViolationDemo() {
  var start = performance.now();
  while (performance.now() - start < 350) {
    // Synchronous busy-wait loop to trigger long click-handler violation
  }
  showPetNotification("Whoa, dat slow click handler froze my paws for 350ms!");
}
