var name		= "Up 'n' Comer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Helped out with 137 phases of a project";
var status_text		= "Some folks are content to go up. Others are happy to settle for just coming. A rare few do both, thereby earning themselves the title Up 'n' Comer.";
var last_published	= 1316467769;
var is_shareworthy	= 0;
var url		= "up-n-comer";
var category		= "projects";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-09-10\/up_n_comer_1315686055.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-09-10\/up_n_comer_1315686055_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-09-10\/up_n_comer_1315686055_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-09-10\/up_n_comer_1315686055_40.png";
function on_apply(pc){
	
}
var conditions = {
	542 : {
		type	: "group_count",
		group	: "job_contributions",
		value	: "137"
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
	pc.stats_add_favor_points("all", round_to_5(50 * multiplier));
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
		"giant"		: "all",
		"points"	: 50
	}
};

//log.info("up_n_comer.js LOADED");

// generated ok (NO DATE)
