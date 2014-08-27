//#include include/takeable.js

var label = "Strange Note";
var version = "1346778856";
var name_single = "Strange Note";
var name_plural = "Strange Notes";
var article = "a";
var description = "A strange note found in Hauki Seeks Manor.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["note_manor_mystery", "note", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.initial_text = "These are the things we're looking for: 1 Ruby, 5 Seeds, all the Paper, 2 Gurly Drinks and more Paper!  P.S. If you lose this list or it is stolen, then don't bother coming back!";	// defined by note (overridden by note_manor_mystery)
	this.instanceProps.initial_title = "Dear Fred,";	// defined by note (overridden by note_manor_mystery)
}

var instancePropsDef = {
	initial_text : ["Initial text to show on this note, from no author"],
	initial_title : ["Initial title to show on this note, from no author"],
};

var instancePropsChoices = {
	initial_text : [""],
	initial_title : [""],
};

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

verbs.write_on = { // defined by note_manor_mystery
	"name"				: "write on",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Change what it says",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:null};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];


		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];


		var pre_msg = this.buildVerbMessage(msg.count, 'write on', 'wrote on', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
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

verbs.read = { // defined by note
	"name"				: "read",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "What does it say?",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.class_tsid == 'teleportation_script') return {state:null};

		if (!this.contents && !this.getInstanceProp('initial_text')) return {state:'disabled', reason: "It is blank :("};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.readNote(pc);

		var pre_msg = this.buildVerbMessage(msg.count, 'read', 'read', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function parent_verb_note_write_on(pc, msg, suppress_activity){
	var rsp = {
	    type: "note_view",
	    title: this.title ? this.title : "A note!",
	    body: this.contents,
	    start_in_edit_mode: true,
	    itemstack_tsid: this.tsid,
	    pc: this.last_editor ? getPlayer(this.last_editor).make_hash() : {},
	    updated: intval(this.last_edited),
	    max_chars: 1000
	};

	pc.apiSendMsg(rsp);

	return true;
};

function parent_verb_note_write_on_effects(pc){
	// no effects code in this parent
};

function canDrop(){ // defined by note_manor_mystery
	return false;
}

function canGive(){ // defined by note_manor_mystery
	return false;
}

function onCreate(){ // defined by note_manor_mystery
	this.initInstanceProps();
	this.disabled_reason = "You can't edit this."
}

function setText(title, text){ // defined by note_manor_mystery
	this.title = title;
	this.text = text;
}

// global block from note_manor_mystery
this.article = 'the';

function canPickup(pc){ // defined by note
	var c_type = this.getContainerType();
	if (c_type == 'street' && this.container.isGreetingLocation()){
		return {ok: 0};
	}

	return {ok: 1};
}

function getLabel(){ // defined by note
	if (this.class_tsid == 'note'){
		var container = this.container;
		if (container && container.is_bag){
			return this.title ? '[Note] '+this.title : this.label;
		}
	}

	return this.title ? this.title : this.label;
}

function onInputBoxResponse(pc, uid, body, title, msg){ // defined by note
	if (this.last_editor && this.last_editor != pc.tsid) return;

	function is_quill(it){ return it.class_tsid == 'quill' && it.isWorking() ? true : false; }
	var quill = pc.findFirst(is_quill);
	if (!quill){
		pc.sendActivity("You don't have a working quill anymore!");
		return;
	}
	quill.use();

	this.setInstanceProp('initial_text', '');
	this.setInstanceProp('initial_title', '');

	body = str(body);
	title = str(title);
	if (uid != 'teleportation_script_create' && this.contents == body && this.title == title) return;
	title = title.substr(0, 150);
	body = body.substr(0, 1000);

	this.contents = body;
	this.title = title;
	this.last_editor = pc.tsid;
	this.last_edited = time();

	this.history.push({title: title, body: body, editor: pc.tsid});
	if (this.history.length > 10){
		array_remove(this.history, 0, this.history.length-10);
	}

	if (uid == 'teleportation_script_create'){
		var loc_info = pc.location.get_info();
		this.destination = {
			tsid: pc.location.tsid,
			x: pc.x,
			y: pc.y,
			name: loc_info.name,
			mote_name: loc_info.mote_name
		};

		if (msg.is_imbued && pc.teleportation_get_token_balance()){
			this.is_imbued = true;
			pc.teleportation_spend_token("Imbueing a Teleportation Script to "+pc.location.label+".");
		}

		pc.prompts_add({
			txt		: "You've created a Teleportation Script! You can give it to anybody you like.",
			icon_buttons	: false,
			timeout		: 15,
			choices		: [
				{ value : 'ok', label : 'OK' }
			]
		});
	}
}

function readNote(pc){ // defined by note
	var disabled_reason ='';
	if (pc.skills_has('penmanship_1')){
		function is_quill(it){ return it.class_tsid == 'quill' && it.isWorking() ? true : false; }
		if (!pc.items_has(is_quill, 1)){
			disabled_reason = "You need a working quill.";
		}
	}
	else{
		disabled_reason = "You need to know Penpersonship.";
	}

	if (this.last_editor != pc.tsid) disabled_reason = 'This is not your note.';

	if (this.disabled_reason) {
		disabled_reason = this.disabled_reason;
	}

	if (this.getInstanceProp('initial_text')){
		this.contents = this.getInstanceProp('initial_text').replace(/\\n/g, "\n").replace(/&quot;/g, "\"");
	}

	if (this.getInstanceProp('initial_title')){
		this.title = this.getInstanceProp('initial_title');
	}

	var rsp = {
	    type: "note_view",
	    title: this.title? this.title : "A note!",
	    body: this.contents,
	    disabled_reason: disabled_reason,
	    start_in_edit_mode: false,
	    itemstack_tsid: this.tsid,
	    pc: this.last_editor ? getPlayer(this.last_editor).make_hash() : {},
	    updated: this.last_edited,
	    max_chars: 1000
	};

	pc.apiSendMsg(rsp);
}

function parent_onCreate(){ // defined by note
	this.contents = '';
	this.title = '';
	this.last_editor = null;
	this.last_edited = 0;
	this.history = [];
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"no_vendor",
	"no_donate",
	"no_discovery_dialog",
	"quest-item",
	"bureaucracy"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-24,"y":-17,"w":47,"h":21},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEnElEQVR42u2WXWhTZxjHiyCIIIow\nGIMyGQiFXuR2d+6iu\/GmIoxdDbtdDMZWyibDTZhOnR\/dCrFzVmVVZ2dZW2ZjsevWEbBu6pY0NjbW\ntGma5uvk65zknJzkJGnSwLP3eXfe7CT9SuL6cZEHHpIc3rzv7\/yfr7eurmY1q9nG2rjT1zwxH3x1\nywJOegJu86zHuiXhpCzoJlx+IIBgcngMFpe4e0sBzvFyG8Ix33KQU76IFcFmggLMhmMw5QuD1cVZ\nMS83Hc4dTTTbvEHg4mmIpHJFHkougEdMSj4pdZOsO7LhqnKSonvuD0thJbsEbiUna++HU7mbQmbx\nwLrCiQC7ZwKCm8HNcSF4+mwKfNF42bAF4HSuTVzIH0xm828lk\/DSC8NhqNxR2YohxENM42boPPkp\n3L7aCXanay0gCCYyBWfPeeJSZvHF2xSGJqzkJLaxyWyGM60tYOj7EaZmncAURTURfDlIT1SG+YhY\ncDcvQYS87J17I2+TI1DBnVXBRVKLJ0sPM\/7+K1zr+Aq62k9Rv3jqMxgeGoQZLweWSRsFQCAvcaYY\nvkQRIHGL3dFDjmgk3kB8V2VgSu4I2dTNoDDfbly8AAO3vi+A4uHPZl3Q3fk1DPb30k8G2Herm\/7G\n7wySi6fobx8B9\/HS9BtNTa+rcDsqCifZzLpc3iAc5tvd\/tvw5x8PKDQ+90tKQRkGhcqOPRgrPEc4\nlnexVFZu1397WFVvT9lwWFnaUGKe4OaPTSY48cE7cJrkHT5HyCsXThSpiS\/kCvFgc8zR9UxJrfNk\nDcJ1\/Af3ctntI5LKGkpzjdMow3xkeAi69eeogrgGQb859mFRJaNaHiFe9D9OTGLFwvWe3hYVrr48\n1VL5Zsw1H9mAbYbJbRwdoQf\/bbEQVZxLQBH+uXOO5uXZtvcoKAt5wYliITkFYTlN4X4be3hchXuN\n+LYlMCYHpzM7\/QdwXpLhrp8OClatWn7Vn9pnwDDwE1w5\/wXcJa2k8\/TnFLIUdHjIAKO\/3Cs0a8xN\n\/K6FjBGwsuDQHFxEZ533Szjkn5CrEmu6y3mAvLUryNM8M5lN0HPtO+KXlijJetrQz31wp\/eHokaM\nHiU5p4GrXxGuMEsVRWfneGnc6V0VkA1+1mLOtL4LX37UQvtdaYUu59gHQ5KiLYhXykm57di19V1d\nhxyBCIc3knJmJ4YPQ2ezT8Pw4ACc\/fh9CrkSHCpaAlf2rN2rNsbGJtIk7d6A0YUjp4JBj9Xaf\/0y\ncBEBeKKwP5YogvPixSGRrq7PaVSsV\/\/caHz41\/FgPC1XAomKOtweEEnyxxfy9DNMqjUgJgh0hsE1\nVD1fVcPZtx8h244efdMfjZuj6cWK1MSpgIDMeWVBPtehP1zx+FrFtqndnKr5eGLyfCydk\/kqADVw\n+9as1Cpsu7oxVZMjaoqZPKwFGlNDrIHbu943+p0M1DAy2iooGQ7zS1hFPYHAtesvHfq\/QlpRfmKl\nP7E7LmPYcRoI6X\/Boml6E6ZN+OqNnoNqBDbFEHSfFpTlHAI+mrB9sh75Vm3osZgaMPSeIG+8\/8h0\nbDOVW63qd6mTYUddzWpWs421fwCbU0dQI69YDQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "\/c2.glitch.bz\/items\/2012-08\/note_manor_mystery-1344971581.swf",
	admin_props	: true,
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
	"no_vendor",
	"no_donate",
	"no_discovery_dialog",
	"quest-item",
	"bureaucracy"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "read"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "read",
	"t"	: "write_on"
};

// generated ok 2012-09-04 10:14:16 by tim
