var type = 5;
var title = "Dullite Rock";
var desc = "This project is to create a Dullite Rock.";
var completion = "Congrats, you made a Dullite Rock!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1494"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plain_crystal",
		"num"		: 1,
		"base_cost"	: 300,
		"desc"		: "Add crystals"
	},
	"r1497"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "fancy_pick",
		"class_ids"	: {
			"0"	: "fancy_pick",
			"1"	: "pick"
		},
		"skill"		: "mining_1",
		"num"		: 25,
		"base_cost"	: 9,
		"energy"	: 6,
		"wear"		: 1,
		"verb_name"	: "dig",
		"verb_past"	: "dug",
		"desc"		: "Plant crystals"
	},
	"r1501"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "essence_of_hairball",
		"num"		: 1,
		"base_cost"	: 449,
		"desc"		: "Add greyness"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(400 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 400
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
