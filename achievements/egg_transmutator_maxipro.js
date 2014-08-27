var name		= "Egg Transmutator Maxi-Pro";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Seasoned 2003 Eggs. That's right, 2003.";
var status_text		= "Some might consider the title Egg Transmutator Maxi-Pro goofy. Undignified for someone who has seasoned 2003 eggs. Well, that's just their opinion.";
var last_published	= 1348797721;
var is_shareworthy	= 1;
var url		= "egg-transmutator-maxipro";
var category		= "animals";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-05-09\/egg_transmutator_maxipro_1304984352.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-05-09\/egg_transmutator_maxipro_1304984352_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-05-09\/egg_transmutator_maxipro_1304984352_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-05-09\/egg_transmutator_maxipro_1304984352_40.png";
function on_apply(pc){
	
}
var conditions = {
	278 : {
		type	: "counter",
		group	: "making_tool",
		label	: "egg_seasoner",
		value	: "2003"
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
	pc.stats_add_xp(round_to_5(800 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(175 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 800,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 175
	}
};

// generated ok (NO DATE)
