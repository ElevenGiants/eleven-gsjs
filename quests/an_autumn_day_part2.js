var title = "An Autumn Day";
var desc = "";
var offer = "Are you ready to reminisce An Autumn Day?";
var completion = "Welcome back, {pc_label}. I hope you enjoyed yourself.";


var auto_complete = 0;
var familiar_turnin = 0;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_repeatable = 1;
var hide_questlog = 1;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = ["an_autumn_day"];
var prerequisites = [];
var end_npcs = ["street_spirit","street_spirit_firebog","street_spirit_zutto","street_spirit_groddle","street_spirit_ix"];
var locations = {
	"an_autumn_day"			: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LUVCCQSMDIB3HOI"
	},
	"an_autumn_day_stillness"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LUVCL0STDIB37HE"
	},
	"an_autumn_day_comfort"		: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LUVCLOOUDIB3432"
	},
	"an_autumn_day_wonder"		: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LUVCMAKVDIB33B4"
	}
};

var requirements = {
	"r537"	: {
		"type"		: "flag",
		"name"		: "leave",
		"desc"		: "toggle flag leave"
	}
};

function onComplete(pc){ // generated from rewards
	var xp=0;
	var currants=0;
	var mood=0;
	var energy=0;
	var favor=0;
	var multiplier = pc.buffs_has('gift_of_gab') ? 1.2 : pc.buffs_has('silvertongue') ? 1.05 : 1.0;
	multiplier += pc.imagination_get_quest_modifier();
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
}
var rewards = {};

function callback_an_autumn_day_finish(details){
	var pc = details.pc;
	if (!pc) pc = this.owner;
				
	if (!pc) return;
				
	this.set_flag(pc, 'leave');
		
	var exit = pc.instances_get_exit(pc.location.instance_id);
	pc.teleportToLocationDelayed(exit.tsid, exit.x, exit.y);
}

function canOffer(pc){
	// We don't want to offer this immediately after part 1 finishes
	var part1 = pc.getQuestInstance('an_autumn_day');
	if (!part1) return false;
	if (!part1.ts_done) return false;
	if (time() - part1.ts_done < 60*60) return false;
			
	// Also repeatable only once every hour
	if (this.ts_done && time() - this.ts_done < 60*60) return false;
	if (this.fail_time && time() - this.fail_time < 60*60) return false;
	
	return true;
}

function onExitLocation(previous_location){
	var pc = this.owner;
	if (!pc) return;
		
	if (pc.location.instance_id == 'an_autumn_day' || pc.location.instance_id == 'an_autumn_day_stillness' || pc.location.instance_id == 'an_autumn_day_comfort' || pc.location.instance_id == 'an_autumn_day_wonder'){
		if (previous_location == 'an_autumn_day') pc.instances_exit(previous_location);
		return;
	}
				
	if (!this.is_complete){
		pc.quests_fail_and_remove(this.class_tsid);
	
		pc.instances_exit(previous_location);
	}
}

function onStarted(pc){
	this.questInstanceLocation(pc, 'an_autumn_day', 0, 0, 5*60, {preserve_links: true}, {}, true);
		
	return {ok: 1};
}

// generated ok (NO DATE)
