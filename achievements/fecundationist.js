var name		= "Fecundationist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Tended 503 weedy patches";
var status_text		= "Congratulations! This is the 503th weedy patch you've cleaned up. You've achieved Fecundationist status.";
var last_published	= 1348798442;
var is_shareworthy	= 1;
var url		= "fecundationist";
var category		= "trees";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-05-09\/fecundationist_1304983857.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-05-09\/fecundationist_1304983857_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-05-09\/fecundationist_1304983857_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-05-09\/fecundationist_1304983857_40.png";
function on_apply(pc){
	
}
var conditions = {
	191 : {
		type	: "group_sum",
		group	: "VERB:tend",
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 700,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 150
	}
};

// generated ok (NO DATE)
