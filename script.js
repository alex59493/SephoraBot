'use strict';

// CONFIG
var TIMERESPONSE = 2000; // Number of milliseconds that the bot needs to write its message
 
var currentAction = null;

// Get the first action and display it
$(function() {
    var parameters = { currentAction: null }; // Ping the bot with empty request to start the conversation
    sendToBot(parameters, function(res) {
        // Display greetings
        var i = 0;
        var interval = setInterval(function() {

            // If all the item in the greetings array are not yet displayed, display the next one
            if (i !== res.currentAction.greetings.length) {
                displayMessage("left", res.currentAction.greetings[i]);
                i += 1;
            }

            // Else, display the next question
            else {
                clearInterval(interval);

                // Display first question
                displayMessage("left", res.nextAction.question);
            }

        }, TIMERESPONSE + 500);

        currentAction = res.nextAction;
    });
});


$("#btn").click(sendMessage);

$("#userInput").keypress(function(e) {
    if (e.which == 13) {
        sendMessage();
    }
});


function sendMessage() {
    displayMessage("right", $("#userInput").val()); // Append user input to displayed messages

    var parameters = { currentAction: currentAction, userInput: $("#userInput").val() };
    sendToBot(parameters, function(res) {
        displayBotResponse(res);
    });

    // Clear textarea
    $("#userInput").val('');
    return true;
}


function displayBotResponse(res) {
    // Display answer to the current entity
    setTimeout(function() {
        displayMessage("left", res.currentAction.resp);
    }, 500);

    // If this is the last entity of the flow, show the bye message and close conversation
    if (res.nextAction.byeMessage) {
        setTimeout(function() {
            displayMessage("left", res.nextAction.byeMessage);
        }, TIMERESPONSE + 500);

        currentAction = -1;
    }

    // Else, display the next question
    else {
        setTimeout(function() {
            displayMessage("left", res.nextAction.question);
        }, TIMERESPONSE + 500);

        currentAction = res.nextAction;
    }
}


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
    // If the messages emiter is the bot, display the message with the "..." animation
    if (message && side && side === "left") {
        $('#messagesWindow').append('<div class="left"><div class="bye"><span>.</span><span>.</span><span>.</span></div><p>' + message + "</p></div>");
        $('#messagesWindow').scrollTop($('#messagesWindow').get(-1).scrollHeight);
        // Wait that the message is fully displayed and refresh the scroll
        // Otherwise, message with more than one line (like "...") won't be completely shown
        setTimeout(function() {
            $('#messagesWindow').scrollTop($('#messagesWindow').get(-1).scrollHeight);
        }, TIMERESPONSE + 1);
        return true;
    }

    // Else if the message emiter is the user, simply display the message (without "...")
    else if (message && side && side === "right") {
        $('#messagesWindow').append('<div class="right">' + message + "</div>");
        $('#messagesWindow').scrollTop($('#messagesWindow').get(-1).scrollHeight);
        return true;
    }

    else return false;
}