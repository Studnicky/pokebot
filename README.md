#Pokebot v2#
Pokebot v2 is a rewrite of [Pokebot](https://github.com/Studnicky/pokebot), without the previous version's dependency on [hubot](https://hubot.github.com/).

Pokebot is a full text-based game of pokemon, playable in [Slack](https://slack.com/).
Running Pokebot will require a configured slack bot integration.

##Running locally##

Pokebot relies on [postgres](http://www.postgresql.org/) and several environment variables to run properly.

###Environment Variables###

Before you can run Pokebot locally, you must create an `.env` file at the root directory to contain the following:

#####(This should be in the same directory as .gitignore)#####

    PORT=((the port you wish to deliver on))
    
    DATABASE_URL=((your local postgres url))
    
    REALTIME_SLACK_TOKEN=((your bot slack token))

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

> If that's not what you see, consult the [postgres manual](http://www.postgresql.org/docs/).

* You should now be able to start the application and begin using Pokebot!

```
node app/app.js
```
#####Don't forget to ```npm install``` before trying to run!#####