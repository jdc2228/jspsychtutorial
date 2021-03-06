var timeline = [];

var welcome = {
    type: "html-keyboard-response",
    stimulus: "Welcome to the experiment. Press any key to begin."
};
timeline.push(welcome);

var instructions = {
    type: "html-keyboard-response",
    stimulus: `
    You will be participating in an rdk experiment. Press F if the dots are moving to the left, and J otherwise. These instructions should be improved later. Press any key to begin.
    `,
    post_trial_gap: 2000
};
timeline.push(instructions);

var rdk_parameters = [
    { coherent_direction: 180, correct_choice: `f`},
    { coherent_direction: 0, correct_choice: `j`}
];

var fixation = {
    type: `html-keyboard-response`,
    stimulus: `<div style="font-size:60px;">+</div>`,
    choices: jsPsych.NO_KEYS,
    /* The bwelow randomization is currently pointless */
    trial_duration: function() {
        return jsPsych.randomization.sampleWithoutReplacement([1000], 1)[0];
    },
    data: {
        task: `fixation`
    }
}

// Make the rdk easier or more difficult here
var rdk_test = {
    type: "rdk", 
    post_trial_gap: 0,
    number_of_dots: 200,
    RDK_type: 3,
    choices: ["f", "j"],
    correct_choice: jsPsych.timelineVariable('correct_choice'),
    coherent_direction: jsPsych.timelineVariable(`coherent_direction`),
    trial_duration: 1000,
    data: {
    task: 'response'
    } 
};

var feedback = {
    type: 'html-keyboard-response',
    choices: jsPsych.NO_KEYS,
    /* The bwelow randomization is currently pointless */
    trial_duration: function() {
        return jsPsych.randomization.sampleWithoutReplacement([1000], 1)[0];
    },
    stimulus: function(){
        // The feedback stimulus is a dynamic parameter because we can't know in advance whether
        // the stimulus should be 'correct' or 'incorrect'.
        // Instead, this function will check the accuracy of the last response and use that information to set
        // the stimulus value on each trial.
        var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
        var response = jsPsych.data.get().last(1).values()[0].response;
        if(last_trial_correct){
        return "<p>Correct!</p><p>You pressed " + response + "</p>"; // the parameter value has to be returned from the function
        } else {
            if(response == -1){
                return "<p>Wrong!</p><p>You didn't press anything!</p>"
            }
        return "<p>Wrong.</p><p>You pressed " + response + "</p>"; // the parameter value has to be returned from the function
        }
    }
}

var test_procedure = {
    timeline: [rdk_test, feedback],
    timeline_variables: rdk_parameters,
    sample: {
    type: 'with-replacement',
    size: 5,
}
}
timeline.push(test_procedure);

var debrief_block = {
  type: "html-keyboard-response",
  stimulus: function() {

    var trials = jsPsych.data.get().filter({task: 'response'});
    var correct_trials = trials.filter({correct: true});
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);

    return `<p>You responded correctly on ${accuracy}% of the trials.</p>
      <p>Press any key to complete the experiment. Thank you!</p>`;

  }
};
timeline.push(debrief_block);
