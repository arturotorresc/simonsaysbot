# SimonSaysBot

_This was a mini project done for fun and I suspect there are other bots out there that do the same thing._

SimonSaysBot is a Twitch bot used to interact with your viewers by defining a list of polls in a .toml file
and letting viewers vote on those polls. After a poll has ended the bot will throw the result and the streamer
is supposed to do what the bot said.

This bot is meant to be self hosted. The binaries are in this repo or if you wish to create them manually I used
the `pkg` npm package to create the binaries.

To generate the binaries download the source code and go into the project directory and call `pkg .`.

**It is recommended that you make the bot a mod to increase message limit**

## Downloading the bot

https://github.com/arturotorresc/simonsaysbot/releases

## Config file

The config file is a .toml file that should live in the `${homeDirectory}/simonsaysbot/config.toml`.

For example for Windows users it might be:
`C:\Users\<My Windows UserName>\simonsaysbot\config.toml`

The options available to configure the bot are:

### channels

A list of channels to connect the bot to, you should put your channel name here enclosed by brackets.
Example: `channels = ["ninja"]`

### polls

A list of polls that the bot will choose from when being called with the `!simonsays go` command.
See the example.config.toml file for an example of how to setup polls.

### defaultDuration

The number of **seconds** that a poll should last.
Example: `defaultDuration = 300`
_For 5 minute polls_

## Commands

The main command is `!simonsays` but it can also be called with `!simondice` since this is a bot
for spanish-speaking streamers.

### !simonsays go

**Can only be called by the mods or the broadcaster.**
The bot will take a random poll from the list of polls defined in the .toml file and display it to users.
This can't be called if there is already an ongoing poll.

### !simonsays options

**Can be called by anyone**
If there is an ongoing poll the bot will display the available options to vote on.

### !simonsays results

**Can be called by anyone**
Displays the results of the last poll.

### !simonsays [vote option number]

**Can be called by anyone**
Votes on a given option while a poll is live. A single user can call this many times to vote multiple times.

### !simonsays help

**Can be called by anyone**
Displays the available commands.

# If downloading the source code

You need to have a `.env` file with variables:

- BOT_USERNAME=<Bot username>
- PASSWORD=<Bot oauth token>

See twitch docs for how to generate oauth token.
