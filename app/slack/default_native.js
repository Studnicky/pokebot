var default_native = {
	name: 'default_native',
	events: function(controller, bot){

		// controller.on('hello', function(bot, data){
		// 	console.log('The client has successfully connected to the server');
		// 	console.log(data);
		// });

		// controller.on('message', function(bot, data){
		// 	console.log('A message was sent to a channel');
		// 	console.log(data);
		// });

		// controller.on('user_typing', function(bot, data){
		// 	console.log('A channel member is typing a message');
		// 	console.log(data);
		// });

		// controller.on('channel_marked', function(bot, data){
		// 	console.log('Your channel read marker was updated');
		// 	console.log(data);
		// });

		// controller.on('channel_created', function(bot, data){
		// 	console.log('A team channel was created');
		// 	console.log(data);
		// });

		// controller.on('channel_joined', function(bot, data){
		// 	console.log('You joined a channel');
		// 	console.log(data);
		// });

		// controller.on('channel_left', function(bot, data){
		// 	console.log('You left a channel');
		// 	console.log(data);
		// });

		// controller.on('channel_deleted', function(bot, data){
		// 	console.log('A team channel was deleted');
		// 	console.log(data);
		// });

		// controller.on('channel_rename', function(bot, data){
		// 	console.log('A team channel was renamed');
		// 	console.log(data);
		// });

		// controller.on('channel_archive', function(bot, data){
		// 	console.log('A team channel was archived');
		// 	console.log(data);
		// });

		// controller.on('channel_unarchive', function(bot, data){
		// 	console.log('A team channel was unarchived');
		// 	console.log(data);
		// });

		// controller.on('channel_history_changed', function(bot, data){
		// 	console.log('Bulk updates were made to a channel\'s history');
		// 	console.log(data);
		// });

		// controller.on('dnd_updated', function(bot, data){
		// 	console.log('Do not Disturb settings changed for the current user');
		// 	console.log(data);
		// });

		// controller.on('dnd_updated_user', function(bot, data){
		// 	console.log('Do not Disturb settings changed for a team member');
		// 	console.log(data);
		// });

		// controller.on('im_created', function(bot, data){
		// 	console.log('A direct message channel was created');
		// 	console.log(data);
		// });

		// controller.on('im_open', function(bot, data){
		// 	console.log('You opened a direct message channel');
		// 	console.log(data);
		// });

		// controller.on('im_close', function(bot, data){
		// 	console.log('You closed a direct message channel');
		// 	console.log(data);
		// });

		// controller.on('im_marked', function(bot, data){
		// 	console.log('A direct message read marker was updated');
		// 	console.log(data);
		// });

		// controller.on('im_history_changed', function(bot, data){
		// 	console.log('Bulk updates were made to a DM channel\'s history');
		// 	console.log(data);
		// });

		// controller.on('group_joined', function(bot, data){
		// 	console.log('You joined a private group');
		// 	console.log(data);
		// });

		// controller.on('group_left', function(bot, data){
		// 	console.log('You left a private group');
		// 	console.log(data);
		// });

		// controller.on('group_open', function(bot, data){
		// 	console.log('You opened a group channel');
		// 	console.log(data);
		// });

		// controller.on('group_close', function(bot, data){
		// 	console.log('You closed a group channel');
		// 	console.log(data);
		// });

		// controller.on('group_archive', function(bot, data){
		// 	console.log('A private group was archived');
		// 	console.log(data);
		// });

		// controller.on('group_unarchive', function(bot, data){
		// 	console.log('A private group was unarchived');
		// 	console.log(data);
		// });

		// controller.on('group_rename', function(bot, data){
		// 	console.log('A private group was renamed');
		// 	console.log(data);
		// });

		// controller.on('group_marked', function(bot, data){
		// 	console.log('A private group read marker was updated');
		// 	console.log(data);
		// });

		// controller.on('group_history_changed', function(bot, data){
		// 	console.log('Bulk updates were made to a group\'s history');
		// 	console.log(data);
		// });

		// controller.on('file_created', function(bot, data){
		// 	console.log('A file was created');
		// 	console.log(data);
		// });

		// controller.on('file_shared', function(bot, data){
		// 	console.log('A file was shared');
		// 	console.log(data);
		// });

		// controller.on('file_unshared', function(bot, data){
		// 	console.log('A file was unshared');
		// 	console.log(data);
		// });

		// controller.on('file_public', function(bot, data){
		// 	console.log('A file was made public');
		// 	console.log(data);
		// });

		// controller.on('file_private', function(bot, data){
		// 	console.log('A file was made private');
		// 	console.log(data);
		// });

		// controller.on('file_change', function(bot, data){
		// 	console.log('A file was changed');
		// 	console.log(data);
		// });

		// controller.on('file_deleted', function(bot, data){
		// 	console.log('A file was deleted');
		// 	console.log(data);
		// });

		// controller.on('file_comment_added', function(bot, data){
		// 	console.log('A file comment was added');
		// 	console.log(data);
		// });

		// controller.on('file_comment_edited', function(bot, data){
		// 	console.log('A file comment was edited');
		// 	console.log(data);
		// });

		// controller.on('file_comment_deleted', function(bot, data){
		// 	console.log('A file comment was deleted');
		// 	console.log(data);
		// });

		// controller.on('pin_added', function(bot, data){
		// 	console.log('A pin was added to a channel');
		// 	console.log(data);
		// });

		// controller.on('pin_removed', function(bot, data){
		// 	console.log('A pin was removed from a channel');
		// 	console.log(data);
		// });

		// controller.on('presence_change', function(bot, data){
		// 	console.log('A team member\'s presence changed');
		// 	console.log(data);
		// });

		// controller.on('manual_presence_change', function(bot, data){
		// 	console.log('You manually updated your presence');
		// 	console.log(data);
		// });

		// controller.on('pref_change', function(bot, data){
		// 	console.log('You have updated your preferences');
		// 	console.log(data);
		// });

		// controller.on('user_change', function(bot, data){
		// 	console.log('A team member\'s data has changed');
		// 	console.log(data);
		// });

		// controller.on('team_join', function(bot, data){
		// 	console.log('A new team member has joined');
		// 	console.log(data);
		// });

		// controller.on('star_added', function(bot, data){
		// 	console.log('A team member has starred an item');
		// 	console.log(data);
		// });

		// controller.on('star_removed', function(bot, data){
		// 	console.log('A team member removed a star');
		// 	console.log(data);
		// });

		// controller.on('reaction_added', function(bot, data){
		// 	console.log('A team member has added an emoji reaction to an item');
		// 	console.log(data);
		// });

		// controller.on('reaction_removed', function(bot, data){
		// 	console.log('A team member removed an emoji reaction');
		// 	console.log(data);
		// });

		// controller.on('emoji_changed', function(bot, data){
		// 	console.log('A team custom emoji has been added or changed');
		// 	console.log(data);
		// });

		// controller.on('commands_changed', function(bot, data){
		// 	console.log('A team slash command has been added or changed');
		// 	console.log(data);
		// });

		// controller.on('team_plan_change', function(bot, data){
		// 	console.log('The team billing plan has changed');
		// 	console.log(data);
		// });

		// controller.on('team_pref_change', function(bot, data){
		// 	console.log('A team preference has been updated');
		// 	console.log(data);
		// });

		// controller.on('team_rename', function(bot, data){
		// 	console.log('The team name has changed');
		// 	console.log(data);
		// });

		// controller.on('team_domain_change', function(bot, data){
		// 	console.log('The team domain has changed');
		// 	console.log(data);
		// });

		// controller.on('email_domain_changed', function(bot, data){
		// 	console.log('The team email domain has changed');
		// 	console.log(data);
		// });

		// controller.on('team_profile_change', function(bot, data){
		// 	console.log('Team profile fields have been updated');
		// 	console.log(data);
		// });

		// controller.on('team_profile_delete', function(bot, data){
		// 	console.log('Team profile fields have been deleted');
		// 	console.log(data);
		// });

		// controller.on('team_profile_reorder', function(bot, data){
		// 	console.log('Team profile fields have been reordered');
		// 	console.log(data);
		// });

		// controller.on('bot_added', function(bot, data){
		// 	console.log('An integration bot was added');
		// 	console.log(data);
		// });

		// controller.on('bot_changed', function(bot, data){
		// 	console.log('An integration bot was changed');
		// 	console.log(data);
		// });

		// controller.on('accounts_changed', function(bot, data){
		// 	console.log('The list of accounts a user is signed into has changed');
		// 	console.log(data);
		// });

		// controller.on('team_migration_started', function(bot, data){
		// 	console.log('The team is being migrated between servers');
		// 	console.log(data);
		// });

		// controller.on('subteam_created', function(bot, data){
		// 	console.log('A user group has been added to the team');
		// 	console.log(data);
		// });

		// controller.on('subteam_updated', function(bot, data){
		// 	console.log('An existing user group has been updated or its members changed');
		// 	console.log(data);
		// });

		// controller.on('subteam_self_added', function(bot, data){
		// 	console.log('You have been added to a user group');
		// 	console.log(data);
		// });

		// controller.on('subteam_self_removed', function(bot, data){
		// 	console.log('You have been removed from a user group');
		// 	console.log(data);
		// });

	}
}

module.exports = default_native;
