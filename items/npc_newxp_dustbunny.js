//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Dustbunny";
var version = "1346352703";
var name_single = "Dustbunny";
var name_plural = "Dustbunnies";
var article = "a";
var description = "An ikkle fwuffy cutesy wutesy Dustbunny. As cute as a small fluffy ball made of dead skin and discarded hair can be, at any rate. Still, at least it's polite.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_newxp_dustbunny", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.walk_speed = "100";	// defined by npc_newxp_dustbunny
	this.instanceProps.conversation_offset_x = "0";	// defined by npc_newxp_dustbunny
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	walk_speed : [""],
	conversation_offset_x : [""],
};

var instancePropsChoices = {
	ai_debug : [""],
	walk_speed : [""],
	conversation_offset_x : [""],
};

var verbs = {};

verbs.debug = { // defined by npc
	"name"				: "debug",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 10,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.debugging === undefined || this.debugging == false) {
			return "ADMIN ONLY: Turn on debug displays for this NPC.";
		}
		else {
			return "ADMIN ONLY: Turn off debug displays for this NPC.";
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_god) { return {state:'enabled'} };

		// Do not show this for non-devs:
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		 
		if (this.debugging === undefined) {
			this.debugging = true;
		}
		else {
			this.debugging = !(this.debugging);
		}

		this.target_pc = pc;

		if (this.debugging) {
			var pre_msg = this.buildVerbMessage(msg.count, 'debug', 'are debugging', failed, self_msgs, self_effects, they_effects);	
		}
		else {
			var pre_msg = this.buildVerbMessage(msg.count, 'debug', 'stopped debugging', failed, self_msgs, self_effects, they_effects);	
		}

		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.give_cubimal = { // defined by npc
	"name"				: "Give a cubimal to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return 'Give '+this.label+' a cubimal likeness';
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var cubimal = this.hasCubimal();

		if (!cubimal) return {state: null};

		if (pc.getQuestStatus('mini_me_mini_you') != 'todo') return {state: null};

		if (pc.counters_get_label_count('npcs_given_cubimals', cubimal)) return {state:'disabled', reason: "You already gave away a "+this.label+" cubimal"}

		if (!pc.findFirst(cubimal)) return {state:'disabled', reason: "You don't have a cubimal of "+this.label};

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var cubimal = this.hasCubimal();
		var stack = null;

		if (!cubimal){
			failed = 1;
		} else {
			stack = pc.findFirst(cubimal);
		}

		var responses = [
		'Pour moi? How kind of you! I feel all fluttery inside!',
		'Oh yes, this is very handsome. Thank you so much!',
		'A passable likeness. Always nice to know that someone is thinking of little old me!',
		'Well what have we here? It\'s a bit... square. But it captures the essence, doesn\'t it?',
		'Cubimals are my favorite! And this one is my favoritest favorite!',
		'I shall carry it with me always, and cherish the memory of your kindness'
		];


		if (stack){
			var item = pc.removeItemStack(stack.path);
			item.apiDelete();
			this.sendBubble(choose_one(responses), 10000, pc);
			pc.counters_increment('npcs_given_cubimals', cubimal);
			pc.quests_inc_counter('npcs_given_cubimals', 1);
		} else {
			failed = 1;
		}


		var pre_msg = this.buildVerbMessage(msg.count, 'Give a cubimal to', 'Gave a cubimal to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.give_egg = { // defined by npc_newxp_dustbunny
	"name"				: "give egg",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Give the Egg",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Give Egg to Dust Bunny",
	"drop_ok_code"			: function(stack, pc){

		if (stack.class_tsid == 'egg_plain') return true;

		return false;
	},
	"conditions"			: function(pc, drop_stack){

		if (!pc.items_has('egg_plain', 1)) return {state:null};
		if (!pc.location.canGiveEgg || !pc.location.canGiveEgg()) return {state:null};

		pc.sendActivity('Drag an EGG onto the Dustbunny. Or, click on the Dustbunny to give it an EGG.', null, false, true);

		return {state:'enabled'};
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		return {
			'ok' : 1,
			'choices' : ['egg_plain'],
		};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var stack = null;
		if (msg.target_itemstack_tsid){
			stack = pc.removeItemStackTsid(msg.target_itemstack_tsid, 1);
		}else{
			stack = pc.removeItemStackClass('egg_plain', 1);
		}

		if (stack){
			var location = this.getLocation();
			location.apiPutItemIntoPosition(stack, this.x, this.y);
			stack.apiDelete();
		}

		this.eventFired('egg_given', {pc:pc});
	}
};

function eventFired(event_id, args){ // defined by npc_newxp_dustbunny
	var location = this.getLocation()

	if (location.eventFired){
		return location.eventFired(event_id, this, args);
	}
}

function facePlayer(pc){ // defined by npc_newxp_dustbunny
	if (pc.x < this.x){
		this.dir = 'right';
	}else{
		this.dir = 'left';
	}
}

function onConversation(pc, msg){ // defined by npc_newxp_dustbunny
	this.conversation_end(pc, msg);
}

function onConversationEnding(pc){ // defined by npc_newxp_dustbunny
	this.setAndBroadcastState('idle_stand');
	this.eventFired('talk_end', {pc:pc});

	if (this.local_chat_queue){
		pc.apiSendMsg({type: 'npc_local_chat', tsid: this.tsid, txt: this.local_chat_queue});
		delete this.local_chat_queue;
	}
}

function onCreate(){ // defined by npc_newxp_dustbunny
	this.initInstanceProps();
	this.onLoad();
}

function onInputBoxResponse(pc, uid, value){ // defined by npc_newxp_dustbunny
	this.eventFired('ask_end', {pc:pc});
}

function onLoad(){ // defined by npc_newxp_dustbunny
	this.npc_walk_speed = this.getInstanceProp('walk_speed');
	this.apiAddHitBox("extension", 300, 300);
}

function onPathing(args){ // defined by npc_newxp_dustbunny
	if (args.status == 2 || args.status == 3 || args.status == 4){
		this.eventFired('walking_end', args);
	}else if (args.status == 1){
		if (args.dir == 'left'){
			this.dir = 'right'; // backwards on purpose
			this.setAndBroadcastState('walk');
		}
		else if (args.dir == 'right'){
			this.dir = 'left'; // backwards on purpose
			this.setAndBroadcastState('walk');
		}
	}
	return true;
}

function onPlayerCollision(pc){ // defined by npc_newxp_dustbunny
	this.eventFired('dustbunny_collision', {pc:pc});
}

function onPropsChanged(){ // defined by npc_newxp_dustbunny
	this.npc_walk_speed = intval(this.getInstanceProp('walk_speed'));
}

function onPrototypeChanged(){ // defined by npc_newxp_dustbunny
	this.onLoad();
}

function startMoving(){ // defined by npc_newxp_dustbunny
	if (!this.container){
		this.apiSetTimer('startMoving', 1000);
		return;
	}

	this.go_dir = choose_one(['left', 'right']);
	if (this.go_dir == 'left'){
		var x = this.x - 800;
		if (x < this.container.geo.l + 50){
			x = this.container.geo.l + 50;
		}
		if (!this.apiFindPath(x, this.y, 0, 'onPathing')){
			this.fsm_pop_stack();
		}
	}else{
		var x = this.x + 800;
		if (x > this.container.geo.r - 50){
			x = this.container.geo.r - 50;
		}
		if (!this.apiFindPath(x, this.y, 0, 'onPathing')){
			this.fsm_pop_stack();
		}
	}
}

function stopMoving(){ // defined by npc_newxp_dustbunny
	this.apiStopMoving();
	this.setAndBroadcastState('idle_stand');
}

function talk(pc, text, choices, msg){ // defined by npc_newxp_dustbunny
	if (!pc) return;

	this.facePlayer(pc);

	var details = [];
	details['dont_take_camera_focus'] = true;

	if (msg){	
		this.conversation_reply(pc, msg, text, choices, null, null, null, details, true);
	}else{
		this.conversation_start(pc, text, choices, null, null, null, details, true);
	}


	// We want to strip out all HTML, and change the split to HTML breaks.
	text = text.replace(new RegExp('<split butt_txt="[^"]+">', 'g'), '--br--');
	text = text.replace(/<br>/g, '<br> ');
	text = utils.strip_html(text);
	text = text.replace(/--br--/g, '<br><br>');

	var split_pos = text.search('<br><br>');
	if (split_pos != -1){
		this.local_chat_queue = text.substr(split_pos+8);
		text = text.substr(0, split_pos);
	}

	pc.apiSendMsg({type: 'npc_local_chat', tsid: this.tsid, txt: text});
}

// global block from npc_newxp_dustbunny
var no_auto_flip = true;

function checkWaiting(){ // defined by npc
	if (!this.isWaiting) return;
	if (!this.container) this.apiSetTimer('checkWaiting', 1000);

	//
	// remove any keys we can, because user has logged off, or is far away
	//

	if (this.waitingFor.__iterator__ == null) delete this.waitingFor.__iterator__;
	for (var i in this.waitingFor){
		if (!this.container.activePlayers) continue;

		var pc = this.container.activePlayers[i];
		if (pc){
			if (this.distanceFromPlayer(pc) > config.verb_radius){
				delete this.waitingFor[i];
			}
		}else{
			delete this.waitingFor[i];
		}
	}


	//
	// done waiting?
	//

	if (!num_keys(this.waitingFor)){
		this.isWaiting = 0;
		if (this.onWaitEnd) this.onWaitEnd();
	}else{
		this.apiSetTimer("checkWaiting", 1000);
	}
}

function clearMovementLimits(){ // defined by npc
	delete this.move_limits;
}

function fullStop(){ // defined by npc
	this.apiStopMoving();
	this.apiCancelTimer('startMoving');
}

function hasCubimal(){ // defined by npc
	var cubimal_map = {
		hell_bartender:					'npc_cubimal_hellbartender',
		npc_batterfly:					'npc_cubimal_batterfly',
		npc_bureaucrat:				'npc_cubimal_bureaucrat',
		npc_butterfly:					'npc_cubimal_butterfly',
		npc_cactus:					'npc_cubimal_cactus',
		npc_cooking_vendor:			'npc_cubimal_mealvendor',
		npc_crab:						'npc_cubimal_crab',
		npc_crafty_bot:					'npc_cubimal_craftybot',
		npc_deimaginator:				'npc_cubimal_deimaginator',
		npc_firefly:					'npc_cubimal_firefly',
		npc_fox:						'npc_cubimal_fox',
		npc_fox_ranger:				'npc_cubimal_foxranger',
		npc_garden_gnome:				'npc_cubimal_gnome',
		npc_gardening_vendor:			'npc_cubimal_gardeningtoolsvendor',
		npc_gwendolyn:				'npc_cubimal_gwendolyn',
		npc_jabba2:					'npc_cubimal_helga',
		npc_jabba1:					'npc_cubimal_unclefriendly',
		npc_juju_black:					'npc_cubimal_juju',
		npc_juju_green:				'npc_cubimal_juju',
		npc_juju_red:					'npc_cubimal_juju',
		npc_juju_yellow:				'npc_cubimal_juju',
		npc_maintenance_bot:			'npc_cubimal_maintenancebot',
		npc_newxp_dustbunny:			'npc_cubimal_dustbunny',
		npc_piggy:					'npc_cubimal_piggy',
		npc_piggy_explorer:				'npc_cubimal_ilmenskiejones',
		npc_quest_giver_widget: 			'npc_cubimal_greeterbot',
		npc_rube:						'npc_cubimal_rube',
		npc_sloth:						'npc_cubimal_sloth',
		npc_smuggler:					'npc_cubimal_smuggler',
		npc_sno_cone_vending_machine:	'npc_cubimal_snoconevendor',
		npc_squid:					'npc_cubimal_squid',
		npc_tool_vendor:				'npc_cubimal_toolvendor',
		npc_yoga_frog:					'npc_cubimal_frog',
		phantom_glitch:				'npc_cubimal_phantom',
		street_spirit_firebog:				'npc_cubimal_firebogstreetspirit',
		street_spirit_groddle:			'npc_cubimal_groddlestreetspirit',
		street_spirit_zutto:				'npc_cubimal_uraliastreetspirit'
	};

	return cubimal_map[this.class_id];
}

function onInteractionEnding(pc){ // defined by npc
	this.fsm_event_notify('interaction_ending', pc);
	if (this.waitingFor){
		delete this.waitingFor[pc.tsid];
	}
	this.checkWaiting();
}

function onInteractionInterval(pc, interval){ // defined by npc
	this.onInteractionStarting(pc);
	this.events_add({callback: 'onInteractionIntervalEnd', pc: pc}, interval);
}

function onInteractionIntervalEnd(details){ // defined by npc
	if (details.pc) {
		this.onInteractionEnding(details.pc);
	}
}

function onInteractionStarting(pc, mouseInteraction){ // defined by npc
	this.fsm_event_notify('interaction_starting', pc);
	if (!this.waitingFor) this.waitingFor = {};
	this.waitingFor[pc.tsid] = 1;
	if (!this.isWaiting){
		this.isWaiting = 1;
		if (this.onWaitStart) this.onWaitStart(pc, mouseInteraction);
		this.apiSetTimer("checkWaiting", 1000);
	}
}

function onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
}

function onPlayerExit(pc){ // defined by npc
	this.fsm_event_notify('player_exit', pc);
}

function onWaitEnd(){ // defined by npc
	this.fsm_event_notify('wait_end', null);
}

function onWaitStart(pc){ // defined by npc
	this.fsm_event_notify('wait_start', pc);
}

function setMovementLimits(x_pos, y_pos, width){ // defined by npc
	this.move_limits = {x:x_pos, y:y_pos, w:width};

	//log.info("move_limits is "+this.move_limits);
}

function parent_onPathing(args){ // defined by npc
	this.fsm_event_notify('pathing', args);
}

function parent_onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-42,"y":-60,"w":91,"h":56},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJ80lEQVR42u1XaXAb5Rk20IYpwwQI\n0CaOdUSSL1nXaiWtdlda3bJkybpvydZhSbZk+baTOAZDmmAHEjctM1wDtHQ60KG005Yp7UAILWcg\nUyiUDCVNMFNoACexg51YPmKzfTdtmZQpDGWgww+\/M9\/srvab73v2ed73eT9VVKzFWqzFWqzF541L\nYFz6ieevT3RGdXhHlDIWg\/orGXBeSlTvMom+c9GUS\/8F+pL\/J2Mfb1ZK6PUMSOY+aELwgEk27DdL\nEQZYMBi8rDOia8n7SEOgUaL1ORQ8u11w+VeKLuvDqtqDmDDvRK9gNiuFNdJSQiPtimPrEw7UEXco\nXPCO3dNiwDIeMhSxomMpD\/5C1Ka4Ld6kesRvQaJ2TLD+KwNYipCKUkx3IzOKCV20ECRr+1uMub5W\n46\/6W02Pbs82PjScsz22NWN5eihleaU3YfhuKUqN5P14XdZH7gjb0ImEQ64NCoXrvhKAkGuyQoTq\nLMWonlJc31GMkpr2MDnalzT9brToeGhnqfmx7bnG57e3Wfb0p8w39bea3yqGdS8lHMp74g7sj2kv\ncTzlxD15M3pVsFG4IeYQX\/Nlgr00HyQ1nVEqmfUpAlk\/tr0U1\/5ka8b6zkiHvbyr2\/Xm7h7Xy9va\nrE\/2J80\/H842PjOQNp\/sSRhmc0FNuc1PvJUPkPvTPmKgLUC2ZwLEzQm7ouQ1ifEvpYialMKNMZui\nCeT9Xm+r\/tG+lPEXg2nz0YGU+XBXjDpyQ7v97ZsKzpnd3Z7VW\/t9L93S7X4G2Hy5P2n6e1dC\/14+\npFkqhKn3oah2ZgOaP6S96mQwKFznN4oSwYqKy74QKIb+Fq\/k26mgcmPIIiMDFmn7QNp0654+z8H9\n24K\/ndgWPjze6566pcc1u7vLdWq04Di3byhwdu+Qb2FPn3d1Z6fzXUiJt9t85GI2QNLA5CQwGMiF\niF1RG9oVscm4fqP0iwOMuJDKlBfP5EPaHUzuZf14JxTEvRNbQ0fv3l0o3zVWWtw\/kpgZ63V\/cHPR\n+d6uHt\/0vm2RubFe\/9xI3r4MRUN3x41nC2HdHKyxBCny06yXvK21GXsmalM+HHcoR50GRCoUXn\/l\nFwLIJHHWi1kKUTJZiFH5Qlg70RHWPDfS6X\/nxsH83J17d9J3jfdPD6Wts0NttpV9o8XV\/Tt76L07\nsvRw3klDNdOQj1MdEd3rWT9xqs1HnGjzk29nfMQLrS5sMtqk3OUxSEwGlaBRKapkfW5gTnTTFRak\ntjLqrLmu1SWXpN1KVqeP4LQFiUJ7SHukM245mos2nRrbXqAnRnJzAynL\/GhXZOHu\/ePLQ91F+v7v\nj9FjQ610d8JAd4S1xzM+8mh7WLsA9\/PtQc0UgHwr7lQeDtvk97gNkh\/olYJ7cRm3B6m9rvJzATTi\nNZudWmEAXEWWbFY25Px4YyFEJQsh7XBnVPtAT4vpzdFSoLyzJ7iyI99EQ+WWRzoDiwmPibZRCvqO\nW0fp0Z7YIgBZaQtozuZCmg\/60pb5YoxaLkS1H8HvNDB4KmCW3WHTCCe0ct5BtYydI6TsFqWQu1Fa\nc+3mis\/KSxSt+KYD+mrMgbaVYvqe3oQxmguT8UJEdwt43r7BpPm1bZnGmaG0ZaErrqe74obT3XHT\nXDFqoAsRI31zb3yhP20\/nQ9qASTxPrx\/BXL3FBTImZZm1UIxSn2U9OBnglb5IStR9xQp476olnGT\nWAMrQohZlEq42YghbOFnsnhTMLhuvNuD7u5qHh9MWe5ucWH3dMb0fxnKWN8dTJn\/Cpsea2nGFpxU\nA+02iOmIHaVBvvPFCLXUHdfPFCO6RZCUzngJAM0wR62mfXg56cbO5YLkarxZNRm0ItMWdd3jwOAB\nXMrxqiTsVmHV+g083jVXqWWc7GceCpi862s1JUeLzSOw6X3RJsXjYNLPg+\/9GRL\/CBj0Cfh92W+W\n0U5dA+0xSmioyg9zAeLDUlR3HjrNckdI+17SjS8ASGBNtwJFcg5yeAXkpQNWedlnlk4ZlNUngMUJ\nRlq1lLULFW5iY2I2iku4tk9Fp6rbfK1OyVN6wKNgweH2kOZImx+fhKT\/20DSfLS3xXhyMG2he1uN\ndO6f\/kbnYYDfnYX5i2DmNHOFd0fTHvUcmPKF90m3eirlUc8nnKpZYH0BJD5txmr+ZCPrHsCl7Lxa\nVNVFSjkGQsqyyrhXX\/2pAKGiPBhMopAtVMiGDoMkz\/Uk9E+AtJNgHQuQe\/SOvO08AD2X9ZOzDBi4\n0jCWO8LUCgMGgNCMOQNrdMajPgfPsyDvfMyhLCec2IxbL573GiWzFnXNcyas+kUNsuUAgXD8JMKq\nVIs49QopB\/lUgATCDihFHEIvF6jh6wajjfKtbV78Zym3+jVg552RvG0BusYytLJpYHIKCmUBQC4D\nwDKwdh4kXAKWVqD30gx7AGwWFJiGNc4nXapFyNdVl0G0AON5Pcp\/FWR+kpLz34D7GwwIzwQMDmBS\ndgKtqxL\/d4CogK9X8sMmdW23GasbtxL1xWa9eNxrkhwC7zoBHeHkQMo0N5SxLEOvXYY+C7ahWgIJ\nz0OXoONNynMwlgHY2ZQbO5N0YWdSDHtN6CqswRRW2aiqLgNzB\/QKwetGZc1jWmTLCS3Ke0iDcB8k\npJzbMTErDXk4DNXNJSWVtYyzfAxQi\/I9JlXNhEFR\/SBU2SE7KXzagtfvhwPn07DZNMg1A0zNwShn\nvPgcFMds1C6fidrRmVAjsghjyW+RnYLT9Wm\/SXocPu64gxJOghqTVnXtEoCb1cl5b+pQwe91SsFB\nAHkcAL4B+VdimMNFbKdSwm4mZJw7GTU1Mjb5HwAJ2ZbdWjl\/yKgS\/Biq9Ddxp+o1kOoQtKiDkPTP\ngkTHAlZk3mMQz0EenfGZJNNeo\/g0tK2TkPwnXHrxyWZKNOWgGhbtZP0xqNIjRqz6Vb2C9wQA\/DW0\ntvsMCsGEVrYlq5KwtKSUG8YlnL1qYRWmknC2oCIWXy3m2DERy6oQViJy0aZ6Zh4urVIBvHUVuJTV\nSCl4TdEmpL0rZujOuNT94GXbUl4iZ8brBmGjRyzq6tcbibrpJk39G01k\/bt2TX3ZrhUetpK1z1rx\nugMWvPYVM1Z9TK\/gP0WhvB\/BtZ1C+QM6BS+qlXHdBjkfRVHeVf8mBWnYLFWJWAoc4eqUYNYXFckl\nuHD9BvBJhJCwRPD8jQqBoOJyLSK4fl\/eeV13jKqmZLxqvZwv0IjZ14AEGrWUvQdy5X6dkv+wQcG\/\n3aDk\/xBk+qUO5d0JY1gv5zlhvk2r4Lo1CNuslnCy6oZKEnwuDAY8ApvdiIsvFMDFf1krmFMNUsuq\nFHKv3\/g\/naRRODzgVVXfutAG6zmbYHEdLmGbmCv0UJIBfeFezDbjYm4d84EXL6CUshuY1sUwpJZy\nfIyN4cIqwScBrsVarMVafE3iH7my05XMM6xMAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "\/c2.glitch.bz\/items\/2012-06\/npc_newxp_dustbunny-1340833455.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: true,
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
	"no_auction"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal",
	"v"	: "give_egg"
};
itemDef.keys_in_pack = {};

log.info("npc_newxp_dustbunny.js LOADED");

// generated ok 2012-08-30 11:51:43 by mygrant
