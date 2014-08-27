var name		= "Second-Rate Rainmaker";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Watered 41 Trees";
var status_text		= "What would the plants do without you? You deserve the title Second-Rate Rainmaker.";
var last_published	= 1323932219;
var is_shareworthy	= 0;
var url		= "secondrate-rainmaker";
var category		= "trees";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-05-09\/secondrate_rainmaker_1304983875.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-05-09\/secondrate_rainmaker_1304983875_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-05-09\/secondrate_rainmaker_1304983875_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-05-09\/secondrate_rainmaker_1304983875_40.png";
function on_apply(pc){
	
}
var conditions = {
	193 : {
		type	: "group_sum",
		group	: "trants_watered",
		value	: "41"
	},
};
function onComplete(pc){ // generated from rewards
	var multiplier = pc.buffs_has('gift_of_gab') ? 1.2 : pc.buffs_has('silvertongue') ? 1.05 : 1.0;
	multiplier += pc.imagination_get_achievement_modifier();
	if (/completist/i.exec(this.name)) { 
		 var level = pc.stats_get_level(); 
		 if (level > 4) {  
				multiplier *= (pc.stats_get_level()/4); 
		} 
	} 
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 150,
	"favor"	: {
		"giant"		: "grendaline",
		"points"	: 20
	}
};

// generated ok (NO DATE)
