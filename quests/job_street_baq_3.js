var type = 1;
var title = "Fruit 1";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r843"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "banana",
		"num"		: 637,
		"base_cost"	: 10,
		"desc"		: "Contribute Bananas - 637 needed!"
	},
	"r844"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "lemon",
		"num"		: 777,
		"base_cost"	: 5,
		"desc"		: "Contribute Lemons - 777 needed!"
	},
	"r845"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "strawberry",
		"num"		: 828,
		"base_cost"	: 4,
		"desc"		: "Contribute Strawberries - 828 needed!"
	},
	"r846"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "fruit_changing_machine",
		"class_ids"	: {
			"0"	: "fruit_changing_machine"
		},
		"skill"		: "fruitchanging_1",
		"num"		: 1900,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "go mental",
		"verb_past"	: "went mental",
		"desc"		: "Contribute work - 1,900 units needed with a Fruit Changing Machine and Fruit Changing"
	},
	"r847"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "apple",
		"num"		: 1111,
		"base_cost"	: 5,
		"desc"		: "Contribute Apples - 1111 needed!"
	},
	"r848"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "mangosteen",
		"num"		: 475,
		"base_cost"	: 10,
		"desc"		: "Contribute Mangosteens - 475 needed!"
	},
	"r849"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plum",
		"num"		: 925,
		"base_cost"	: 3,
		"desc"		: "Contribute Plums - 925 needed!"
	},
	"r850"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "ore_grinder",
		"class_ids"	: {
			"0"	: "ore_grinder"
		},
		"skill"		: "refining_2",
		"num"		: 1625,
		"base_cost"	: 9,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "squash",
		"verb_past"	: "squashed",
		"desc"		: "Contribute work - 1,625 units needed with a Grinder and Refining II"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(18500 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(32000 * multiplier));
	pc.stats_add_favor_points("grendaline", Math.round(2800 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "grendaline", points: Math.round(2800 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 18500,
	"mood"	: 32000,
	"favor"	: {
		"0"	: {
			"giant"		: "grendaline",
			"points"	: 2800
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(125, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.favor = [];
	rewards.favor.push({giant: "grendaline", points: 2800});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var performance_percent = 0;
var performance_cutoff = 5;
var performance_rewards = {
	"xp"	: 125,
	"favor"	: {
		"0"	: {
			"giant"		: "mab",
			"points"	: 100
		}
	}
};

// generated ok (NO DATE)
