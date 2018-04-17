var sessionLength = $("#session-length"),
    digitalClock  = $("#digital-clock"),    
    breakLength   = $("#break-length"),
    timeLabel     = $("#time-label"),
    hand          = $("#hand");
  
var clockRunning = false,
    currentlyWorking = true,
    paused = false;

var clockTime = {
  time: 0,
  total: 0,
  // Stage can be session or break time
  set: function(stage) {
    this.time = parseInt(stage) * 60;
    this.total = parseInt(stage) * 60;
  },
  recalculate: function() {
    if(this.time - 1 > 0){
      this.time = this.time - 1;
    } else {
      changeStage();
    }
  },
  minutes: function() {
    return parseInt(this.time / 60);
  },
  seconds: function() {
    return this.time % 60;
  },
  get: function() {
    return this.time;
  },
  totalTime: function() {
    return this.total;
  }
}

var timer = {
  timer: new moment.duration(1, "seconds")
      .timer({loop: true, start: false}, callback),
  start: function() {
    if(!paused) {
      var stage = currentlyWorking ? sessionLength.text() : breakLength.text();
      clockTime.set(stage);
    }
    this.timer.start();
  },
  stop: function() {
    this.timer.stop();
  }
}

/**
 * Updates the clock time shown
 */
function callback() {
  clockTime.recalculate();
  var formatedSeconds = clockTime.seconds();
  formatedSeconds = formatedSeconds < 10 ? "0" + formatedSeconds : formatedSeconds;

  digitalClock.text(clockTime.minutes() + ":" + formatedSeconds);

  var degress = ((clockTime.totalTime() - clockTime.get()) / clockTime.totalTime()) * 360;
  hand.css("transform", "rotate("+ degress +"deg)");
}

/**
 * Changes working/chilling stages
 */
function changeStage() {
  var stage = currentlyWorking ? breakLength.text() : sessionLength.text();
  timeLabel.text(currentlyWorking ? "Break Time!" : "Work Time!");
  currentlyWorking = !currentlyWorking;
  clockTime.set(stage);
}

$("#start-stop").click(function() {
  timeLabel.css("visibility", "visible");
  if(!clockRunning){
    timer.start();
    clockRunning = true;
    changeWorkingPausedStyles(true);
  } else {
    timer.stop();
    paused = true;
    clockRunning = false;
    changeWorkingPausedStyles(false);
  }
});

$("#reset").click(function() {
  if(!clockRunning) {
    timeLabel.css("visibility", "hidden");
    clockTime.set(sessionLength.text());
    currentlyWorking = true;
    paused = false;
    digitalClock.text(sessionLength.text() + ":00");
    hand.css("transform", "rotate(0deg)");
  }
});

$("#session-decrease").click(function() {
  changeSessionLength(false);
});

$("#session-increase").click(function() {
  changeSessionLength(true);
});

$("#break-decrease").click(function() {
  changeBreakLength(true);
});

$("#break-increase").click(function() {
  changeBreakLength(false);
});


/**
 * Displays the session length adjustment
 * 
 * @param {boolean} adding wether is adding or substracting minutes
 */
function changeSessionLength(adding) {
  var length = parseInt(sessionLength.text());

  length = changeLength(adding, length);
  
  sessionLength.text(length);

  if(currentlyWorking)
    digitalClock.text(length + ":00");
}

/**
 * Displays the break length adjustment
 * 
 * @param {boolean} adding wether is adding or substracting minutes
 */
function changeBreakLength(adding) {
  var length = parseInt(breakLength.text());

  length = changeLength(adding, length);

  breakLength.text(length);

  if(!currentlyWorking)
    digitalClock.text(length + ":00");
}

/**
 * Calculates the new length for session or break adjustment
 * and applies common logic
 * 
 * @param {boolean} adding wether is adding or substracting minutes
 * @param {number} currentLength session or break current length
 */
function changeLength(adding, currentLength) {
  if(!clockRunning){

    if(adding){

      currentLength = currentLength + 1;

    } else {

      if(currentLength - 1 > 0) {
        currentLength = currentLength - 1;
      }

    }

    hand.css("transform", "rotate(0deg)");
    paused = false;
  }

  return currentLength;
}

/**
 * Changes buttons styles when clock is running or paused
 * 
 * @param {boolean} running clock state
 */
function changeWorkingPausedStyles(running) {
  if(running) {
    $("#start-stop").addClass("started");
    $("#start-stop").text("STOP");
    $("#reset").css("cursor", "not-allowed");
    $("#reset").prop("disabled", true);
    $("#session-increase").css("cursor", "not-allowed");
    $("#session-decrease").css("cursor", "not-allowed");
    $("#break-increase").css("cursor", "not-allowed");
    $("#break-decrease").css("cursor", "not-allowed");
  } else {
    $("#start-stop").removeClass("started");
    $("#start-stop").text("START");
    $("#reset").css("cursor", "pointer");
    $("#reset").prop("disabled", false);
    $("#session-increase").css("cursor", "pointer");
    $("#session-decrease").css("cursor", "pointer");
    $("#break-increase").css("cursor", "pointer");
    $("#break-decrease").css("cursor", "pointer");
  }
}