var name		= "Assistant Spice Manager";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Converted 503 Spices";
var status_text		= "Converting 503 spices is nothing to sneeze at. It's serious business, which is why you have now been promoted to Assistant Spice Manager.";
var last_published	= 1348796727;
var is_shareworthy	= 1;
var url		= "assistant-spice-manager";
var category		= "trees";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-05-09\/assistant_spice_manager_1304984324.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-05-09\/assistant_spice_manager_1304984324_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-05-09\/assistant_spice_manager_1304984324_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-05-09\/assistant_spice_manager_1304984324_40.png";
function on_apply(pc){
	
}
var conditions = {
	273 : {
		type	: "counter",
		group	: "making_tool",
		label	: "spice_mill",
		value	: "503"
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
	pc.stats_add_favor_points("spriggan", round_to_5(125 * multiplier));
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
		"giant"		: "spriggan",
		"points"	: 125
	}
};

// generated ok (NO DATE)
