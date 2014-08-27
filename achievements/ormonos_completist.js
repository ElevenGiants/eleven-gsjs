var name		= "Ormonos Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Ormonos";
var status_text		= "You've navigated every hole in Ormonos, and earned your Ormonos Completist badge. And if you lose it, we can always get you an Ormonos Replacement Badge! No not really, I'm kidding. You just get this one.";
var last_published	= 1350522296;
var is_shareworthy	= 1;
var url		= "ormonos-completist";
var category		= "exploring";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-10-21\/ormonos_completist_1319236022.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-10-21\/ormonos_completist_1319236022_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-10-21\/ormonos_completist_1319236022_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-10-21\/ormonos_completist_1319236022_40.png";
function on_apply(pc){
	
}
var conditions = {
	608 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_102",
		value	: "28"
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
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 150,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 20
	}
};

// generated ok (NO DATE)
