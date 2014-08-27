var name		= "Street Creator Dirt Trophy";
var collection_type	= 2;
var is_secret		= 0;
var desc		= "Collected all pieces of the Street Creator Dirt Trophy";
var status_text		= "";
var last_published	= 1323933879;
var is_shareworthy	= 0;
var url		= "street-creator-dirt-trophy";
var category		= "trophies";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-05-09\/collection_street_creator_dirt_1304985057.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-05-09\/collection_street_creator_dirt_1304985057_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-05-09\/collection_street_creator_dirt_1304985057_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-05-09\/collection_street_creator_dirt_1304985057_40.png";
function on_apply(pc){
	
}
var conditions = {
	387 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_dirt_piece1",
		value	: "1"
	},
	388 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_dirt_piece2",
		value	: "1"
	},
	389 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_dirt_piece3",
		value	: "1"
	},
	390 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_dirt_piece4",
		value	: "1"
	},
	391 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_dirt_piece5",
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
	pc.stats_add_xp(round_to_5(1000 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(30 * multiplier));
	pc.createItemFromFamiliar("trophy_street_creator_dirt", 1);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1000,
	"favor"	: {
		"giant"		: "all",
		"points"	: 30
	},
	"items"	: {
		"0"	: {
			"class_id"	: "trophy_street_creator_dirt",
			"label"		: "Street Creator Dirt Trophy",
			"count"		: "1"
		}
	}
};

// generated ok (NO DATE)
