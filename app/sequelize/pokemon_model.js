module.exports = function(sequelize, Sequelize) {

	var Pokemon;
	Pokemon = sequelize.define('Pokemon', {
		national_id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			allowNull: false,
			unique: true,
			hasComment: {type: Sequelize.STRING, field: "Unique Pokedex ID (National index)"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "national_id" }
		},
		name: {
			type: Sequelize.STRING(30),
			allowNull: false,
			unique: true,
			hasComment: {type: Sequelize.STRING, field: "Pokemon name"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "name" }
		},
		generation: {
			type: Sequelize.INTEGER,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Pokemon Generation"}
		},
		height: {
			type: Sequelize.INTEGER,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Pokemon average height"}
		},
		weight: {
			type: Sequelize.INTEGER,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Pokemon average weight"}
		},
		capture_rate: {
			type: Sequelize.INTEGER,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Pokemon capture difficulty"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "capture_rate" }
		},
		happiness: {
			type: Sequelize.INTEGER,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Pokemon base happiness rating"},
		},
		growth_rate: {
			type: Sequelize.STRING(20),
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Pokemon growth rate formula"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "growth_rate" }
		},
		battle_exp: {
			type: Sequelize.INTEGER,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Experience gained on defeating this Pokemon"}
		},
		hatch_counter: {
			type: Sequelize.INTEGER,
			allowNull: true,
			hasComment: {type: Sequelize.STRING, field: "Duration of Pokemon egg form"},
		},
		has_forms: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Can this Pokemon change forms?"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "has_forms" }
		},
		has_gender: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Does this Pokemon have a gender?"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "has_gender" }
		},
		gender_rate: {
			type: Sequelize.REAL,
			allowNull: true,
			hasComment: {type: Sequelize.STRING, field: "Male to Female ratio as (1/value)"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "gender_rate" }
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
		abilities: {
			type: Sequelize.JSON,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Abilities as JSON object"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "abilities" }
		},
		stats: {
			type: Sequelize.JSON,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Abilities as JSON object"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "stats" }
		},
		types: {
			type: Sequelize.JSON,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Types as JSON object"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "types_json" }
		},
		ev_yields: {
			type: Sequelize.JSON,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Effort values yield when defeated"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "ev_yields" }
		},
		evolutions: {
			type: Sequelize.JSON,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Possible evolutions as JSON object"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "evolutions" }
		},
		movelist: {
			type: Sequelize.JSON,
			allowNull: false,
			hasComment: {type: Sequelize.STRING, field: "Movelist as JSON object"},
			fieldWithUnderscores: { type: Sequelize.STRING, field: "moves_json" }
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