var name		= "Super Supreme Egg Plant Coddler";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Administered firm, life-sustaining pettings to 127 Egg Plants";
var status_text		= "The votes are in. You have been nominated Super Supreme Egg Plant Coddler. The title comes with a badge and various secret Egg-related duties.";
var last_published	= 1348802882;
var is_shareworthy	= 1;
var url		= "super-supreme-egg-plant-coddler";
var category		= "trees";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-05-09\/super_supreme_egg_plant_coddler_1304984609.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-05-09\/super_supreme_egg_plant_coddler_1304984609_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-05-09\/super_supreme_egg_plant_coddler_1304984609_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-05-09\/super_supreme_egg_plant_coddler_1304984609_40.png";
function on_apply(pc){
	
}
var conditions = {
	321 : {
		type	: "counter",
		group	: "trants_petted",
		label	: "trant_egg",
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(100 * multiplier));
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
		"giant"		: "grendaline",
		"points"	: 100
	}
};

//log.info("super_supreme_egg_plant_coddler.js LOADED");

// generated ok (NO DATE)
