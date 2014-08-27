var name		= "Ham Hocker";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Nibbled on 137 enthusiastically acquiescent Piggies";
var status_text		= "That makes 137 Piggies you've nibbled. Slow down - you'll get gas! This Ham Hocker badge is not merely an honor - it's also a warning to others not to get between you and a Piggy.";
var last_published	= 1348798887;
var is_shareworthy	= 1;
var url		= "ham-hocker";
var category		= "animals";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-05-09\/ham_hocker_1304984225.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-05-09\/ham_hocker_1304984225_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-05-09\/ham_hocker_1304984225_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-05-09\/ham_hocker_1304984225_40.png";
function on_apply(pc){
	
}
var conditions = {
	253 : {
		type	: "counter",
		group	: "npc_piggy",
		label	: "nibble",
		value	: "137"
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 50
	}
};

// generated ok (NO DATE)
