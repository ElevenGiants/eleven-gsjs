var name		= "Toolsmith";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Painstakingly crafted 127 tools with a Tinkertool";
var status_text		= "Nice. Tools. And I'm not just saying that. Here's the Toolsmith badge to prove it.";
var last_published	= 1348802943;
var is_shareworthy	= 1;
var url		= "toolsmith";
var category		= "industrial";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-09-10\/toolsmith_1315686119.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-09-10\/toolsmith_1315686119_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-09-10\/toolsmith_1315686119_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-09-10\/toolsmith_1315686119_40.png";
function on_apply(pc){
	
}
var conditions = {
	567 : {
		type	: "counter",
		group	: "making_tool",
		label	: "tinkertool",
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("alph", round_to_5(75 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "alph",
		"points"	: 75
	}
};

//log.info("toolsmith.js LOADED");

// generated ok (NO DATE)
