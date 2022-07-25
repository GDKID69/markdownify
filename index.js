const bold = arg => { return `**${arg}**`;};

const italics = arg => { return `*${arg}*`;};

const strikethrough = arg => { return `~~${arg}~~`;};

const underline = arg => { return `__${arg}__`;};

const codeblockify = arg => { return `\`${arg}\``;};

function shuffle(arg) {
    const groups = [];
    while (!arg == "") {
        let takeaway = betterRandom({
            1: 0.65,
            2: 0.35,
        });
        groups.push(arg.slice(0, takeaway));
        arg = arg.slice(takeaway);
    }

    return groups;
};

function betterRandom(probabilities) {
    let i,
        sum = 0,
        r = Math.random();
    for (i in probabilities) {
        sum += probabilities[i];
        if (r <= sum) return i;
    }
};

function markdownFlood(text) {
    text = text.replace(/\s/g, "\u2800");
    
    const groupList = shuffle(text);

    var actionsList = [
        bold,
        italics,
        strikethrough,
        underline,
    ];
    
    var poppedAction, action;

    for (var index in groupList) {
        var group = groupList[index];
        let code = betterRandom({
            1: 0.4,
            0: 0.6,
        });

        if (code == 1)  groupList[index] = group = codeblockify(group);

        action = actionsList[Math.floor(Math.random() * actionsList.length)];
        while (action == poppedAction) poppedAction = action = actionsList[Math.floor(Math.random() * actionsList.length)];

        groupList[index] = group = action(group);

        var again = betterRandom({
            1: 0.2,
            0: 0.8,
        });

        if (again == 1) {
            action = actionsList[Math.floor(Math.random() * actionsList.length)];
            while (action == poppedAction) poppedAction = action = actionsList[Math.floor(Math.random() * actionsList.length)];

            groupList[index] = group = action(group);
        }
    }

    const output = groupList.join("\u200b")
        .replace(/b/g, "🅱️")
        .replace(/B/g, "🅱️");

    return output;
};
