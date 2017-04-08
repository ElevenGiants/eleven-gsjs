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

// no "live help" chat groups for now
this.live_help_groups = [];
this.newbie_live_help_groups = [];

// make all wall/floor/etc textures free
this.home_limits.UPGRADES_ARE_FREE = true;

// limit POL choice to the available templates
this.homes_interior_configs = {
	uralia_2a_int_high: this.homes_interior_configs.uralia_2a_int_high,
	basic_int: this.homes_interior_configs.basic_int,
	_moon_int_high: this.homes_interior_configs._moon_int_high,
};
this.homes_exterior_configs = {
	uralia_2a_high: this.homes_exterior_configs.uralia_2a_high,
	basic: this.homes_exterior_configs.basic,
	_moon_high: this.homes_exterior_configs._moon_high,
};

// set default POL templates
this.home_limits.START_EXT_TEMPLATE = "uralia_2a_high";
this.home_limits.START_INT_TEMPLATE = "uralia_2a_int_high";

// disable quests that tp the player to an instance we do not have
var disabled_quests = [
	'an_autumn_day',
	'an_autumn_day_part2',
	'animalkinship_1',
	'ezcooking_1',
	'lightgreenthumb_1',
	'soilappreciation_1',
	'blue_and_white_part1',
	'blue_and_white_part2',
	'btc_room_3',
	'btc_room_3_reminisce',
	'eyeballery_identify_object',
	'fuelmaking_refuel_robot',
	'greedy_street_spirit_reminisce',
	'greedy_street_spirit',
	'help_juju_bandits_2',
	'help_juju_bandits',
	'join_club',
	'join_club_reminisce',
	'last_pilgrimage_of_esquibeth',
	'last_pilgrimage_of_esquibeth_reminisce',
	'le_miserable_part_2',
	'le_miserable_reminisce',
	'le_miserable',
	'letter_block_1',
	'letter_block_2',
	'letter_block_3',
	'mental_block_2',
	'mental_block_reminisce',
	'mental_block',
	'pico_pattern',
	'puzzle_level_color_blockage_rem',
	'puzzle_level_color_blockage',
	'puzzle_level_light_perspective_rem',
	'puzzle_level_light_perspective',
	'radiant_glare_rem',
	'radiant_glare',
	'rook_hall',
	'rube_spy',
	'stale_but_necessary',
	'where_the_blue_grew',
	'winter_walk_part2',
	'winter_walk',
];
