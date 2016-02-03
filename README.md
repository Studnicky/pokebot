#Pokebot v2#
[Pokebot](https://pokebot.slack.com/messages)v2 is a rewrite of [Pokebot](https://github.com/Studnicky/pokebot), built on [botkit](https://github.com/howdyai/botkit) instead of [hubot](https://hubot.github.com/).

Pokebot is a full text-based game of pokemon, playable in [Slack](https://slack.com/).
Running Pokebot will require a [bot-user](https://api.slack.com/bot-users) integration to be configured for your slack team.


##Bot Interactions##

#####Textual commands will always follow the pattern (verb) (object) (argument)#####

###Users###

*	Return a list of all slack team users and roles
```
list users
```
*	Return a list of all slack team users currently present
```
find users here
```

###Pokemon###
* Capture a Pokemon
	To attempt to capture a wild Pokemon in the slack channel, throw a Pokeball by applying the type of Pokeball you wish to use as a reaction emote.
	The Pokemon may break free, and the type of ball will affect the probability of catching the Pokemon.  Be fast, only one user can catch each wild Pokemon!

*	Show all available starter Pokemon
```
list starters
```
*	Select (name) from available starter Pokemon
```
pick starter (name)
```

###Party###
*	List all Pokemon in your current party
```
list party
```
*	List all Pokemon in the storage box (number)
```
list box (number)
```
*	List all Pokemon in another user's current party
```
list party (@user)
```
*	Find which Pokemon is at party position (number) or box (number) position (number)
```
find party (number)

find box (number) (number)
```
*	Deposit Pokemon at party position (number) into the first available storage box positon
```
store party (number)
```
*	Withdraw Pokemon at box (number) position (number) into the first available party positon
```
fetch box (number) (number)
```
*	Switch the positions of Pokemon you own in either your party or boxes
```
swap party (number) party (number)

swap party (number) box (number) (number)

swap box (number) (number) party (number)

swap box (number) (number) box (number) (number)
```
*	Release a Pokemon at party position (number) or box (number) position (number)
```
release party (number)

release box (number) (number)
```


##Road Map##
☑	User data

☑	User API

☑	Pokemon data

☑	Pokemon API

☑	Slack Adapter (botkit)

☑	CRUD functionality

☑	User Party data

☑	User Party API

☑	Full [Pokedex](https://github.com/veekun/pokedex) Pokemon database

☐	Create full API endpoints

☐	Front-end web Interface

☐	Unit-testing

☐	User Items

☐	User Pokemon Trade & Sell

☐	User to User Pokemon battles (simple)

☐	User to AI Pokemon battles (simple)

☐	Pokemon EXP & leveling

☐	Pokemon Nature

☐	Pokemon Gender Differences

☐	Pokemon Evolutions

☐	User to User Pokemon battles (full)

☐	Pokemon EV training

☐	Pokemon Abilities

☐	Pokemon Mega-Evolution & Forms

☐	Pokemon Breeding

☐	User to AI Pokemon battles (full)

■	...additional API clients?


##Running locally##

Pokebot relies on [postgres](http://www.postgresql.org/) and several environment variables to run properly.

#####Run ```npm install``` first to get the latest dependency packages.#####

###Environment Variables###

Before you can run Pokebot locally, you must create an `.env` file at the root directory to contain the following:

#####(This should be in the same directory as .gitignore)#####

    PORT=((port for webserver & socket to deliver on))
    
    DATABASE_URL=((your local postgres url))
    
    REALTIME_SLACK_TOKEN=((your bot slack token))

	KEEPALIVE_ENDPOINT=((full app web address url))

###Postgres Database###

* [Install postgres](http://www.postgresql.org/download/)

* Log in to postgres as it's default superuser
```
$ sudo -u postgres psql

```
* Make a new user named pokebot with database creation privileges
```
postgres=#	CREATE USER pokebot CREATEDB CREATEUSER PASSWORD 'oak';
```

* Create a new empty database named pokebot for user pokebot to use
```
postgres=#	CREATE DATABASE pokebot OWNER pokebot TEMPLATE template0;
```

* Exit and log back in as pokebot, enter the password you just made when prompted:
```
postgres=#	\q
$ psql -h localhost -U pokebot
Password for user pokebot:
```

* Make sure the pokebot database exists and belongs to pokebot
```
postgres=# \l

     Name      |  Owner   | Encoding |   Collate   |    Ctype    |   Access privileges   
---------------+----------+----------+-------------+-------------+-----------------------
 pokebot       | pokebot  | UTF8     | en_US.UTF-8 | en_US.UTF-8 | 

(5 rows)

```
* If that's all set up correctly, go ahead and exit psql. Sequelize will do the rest.

```
postgres=#	\q
```

* If that's not what you see, consult the [postgres manual](http://www.postgresql.org/docs/).

* You should now be able to start the application and begin using Pokebot!
```
node app/app.js
```