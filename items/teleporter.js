var label = "Collision-triggered Teleporter";
var version = "1349114019";
var name_single = "Collision-triggered Teleporter";
var name_plural = "Collision-triggered Teleporters";
var article = "a";
var description = "Takes the player to a location when they collide with it.";
var is_hidden = true;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["teleporter"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.width = "10";	// defined by teleporter
	this.instanceProps.height = "10";	// defined by teleporter
	this.instanceProps.target_tsid = "";	// defined by teleporter
	this.instanceProps.target_x = "0";	// defined by teleporter
	this.instanceProps.target_y = "0";	// defined by teleporter
	this.instanceProps.single_use = "0";	// defined by teleporter
	this.instanceProps.is_party = "0";	// defined by teleporter
}

var instancePropsDef = {
	width : ["Width of the hitbox"],
	height : ["Height of the hitbox"],
	target_tsid : ["TSID of the target location"],
	target_x : ["x of the target location"],
	target_y : ["y of the target location"],
	single_use : ["1 if it auto-destroys after use"],
	is_party : ["1 if it's a party-space teleporter"],
};

var instancePropsChoices = {
	width : [""],
	height : [""],
	target_tsid : [""],
	target_x : [""],
	target_y : [""],
	single_use : [""],
	is_party : [""],
};

var verbs = {};

function onPlayerCollision(pc){ // defined by teleporter
	if (this.only_visible_to && this.only_visible_to != pc.tsid) return false;

	log.info('Player '+pc+' collided with teleporter');

	if (intval(this.instanceProps.is_party) == 1){
		pc.party_enter_space();
	}
	else{
		if (pc.location.onTeleporterCollision){
			pc.location.onTeleporterCollision(pc, this);
		}
		else{
			pc.teleportToLocation(this.instanceProps.target_tsid ? this.instanceProps.target_tsid : this.container.tsid, intval(this.instanceProps.target_x), intval(this.instanceProps.target_y));
		}
	}

	if (intval(this.instanceProps.single_use) == 1){
		pc.announce_sound('TELEPORTER_VISIBLE_DISAPPEARS');
		if (this.disappear) return this.disappear();

		this.apiDelete();
	}
}

function onPropsChanged(){ // defined by teleporter
	log.info('Teleporter properties changed');

	this.apiSetHitBox(intval(this.instanceProps.width), intval(this.instanceProps.height));
}

// global block from teleporter
var hitBox = {
	w: 10,
	h: 10,
};

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade",
	"no_scale"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":0,"y":0,"w":40,"h":40},
		'thumb': null,
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "\/c2.glitch.bz\/items\/missing.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 0;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_trade",
	"no_scale"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("teleporter.js LOADED");

// generated ok 2012-10-01 10:53:39 by mygrant
