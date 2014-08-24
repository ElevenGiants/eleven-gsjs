var name		= "Advanced Larva Lover";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Fed 103 Caterpillars until they metamorphosized into Butterflies";
var status_text		= "By our count, that's 103 Caterpillars you've lovingly nurtured through those trying juvenile years and into those trying adult years. The least we can do is award you this Advanced Larva Lover badge.";
var last_published	= 1348796055;
var is_shareworthy	= 1;
var url		= "advanced-larva-lover";
var category		= "animals";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-05-09\/advanced_larva_lover_1304984141.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-05-09\/advanced_larva_lover_1304984141_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-05-09\/advanced_larva_lover_1304984141_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-05-09\/advanced_larva_lover_1304984141_40.png";
function on_apply(pc){
	
}
var conditions = {
	242 : {
		type	: "counter",
		group	: "animals_grown",
		label	: "caterpillar",
		value	: "103"
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(125 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 600,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 125
	}
};

//log.info("advanced_larva_lover.js LOADED");

// generated ok (NO DATE)
