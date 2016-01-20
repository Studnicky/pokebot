var default_message = {
	name: 'default_message',
	events: function(bot){

		bot.on('bot_message',function(bot, data){
			console.log('A message was posted by an integration')
			console.log(data);
		});

		bot.on('me_message',function(bot, data){
			console.log('A /me message was sent')
			console.log(data);
		});

		bot.on('message_changed',function(bot, data){
			console.log('A message was changed')
			console.log(data);
		});

		bot.on('message_deleted',function(bot, data){
			console.log('A message was deleted')
			console.log(data);
		});

		bot.on('channel_join',function(bot, data){
			console.log('A team member joined a channel')
			console.log(data);
		});

		bot.on('channel_leave',function(bot, data){
			console.log('A team member left a channel')
			console.log(data);
		});

		bot.on('channel_topic',function(bot, data){
			console.log('A channel topic was updated')
			console.log(data);
		});

		bot.on('channel_purpose',function(bot, data){
			console.log('A channel purpose was updated')
			console.log(data);
		});

		bot.on('channel_name',function(bot, data){
			console.log('A channel was renamed')
			console.log(data);
		});

		bot.on('channel_archive',function(bot, data){
			console.log('A channel was archived')
			console.log(data);
		});

		bot.on('channel_unarchive',function(bot, data){
			console.log('A channel was unarchived')
			console.log(data);
		});

		bot.on('group_join',function(bot, data){
			console.log('A team member joined a group')
			console.log(data);
		});

		bot.on('group_leave',function(bot, data){
			console.log('A team member left a group')
			console.log(data);
		});

		bot.on('group_topic',function(bot, data){
			console.log('A group topic was updated')
			console.log(data);
		});

		bot.on('group_purpose',function(bot, data){
			console.log('A group purpose was updated')
			console.log(data);
		});

		bot.on('group_name',function(bot, data){
			console.log('A group was renamed')
			console.log(data);
		});

		bot.on('group_archive',function(bot, data){
			console.log('A group was archived')
			console.log(data);
		});

		bot.on('group_unarchive',function(bot, data){
			console.log('A group was unarchived')
			console.log(data);
		});

		bot.on('file_share',function(bot, data){
			console.log('A file was shared into a channel')
			console.log(data);
		});

		bot.on('file_comment',function(bot, data){
			console.log('A comment was added to a file')
			console.log(data);
		});

		bot.on('file_mention',function(bot, data){
			console.log('A file was mentioned in a channel')
			console.log(data);
		});

		bot.on('pinned_item',function(bot, data){
			console.log('An item was pinned in a channel')
			console.log(data);
		});

		bot.on('unpinned_item',function(bot, data){
			console.log('An item was unpinned from a channel')
			console.log(data);
		});

	}
}

module.exports = default_message;
