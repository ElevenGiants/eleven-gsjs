//#include include/shrines.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Shrine to Spriggan";
var version = "1351536731";
var name_single = "Shrine to Spriggan";
var name_plural = "Shrines to Spriggan";
var article = "a";
var description = "This is a shrine to Spriggan. Sure, Spriggan is the most taciturn and humorless of all the giants. You would be, too, if you had sole dominion over the trees. Trees are serious business, you know.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = "npc_shrine_spriggan";
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_shrine_uralia_spriggan", "npc_shrine_spriggan", "npc_shrine_base", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
};

var instancePropsChoices = {
	ai_debug : [""],
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

verbs.prime = { // defined by npc_shrine_base
	"name"				: "prime",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Prime the shrine as a weapon against the rook. Costs $energy_cost energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.skills_has('piety_1')) {
			if (this.container.isRooked()) {
				return {state:'disabled', reason: "You need to know Piety I to prime Shrines during Rook Attacks."};
			}
			else { 
				return {state: null};
			}

			return {state:null};
		}
		if (!this.container.isRooked()) {
			return {state: 'disabled', reason: "You can prime a shrine only in the presence of enemies of imagination."};
		}
		if (!this.container.canAttack()) {
			return {state: 'disabled', reason: "You must stun the Rook using your Focusing Orb before it is vulnerable to shrine attacks."};
		}

		return {state: 'enabled'};
	},
	"effects"			: function(pc){

		return {energy_cost: 10};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var energy_loss = 10;
		if (pc.buffs_has('rook_armor')) energy_loss = energy_loss / 2;

		if(pc.metabolics_get_energy() <= energy_loss) {
			pc.sendActivity("You don't have enough energy to do that!");
			return;
		}

		this.primeStart(pc);

		var val = pc.metabolics_lose_energy(energy_loss);
		if(val) {
			self_effects.push({
				'type': 'metabolic_dec',
				'which': 'energy',
				'value': val
			});
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'prime', 'primed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.talk_to = { // defined by npc_shrine_base
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "I have something to tell you!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var convos = pc.conversations_offered_for_item(this);
		if (convos.length) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 1;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var convos = pc.conversations_offered_for_item(this);
		for (var i=0; i<convos.length; i++){
			var conversation_runner = "conversation_run_"+convos[i];
			if (this[conversation_runner]){
				failed = 0;
				this[conversation_runner](pc, msg);
				break;
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'talk to', 'talked to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.donate_to = { // defined by npc_shrine_base
	"name"				: "donate to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Or, drag item to shrine",
	"get_tooltip"			: function(pc, verb, effects){

		var t = verb.tooltip;

		if (config.is_dev) {
			t += this.getFavorText(pc);
		}

		if (pc.buffs_has('extremely_hallowed')){
			t += ' <b>Triple rewards!</b>';
		}

		if (pc.buffs_has('fairly_hallowed')){
			t += ' <b>Double rewards!</b>';
		}

		return t;
	},
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Donate {$stack_name} to {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		if(this.primed) {
			var emblem_name = 'emblem_'+this.get_giant();
			
			// If we have been primed, allow our own emblems.
			if ((!stack.is_bag && !stack.hasTag('emblem') && !stack.hasTag('machine') && !stack.hasTag('no_donate')) || (stack.class_tsid == emblem_name)){
				return true;
			}
		} else {
			if (!stack.is_bag && !stack.hasTag('emblem') && !stack.hasTag('machine')){ // No bags, no emblems, no machines
				return true;
			}
		}

		return false;
	},
	"conditions"			: function(pc, drop_stack){

		if(this.container.isRooked()) {
			if(!this.container.canAttack()) {
				return {state: 'disabled', reason: "Interference from the Rook is blocking donations."};
			} else if (!this.primed) {
				return {state: 'disabled', reason: "This shrine must be primed in order to attack the Rook."};
			} else {
				return {state: 'enabled'};
			}
		} else {
			var giant = this.get_giant();
			if (pc.stats_has_favor_points(giant, pc.stats_get_max_favor(giant))){ 
				return {state: 'disabled', reason: "Pick up your emblem first."};
			}
			else {
				return {state: 'enabled'};
			}
		}
	},
	"requires_target_item_count"	: true,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var uniques = {};
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if(this.primed) {
				var emblem_name = 'emblem_'+this.get_giant();
			
				// If we have been primed, allow our own emblems.
				if ((!it.is_bag && !it.hasTag('emblem') && !it.hasTag('machine') && !it.hasTag('no_donate')) || (it.class_tsid == emblem_name)){ // No bags, no emblems, no machines
					uniques[it.class_tsid] = it.tsid;
				}
			} else {
				if (!it.is_bag && !it.hasTag('emblem') && !it.hasTag('machine')){ // No bags, no emblems, no machines
					uniques[it.class_tsid] = it.tsid;
				}
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
			pc.sendActivity("You don't have anything the "+this.name_single+" wants!");
			return {
				'ok' : 0,
				'txt' : "You don't have anything the "+this.name_single+" wants!",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if(this.container.isRooked()) {
			if(!this.container.canAttack()) {
				pc.sendActivity("Interference from the Rook prevents your donation.");
				return false;
			} else if (!this.primed) {
				pc.sendActivity("The shrine must be primed before you can attack the Rook.");
				return false;
			} else {
				return this.shrineAttack(pc,msg);
			}
		} else {
			this.conversation_end(pc, msg);
			return this.evalDonate(pc, msg);
		}
	}
};

verbs.get_emblem = { // defined by npc_shrine_base
	"name"				: "get emblem",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Retrieve your emblem",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var giant = this.get_giant();

		if (pc.stats_has_favor_points(giant, pc.stats_get_max_favor(giant))){
			var temp = apiNewItemStack('emblem_'+giant, 1);
			if (pc.isBagFull(temp)){
				temp.apiDelete();
				return {state:'disabled', reason: "Your inventory is full!"};
			}

			temp.apiDelete();

			if(this.container.isRooked()) {
				return {state: 'disabled', reason: "The Rook is interfering with Shrine activity."};
			}
			return {state:'enabled'};
		}
		else{
			return {state:null};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var failed = !this.give_emblem(pc);

		var pre_msg = this.buildVerbMessage(msg.count, 'get an emblem from', 'got an emblem from', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.check_favor = { // defined by npc_shrine_base
	"name"				: "check favor",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "View & spend favor points",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		var giant = this.get_giant();

		if (pc.stats_has_favor_points(giant, pc.stats_get_max_favor(giant))){
			return {state:null};
		}
		else{
			if(this.container.isRooked()) {
				return {state: 'disabled', reason: "The Rook is interfering with Shrine activity."};
			}
			return {state:'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.check_favor(pc);
		return true;
	}
};

function getFavorText(pc){ // defined by npc_shrine_base
	var text = "";

	if (pc) { 
		var giant = this.get_giant();
		var points = pc.stats_get_favor_points(giant);
		var max = pc.stats_get_max_favor(giant);

		log.info("SHRINE: doing getFavorText,  max is "+max+" for giant "+giant);

		text += " Current favor: "+points+"/"+max;
	}


	return text;
}

function onConversation(pc, msg){ // defined by npc_shrine_base
	var conversation_runner = "conversation_run_"+msg.choice.split('-')[0];
	if (this[conversation_runner]) return this[conversation_runner](pc, msg);

	if (msg.choice == "yes"){
		this.doDonate(pc, this.pendingDonations[pc.tsid]);
	}
	else if (msg.choice === "giveEmblem") {
		this.give_emblem(pc);
		this.setAndBroadcastState('close');
	}
	else{
		this.setAndBroadcastState('close');
	}

	if (this.pendingDonations && this.pendingDonations[pc.tsid]) { 
		delete this.pendingDonations[pc.tsid];
	}

	this.conversation_end(pc, msg);
}

function onCreate(){ // defined by npc_shrine_base
	this.initInstanceProps();
	this.dir = 'right';
	this.apiSetHitBox(400, 400);
	this.apiAddHitBox("emblem", 200, 400);
	this.apiSetPlayersCollisions(true);
	this.default_state = 'closed';
	this.setAndBroadcastState('close');
	this.initInstanceProps();
	this.fsm_init();
}

function onLoad(){ // defined by npc_shrine_base
	this.apiSetHitBox(400, 400);
	this.apiSetPlayersCollisions(true);
	this.dir = 'right';

	this.apiRemoveHitBox("emblem");
	this.apiAddHitBox("emblem", 400, 400);
}

function onOverlayClicked(pc, payload){ // defined by npc_shrine_base
	if(this.primed) {
		// Stub for now. Do nothing.
	} else {
		this.primeStart(pc);
		return true;
	}
}

function onPlayerCollision(pc, hitbox){ // defined by npc_shrine_base
	if (config.is_dev) log.info(this+' collided with '+pc);

	if (pc.getQuestStatus('donate_to_all_shrines') == 'none' && !pc.shrine_announced){
		if (!pc.shrines_passed) pc.shrines_passed = {};
		if (!pc.shrines_passed[this.tsid]) pc.shrines_passed[this.tsid] = 0;
		pc.shrines_passed[this.tsid]++;

		if (pc.shrines_passed.__length == 3){
			pc.announce_vog_fade("Lo, a shrine to "+capitalize(this.get_giant())+"//Try donating something.");
			pc.shrine_announced = true;
			return;
		}
	}
	else if (this.get_giant() == 'grendaline' && pc.getQuestStatus('donate_to_all_shrines') == 'done' && pc.getQuestStatus('last_pilgrimage_of_esquibeth') == 'none'){
		
		var donate_to_all_shrines = pc.getQuestInstance('donate_to_all_shrines');
		if (donate_to_all_shrines && donate_to_all_shrines.ts_done && time() - donate_to_all_shrines.ts_done >= 30*60) pc.quests_offer('last_pilgrimage_of_esquibeth');
	}

	if (this.conversations){
		for (var i=0; i<conversations.length; i++){
			if (pc.conversations_offer(this, conversations[i])){
				return pc.conversations_offer_bubble(this);
			}
		}
	}

	if ( hitbox === "emblem"){
		var giant = this.get_giant();

		if (pc.stats_has_favor_points(giant, pc.stats_get_max_favor(giant))){
			var temp = apiNewItemStack('emblem_'+giant, 1);
			if (pc.isBagFull(temp)){
				temp.apiDelete();
				this.sendBubble("I have an Emblem for you, but your pack is full. Free up some space to get it!", 3000, pc);
				return;
			}

			temp.apiDelete();

			this.give_emblem(pc);
		}
	}
}

function onPlayerExit(pc){ // defined by npc_shrine_base
	this.npc_onPlayerExit(pc);

	if(this.primed && pc == this.priming_pc) {
		this.primeComplete();
	}
}

function onPrototypeChanged(){ // defined by npc_shrine_base
	this.onLoad();
}

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

function onPathing(args){ // defined by npc
	this.fsm_event_notify('pathing', args);
}

function npc_onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
}

function npc_onPlayerExit(pc){ // defined by npc
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

function conversation_canoffer_rituals_of_the_giants_3(pc){ // defined by conversation auto-builder for "rituals_of_the_giants_3"
	var chain = {
		id: "rituals_of_the_giants",
		level: 3,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "rituals_of_the_giants_2")){
		return true;
	}
	return false;
}

function conversation_run_rituals_of_the_giants_3(pc, msg, replay){ // defined by conversation auto-builder for "rituals_of_the_giants_3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "rituals_of_the_giants_3";
	var conversation_title = "Rituals of the Giants";
	var chain = {
		id: "rituals_of_the_giants",
		level: 3,
		max_level: 3
	};
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	choices['6'] = {};
	choices['7'] = {};
	choices['8'] = {};
	if (!msg.choice){
		choices['0']['rituals_of_the_giants_3-0-2'] = {txt: "I’m risen, but...", value: 'rituals_of_the_giants_3-0-2'};
		this.conversation_start(pc, "All rise. ALL RISE, for the daily recitation of the Pledge to Spriggan.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_3-0-2"){
		choices['1']['rituals_of_the_giants_3-1-2'] = {txt: "Look, I’m not sure...", value: 'rituals_of_the_giants_3-1-2'};
		this.conversation_reply(pc, msg, "We, earnest tree-huggers and loyal supplicants to Spriggan, pledge allegiance to the All-Powerful Giant of Trees.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_3-1-2"){
		choices['2']['rituals_of_the_giants_3-2-2'] = {txt: "I’m not really a Spriggot, tbh.", value: 'rituals_of_the_giants_3-2-2'};
		this.conversation_reply(pc, msg, "We swear to pet, not poison, water, not weedkill, and never to go against the grain, when we know the grain is good.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_3-2-2"){
		choices['3']['rituals_of_the_giants_3-3-2'] = {txt: "Oh come ON...", value: 'rituals_of_the_giants_3-3-2'};
		this.conversation_reply(pc, msg, "We will cherish our wood, and love our logs, and never take a hatchet to a dying friend, for every tree is our friend.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_3-3-2"){
		choices['4']['rituals_of_the_giants_3-4-2'] = {txt: "I’m sorry, I can’t.", value: 'rituals_of_the_giants_3-4-2'};
		this.conversation_reply(pc, msg, "... nd above all, deny our loyalty to any giant but Spriggan.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_3-4-2"){
		choices['5']['rituals_of_the_giants_3-5-2'] = {txt: "But, but - it’s not. When is this from?", value: 'rituals_of_the_giants_3-5-2'};
		this.conversation_reply(pc, msg, "In this, the age of Spriggan.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_3-5-2"){
		choices['6']['rituals_of_the_giants_3-6-2'] = {txt: "That’s terrible. This is awful.", value: 'rituals_of_the_giants_3-6-2'};
		this.conversation_reply(pc, msg, "Now and ever more. This is our special pledge. Our lives are made shiny by it. We wooden’ lie.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_3-6-2"){
		choices['7']['rituals_of_the_giants_3-7-2'] = {txt: "Unbeleafable.", value: 'rituals_of_the_giants_3-7-2'};
		this.conversation_reply(pc, msg, "You may now continue your day. Transmission ends.", choices['7'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_3-7-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"rituals_of_the_giants_3",
];

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"shrine",
	"no_trade"
];

var responses = {
	"donated_item_tier1": [
		"Meh.",
		"Pah.",
		"Sigh…",
		"Feh.",
		"Hm.",
	],
	"donated_item_tier2": [
		"It is ok.",
		"This is mediocre.",
		"Ok. But more. More. Yes? More.",
		"Spriggan likes this ok.",
		"Takk.",
	],
	"donated_item_tier3": [
		"Thank you, yes.",
		"Danke. Ja.",
		"Merci. Oui.",
		"Gracias. Sí.",
		"Hvala Vam. Da.",
	],
	"donated_item_tier4": [
		"Spriggan salutes you. He Spriglutes you!",
		"Tres bon. Merci beaucoup.",
		"Dear supplicant: YES. Regards, Spriggan.",
		"YES. YES!",
		"Bold. Strong. Good. GOOD.",
	],
	"super_donation_20x_xp": [
		"By the power of SPRIGGAN!",
		"The law of Spriggan says: you deserve reward.",
		"Extra Spriggot love for you, little one.",
		"Spoinks, petal! Here's one doozy of a re-diddly-ward, y'hear? Ahem.",
	],
	"super_donation_5x_xp": [
		"Spriggan says: you deserve a reward.",
		"More reward for you. From Spriggan.",
		"Sometimes, you deserve a little encouragement.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-62,"y":-162,"w":122,"h":162},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALS0lEQVR42rWXWUxbZxbHPdNKbRPs\na\/sab5iwL2ExYMBgFtsYbDYbL2B2MPu+EwKUPVCyACEhNGnSFEJJ0hCaMA0h7UzaaUbzVGmkduZp\n+lCl0rzMWzRPI83Lf44vVaU+jEY05kp\/XfPhe7+fz\/nO+f4fj\/crrrbnz5mW\/X1j85MnjraDg5mj\nqH1\/P4F3HFfrs2eG1oP9zcqPt18Wf7gB3eV1xMwtIXT6IvyH5iDqn4GobxqijjGIuicg7HoXwt4p\nMDTG7xiFuHsMoZPnkb+4jJw72y\/LdnfvtBwc2F8brPngIKjlyWffOre3EXSWIAZo0sFZus9C3DMJ\ntn0UbPMw2IYBSDz98K\/v4yTxisbEdT0QuBrg56jHSUcd+M1DEIwugpm\/BsvHd9H2dP\/lrwL1ptEb\nsYr79xC7cAkne96FX8sgBC1DEDYNgm05w0H4V3dB6m6Fv60WUrsHcpLMWgO5owFShwf+pc2QVnaA\nLW+FqLoDDD0r7BwDc2YBzOwVRF69hardXXjnOhrgwf6eZWMTwjOTP8ENwa+iFXx7LRhbNVh7HfwJ\nRJpfDoneCqneBmlmEaQZBZBlFEGWRWNeGUogzXVxP4B1NkBE0RQ19HPRFxKkYOw8BEOTcG7ewZEA\na+8\/QPnODmSjC4dwtV0QlDZCmGODMMUAoVoH0elkiKI1EEUlQhSZAFGE+pfyjnn\/R98Rx6dDmJgJ\nUXYhxBRZYUUbBBRRP08vNMvX0Hbw9GiAcbU9r2o\/2eEeNN+4jdODtOgzLQRGE8WmHsJFJR1ChMdD\n\/D\/k\/d8haNLhM\/SsMFmPiMYuGJeuomb3U26OmnufHA1Q2ztxN8TVAt34AmoePORe0vT4MRxr66Rr\nyOwbwumSCkQVOhBVUPJ\/ldrcgazBs3C+\/wEa6T3e93nV8OgRNF0jtDxsRwPU9Y4b4jwDkBXQ4rc2\nQT08B11DN8rvPuBe7Hmw8\/Mk\/0vNe3soW7+BlidPuL\/tFy9zY65bGzDMXUA0vU+oKwJLcEpT2asj\nV7K2e\/zuKVsD5EUeqshWhFX3QFIzDFXXLAL630PE5BWEz64j7Nx1hE1dQdjEJYRPHip0\/AJCrXWI\nKalD5tR5hLSfhaquF37mSvhl28HPKgGjK4QovQDKXDeU2c6jtxpRsptJaR\/9VklR5CDtrZCUdkFS\nNQhx7QjETdSQW6bBtM9C2L2Ikw1j8KsfOVTdMPyqB8Gv7IegvBf8Yg\/4BMI3uiAgOGE6wWktBFeK\n4OK61ddq1glNA3sB+dTbCusgszVB6myHv7sHbCU14uohsJ5Rah2jYEo7IXC0072L+8y46DNFXpBf\nfQiWTVHLKIZQW0Bw+ZBlOyjK9f0+2eriqzpXlbkVkJOklmpIC+u5tLPWBogJWmxrhrCoHsLihkPR\njxHRdxiKmoCgWILzFoKE0spS9BQG157C5Ary6X4cbms0xFYOvIymCAUThDTLThOTDE6wxjKIc8rA\nmtycxEYnRJTKMPoRSS0zyBxcReWlLUQV1fxDleM08I7ryhu9ydQt39nrv\/0YtZfvIcrRBjbVDEla\nISkfknSqSkqfhBRKP0LbfRGa9vNIo7tj+hom7n\/mcVjn+522xeODFMRlzQwsr6DvyjpU1CaE0em0\nc6QeKiyZExOcAFlsFlLb5jnArMEVWIfOvfrhhx+YirLFVWfxvOfYAKWp5julfSOon7kIvygt+OEp\nEIQkgglJIrBECH8SPyAWKiqIlM6LMA6vYuT9LVxavG5Yunh1hneclzyt4Dsd7aOni8k+xWWBH60D\nE5MJYVQ6mHBSZBqYCFKQGkKCTutdRornLG7t7uDhw+2v+8aHPfHVFfZjgTshCVQq0gv\/I9MWQRBv\nAKMm45BoApOQCybOABHdRQkm7s5EaLnIhlvqkN2ziHc\/2sUXXzybmFpbNCS73cwxRS+vUabJBasp\nAJ\/WmBdOGE0uRWMBm0JOhcbFKQWQpBRDmmiBJDoL0tgcJFHPrF3ahEilUR9regMyix6I43MockYI\n1Hqq4npEk0eMcTUiprQJIaYyyAk2QGuFKrUYcvquLC4HktNZyO2cgiRGX32sgJIEwz9FcXpKrx7x\nVa2IIketoMYtp96nMFdBmVcJBe0QSoPrZ0V63XaMAUE6atSagu1jg+NHayOFVBCipFwIIrUIoMnl\nxYdmIryyCxlDs4imY0BEVSfCq7oho+3RK3ke7TyxJkjVefBPtb3yKVRZTLbdKw4wUuuRppjBJuRA\nEJ6KsIoO+Je0wDK3gobN+8gcX0TKyDyc1zdQcf02At1dZPWbOUhVhhsBWeVQ6Jy0bs2JPgMsj9PP\nuGP1q6M3HzLGjonNYL0DbEwWAWrBFtKhqLwPjpUbiOkYR2jTCCRkInRkuxIG5xDfNYHQxhH4U5RV\nOhdk8Xl0t1MUC\/t9GsV6rcUzdX5loXP9Lirmb0CeZIaQ+hxb0gox+UO2bgRxw4uI6p1B+vQSTBfW\nIa0fRnjXNFRNY5CQTQvMLKeCyYNMnQtllmvPp4CXN+4bLszM4MrWJpqvbCF\/+BKdMzLAlnVDRFZL\n3DSJ4L4F2Cm1NVv3Ubl1D9aVDyFrm4a48V2yZf04pa+EPJlOfnEmnDJVvPQZnGVoKmHtyRPDxld\/\nwPStG+j94D5qV7YhidVDVDUAYdcCnXPnOSVOLKHnj1+i\/dlTsJ1zEHWcI0M7BRGZW2WKDYFGMr7J\ndCRNL\/GeP37jI\/cyyliGJzwHf\/0G1559jjMbO2hd34E4Mh2Rw+9B0HcRzMAyp0Q6iPd8+Rx9f\/oK\nkmEa6790qMZxyBPMFMVqSm85VMZyWsc5aT4BNI9MGS7vPrB\/\/rdv0HN+AmNbu8iup8iFkXPpmAUz\ntsaJJZVuPaST32fw7O0jZfUO+EMrEJxdg4BSLVeboUxzQeVNtc4BSWqh7+zWyqNHM6uf3sX05m1M\n3t1Dos1D1iodbA\/tDHMEN3sV7OQK2OlVhFy4AfHkKgLOrUE84R2jO+0g8gQLVyhKXSkktLOIYg1V\nPgO8+fwvzLVnv8f8zu9w5qOH5Fi0BKiDJKcU0ooWSKkxy2p7IKvpgaK2D4oaEkVZ6RmCrLwDsuJ6\nKBLyoSJAVXYlByhWm2aybQt2r3wCObr5ybfj24+hsdVxLoVNJBedVADWawaSyRgk5VMBWKFIKUGg\nrgzKpCLai20I0BRDQe1FqSlCkLGeUlzNmQix2jiT63pvT0\/u2ieAxtYzX7euboAfooGQDACbaoU0\n3QlZBm131IQDDDWHokoN1NM9xYpTlM6ooh4EZVYgMK0UQTkEaKiiKnZCTBtA28Cq74wrE5\/9tZgM\ngoCMgkhj5myVf7od8kzvobsSARQZlbGOk0Jj5SIYQBENNdQimIBPEWSwiXYUQzXcXcO48\/FHr5aX\n1310qjMa3\/SLSvmzKMlCgNmH3i+ZANN+AqTKVFHkVDl1CPAWgje93r5H6Q41NSKQIhZqbkFwXhNU\n1GbMtb1Id9Wv8TIz+T6B45mslneikr8TeJtzYi4H6J9G51za+L2ACn3lv5X6KkovuRdNIa07KwII\n0gsYYWlHaG4TJ2+K5ZR6YbzxX28nGZ\/ysvIaeWaz8vUAre4Anqm49rdaw9UTMRk\/MqczIFSb6Fhp\n4wBZAhKn2b4XpxZ9712LcqpWpbcwEougUFvI7rcjzNKGIFoCijQHTmjMz3i6vCVepnmc3uvmma0R\nrx\/FfLeYXqbl5RRVv51s3HxHnf3inUT9i5OJOS9OJuW9eDPdcpWXYZl\/Q2taE8UZ\/s7G5\/74ljb3\nQ78k0z0mq+SmX6Zt7URG8dpbuvwlnr6onZfnzOIVulSUnbd971otTikvzx7Pyy1R82zuEJ69MvBn\nWd2nfqGSSiUvjw5HXrndb\/ya6f4L3Cw8qvn5UqAAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "\/c2.glitch.bz\/items\/2010-04\/1271458899-8259.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
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
	"shrine",
	"no_trade"
];
itemDef.keys_in_location = {
	"c"	: "check_favor",
	"e"	: "debug",
	"o"	: "donate_to",
	"g"	: "get_emblem",
	"v"	: "give_cubimal",
	"h"	: "prime",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("npc_shrine_uralia_spriggan.js LOADED");

// generated ok 2012-10-29 11:52:11 by lizg
