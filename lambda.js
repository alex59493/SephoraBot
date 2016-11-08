'use strict';
console.log('Loading event');


/*
    Conversation Flow
    Organized list of actions that the bot follows in order to lead the conversation
    Entry point is "hello", exit point is "bye"
*/

var bye = {
    byeMessage: "This is what I suggest. I hope you had a great experience with me. Have a good day!"
};

var entities = [
    {
        for: "name",
        value: null,
        question: "I like to call people by their names, mine is Bot, what's yours ?",
        resp: "Nice to meet you !",
        next: "age"
    },
    {
        for: "age",
        value: null,
        question: "How old is the person you want to offer a gift to ?",
        resp: "Understood.",
        next: "gender"
    },
    {
        for: "gender",
        value: null,
        question: "Is it a girl or a boy ?",
        resp: "Ok.",
        next: bye
    }
];

var hello = {
    greetings: ["Hey you, are you searching an idea for a christmas gift ?", "I can help you with that, let me ask you a few questions, and I will give you my best recommendations !"],
    next: getObjectByAttrValue(entities, "for", "name")
};

/*
    ------------------------------------------
*/


exports.handler = function(event, context, callback) {
    var currentAction = event.currentAction ? event.currentAction : hello;
    var inputUser = event.inputUser ? event.inputUser : ""; // Get value of user input

    // Fill correct entity with user input
    if (isEntity(currentAction) && inputUser) {
        entities[entities.indexOf(currentAction)].value = inputUser;
    }

    // Define Next action
    var next = {};
    if (currentAction === hello) {
        next = hello.next;
    }
    else if (currentAction.next.byeMessage) {
        next = bye;
    }
    else if (isEntity(currentAction)) {
        next = getObjectByAttrValue(entities, "for", currentAction.next);
    }

    callback(null, {"currentAction":currentAction, "nextAction":next});
};


function getObjectByAttrValue(arr, attr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][attr] == val) return arr[i];
  }
}

function isEntity(currentAction) {
    return currentAction !== hello && currentAction !== bye;
}

/*
function nextAction(actions, action) {
    if (action.next === null) { return null; }

    for (var i = 0; i < actions.length; i++) {
        if (actions[i].for === action.next) {
            return actions[i];
        }
    }
    return null;
}
*/