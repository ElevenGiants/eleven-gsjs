var name		= "Pretty Fine Refiner, Shiny Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Fastidiously refined 2503 Shiny Elements";
var status_text		= "See what you can do when you put your mind to it? You are indeed a Pretty Fine Refiner, Shiny Class. No joke.";
var last_published	= 1338930612;
var is_shareworthy	= 0;
var url		= "pretty-fine-refiner-shiny-class";
var category		= "industrial";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_fine_refiner_shiny_class_1304984887.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_fine_refiner_shiny_class_1304984887_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_fine_refiner_shiny_class_1304984887_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_fine_refiner_shiny_class_1304984887_40.png";
function on_apply(pc){
	
}
var conditions = {
	373 : {
		type	: "counter",
		group	: "elements_refined",
		label	: "element_shiny",
		value	: "2503"
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "zille",
		"points"	: 50
	}
};

//log.info("pretty_fine_refiner_shiny_class.js LOADED");

// generated ok (NO DATE)
