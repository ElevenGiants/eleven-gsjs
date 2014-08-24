var name		= "First-Rate Rainmaker";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Watered 127 Trees";
var status_text		= "You're a one-person sprinkler system! You've been promoted to First-Rate Rainmaker.";
var last_published	= 1323932225;
var is_shareworthy	= 0;
var url		= "firstrate-rainmaker";
var category		= "trees";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-05-09\/firstrate_rainmaker_1304983882.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-05-09\/firstrate_rainmaker_1304983882_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-05-09\/firstrate_rainmaker_1304983882_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-05-09\/firstrate_rainmaker_1304983882_40.png";
function on_apply(pc){
	
}
var conditions = {
	194 : {
		type	: "group_sum",
		group	: "trants_watered",
		value	: "127"
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(40 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 300,
	"favor"	: {
		"giant"		: "grendaline",
		"points"	: 40
	}
};

//log.info("firstrate_rainmaker.js LOADED");

// generated ok (NO DATE)
