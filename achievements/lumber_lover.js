var name		= "Lumber Lover";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Petted and watered 41 Wood Trees to the full woody bloom of adulthood";
var status_text		= "Watering and petting 41 trees to maturity has earned you the title of Lumber Lover. Who has greater love for the nourishment and gentle fondling of a tall, proud piece of woody goodness than you, Tiny Glitch? No one. Your grandmother would be proud. If you had one.";
var last_published	= 1323933330;
var is_shareworthy	= 0;
var url		= "lumber-lover";
var category		= "trees";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-09-10\/lumber_lover_1315686030.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-09-10\/lumber_lover_1315686030_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-09-10\/lumber_lover_1315686030_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-09-10\/lumber_lover_1315686030_40.png";
function on_apply(pc){
	
}
var conditions = {
	532 : {
		type	: "counter",
		group	: "wood_tree",
		label	: "maxed",
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
	pc.stats_add_xp(round_to_5(450 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(60 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 450,
	"favor"	: {
		"giant"		: "grendaline",
		"points"	: 60
	}
};

// generated ok (NO DATE)
