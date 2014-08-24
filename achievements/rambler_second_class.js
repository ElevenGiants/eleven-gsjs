var name		= "Rambler, Second Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited 127 new locations.";
var status_text		= "Wow! You've covered a lot of ground since your travels began. You've earned this Rambler, Second Class badge.";
var last_published	= 1348802469;
var is_shareworthy	= 1;
var url		= "rambler-second-class";
var category		= "exploring";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-09-18\/rambler_second_class_1316414513.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-09-18\/rambler_second_class_1316414513_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-09-18\/rambler_second_class_1316414513_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-09-18\/rambler_second_class_1316414513_40.png";
function on_apply(pc){
	
}
var conditions = {
	6 : {
		type	: "group_count",
		group	: "locations_visited",
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(75 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 75
	}
};

//log.info("rambler_second_class.js LOADED");

// generated ok (NO DATE)
