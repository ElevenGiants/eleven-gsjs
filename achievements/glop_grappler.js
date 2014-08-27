var name		= "Glop Grappler";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Unsqueamishly scooped 503 quivering Jellisac clumps";
var status_text		= "This marks the 503rd Jellisac that you've manfully wrangled with your own bare hands. Everyone else wanted to give you a pair of rubber gloves, but I knew that what you really wanted was highly sought-after Glop Grappler badge. You're welcome.";
var last_published	= 1348798836;
var is_shareworthy	= 1;
var url		= "glop-grappler";
var category		= "harvesting";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-09-10\/glop_grappler_1315685987.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-09-10\/glop_grappler_1315685987_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-09-10\/glop_grappler_1315685987_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-09-10\/glop_grappler_1315685987_40.png";
function on_apply(pc){
	
}
var conditions = {
	517 : {
		type	: "counter",
		group	: "jellisac",
		label	: "scoop",
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

// generated ok (NO DATE)
