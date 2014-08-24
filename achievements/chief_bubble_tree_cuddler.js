var name		= "Chief Bubble Tree Cuddler";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Petted 127 deserving Bubble Trees";
var status_text		= "When it comes to tree petting, you sure do get around. In some places, the title Chief Bubble Tree Cuddler might be a scarlet letter. Luckily, here you're a star.";
var last_published	= 1348797073;
var is_shareworthy	= 1;
var url		= "chief-bubble-tree-cuddler";
var category		= "trees";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-05-09\/chief_bubble_tree_cuddler_1304984625.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-05-09\/chief_bubble_tree_cuddler_1304984625_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-05-09\/chief_bubble_tree_cuddler_1304984625_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-05-09\/chief_bubble_tree_cuddler_1304984625_40.png";
function on_apply(pc){
	
}
var conditions = {
	324 : {
		type	: "counter",
		group	: "trants_petted",
		label	: "trant_bubble",
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

//log.info("chief_bubble_tree_cuddler.js LOADED");

// generated ok (NO DATE)
