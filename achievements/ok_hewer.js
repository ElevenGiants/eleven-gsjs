var name		= "OK Hewer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Mined for ore 11 times";
var status_text		= "Here's some news that will tickle your callouses: for your efforts with a pick, you've just earned the designation OK Hewer.";
var last_published	= 1323922489;
var is_shareworthy	= 0;
var url		= "ok-hewer";
var category		= "industrial";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-05-09\/ok_hewer_1304983903.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-05-09\/ok_hewer_1304983903_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-05-09\/ok_hewer_1304983903_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-05-09\/ok_hewer_1304983903_40.png";
function on_apply(pc){
	
}
var conditions = {
	198 : {
		type	: "group_sum",
		group	: "nodes_mined",
		value	: "11"
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
	pc.stats_add_xp(round_to_5(75 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(10 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 75,
	"favor"	: {
		"giant"		: "zille",
		"points"	: 10
	}
};

//log.info("ok_hewer.js LOADED");

// generated ok (NO DATE)
