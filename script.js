'use strict';
var currentAction = null;

// Get the first action and display it
$(function() {
    var parameters = { currentAction: null }; // Ping the bot with empty request to start the conversation
    sendToBot(parameters, function(res) {
        // Display greetings
        var i = 0;
        var greetings = setInterval(function() {
            if (i === res.currentAction.greetings.length) clearInterval(greetings);
            else {
                displayMessage("left", res.currentAction.greetings[i]);
                i += 1;
            }
        }, 2500);

        // Display first question
        setTimeout(function() {
            displayMessage("left", res.nextAction.question);
        }, 8000);

        currentAction = res.nextAction;
    });
});


$("#btn").click(function() {

    displayMessage("right", $("#userInput").val()); // Append user input to displayed messages

    var parameters = { currentAction: currentAction, userInput: $("#userInput").val() };
    sendToBot(parameters, function(res) {

        // Display answer
        setTimeout(function() {
            displayMessage("left", res.currentAction.resp);
        }, 500);

        // If this is the last question of the flow, show the bye message and close conversation
        if (res.nextAction.byeMessage) {
            setTimeout(function() {
                displayMessage("left", res.nextAction.byeMessage);
            }, 2500);
        }
        else {
            // Display next question
            setTimeout(function() {
                displayMessage("left", res.nextAction.question);
            }, 2500);

            currentAction = res.nextAction;
        }
    });

    // Clear textarea
    $("#userInput").val('');
    return true;
});


function sendToBot(parameters, callback) {
    $.ajax({
        url: 'https://4ykhvsc5rb.execute-api.ap-southeast-1.amazonaws.com/test/next',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(parameters),
        success: function(res) {
            callback(res);
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
}


function displayMessage(side, message) {
    if (message && side && side === "left") {
        $('#messagesWindow').append('<div class="left"><div class="bye"><span>.</span><span>.</span><span>.</span></div><p>' + message + "</p></div>");
        $('#messagesWindow').scrollTop($('#messagesWindow').get(-1).scrollHeight);
        return true;
    }
    else if (message && side && side === "right") {
        $('#messagesWindow').append('<div class="right">' + message + "</div>");
        $('#messagesWindow').scrollTop($('#messagesWindow').get(-1).scrollHeight);
        return true;
    }
    else return false;
}