var BotKit = require('botkit');
var request = require('request');
var db = require(__dirname +'/../db');

//	Instantiate botkit, spawn controller
var slack = BotKit.slackbot({debug: false, log: true});
slack.spawn({token: process.env.REALTIME_SLACK_TOKEN}).startRTM(function(err,bot,payload) {
	if (err) {
		throw new Error('Could not connect to Slack');
	}
});

/***************************** slack native events *****************************/
slack.on('hello', function(bot, data){
	console.log('The client has successfully connected to the server');
	console.log(data);
});
slack.on('message', function(bot, data){
	console.log('A message was sent to a channel');
	console.log(data);
});
slack.on('user_typing', function(bot, data){
	console.log('A channel member is typing a message');
	console.log(data);
});
slack.on('channel_marked', function(bot, data){
	console.log('Your channel read marker was updated');
	console.log(data);
});
slack.on('channel_created', function(bot, data){
	console.log('A team channel was created');
	console.log(data);
});
slack.on('channel_joined', function(bot, data){
	console.log('You joined a channel');
	console.log(data);
});
slack.on('channel_left', function(bot, data){
	console.log('You left a channel');
	console.log(data);
});
slack.on('channel_deleted', function(bot, data){
	console.log('A team channel was deleted');
	console.log(data);
});
slack.on('channel_rename', function(bot, data){
	console.log('A team channel was renamed');
	console.log(data);
});
slack.on('channel_archive', function(bot, data){
	console.log('A team channel was archived');
	console.log(data);
});
slack.on('channel_unarchive', function(bot, data){
	console.log('A team channel was unarchived');
	console.log(data);
});
slack.on('channel_history_changed', function(bot, data){
	console.log('Bulk updates were made to a channel\'s history');
	console.log(data);
});
slack.on('dnd_updated', function(bot, data){
	console.log('Do not Disturb settings changed for the current user');
	console.log(data);
});
slack.on('dnd_updated_user', function(bot, data){
	console.log('Do not Disturb settings changed for a team member');
	console.log(data);
});
slack.on('im_created', function(bot, data){
	console.log('A direct message channel was created');
	console.log(data);
});
slack.on('im_open', function(bot, data){
	console.log('You opened a direct message channel');
	console.log(data);
});
slack.on('im_close', function(bot, data){
	console.log('You closed a direct message channel');
	console.log(data);
});
slack.on('im_marked', function(bot, data){
	console.log('A direct message read marker was updated');
	console.log(data);
});
slack.on('im_history_changed', function(bot, data){
	console.log('Bulk updates were made to a DM channel\'s history');
	console.log(data);
});
slack.on('group_joined', function(bot, data){
	console.log('You joined a private group');
	console.log(data);
});
slack.on('group_left', function(bot, data){
	console.log('You left a private group');
	console.log(data);
});
slack.on('group_open', function(bot, data){
	console.log('You opened a group channel');
	console.log(data);
});
slack.on('group_close', function(bot, data){
	console.log('You closed a group channel');
	console.log(data);
});
slack.on('group_archive', function(bot, data){
	console.log('A private group was archived');
	console.log(data);
});
slack.on('group_unarchive', function(bot, data){
	console.log('A private group was unarchived');
	console.log(data);
});
slack.on('group_rename', function(bot, data){
	console.log('A private group was renamed');
	console.log(data);
});
slack.on('group_marked', function(bot, data){
	console.log('A private group read marker was updated');
	console.log(data);
});
slack.on('group_history_changed', function(bot, data){
	console.log('Bulk updates were made to a group\'s history');
	console.log(data);
});
slack.on('file_created', function(bot, data){
	console.log('A file was created');
	console.log(data);
});
slack.on('file_shared', function(bot, data){
	console.log('A file was shared');
	console.log(data);
});
slack.on('file_unshared', function(bot, data){
	console.log('A file was unshared');
	console.log(data);
});
slack.on('file_public', function(bot, data){
	console.log('A file was made public');
	console.log(data);
});
slack.on('file_private', function(bot, data){
	console.log('A file was made private');
	console.log(data);
});
slack.on('file_change', function(bot, data){
	console.log('A file was changed');
	console.log(data);
});
slack.on('file_deleted', function(bot, data){
	console.log('A file was deleted');
	console.log(data);
});
slack.on('file_comment_added', function(bot, data){
	console.log('A file comment was added');
	console.log(data);
});
slack.on('file_comment_edited', function(bot, data){
	console.log('A file comment was edited');
	console.log(data);
});
slack.on('file_comment_deleted', function(bot, data){
	console.log('A file comment was deleted');
	console.log(data);
});
slack.on('pin_added', function(bot, data){
	console.log('A pin was added to a channel');
	console.log(data);
});
slack.on('pin_removed', function(bot, data){
	console.log('A pin was removed from a channel');
	console.log(data);
});
slack.on('presence_change', function(bot, data){
	console.log('A team member\'s presence changed');
	console.log(data);
});
slack.on('manual_presence_change', function(bot, data){
	console.log('You manually updated your presence');
	console.log(data);
});
slack.on('pref_change', function(bot, data){
	console.log('You have updated your preferences');
	console.log(data);
});
slack.on('user_change', function(bot, data){
	console.log('A team member\'s data has changed');
	console.log(data);
});
slack.on('team_join', function(bot, data){
	console.log('A new team member has joined');
	console.log(data);
});
slack.on('star_added', function(bot, data){
	console.log('A team member has starred an item');
	console.log(data);
});
slack.on('star_removed', function(bot, data){
	console.log('A team member removed a star');
	console.log(data);
});
slack.on('reaction_added', function(bot, data){
	console.log('A team member has added an emoji reaction to an item');
	console.log(data);
});
slack.on('reaction_removed', function(bot, data){
	console.log('A team member removed an emoji reaction');
	console.log(data);
});
slack.on('emoji_changed', function(bot, data){
	console.log('A team custom emoji has been added or changed');
	console.log(data);
});
slack.on('commands_changed', function(bot, data){
	console.log('A team slash command has been added or changed');
	console.log(data);
});
slack.on('team_plan_change', function(bot, data){
	console.log('The team billing plan has changed');
	console.log(data);
});
slack.on('team_pref_change', function(bot, data){
	console.log('A team preference has been updated');
	console.log(data);
});
slack.on('team_rename', function(bot, data){
	console.log('The team name has changed');
	console.log(data);
});
slack.on('team_domain_change', function(bot, data){
	console.log('The team domain has changed');
	console.log(data);
});
slack.on('email_domain_changed', function(bot, data){
	console.log('The team email domain has changed');
	console.log(data);
});
slack.on('team_profile_change', function(bot, data){
	console.log('Team profile fields have been updated');
	console.log(data);
});
slack.on('team_profile_delete', function(bot, data){
	console.log('Team profile fields have been deleted');
	console.log(data);
});
slack.on('team_profile_reorder', function(bot, data){
	console.log('Team profile fields have been reordered');
	console.log(data);
});
slack.on('bot_added', function(bot, data){
	console.log('An integration bot was added');
	console.log(data);
});
slack.on('bot_changed', function(bot, data){
	console.log('An integration bot was changed');
	console.log(data);
});
slack.on('accounts_changed', function(bot, data){
	console.log('The list of accounts a user is signed into has changed');
	console.log(data);
});
slack.on('team_migration_started', function(bot, data){
	console.log('The team is being migrated between servers');
	console.log(data);
});
slack.on('subteam_created', function(bot, data){
	console.log('A user group has been added to the team');
	console.log(data);
});
slack.on('subteam_updated', function(bot, data){
	console.log('An existing user group has been updated or its members changed');
	console.log(data);
});
slack.on('subteam_self_added', function(bot, data){
	console.log('You have been added to a user group');
	console.log(data);
});
slack.on('subteam_self_removed', function(bot, data){
	console.log('You have been removed from a user group');
	console.log(data);
});
/************************ slack message subtype events *************************/
slack.on('bot_message',function(bot, data){
	console.log('A message was posted by an integration')
	console.log(data);
});
slack.on('me_message',function(bot, data){
	console.log('A /me message was sent')
	console.log(data);
});
slack.on('message_changed',function(bot, data){
	console.log('A message was changed')
	console.log(data);
});
slack.on('message_deleted',function(bot, data){
	console.log('A message was deleted')
	console.log(data);
});
slack.on('channel_join',function(bot, data){
	console.log('A team member joined a channel')
	console.log(data);
});
slack.on('channel_leave',function(bot, data){
	console.log('A team member left a channel')
	console.log(data);
});
slack.on('channel_topic',function(bot, data){
	console.log('A channel topic was updated')
	console.log(data);
});
slack.on('channel_purpose',function(bot, data){
	console.log('A channel purpose was updated')
	console.log(data);
});
slack.on('channel_name',function(bot, data){
	console.log('A channel was renamed')
	console.log(data);
});
slack.on('channel_archive',function(bot, data){
	console.log('A channel was archived')
	console.log(data);
});
slack.on('channel_unarchive',function(bot, data){
	console.log('A channel was unarchived')
	console.log(data);
});
slack.on('group_join',function(bot, data){
	console.log('A team member joined a group')
	console.log(data);
});
slack.on('group_leave',function(bot, data){
	console.log('A team member left a group')
	console.log(data);
});
slack.on('group_topic',function(bot, data){
	console.log('A group topic was updated')
	console.log(data);
});
slack.on('group_purpose',function(bot, data){
	console.log('A group purpose was updated')
	console.log(data);
});
slack.on('group_name',function(bot, data){
	console.log('A group was renamed')
	console.log(data);
});
slack.on('group_archive',function(bot, data){
	console.log('A group was archived')
	console.log(data);
});
slack.on('group_unarchive',function(bot, data){
	console.log('A group was unarchived')
	console.log(data);
});
slack.on('file_share',function(bot, data){
	console.log('A file was shared into a channel')
	console.log(data);
});
slack.on('file_comment',function(bot, data){
	console.log('A comment was added to a file')
	console.log(data);
});
slack.on('file_mention',function(bot, data){
	console.log('A file was mentioned in a channel')
	console.log(data);
});
slack.on('pinned_item',function(bot, data){
	console.log('An item was pinned in a channel')
	console.log(data);
});
slack.on('unpinned_item',function(bot, data){
	console.log('An item was unpinned from a channel')
	console.log(data);
});
/****************************** web socket events ******************************/
slack.on('rtm_open', function(bot, data){
	console.log('slack connected!')
	console.log(data);
});
slack.on('rtm_close', function(bot, data){
	console.log('slack connection lost!');
	console.log(data);
});
/***************************** botkit custom events ****************************/
slack.on('message_received', function(bot, data){
	console.log('A message was received by the bot');
	console.log(data);
});
slack.on('bot_channel_join', function(bot, data){
	console.log('The bot has joined a channel');
	console.log(data);
});
slack.on('user_channel_join', function(bot, data){
	console.log('A user has joined a channel');
	console.log(data);
});
slack.on('bot_group_join', function(bot, data){
	console.log('The bot has joined a group');
	console.log(data);
});
slack.on('user_group_join', function(bot, data){
	console.log('A user has joined a group');
	console.log(data);
});
slack.on('direct_message', function(bot, data){
	console.log('The bot received a direct message from a user');
	console.log(data);
});
slack.on('direct_mention', function(bot, data){
	console.log('The bot was addressed directly in a channel');
	console.log(data);
});
slack.on('mention', function(bot, data){
	console.log('The bot was mentioned by someone in a message');
	console.log(data);
});
slack.on('ambient', function(bot, data){
	console.log('The message received had no mention of the bot');
	console.log(data);
});
/****************************** web socket events ******************************/

	// web: {
	// 	user: {
	// 		list: {
	// 			get: function(callback){
	// 				request.get(slackEndpoint +'users.list', {
	// 					json: true,
	// 					qs: {token: slackToken}
	// 				}, function(error, response, data) {
	// 					// If we fetched the list, might as well update it
	// 					db.user.list.set(data);

	// 					if(typeof(callback) =='function'){
	// 						callback(data.members);
	// 					}

	// 				});
	// 			},
	// 			presence: function(callback){
	// 				request.get(slackEndpoint +'users.list', {
	// 					json: true,
	// 					qs: {token: slackToken, presence: 1}
	// 				}, function(error, response, data) {

	// 					if (data.ok !== true){
	// 						console.log('Failed to retrieve users list from slack API\n'+ error);
	// 					} else {
	// 						var active_users = [];

	// 						if(typeof(callback) =='function'){
	// 							callback(data.members);
	// 						}

	// 					}
	// 				});
	// 			}	
	// 		}
	// 	}
	// }

	module.exports = slack;