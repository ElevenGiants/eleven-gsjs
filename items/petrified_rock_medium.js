//#include include/takeable.js

var label = "Medium Petrified Rock";
var version = "1350098703";
var name_single = "Medium Petrified Rock";
var name_plural = "Medium Petrified Rocks";
var article = "a";
var description = "A once-vibrant medium-sized rock, shocked into a state of frozen fossilized awe when it witnessed an epic feat, and drawn, like a magnet, to the generous contributors who brought about the most awe. The fragile structure of elements in its core suggest that a modest selection of rare delights may be found when it is cracked open.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["petrified_rock_medium", "petrified_rock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"proximity_override"			: 800,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_pickup(pc, msg);
	}
};

verbs.give = { // defined by takeable
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.crack = { // defined by petrified_rock_base
	"name"				: "crack",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_all"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Crack it open",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Crack {$item_name} with a {$stack_name}",
	"drop_ok_code"			: function(stack, pc){

		if (in_array_real(stack.class_tsid, this.valid_tools) && stack.isWorking()) return true;
		return false;
	},
	"conditions"			: function(pc, drop_stack){

		for (var i=0; i<this.valid_tools.length; i++){
			if (this.valid_tools[i] && pc.items_find_working_tool(this.valid_tools[i])) return {state:'enabled'};
		}

		return {state:'disabled', reason: "You don't have anything to crack it with."};
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var uniques = {};
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (in_array_real(it.class_tsid, this.valid_tools) && it.isWorking()){
				uniques[it.class_tsid] = it.tsid;
			}
		}

		var possibles = [];
		for (var i in uniques){
			possibles.push(i);
		}

		if (possibles.length){
			return {
				'ok' : 1,
				'choices' : possibles,
			};
		}else{
			this.startMoving();
			pc.sendActivity("You don't have anything to crack this with.");
			return {
				'ok' : 0,
				'txt' : "You don't have anything to crack this with.",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (msg.target_item_class || msg.target_itemstack_tsid){
			var tool;
			if (msg.target_itemstack_tsid){
				tool = pc.removeItemStackTsid(msg.target_itemstack_tsid, msg.target_item_class_count);
			}
			else{
				tool = pc.removeItemStackClassExact(msg.target_item_class, msg.target_item_class_count);
			}

			if (tool){
				if (tool.use) tool.use(this, 1);
				this.apiSetTimerX('onCrack', 2000, pc, tool);
				
				pc.announce_sound('PETRIFIED_ROCK');
				var annc = {
					type: 'pc_overlay',
					uid: pc.tsid+'-'+this.class_tsid,
					duration: 2000,
					pc_tsid: pc.tsid,
					locking: true,
					delta_x: 0,
					delta_y: -115,
					swf_url: overlay_key_to_url('petrified_rock_open_overlay')
				};
				pc.apiSendAnnouncement(annc);

				var anncx = {
					type: 'pc_overlay',
					uid: pc.tsid+'-'+this.class_tsid+'-all',
					duration: 2000,
					pc_tsid: pc.tsid,
					delta_x: 0,
					delta_y: -110,
					bubble: true,
					width: 40,
					height: 40,
					swf_url: overlay_key_to_url('petrified_rock_open_overlay')
				};

				pc.location.apiSendAnnouncementX(anncx, pc);

				//this.onCrack(pc, tool);
			}
			else{
				failed = 1;
			}
		}
		else{
			failed = 1;
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'crack', 'cracked', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function onCrack(pc, tool){ // defined by petrified_rock_medium
	/*
	'crack' verb on Medium Petrified Rock gives the following:
	* 2 artifact pieces - run drop table "artifact_pieces" 2 times http://dev.glitch.com/god/drop_table_edit.php?id=91
	* 50% chance of a gem -50% chance to run the drop table "gem_equal_chance" http://dev.glitch.com/god/drop_table_edit.php?id=95
	* 20-1000 currants - run drop table "petrified_rock_medium_currants" http://dev.glitch.com/god/drop_table_edit.php?id=93
	*/

	this.apiConsume(1);

	var results = [];
	results = pc.runDropTable("artifact_pieces", null, null, null, null, results);
	results = pc.runDropTable("artifact_pieces", null, null, null, null, results);
	if (is_chance(0.50)) results = pc.runDropTable("gem_equal_chance", null, null, null, null, results);
	results = pc.runDropTable("petrified_rock_medium_currants", null, null, null, null, results);

	if (results.length){
		var msg;
		if (results.length > 1){
			var last = results.pop();
			msg = "You got "+results.join(', ')+", and "+last+"!";
		}
		else{
			msg = "You got "+results.join(', ')+"!";
		}
		pc.sendActivity(msg);
	}
}

// global block from petrified_rock_base
var valid_tools = [
	'ace_of_spades',
	'class_axe',
	'fancy_pick',
	'grand_ol_grinder',
	'hatchet',
	'high_class_hoe',
	'hoe',
	'ore_grinder',
	'pick',
	'shovel'
];

function getDescExtras(pc){
	var out = [];
	out.push([2, "Petrified Rocks are awarded for contributing to <a href=\"http:\/\/www.glitch.com\/feats\/\" glitch=\"external|http:\/\/www.glitch.com\/feats\/\">Feats<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"collectible",
	"petrified"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-12,"y":-26,"w":23,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAELUlEQVR42u3X6VJTZxgHcGd6AXxz\nptOOKBCWsJpATEJIThaWRJYkhABZgJCAKFCkCYgsWUyhEUgDVRgVKdAqorJbaTFKrI6WkVZq2\/FD\npx0ugUv495yX0js4wIz5zzxzvv7mfZ53OceORRNNNNFE82Hk\/Wak7a+3r6v\/fvfu+JHE\/bm5gd9f\nhZnanbs+VHZkcP\/8Eo75NfJo9\/niNJ7MjmNzfR53x4dhLqJqjwRw69nq9tr0CO4Fu\/FgpA8vVr7D\n\/VsjoHjpuyaNIvZQcb+9\/HHqh5lRAhvpbCLfp3M3EV6exRleFnhp3KVDgQUaK2JerM5FXq\/dJ21d\nmRiG75wF33zlw9rdGwSoPluC7HQucricqQMHvno8H\/nj52fY\/mkNb54sYtzdToCjA27cm7mFtQcz\nMBirkCcUQpCaCAE3cYkfFxdzILi3G48yX9JztjoxSNdV3Pa7CK6rzogBXy8mblzD+uId1DscEEoo\nUGeykZ2SgEzOqd1sbjz7u3srvBxaHPOTeRvtOo\/LNiPcDhOaK4oxHBxEKDSM9YfTsNvrkCOSIpdS\noeysBgmffIzTSfHManpYBT5fmIowOKZ6G0zosJYT3Ge1VXvAYADfz1zHQLcTZosVwjwFRHQpJXvt\nzknlRFgFMsdIwOmAp9mKoXYHaW9VgRQ9ne0EOB3yYWHsC9h0Gni8faDy1QSp0WjYB26FV8o2Ht6G\nm8Z5W2oQdDaip74KRlUe3N2dGAv2Y\/5rL2YCl1BdKEOH6yKampsJUF1cug8MsQd8urzEHCv7LZ70\nfw6nRU+AV3o6MBfqw7eBTvjP19BzWQ1f7yW4vW6cFohByZUEKMnisjeDb8LLO0yL94F3BrvQqCsi\nQBqP2WAvvHTLff\/VVb+btD01k48UTgJ4yfHISoxn7wpcnhzBxsI0VidDmKCPF3+rjeC6Gq3kBmFu\nk1Zjyf9A\/xUPXJ0uspt5KRxkJJwE99SJbdaAl5tqd5y2ajhrjLBr91aOKe8FK1lNBmWiZ4\/gLp6D\nxWqGPL8Q4lwpfRZykBp3ghRrQKNSslSuyIWOEhGYQSmBQ1uIaz0tMKnlBFYk4sPXYsfQ4Jdoa2+D\nIFcGnaYQooxk5tpD8slPWQSqJB5pVhr4yQkEaC6Sw15WgAv0OcjAXDUVkPHS0N\/vh6u1CZXWOphq\nbDDrS0Hx0+n5i0MKm0C9QhyrpUTbanE2DPRKlivEsDArR7fT2+VEQ7UBuZkpcLt7UasvRntHB8x1\n9dCqpASYFh\/7Pispro3t2+6jUqlgylKmhlFbDIfdhsGhANmtVWolROnJsFYaYCkpgEZnhFKtbSvJ\ny5FVqPgH81jYT55M0SCWUjtSRT70lSaYDXpoZSII05Mgpx8I5XLxTkGxLvPQX9QqVUVMfolOZlBJ\nPQVCnod5DEgzuIrob2Q00UQTzQeSfwHlCn6Gr5vqrwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "\/c2.glitch.bz\/items\/2012-10\/petrified_rock_medium-1349210507.swf",
	admin_props	: false,
	obey_physics	: true,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"collectible",
	"petrified"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "crack",
	"g"	: "give"
};

log.info("petrified_rock_medium.js LOADED");

// generated ok 2012-10-12 20:25:03 by stewart
