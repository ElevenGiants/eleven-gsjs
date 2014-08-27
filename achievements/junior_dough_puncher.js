var name		= "Junior Dough Puncher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Prepared 41 unique recipes.";
var status_text		= "You've decocted even more concoctions! Here's a Junior Dough Puncher badge.";
var last_published	= 1323914086;
var is_shareworthy	= 0;
var url		= "junior-dough-puncher";
var category		= "cooking";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-09-13\/junior_dough_puncher_1315979177.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-09-13\/junior_dough_puncher_1315979177_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-09-13\/junior_dough_puncher_1315979177_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-09-13\/junior_dough_puncher_1315979177_40.png";
function on_apply(pc){
	
}
var conditions = {
	14 : {
		type	: "group_count",
		group	: "making_food",
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(40 * multiplier));
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
		"giant"		: "pot",
		"points"	: 40
	}
};

// generated ok (NO DATE)
