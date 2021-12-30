const { Plugin } = require("powercord/entities");
const { getModule, messages } = require("powercord/webpack");
const { inject, uninject } = require("powercord/injector");

const ColorUtils = getModule(["isValidHex"], false);

const settings = require("./Settings");

/**
 * Adds bold markdown around a string
 * @param {String} arg 
 * @returns {String} The original string in bold
 */
const bold = arg => { return `**${arg}**`;};

/**
 * Adds italics markdown around a string
 * @param {String} arg 
 * @returns {String} The original string in italics
 */
const italics = arg => { return `*${arg}*`;};

/**
 * Adds strikethrough markdown around a string
 * @param {String} arg 
 * @returns {String} The original string in a strikethrough
 */
const strikethrough = arg => { return `~~${arg}~~`;};

/**
 * Adds underline markdown around a string
 * @param {String} arg 
 * @returns {String} The original string underlined
 */
const underline = arg => { return `__${arg}__`;};

/**
 * Adds codeblock markdown around a string
 * @param {String} arg 
 * @returns {String} The original string in a codeblock
 */
const codeblockify = arg => { return `\`${arg}\``;};

/**
 * Randomly arranges a string into groups
 * @param {String} arg
 * @returns {Array<String>} The list of groups
 */
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

/**
 * Does random picking but with weights
 * @param {Object} probabilities
 */
function betterRandom(probabilities) {
    let i,
        sum = 0,
        r = Math.random();
    for (i in probabilities) {
        sum += probabilities[i];
        if (r <= sum) return i;
    }
};

/**@param {String[]} _args */
function markdownFlood(_args) {
    const text = _args.join("\u2800").replace(/( )/g, "\u2800");
    
    const groupList = shuffle(text);

    var actionsList = [
        bold,
        italics,
        strikethrough,
        underline,
    ];
    
    /**@type {(arg: String) => String | undefined} */
    var poppedAction;
    /**@type {(arg: String) => String | undefined} */
    var action;

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

        if (again === 1) {
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

module.exports = class Markdownify extends Plugin {
    subcommands = {
        toggle: {
            command: "toggle",
            description: "Toggle the markdown flooding",
            usage: "{c}",
            /**
             * @param {String[]} _ 
             * @returns {Boolean}
             * */
            executor: (_) => {
                if (this.settings.get("markdownFlood", false) === true) {
                    this.settings.set("markdownFlood", false);
                }

                else {
                    this.settings.set("markdownFlood", true);
                }

                return this.settings.get("markdownFlood", false);
            }
        }
    };

    injectID = "markdownifyInject";
    entityID = "markdownify";

    startPlugin() {
        powercord.api.settings.registerSettings(
            this.entityID,
            {
                category: this.entityID,
                label: "Markdownify",
                render: settings,
            }
        );
        powercord.api.commands.registerCommand({
            command: "markdown",
            description: "Flood some text with unnecessary markdown",
            usage: "{c} [text]",
            /**@param {String[]} _args */
            executor: (_args) => {
                if (_args[0] == "toggle") {
                    /**@type {Boolean}*/
                    const toggle = this.subcommands.toggle.executor.bind(this)(_args[0]);
                    return {
                        send: false,
                        result: {
                            type: "rich",
                            title: "Markdownification Toggled",
                            description: toggle
                                         ? `All your messsages sent afterwards will be ${markdownFlood(["flooded"])} with
                                         ${markdownFlood(["unnecessary markdown :)"])}`
                                         : `Your future messages will not contain ${markdownFlood(["any of this shit"])}`,
                            color: toggle
                                   ? ColorUtils.hex2int("#2ECC70")
                                   : ColorUtils.hex2int("#C0382B"),
                        }
                    };
                }

                const output = markdownFlood(_args);

                return {
                    send: true,
                    result: output,
                };
            },
            /**@param {String[]} args */
            autocomplete: (args) => {
                if (args[0] !== void 0 && args.length === 1) {
                    return {
                        commands: Object.values(this.subcommands).filter(({ command }) => command.includes(args[0].toLowerCase())),
                        header: "Available Subcommands",
                    };
                }
            }
        });

        inject(this.injectID, messages, "sendMessage", (args, res) => {
            if (this.settings.get("markdownFlood", false) === true) {
                args[1].content = markdownFlood([args[1].content]);
            }

            return res;
        }, false);
    }

    pluginWillUnload() {
        powercord.api.commands.unregisterCommand("markdown");
        powercord.api.settings.unregisterSettings(this.entityID);
        uninject(this.injectID);
    }
};