module.exports = function(sequelize, Sequelize) {
	
	var User;
	User = sequelize.define('User', {
		slack_id: {
			type: Sequelize.STRING,
			primaryKey: true,
			allowNull: false,
			unique: true,
			hasComment: {type: Sequelize.STRING, field: "Unique user ID generated by Slack"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "slack_id" }
		},
		slack_name: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
			hasComment: {type: Sequelize.STRING, field: "Username registered in Slack"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "slack_name" }
		},
		tz_offset: {
			type: Sequelize.STRING,
			allowNull: true,	//	Bot users do not always have tx_offset
			hasComment: {type: Sequelize.STRING, field: "User home timezone"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "tz_offset" }
		},
		permissions_level: {
			type: Sequelize.INTEGER,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "User permissions level"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "permissions_level" }
		},
		position_cap: {
			type: Sequelize.INTEGER,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "User pokemon max count"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "permissions_level" }
		},
		credits: {
			type: Sequelize.INTEGER,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "User credit balance"}
		}
	},
	{
		tableName: 'users',
		deletedAt: 'deleted_at',
		freezeTableName: true,
		paranoid: true,
		underscored: true,
		underscoredAll: true,
		classMethods: {
			associate: function(models) {
				User.hasMany(models.Pokemon_Instance, {foreignKey: 'slack_id', targetKey: 'owner_id'});
				User.hasMany(models.Pokemon_Instance, {foreignKey: 'slack_id', targetKey: 'caught_by'});
			}
		},
		instanceMethods: {
			//	TODO: Method to find open party positions, reads from pokemon_instance table
		}
	});

	return User;
};