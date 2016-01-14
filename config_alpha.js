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

// assign everybody to the same live help group (no distinction by level for now)
this.live_help_groups = ['RA512UITCLA22AD'];
this.newbie_live_help_groups = ['RA512UITCLA22AD'];

// make all wall/floor/etc textures free
this.home_limits.UPGRADES_ARE_FREE = true;

// limit POL choice to the available templates
this.homes_interior_configs = {
	meadows_int_default__high: this.homes_interior_configs.meadows_int_default__high,
};
this.homes_exterior_configs = {
	meadow_ext_default_high: this.homes_exterior_configs.meadow_ext_default_high,
};