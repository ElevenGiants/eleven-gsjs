//#include config_prod.js

// multiplies health fall and tending interval lengths (i.e. 1 is "normal", more is slower)
var trant_growth_multiplier = 10;

// parameters for animal sadness; see getSadnessMax in items/include/animal_sadness.js
// the resulting maximum is halved for public streets
var population_controls = {
	'npc_piggy': {
		per_width: 2,
		min_max: 6,
		max_max: 10
	},
	'npc_butterfly': {
		per_width: 1,
		min_max: 4,
		max_max: 6
	},
	'npc_chicken': {
		per_width: 1,
		min_max: 4,
		max_max: 6
	}
};

