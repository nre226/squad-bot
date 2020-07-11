'use strict';

require('dotenv').config();

const https = require('https');

class Bot {
    /**
     * Called to handle rolling dice for various actions.
     *
     * @static
     * @param {string} messageText The message text containing the roll information incoming from another function
     * @param {Boolean} isAutomatedRoll Determines if it is a roll coming from a user (the base case) or from the app
     * @return {string}
     */
    static handleDieRoll(messageText, isAutomatedRoll=false) {
        let total = 0
        let dieRoll = 0
        let verbose = '('

        let dieCommand = messageText.substring(messageText.indexOf('r')+2)

        let numberOfDice = messageText.substring(messageText.indexOf('r')+2, messageText.indexOf('d')) || 1
        let number = messageText.substring(messageText.indexOf('d')+1)

        if(parseInt(numberOfDice) == 0 || parseInt(number) == 0) {
            return null
        }

        for(let i=0; i<parseInt(numberOfDice); i++) {
            dieRoll = Math.floor(Math.random() * number) + 1;
            total += dieRoll
            if(i !== parseInt(numberOfDice)-1) {
                verbose += dieRoll+", "
            } else {
                verbose += dieRoll+")"
            }
        }

        if(isAutomatedRoll) {
            return parseInt(total)
        }
        return "You got a "+total+"\n"+"Details: ["+dieCommand+" "+verbose+"]"
    }

    static checkMention(message) {
        const messageText = message.text;

        const allRegex = /\@all/;
        const everyoneRegex = /\@everyone/;

        if(messageText && (allRegex.test(messageText) || everyoneRegex.test(messageText))) {
            return true;
        }

        return false;
    }

    static checkGroup(message) {
        const messageText = message.text;
        
        const LexingtonRegex = /\@lexington/;

        if(messageText && LexingtonRegex.test(messageText)) {
            return true;
        }

        return false;
    }

    /**
     * Called when the bot receives a message.
     * TO DO: ordering of calls, upgraded dice rolling to include add and subtract, /commands
     *
     * @static
     * @param {Object} message The message data incoming from GroupMe
     * @return {string}
     */
    static checkMessage(message) {
        const messageText = message.text;

        // Place to put the regular expressions to be used
        const botRegex = /^\/shrug$/;
        const goodRegex = /^\/good bot$/;
        const driveRegex = /^\/drive$/;
        const rollRegex = /^\/r ([0-9]{1,2})?d([0-9]{1,4})$/;
        const helpRegex = /^\/help$/;

        // Check if the GroupMe message has content and if the regex pattern is true
        if (messageText && botRegex.test(messageText)) {
            // Check is successful, return a message!
            return '¯\\_(ツ)_/¯';
        } else if(messageText && driveRegex.test(messageText)) {
            return 'https://drive.google.com/drive/folders/19rI6fzBZNd_wXHuPZKAI2KD35O_kLSdO?usp=sharing'
        } else if(messageText && helpRegex.test(messageText)) {
            return 'https://github.com/nre226/squad-bot'
        } else if(messageText && rollRegex.test(messageText)) {
            return this.handleDieRoll(messageText)
        } else if(messageText && goodRegex.test(messageText)) {
            let variance = Math.floor(Math.random() * 2) + 1;
            if(variance == 1) {
                return ":)"
            }
            return "I try"
        }

        return null;
    };

    /**
     * Sends a message to GroupMe with a POST request.
     *
     * @static
     * @param {string} messageText A message to send to chat
     * @return {undefined}
     */
    static sendMessage(messageText) {
        // Get the GroupMe bot id saved in `.env`
        const botId = process.env.BOT_ID;

        const options = {
            hostname: 'api.groupme.com',
            path: '/v3/bots/post',
            method: 'POST'
        };

        const body = {
            bot_id: botId,
            text: messageText
        };

        // Make the POST request to GroupMe with the http module
        const botRequest = https.request(options, function(response) {
            if (response.statusCode !== 202) {
                console.log('Rejecting bad status code ' + response.statusCode);
            }
        });

        // On error
        botRequest.on('error', function(error) {
            console.log('Error posting message ' + JSON.stringify(error));
        });

        // On timeout
        botRequest.on('timeout', function(error) {
            console.log('Timeout posting message ' + JSON.stringify(error));
        });

        // Finally, send the body to GroupMe as a string
        botRequest.end(JSON.stringify(body));
    };

    static getGroupId(callbackFn) {
        callbackFn("Please... This will work and I am just doing it to make me feel a little better...");
        // console.log('getting group id')
        // // Get the GroupMe bot id saved in `.env`
        // const accessToken = process.env.ACCESS_TOKEN;

        // var options = {
        //     host: 'www.reddit.com',
        //     port: 443,
        //     path: '/r/TellMeAFact/top/.json?count=1',
        //     method: 'GET'
        // };

        // callbackFn("111 This will work and I am just doing it to make me feel a little better...");
        
        // var req = https.request(options, function(res) {
        //     callbackFn(res.statusCode.toString());
        // });

        // callbackFn("This will work and I am just doing it to make me feel a little better...");
        
        // req.on('error', function(e) {
        //     callbackFn('problem with request: ' + e.message);
        // });
        
        // req.end();
        // callbackFn('Past the end...');





        // const options = {
        //     hostname: 'api.groupme.com',
        //     path: '/v3/groups?token='+accessToken,
        //     method: 'GET'
        // };

        // // Make the POST request to GroupMe with the http module
        // const apiRequest = https.get(options, function(response) {
        //     return "Does it work in here?";
        //     if (response.statusCode !== 202) {
        //         console.log('Rejecting bad status code ' + response.statusCode);
        //     }

        //     response.on('data', (test) => {
        //         return test;
        //     })
        // });
        // console.log('after request')

        // // On error
        // apiRequest.on('error', function(error) {
        //     console.log('Error posting message ' + JSON.stringify(error));
        // });

        // // On timeout
        // apiRequest.on('timeout', function(error) {
        //     console.log('Timeout posting message ' + JSON.stringify(error));
        // });

        // // Finally, send the body to GroupMe as a string
        // console.log("immediately before the end")
        // apiRequest.end();
        // console.log('after the end')
    };

    //TODO: Need to add functionality to get userids for a group and add them into the @everyone automatically.

    static sendMention(isLex) {
        // Get the GroupMe bot id saved in `.env`
        const botId = process.env.BOT_ID;

        let messageText = "";
        let userids = [];

        if(isLex) {
            messageText = "Lexington people, get in here!";
            userids = ["19542518", "19805360", "24875384", "31510906", "23757907", "23757906", "45258463", "68505902", "25616793", "36989251", "21561546", "22820263","22939688", "22820261", "8209125", "21300347"];
        } else {
            messageText = "Everyone, get in here!";
            userids = ["19542518", "19805360", "3411029", "24875384", "31510906", "23757907", "23757906", "23757908", "6085493", "45258463", "68505902", "25616793", "30500658", "36989251", "21561546", "22820263", "22939688", "20896823", "22820261", "8209125", "21300347", "24365259"];
        }

        let lociList = []

        for (let id of userids) {
            lociList.push([0,9])
        }

        const options = {
            hostname: 'api.groupme.com',
            path: '/v3/bots/post',
            method: 'POST'
        };
    
        const body = {
            bot_id: botId,
            text: messageText,
            attachments: [
                {
                    "type":"mentions",
                    "user_ids":userids,
                    "loci":lociList
                }
            ]
        };
    
        // Make the POST request to GroupMe with the http module
        const botRequest = https.request(options, function(response) {
            if (response.statusCode !== 202) {
                console.log('Rejecting bad status code ' + response.statusCode);
            }
        });

        // On error
        botRequest.on('error', function(error) {
            console.log('Error posting message ' + JSON.stringify(error));
        });

        // On timeout
        botRequest.on('timeout', function(error) {
            console.log('Timeout posting message ' + JSON.stringify(error));
        });

        // Finally, send the body to GroupMe as a string
        botRequest.end(JSON.stringify(body));
    };
};

module.exports = Bot;
