# GroupMe Squad Bot

## What You Need to Know

This is a quick bot that I got set up for a group chat that I moderate. It can handle linking to appropriate resources, mentioning members, and other
misc quality of life things.

### Commands

* /drive will link you to the communal google drive
* /gallery will link you to the Google Photos GroupMe Gallery Archive
* /members will link you to the auto-generated Google Photos Album of Squad members and pets
* /photo drive will link you to the Google Photos Album of photos/videos found on the Google Drive (see /drive)
* Members can be mentioned in mass by using either @all or @everyone
* Members that live in specifically Lexington can be mentioned by using @lexington or @Lexington
* /r #d# will roll a number of dice between 1 and 99 (first #) and a side count of between 1 and 9999 (second #), support for addition and subtraction my come in the future
* /help will link you here... hi. An inline solution for commands will be developed in the future
* /good bot will tell him he is doing a good job
* /shrug will produce the classic `¯\_(ツ)_/¯`

## Changes

There were a few changes that I made to get the bot up and running that are overlooked in the documentation linked below. They are as follows:

* For development purposes [localtunnel.me](localtunnel.me) is deprecated and has been moved to [serverless.social](http://serverless.social) and I was not able to get the localtunnel library to continue working with the code. I was not able to properly test until it was set up in heroku and on a test GroupMe group. Which I also suggest as a workaround.
* On Heroku the BOT_ID will also need to be entered into the settings under the Config Vars section
* On any Heroku issues ensure that you run a `heroku restart`

### Acknowledgements

* If you want to make your own bot you can follow along the tutorial found at [github.com/ACMatUC/groupme-bot-starter](https://github.com/ACMatUC/groupme-bot-starter)
