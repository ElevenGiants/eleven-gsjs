var name		= "Metalhead";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Smelted 503 Metal Ingots from purest Metal Rock";
var status_text		= "Yes, you've smelted a lot of Metal Rock into Plain Metal. Yes, we're giving you a badge. Yes, it's the Metalhead badge. Yes!";
var last_published	= 1348801868;
var is_shareworthy	= 1;
var url		= "metalhead";
var category		= "industrial";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-09-10\/metalhead_1315686081.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-09-10\/metalhead_1315686081_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-09-10\/metalhead_1315686081_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-09-10\/metalhead_1315686081_40.png";
function on_apply(pc){
	
}
var conditions = {
	551 : {
		type	: "counter",
		group	: "smelter",
		label	: "ingots_created",
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
	pc.stats_add_favor_points("zille", round_to_5(150 * multiplier));
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
		"giant"		: "zille",
		"points"	: 150
	}
};

// generated ok (NO DATE)
