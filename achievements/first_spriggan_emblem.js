var name		= "First Emblem of Spriggan";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Got your first Spriggan Emblem";
var status_text		= "Your humble offerings pile around my toes like so many tickly pebbles. I am duly tickled. In exchange for your 1000 favor points, I grant you this Emblem of Spriggan.";
var last_published	= 1323915630;
var is_shareworthy	= 0;
var url		= "first-emblem-of-spriggan";
var category		= "giants";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-05-09\/first_spriggan_emblem_1304983730.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-05-09\/first_spriggan_emblem_1304983730_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-05-09\/first_spriggan_emblem_1304983730_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-05-09\/first_spriggan_emblem_1304983730_40.png";
function on_apply(pc){
	
}
var conditions = {
	167 : {
		type	: "counter",
		group	: "emblems_acquired",
		label	: "spriggan",
		value	: "1"
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
	pc.createItemFromFamiliar("emblem_spriggan", 1);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 75,
	"items"	: {
		"0"	: {
			"class_id"	: "emblem_spriggan",
			"label"		: "Emblem of Spriggan",
			"count"		: "1"
		}
	}
};

// generated ok (NO DATE)
