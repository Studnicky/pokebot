var api = require(__dirname +'/../api');
var utility = require(__dirname +'/../utility');

var party = {
	name: 'party',
	events: function(controller, bot){

		//	Get list of Pokemon in user party
		controller.hears(['show party <@(.*)>'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			var userid = message.match[1];
			api.party.get_party(userid, function(err, response){
				if(err){
					return bot.reply(message, err);
				} else {
					var replymessage = ('<@'+userid+'>\'s current party members are: \n');
					response.party_members.map(function(instance){
						replymessage += (utility.numeral_suffix(instance.party_position) + ': ' + utility.pokemon_emoji(instance.Pokemon.get(), instance)+ '\n');
					});
					return bot.reply(message, replymessage);
				}
			});
		});

		//	Get list of Pokemon in user party
		controller.hears(['list party'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			api.party.get_party(message.user, function(err, response){
				if(err){
					return bot.reply(message, err);
				} else {
					var replymessage = 'Your current party members are: \n';
					response.party_members.map(function(instance){
						replymessage += (utility.numeral_suffix(instance.party_position) + ': ' + utility.pokemon_emoji(instance.Pokemon.get(), instance)+ '\n');
					});
					return bot.reply(message, replymessage);
				}
			});
		});

		//	Get list of Pokemon in user storage box
		controller.hears(['list (box|pc|storage) ([1-6])'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			var box = typeof(parseInt(message.match[2])) == 'number' ? parseInt(message.match[2]) : 1;
			api.party.get_box(message.user, box, function(err, response){
				if(err){
					return bot.reply(message, err);
				} else {
					var replymessage = '';
					response.box_members.map(function(instance){
						replymessage += utility.numeral_suffix(instance.party_position-(box-1)*30-6) + ': ' + utility.pokemon_emoji(instance.Pokemon, instance) + '\n';
					});
				}
				return bot.reply(message, replymessage);
			});
		});

		//	Get specific member of user party
		controller.hears(['(find|get) ((party)|((box|pc|storage) ([1-6]))) ([1-3]?[0-9])'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			var box = (typeof(message.match[6]) == 'undefined') ? undefined : parseInt(message.match[6]);
			var position = (box)*30-30+6+parseInt(message.match[7]) || parseInt(message.match[7]);
			api.party.get_member(message.user, position, function(err, response){
				if(err){
					return bot.reply(message, err);
				} else {
					var replymessage = '';
					var instance = response.instance;

					if(instance.party_position <= 6){
						replymessage += 'Your ' + utility.numeral_suffix(instance.party_position) + ' party member is: ' + utility.pokemon_emoji(instance.Pokemon, instance) + '.\n';
					} else {
						replymessage += 'Box #' + box + ' ' + utility.numeral_suffix(utility.get_box_position(instance.party_position)) + ' position contains ' + utility.pokemon_emoji(instance.Pokemon, instance) + '\n';
					}
					return bot.reply(message, replymessage);
				}
			});
		});

		//	Swap places of two pokemon in user party or boxes
		controller.hears(['(move|send|swap|switch) ((party)|((box|pc|storage) ([1-6]))) ([1-3]?[0-9]) ((party)|((box|pc|storage) ([1-6]))) ([1-3]?[0-9])'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			if(message.match[7] == 0 || message.match[13] == 0){
				return bot.reply(message, 'Position cannot be zero!');
			}
			var box_1 = (typeof(message.match[6]) == 'undefined') ? undefined : parseInt(message.match[6]);
			var box_2 = (typeof(message.match[12]) == 'undefined') ? undefined : parseInt(message.match[12]);
			var position_1 = (box_1)*30-30+6+parseInt(message.match[7]) || parseInt(message.match[7]);
			var position_2 = (box_2)*30-30+6+parseInt(message.match[13]) || parseInt(message.match[13]);
			
			//	If either position is empty, api will be mad when we attempt to transact
			api.party.swap(message.user, position_1, position_2, function(err, response){
				if(err){
					return bot.reply(message, err);
				} else {
					var replymessage = '';
					response.instances.map(function(instance){
						if(instance.new_position <= 6){
							replymessage += utility.pokemon_emoji(instance.pokemon, instance.instance) + ' moved to party at position ' + instance.new_position + '.\n';
						} else {
							replymessage += utility.pokemon_emoji(instance.pokemon, instance.instance) + ' sent to storage box ' + utility.get_box(instance.new_position) + ' at position ' + utility.get_box_position(instance.new_position) + '.\n';
						}
					});
					return bot.reply(message, replymessage);
				}					
			});
		});

		//	Store specified party member into first available box position
		controller.hears(['(deposit|store) party ([1-6])'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			if(message.match[2] == 0){
				return bot.reply(message, 'Position cannot be zero!');
			}
			var position = parseInt(message.match[2]);
			api.party.store(message.user, position, function(err, response){
				if(err){
					return bot.reply(message, err);
				} else {
					var instance = response.instances[0];	//	Should only be 1 object
					var replymessage = utility.pokemon_emoji(instance.pokemon, instance.instance) + ' sent to storage box ' + utility.get_box(instance.new_position) + ' at position ' + utility.get_box_position(instance.new_position) + '.\n';
					return bot.reply(message, replymessage);
				}
			});
		});

		//	Fetch pokemon from box specified into first available user party position
		controller.hears(['(fetch|retrieve|withdraw) (box|pc|storage) ([1-6]) ([1-3]?[0-9])'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			var box = (typeof(message.match[3]) == 'undefined') ? undefined : parseInt(message.match[3]);
			var position = (box)*30-30+6+parseInt(message.match[4]) || parseInt(message.match[4]);
			api.party.retrieve(message.user, position, function(err, response){
				if(err){
					return bot.reply(message, err);
				} else {
					var instance = response.instances[0];	//	Should only be 1 object
					var replymessage = utility.pokemon_emoji(instance.pokemon, instance.instance) + ' added as to party as ' + utility.numeral_suffix(instance.new_position) + ' member.\n';
					return bot.reply(message, replymessage);
				}
			});
		});

		//	Release target pokemon from user party or box position
		controller.hears(['(delete|release|remove) ((party)|((box|pc|storage) ([1-6]))) ([1-3]?[0-9])'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			var box = (typeof(message.match[6]) == 'undefined') ? undefined : parseInt(message.match[6]);
			var position = (box)*30-30+6+parseInt(message.match[7]) || parseInt(message.match[7]);
			if(box == 0){
				return bot.reply(message, 'There is no box zero!');
			} else if (position == 0){
				return bot.reply(message, 'Box positions are numbered 1 to 30!');
			}
			api.party.get_member(message.user, position, function(err, response){
				if(err){
					return bot.reply(message, err);
				} else {
					var replymessage = '';
					var instance = response.instance;

					if(response.instance.party_position <= 6){
						replymessage += 'Your ' + utility.numeral_suffix(instance.party_position) + ' party member is: ' + utility.pokemon_emoji(instance.Pokemon, instance) + '.\n';
					} else {
						replymessage += 'Box #' + box + ' ' + utility.numeral_suffix(utility.get_box_position(instance.party_position)) + ' position contains ' + utility.pokemon_emoji(instance.Pokemon, instance) + '\n';
					}
					replymessage += 'Do you really want to release ' + utility.pokemon_emoji(instance.Pokemon, instance) + '?';
					return bot.startConversation(message, function(err, convo){
						convo.ask(replymessage, //	Array of objects that contain pattern matchers and callbacks
						[{
							pattern: '(yes)',
							callback: function(response, convo){
								api.party.release(message.user, instance.party_position, function(err, response){
									if(err){
										return convo.say(err);
									} else {
										var replymessage = '';
										if(instance.party_position <= 6){
											replymessage += utility.numeral_suffix(instance.party_position) + ' party position is now empty.\n';
										} else {
											replymessage += 'Box #' + box + ' ' + utility.numeral_suffix(utility.get_box_position(instance.party_position)) + ' position is now empty.\n';
										}
										replymessage += utility.pokemon_emoji(instance.Pokemon, instance) + " waves goodbye as he disappears into the bushes!"
										convo.say(replymessage);
									}
								});
								convo.next();	//	Advance to the next convo ask (or terminate)
							}
						},
						{
							pattern: '(no)',
							callback: function(response, convo){
								convo.say("Ooh, ok. Glad you changed your mind.");
								convo.next();	//	Advance to the next convo ask (or terminate)
							}
						},
						{
							default: true,
							callback: function(response, convo){
								convo.say("Sorry, I didn't understand. Please answer yes or no.");
								convo.repeat();	//	Repeat the question (moves convo index back one)
								convo.next();	//	Advance to the next convo ask (or terminate)
							}
						}])
					});
				}
			});
		});
	}
}

module.exports = party;
