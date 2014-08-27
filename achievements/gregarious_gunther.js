var name		= "Gregarious Gunther";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Sojourned on 503 separate home streets";
var status_text		= "Oh the places you have been, and oh the home streets that you've seen! With feet in your head, and brains in your shoes, you can go wandering wherever you choose! 503 home streets you landed upon. Just look at the pretty badge that you've won!";
var last_published	= 1348798872;
var is_shareworthy	= 1;
var url		= "gregarious-gunther";
var category		= "social";
var url_swf		= "\/c2.glitch.bz\/achievements\/2012-06-14\/gregarious_gunther_1339718447.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2012-06-14\/gregarious_gunther_1339718447_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2012-06-14\/gregarious_gunther_1339718447_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2012-06-14\/gregarious_gunther_1339718447_40.png";
function on_apply(pc){
	
}
var conditions = {
	780 : {
		type	: "group_count",
		group	: "player_streets_visited",
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
	pc.stats_add_xp(round_to_5(1200 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(200 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1200,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 200
	}
};

// generated ok (NO DATE)
