module.exports = function(sequelize, Sequelize) {

	var Pokemon;
	Pokemon = sequelize.define('Pokemon', {
		abilities: {
			type: Sequelize.JSON,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Abilities as JSON object"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "abilties_json" }
		},
		attack: {
			type: Sequelize.INTEGER,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Attack rating"}
		},
		catch_rate: {
			type: Sequelize.INTEGER,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Special Attack Rating"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "catch_rate" }
		},
		defense: {
			type: Sequelize.INTEGER,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Defense Rating"}
		},
		evolutions: {
			type: Sequelize.JSON,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Possible evolutions as JSON object"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "evolutions_json" }
		},
		ev_yield: {
			type: Sequelize.JSON,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Effort values yield when defeated"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "ev_yield" }
		},
		gen: {
			type: Sequelize.INTEGER,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Pokemon Generation"}
		},
		growth_rate: {
			type: Sequelize.JSON,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Pokemon growth rate formula"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "growth_rate" }
		},
		hp: {
			type: Sequelize.INTEGER,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Health Points"}
		},
		is_legendary: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Is this pokemon considered legendary?"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "is_legendary" }
		},
		is_mythical: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Is this pokemon considered mythical?"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "is_mythical" }
		},
		is_starter: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Is this an available starter pokemon?"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "is_starter" }
		},
		is_wild: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Is this pokemon seen in the wild?"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "is_wild" }
		},
		male_female_ratio: {
			type: Sequelize.REAL,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Male to Female ratio"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "m_to_f" }
		},
		movelist: {
			type: Sequelize.JSON,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Movelist as JSON object"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "moves_json" }
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
			hasComment: {type: Sequelize.STRING, field: "Pokemon name"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "display_name" }
		},
		national_id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			allowNull: false,
			unique: true,
			hasComment: {type: Sequelize.STRING, field: "Unique Pokedex ID (National index)"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "national_id" }
		},
		sp_atk: {
			type: Sequelize.INTEGER,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Special Attack Rating"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "sp_atk" }
		},
		sp_def: {
			type: Sequelize.INTEGER,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Special Defense Rating"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "sp_def" }
		},
		speed: {
			type: Sequelize.INTEGER,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Speed Rating"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "speed" }
		},
		types: {
			type: Sequelize.JSON,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Types as JSON object"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "types_json" }
		}
	},{
		tableName: 'pokemon',
		deletedAt: 'deleted_at',
		freezeTableName: true,
		paranoid: true,
		underscored: true,
		underscoredAll: true,
		classMethods: {
			associate: function(models) {
				Pokemon.hasMany(models.Pokemon_Instance, {foreignKey: 'national_id', targetKey: 'national_id'});
			},
		}
	});

return Pokemon;
};