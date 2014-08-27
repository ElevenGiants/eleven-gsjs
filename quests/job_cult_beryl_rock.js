var type = 5;
var title = "Beryl Rock";
var desc = "This project is to create a Beryl Rock.";
var completion = "Congrats, you made a Beryl Rock!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1493"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plain_crystal",
		"num"		: 1,
		"base_cost"	: 300,
		"desc"		: "Add crystals"
	},
	"r1496"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "fancy_pick",
		"class_ids"	: {
			"0"	: "fancy_pick",
			"1"	: "pick"
		},
		"skill"		: "mining_1",
		"num"		: 30,
		"base_cost"	: 9,
		"energy"	: 6,
		"wear"		: 1,
		"verb_name"	: "dig",
		"verb_past"	: "dug",
		"desc"		: "Plant crystals"
	},
	"r1499"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "essence_of_silvertongue",
		"num"		: 1,
		"base_cost"	: 283,
		"desc"		: "Add value"
	},
	"r1500"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "essence_of_gandlevery",
		"num"		: 2,
		"base_cost"	: 181,
		"desc"		: "Add fortitude"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(500 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 500
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var performance_percent = 0;
var performance_cutoff = 0;
var performance_rewards = {};

// generated ok (NO DATE)
