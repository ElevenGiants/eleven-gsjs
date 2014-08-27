var name		= "Golden Watering Can";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Watered 1009 Trees";
var status_text		= "You've just watered your 1,009th plant! You win the highly sought-after Golden Watering Can Award!";
var last_published	= 1348798854;
var is_shareworthy	= 1;
var url		= "golden-watering-can";
var category		= "trees";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-05-09\/golden_shower_award_1304983897.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-05-09\/golden_shower_award_1304983897_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-05-09\/golden_shower_award_1304983897_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-05-09\/golden_shower_award_1304983897_40.png";
function on_apply(pc){
	
}
var conditions = {
	197 : {
		type	: "group_sum",
		group	: "trants_watered",
		value	: "1009"
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
	pc.stats_add_favor_points("grendaline", round_to_5(150 * multiplier));
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
		"giant"		: "grendaline",
		"points"	: 150
	}
};

// generated ok (NO DATE)
