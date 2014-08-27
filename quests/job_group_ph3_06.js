var type = 3;
var title = "Celebratory Soirée_Group";
var desc = "This project is for creating a new group-owned location linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 180;
var claimable = 1;

var requirements = {
	"r1141"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "juicy_carpaccio",
		"num"		: 25,
		"base_cost"	: 56,
		"desc"		: "Contribute Juicy Carpaccios - 25 needed!"
	},
	"r1142"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cheese_plate",
		"num"		: 42,
		"base_cost"	: 58,
		"desc"		: "Contribute Cheese Plates - 42 needed!"
	},
	"r1143"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "exotic_fruit_salad",
		"num"		: 35,
		"base_cost"	: 33,
		"desc"		: "Contribute Exotic Fruit Salads - 35 needed!"
	},
	"r1144"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "awesome_pot",
		"class_ids"	: {
			"0"	: "awesome_pot"
		},
		"skill"		: "masterchef_2",
		"num"		: 119,
		"base_cost"	: 13,
		"energy"	: 4,
		"wear"		: 2,
		"verb_name"	: "radiate",
		"verb_past"	: "radiated",
		"desc"		: "Contribute work - 119 units needed with a Awesome Pot and Master Chef II"
	},
	"r1145"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "mike_tyson_grill",
		"class_ids"	: {
			"0"	: "mike_tyson_grill"
		},
		"skill"		: "grilling_2",
		"num"		: 125,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "grill",
		"verb_past"	: "grilled",
		"desc"		: "Contribute work - 125 units needed with a Famous Pugilist Grill and Grilling II"
	},
	"r1146"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "blender",
		"class_ids"	: {
			"0"	: "blender"
		},
		"skill"		: "blending_2",
		"num"		: 156,
		"base_cost"	: 13,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "blend",
		"verb_past"	: "blended",
		"desc"		: "Contribute work - 156 units needed with a Blender and Blending II"
	},
	"r1147"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "sparkle_powder",
		"num"		: 7,
		"base_cost"	: 450,
		"desc"		: "Contribute Sparkle Powder - 7 needed!"
	},
	"r1148"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "laughing_gas",
		"num"		: 42,
		"base_cost"	: 20,
		"desc"		: "Contribute Laughing Gas - 42 needed!"
	},
	"r1149"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "applejack",
		"num"		: 65,
		"base_cost"	: 25,
		"desc"		: "Contribute Applejacks - 65 needed!"
	},
	"r1150"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "saucepan",
		"class_ids"	: {
			"0"	: "saucepan"
		},
		"skill"		: "saucery_2",
		"num"		: 155,
		"base_cost"	: 11,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "simmer",
		"verb_past"	: "simmered",
		"desc"		: "Contribute work - 155 units needed with a Saucepan and Saucery II"
	},
	"r1151"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "cocktail_shaker",
		"class_ids"	: {
			"0"	: "cocktail_shaker"
		},
		"skill"		: "cocktailcrafting_1",
		"num"		: 165,
		"base_cost"	: 9,
		"energy"	: 4,
		"wear"		: 2,
		"verb_name"	: "shake",
		"verb_past"	: "shook",
		"desc"		: "Contribute work - 165 units needed with a Cocktail Shaker and Cocktail Crafting I"
	},
	"r1152"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "knife_and_board",
		"class_ids"	: {
			"0"	: "knife_and_board"
		},
		"skill"		: "cheffery_3",
		"num"		: 175,
		"base_cost"	: 13,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "chop",
		"verb_past"	: "chopped",
		"desc"		: "Contribute work - 175 units needed with a Knife & Board and Cheffery III"
	}
};

var claim_reqs = {
	"r1272"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "currants",
		"num"		: 10000,
		"base_cost"	: 0,
		"desc"		: "Contribute Currants - 10,000 needed!"
	}
};

function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(15000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(15000 * multiplier));
	rewards.energy = pc.metabolics_add_energy(Math.round(15000 * multiplier));
	pc.stats_add_favor_points("all", Math.round(300 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "all", points: Math.round(300 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"		: 15000,
	"mood"		: 15000,
	"energy"	: 15000,
	"favor"		: {
		"0"	: {
			"giant"		: "all",
			"points"	: 300
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(50, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(20);
	rewards.energy = pc.metabolics_add_energy(10);
	rewards.items = [];
	rewards.recipes = [];
	var items = pc.runDropTable("street_creation_rewards_a");
	for (var i in items){
		if (items[i].class_id){
			rewards.items.push({class_tsid: items[i].class_id, label: items[i].label, count: items[i].count});
		}else if (items[i].currants){
			if (!rewards.currants) rewards.currants = 0;
			rewards.currants += items[i].currants;
		}else if (items[i].favor){
			if (!rewards.favor) rewards.favor = [];
			rewards.favor.push(items[i].favor);
		}
	}
	var items = pc.runDropTable("street_creation_trophies");
	for (var i in items){
		if (items[i].class_id){
			rewards.items.push({class_tsid: items[i].class_id, label: items[i].label, count: items[i].count});
		}else if (items[i].currants){
			if (!rewards.currants) rewards.currants = 0;
			rewards.currants += items[i].currants;
		}else if (items[i].favor){
			if (!rewards.favor) rewards.favor = [];
			rewards.favor.push(items[i].favor);
		}
	}
	return rewards;
}
var performance_percent = 0;
var performance_cutoff = 5;
var performance_rewards = {
	"xp"		: 50,
	"mood"		: 20,
	"energy"	: 10,
	"drop_table"	: {
		"0"	: {
			"class_tsid"	: "street_creation_trophies",
			"label"		: "A Street Creator Trophy Piece",
			"count"		: 1
		}
	}
};

// generated ok (NO DATE)
