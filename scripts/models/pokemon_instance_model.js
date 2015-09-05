module.exports = function(sequelize, Sequelize) {

	var Pokemon_Instance;
	Pokemon_Instance = sequelize.define('Pokemon_Instance', {
		caught_by: {
			type: Sequelize.STRING,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Unique user ID generated by Slack"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "slack_id" }
		},
		current_form: {
			type: Sequelize.JSON,
			allowNull: true,
			hasComment: {type: Sequelize.STRING, field: "Pokemon current form"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "current_form" }
		},
		effort_values: {
			type: Sequelize.JSON,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Pokemon EV values for each stat"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "effort_values" }
		},
		exp: {
			type: Sequelize.BIGINT,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Pokemon current experience"}
		},
		gender: {
			type: Sequelize.INTEGER,
			allowNull: true,
			hasComment: {type: Sequelize.STRING, field: "Pokemon Gender (NULL=null 0=F 1=M)"}
		},
		happiness: {
			type: Sequelize.INTEGER,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Pokemon happiness rating"},
		},
		has_pokerus: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Pokemon has pokerus"},
		},
		holds_item: {
			type: Sequelize.JSON,
			allowNull: true,
			hasComment: {type: Sequelize.STRING, field: "Item held by pokemon"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "item_json" }
		},
		individual_values: {
			type: Sequelize.JSON,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Pokemon individual values as JSON"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "iv_json" }
		},
		is_shiny: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Is this pokemon shiny?"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "is_shiny" }
		},
		nature: {
			type: Sequelize.JSON,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Pokemon nature as JSON"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "nature_json" }
		},
		national_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Unique Pokedex ID (National index)"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "national_id" }
		},
		nickname: {
			type: Sequelize.STRING,
			allowNull: true,
			hasComment: {type: Sequelize.STRING, field: "Pokemon nickname"}
		},
		owner_id: {
			type: Sequelize.STRING,
			primaryKey: true,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Unique user ID generated by Slack"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "owner_id" }
		},
		party_position: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Unique user ID generated by Slack"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "party_position" }
		},
		for_trade: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Is this pokemon available for trade?"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "for_trade" }
		},
		been_traded: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Has this pokemon been traded before?"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "been_traded" }
		},
		for_sale: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Is this pokemon available for sale?"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "for_sale" }
		},
		been_sold: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Is this pokemon available for trade?"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "been_sold" }
		}
	},
	{
		tableName: 'pokemon_instance',
		deletedAt: 'deleted_at',
		paranoid: true,
		freezeTableName: true,
		underscored: true,
		underscoredAll: true,
		classMethods: {
			associate: function(models) {
				Pokemon_Instance.belongsTo(models.User, {foreignKey: 'owner_id', targetKey: 'slack_id', as: 'current_owner'});
				Pokemon_Instance.belongsTo(models.User, {foreignKey: 'caught_by', targetKey: 'slack_id', as: 'original_owner'});
				Pokemon_Instance.belongsTo(models.Pokemon, {foreignKey: 'national_id', targetKey: 'national_id', as: 'pokedex_id'});
			},
		}
	});

return Pokemon_Instance;
};