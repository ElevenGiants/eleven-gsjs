//#include include/takeable.js

var label = "Tester tool";
var version = "1420816557";
var name_single = "Tester tool";
var name_plural = "Tester tools";
var article = "a";
var description = "For testers only!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["admin_widget", "takeable"];
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

verbs.teleport = { // defined by admin_widget
	"name"				: "teleport",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Teleport to another location",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var choices = {
			1: {value: 'tele_tsid_LHVDIELDQQ7228K', txt: 'Plexus'},
			2: {value: 'tele_tsid_LA9QTSIOV4F31QH', txt: 'Bliss'},
			3: {value: 'tele_tsid_LHV88RQU60B3Q0G', txt: 'Lotha Harte'},
			4: {value: 'tele_tsid_LA918AIN63127HB', txt: 'Dobak Fathom'},
			5: {value: 'tele_tsid_LIF15S7VPRV1DIP', txt: 'Kiehiman Course'},
		};

		var extra = pc.teleportation_get_history();
		for (var i=0; i<extra.length; i++){
		    var tsid = extra[i];
		    var loc = api.apiFindObject(tsid);
		    choices[tsid] = {value: 'tele_tsid_'+tsid, txt: '@' + loc.label};
		}

		pc.apiSendMsgAsIs({
		    type: 'conversation',
		    itemstack_tsid: this.id,
		    txt: "Where would you like to go? (@locs are from your history)",
		    choices: choices,
		});

		return true;
	}
};

verbs.redeal = {
	"name"				: "redeal",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Redeals your upgrade cards",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.imagination_reshuffle_hand();
		return true;
	}
};

verbs.home = {
	"name"				: "home",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Teleports you to Gregarious Grange",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.teleportToLocation('LLI32G3NUTD100I', 2540, -39);
		return true;
	}
};

verbs.max = {
	"name"				: "max",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Restores energy and mood",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.metabolics_add_energy(999999);
		pc.metabolics_add_mood(999999);
		return true;
	}
};

verbs.resurrect = {
	"name"				: "resurrect",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "Rise from the dead",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead) return {state:'enabled'};
		return {state:'disabled', reason: "Unfortunately, you are alive"};
	},
	"handler"			: function(pc, msg, suppress_activity){

		// Copy of upgrade_card_instant_resurrection
		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		pc.resurrect();
		pc.metabolics_add_energy(999999);
		pc.metabolics_add_mood(999999);

		var pre_msg = this.buildVerbMessage(msg.count, 'resurrect', 'resurrected', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.cash = {
	"name"				: "currants",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "+100,000 currants",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.stats_add_currants(100000);
		return true;
	}
};

verbs.buffs = {
	"name"				: "buffs",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 59,
	"tooltip"			: "Give or remove a buff",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var choices = {
			1: {value: 'buff_high_jumper', txt: 'High Jumper'},
			2: {value: 'buff_walking_dead', txt: 'Walking Dead'},
			3: {value: 'buff_levitation_by_meditation', txt: 'Levitation'},
			4: {value: 'buff_moonwalk', txt: 'Moonwalk'},
			5: {value: 'buff_hairball_dash', txt: 'Hairball Dash'},
			6: {value: 'remove_all_buffs', txt: 'Remove all buffs'},
		};

		pc.apiSendMsgAsIs({
		    type: 'conversation',
		    itemstack_tsid: this.id,
		    txt: "Select a buff!",
		    choices: choices,
		});

		return true;
	}
};

verbs.reset = {
	"name"				: "reset",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 60,
	"tooltip"			: "Reset for testing",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var choices = { // pc.buffs_apply
			1: {value: 'reset_skills', txt: 'Skills'},
			2: {value: 'reset_quests', txt: 'Quests'},
			3: {value: 'reset_achievements', txt: 'Achievements'},
		};

		pc.apiSendMsgAsIs({
		    type: 'conversation',
		    itemstack_tsid: this.id,
		    txt: "Select something to reset (can not be undone!)",
		    choices: choices,
		});

		return true;
	}
};

verbs.learn = {
	"name"				: "learn",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 61,
	"tooltip"			: "Finish learning a skill",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.skills_is_learning()) return {state:'disabled', reason:'You are not learning a skill!'};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var skill = pc.skills_get_learning();
		pc.skills_give(skill.id);
		return true;
	}
};

verbs.items = {
	"name"				: "items",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 62,
	"tooltip"			: "Create useful items",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){
		var choices = {
			1: {value: 'items_emblems', txt: 'Emblems'},
			2: {value: 'items_grain_bushel', txt: 'Grain'},
			3: {value: 'items_meat', txt: 'Meat'},
			4: {value: 'items_milk_butterfly', txt: 'Milk'},
			5: {value: 'items_fertilidust', txt: 'Fertilidust'},
			6: {value: 'items_fiber', txt: 'Fiber'},
			7: {value: 'items_guano', txt: 'Guano'},
		};
		pc.apiSendMsgAsIs({
			type: 'conversation',
			itemstack_tsid: this.id,
			txt: "What can I help you with?",
			choices: choices,
		});
		return true;
	}
};

verbs.img = {
	"name"				: "iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 63,
	"tooltip"			: "+100,000 iMG",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){
		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var context = {'class_id':this.class_tsid, 'verb':'img'};
		var val = pc.stats_add_xp(100000, true, context);
		if (val){
			self_effects.push({
				"type"    : "xp_give",
				"which"    : "",
				"value"    : val
			});
		}
		var pre_msg = this.buildVerbMessage(msg.count, 'consider', 'considered', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);
		return failed ? false : true;
	}
};

verbs.doquests = {
	"name"				: "do quests",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 64,
	"tooltip"			: "Finish all pending quests",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (Object.keys(pc.quests_get_all().todo).length === 0) return {state:'disabled', reason:'You have no pending quests!'};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){
		var questStr = "";
		for (var class_tsid in pc.quests_get_all().todo) {
			var quest = pc.getQuestInstance(class_tsid);
			questStr += '<li>' + quest.getTitle(pc) + '</li>';
		}

		var choices = {
			1: {value: 'doallquests', txt: 'Do it!'},
			2: {value: 'close', txt: 'Never mind'}
		};
		pc.apiSendMsgAsIs({
			type: 'conversation',
			itemstack_tsid: this.id,
			txt: "This action will complete the following quests:<ul>" + questStr + "</ul>" +
				"<br>Note: You will <b>not</b> recieve quest rewards for any completed quests.",
			choices: choices,
		});
		return true;
	}
};

function endConversation(pc, msg){ // defined by admin_widget
	pc.apiSendMsgAsIs({
		type: 'conversation_choice',
		msg_id: msg.msg_id,
		success: true,
		itemstack_tsid: this.tsid
	});
}

function onConversation(pc, msg){ // defined by admin_widget
	if (msg.choice === 'doallquests') {
		for (var class_tsid in pc.quests_get_all().todo) {
			pc.quests_remove(class_tsid);
			pc.quests_give_finished(class_tsid);
		}
	}
	else if (msg.choice.substr(0,10) == 'tele_tsid_') { // Teleport to TSID
		var tsid = msg.choice.substr(10);
		pc.sendActivity('Teleporting you to '+tsid+' ...');
		pc.teleportToLocation(tsid, 0, -100);
	}
	else if (msg.choice.substr(0,5) == 'buff_') { // Give/remove buffs.
		var buff = msg.choice.substr(5);
		if (pc.buffs_has(buff)) {
			pc.buffs_remove(buff);
		}
		else {
			pc.buffs_apply(buff);
		}
	}
	else if (msg.choice === 'remove_all_buffs') { // Remove ALL buffs.
		pc.buffs_remove_all();
	}
	else if (msg.choice.substr(0,6) == 'reset_') { // Resets.
		switch (msg.choice.substr(6)) {
			case 'skills':
				pc.skills_reset();
				break;
			case 'achievements':
				pc.achievements_reset();
				break;
			case 'quests':
				pc.quests_reset();
				break;
		}
	}
	else if (msg.choice.substr(0,6) == 'items_') {
		var id = msg.choice.substr(6);
		switch (id) {
			case 'emblems':
				config.giants.forEach(function create(giant) {
					pc.createItemFromGround('emblem_' + giant);
				});
				break;
			default:
				var proto = api.apiFindItemPrototype(id);
				pc.createItemFromGround(id, proto.stackmax || 1);
				break;
		}
	}

	this.endConversation(pc, msg);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-31,"y":-65,"w":62,"h":65},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHOElEQVR42u2Y+1OTVxrH\/Q+Yndm1\nQlUQlYLtLEFlt2XVUFS2F64qVrESrAKjogESjFwkWCQFC8TFBEGwQWQRFMELchWCJtyFcBNku24U\nrNyEVxGQi+x3z3mR7Nr90YT6g2fmmRyGIe+H7\/M83\/Ocd8GC9+v9er8Ms4I3r+BGO33Ej\/jCgidx\ntuS+U3CH7c3ERzatQKjjShzdvAJhf12JOPePee8E3IH1Zq5+60xx2H4ZhBuXs3FggxmivrbUvhOA\n3p8uVu79bAn22S3FQQLmz10GH7IXESUFG835e+2MTX8zONEmc6OtHGN42BjD7Y+L4Ln2Qza2rzaB\n96dLKDCTEraL92qqnTczeU88M6kVY+oRD9Md3OmXrVygw9TggNs4xhpHyz+AhoPF7\/HlqoXsXh61\nHy+e1mFmogP\/nu7DzNQTvJp4gMnRZowytRjuu42+7nIF8MDo198bt8XK9Ee3VYpDXDOln90SV711\nsZftYr4Hx0RRcimegN17HZ0E7jEmXjTjxVAVG0O9lXjysIyN\/sdKzf9+zzFHC+uTrqsYibMVaG3T\n8vH9y1L9NRxRjP9fOBr3MT3eroOjMfC4Qgc4C1mhpH8baG\/Opy5Ag9YzLZPdf1pMQZV6gevRlnJT\nZHy0NV3Gm5D3MPlC8wbkcJ9KB1hdloxgt9XawM\/NEULgwolNBZA9VZAGbUAS4rcGbKz7uzY+xgct\nd3P+D3B6rPUNQAo8yjSwgJG+X+M7kkp\/olqQgzkEDstZqJ1rTDDnED52S\/LfCg6TbdYPfy7G5axo\nMH2VGHx4CVOjTRgZuPUarloH96\/71\/CP9qsY6qvC4JPbuHg2HE6ffMA6wbe2ixkCxPDtzTHnEGxw\njPlvB0isY06tlppEVBbHkdSdwM3cCDQ35GCkvwzjz+rR230L4Ud3IvTIDpTelKP3UTkKrsQj7sQB\nBO11Vrh8slC857OlmkMbzBQ7VptoKeRWzgf8t04vVZAqNT3eBqa3CONMNYZ6rpLPGtRVZUJdHIGB\nX1Toar+GI0EeEARshbIsFf09SjTXZ6GiSA65VMjWmbvNQmtyQjG+60zz3W0W6e9cHx2uwRhTB\/o5\nBzubVhWpubt4StL5fLAGhdcTUVGSwqpNU9zVmod6VboOkC56Aun9FBpjavMpEE3l86e1Ou8bf97A\nwlBzfj6owtw\/MvK0mm2SngfFKC+UvQFokDXSr+Y9G1CxDUEBaZdSwImRRlZR+rv+nnJdzNkMTXH6\n2WOQJQgMPwEN9FRoKQh9cG93xWu1KGgtUUxNmuKWDkzbVcBGbtYPkEmFkMUJDD9YTI42Wfd2lzPa\nrhu4U57GKvfw5yJyeih1YDSld6sy2LTmZcfitFTAzIt6c+vlcJNpZ+sVTe7FGEyNtaBKeU6nWGdz\nLtsQF86JZ1VLEEpTYkRG8z6KlZWlGJ2XC7UULCczGhXFSVCXn8XNvASSysOMJPTb\/NMRHvjNZkXq\ni6XZx5Eh3Q+ZxAeJ0fsQGbwDR\/Z\/pQk74IjoICeNyG+T6\/xCkQEUE\/dcZybapdQDnw1UQ9txHUU5\nUZD\/4Ivjol0aT2dbxWGvDeJYoYsmOvBLvsFgeh\/d5r2aaFeS0P56MJibXigk3VPbedB5DTnpkZrd\nzrZcT5e1Yk8XW75B1fqbNJRJS4lC+jkJfkqNRq36IjHoBjKM3iGGfEdnzjSoKTP9d9Cgysj3crNV\nzEs6JVGBSEk6jpwsKYoLUtF8Nw\/FGWLECnegLF9KTLqRhXs50sT6H52iK0qSlV7ua\/VfdzHuFtbX\nf\/TTjg3VY5gc7vSh9OG3UoQ46bYKyT5c9lirvByDb2yX4liIL0TB+1BenIZKMhBQ9eiJUlogYwyi\nVqyblVS6cw3OC10Qt90G8d99ThRRYYCMSjHbOOxFXX3jFC6khEEs2ouLmfE4fzoUkc4fI\/vMUd0c\n2EE8MDPzhP5PCwKgPPaFBSK\/+giiTStA3yLUl8hJ4V\/H93s2wttuGaLDfaBIk6BGlY3OtkJi0K3o\nqs6AwJmDwV8qWMDufxaitDBR\/69FtnCMpbODozF22X7IxplYf1zKjNZ421uKE6L8+QVXz0jrVVnI\njfdnU95SIiMTsxpJkv1IOh1OIJXoasvDT2dD9A\/oseZ3RnSqDdq+Lj\/gm\/XKLZxFYoGnA5sqdWYE\nj\/re5GiLpvd+AbJCt7F1KXG2hOL7PTgpCYA0LgTJsjBSk0lISgienxdLMR7mRpciPbWNBadmrYQ0\nEA26P+W9HsEbl8PfaTUkUQG4cTUZ6WknkCoPmZ+Jha6TblZ8qlTqwc1s89Amygh2ZSfky9JD7H32\nIM8J1\/KS0Fh3BWVFaTiTKFLM27FG7q582jQxrlZsSmkcJz9fkAcjjFwjSRkoJJJArqYhX9xUn6dU\nV2Yqsy\/EWM8boMBhmSm9rwaROyy1mRDHleDbk24+uhtBXo7iBe\/Coh1MO9v7z7OXaw8bEybMz9mg\nE8p\/ALFc4MswXUvTAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "\/c2.glitch.bz\/items\/2012-09\/test_item2-1347647397.swf",
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
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"t"	: "teleport",
	"e" : "resurrect"
};
