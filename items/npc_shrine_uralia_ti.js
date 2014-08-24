//#include include/shrines.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Shrine to Tii";
var version = "1351536731";
var name_single = "Shrine to Tii";
var name_plural = "Shrines to Tii";
var article = "a";
var description = "This is a shrine to Tii, the overseer of elements, and the giant who manipulates all matters alchemical. Unlike the other giants, Tii is neither male nor female. Or both male and female. It's either really simple or really confusing, depending how you look at it. Some reckon this is why Tii seems cold and distant. They are incorrect. Tii is merely calculating and combining. It's distracting.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = "npc_shrine_ti";
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_shrine_uralia_ti", "npc_shrine_ti", "npc_shrine_base", "npc"];
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

function conversation_canoffer_voicemail_of_the_giants_3(pc){ // defined by conversation auto-builder for "voicemail_of_the_giants_3"
	var chain = {
		id: "voicemail_of_the_giants",
		level: 3,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "voicemail_of_the_giants_2")){
		return true;
	}
	return false;
}

function conversation_run_voicemail_of_the_giants_3(pc, msg, replay){ // defined by conversation auto-builder for "voicemail_of_the_giants_3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "voicemail_of_the_giants_3";
	var conversation_title = "Voicemail of the Giants";
	var chain = {
		id: "voicemail_of_the_giants",
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
	if (!msg.choice){
		choices['0']['voicemail_of_the_giants_3-0-2'] = {txt: "Ping-ping...", value: 'voicemail_of_the_giants_3-0-2'};
		this.conversation_start(pc, "Beep-boop. Eeeeeuuuuuuuuuurgh, ping, ping.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'voicemail_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "voicemail_of_the_giants_3-0-2"){
		choices['1']['voicemail_of_the_giants_3-1-2'] = {txt: "Enter.", value: 'voicemail_of_the_giants_3-1-2'};
		this.conversation_reply(pc, msg, "Connection made. Tii is online. To progress with your supplication, please click “Enter”.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'voicemail_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "voicemail_of_the_giants_3-1-2"){
		choices['2']['voicemail_of_the_giants_3-2-2'] = {txt: "You’re welcome.", value: 'voicemail_of_the_giants_3-2-2'};
		this.conversation_reply(pc, msg, "Tii would like you to know that your donations are important to Tii. Tii thanks you. Please click “You’re welcome”", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'voicemail_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "voicemail_of_the_giants_3-2-2"){
		choices['3']['voicemail_of_the_giants_3-3-2'] = {txt: "Excellent news.", value: 'voicemail_of_the_giants_3-3-2'};
		this.conversation_reply(pc, msg, "Tii believes that come the next great age of imagining, the logic and logistical perfection of the way of Tii will win out. Click “Excellent news” to progress.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'voicemail_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "voicemail_of_the_giants_3-3-2"){
		choices['4']['voicemail_of_the_giants_3-4-2'] = {txt: "Hello?", value: 'voicemail_of_the_giants_3-4-2'};
		this.conversation_reply(pc, msg, "Tii says “Correct”. Tii would like to reassure all loyal Tii-ites that when the time comes, they will be remembered, if not fondly, then certainly fairly. Because as Tii always says, the...", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'voicemail_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "voicemail_of_the_giants_3-4-2"){
		choices['5']['voicemail_of_the_giants_3-5-2'] = {txt: "Dang. I think.", value: 'voicemail_of_the_giants_3-5-2'};
		this.conversation_reply(pc, msg, "... the ... eeeuuuuuuuuurghhhhhhh, ping, ping. Connection lost.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'voicemail_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "voicemail_of_the_giants_3-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"voicemail_of_the_giants_3",
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
		"Donk. Donation received. Status: poor.",
		"Donk. Donation received. Tii says: this is not worth much.",
		"Donk. Donation received. Object value: low.",
		"Donk. Minor donation detected. Minor thanks given by Tii.",
		"Donk. Minor donation to Tii received. Tii reciprocates, minorly.",
	],
	"donated_item_tier2": [
		"Ping. Donation received. Donation status: mediocre.",
		"Ping. Donation received. Tii says: this object is worth a little.",
		"Ping. Donation received. Object value: mediocre to middling.",
		"Ping. Mediocre donation received. Mediocre thanks given by Tii.",
		"Ping. Mediocre donation received. Tii reciprocates, mediocrely.",
	],
	"donated_item_tier3": [
		"Beep-boop! Donation received. Donation status: moderate.",
		"Beep-boop! Donation received. Tii says: This is worth something.",
		"Beep-boop! Donation received. Object value: moderate.",
		"Beep-boop! Moderate donation received. Moderate thanks given by Tii.",
		"Beep-boop! Moderate donation received. Tii reciprocates, moderately.",
	],
	"donated_item_tier4": [
		"Ding-Dong! Donation received. Status: Major.",
		"Ding-Dong! Donation received. Tii says: This is worth a lot. Thanks.",
		"Ding-dong! Major donation received. Object value: high.",
		"Ding-DONG! Major donation received. Major thanks given by Tii.",
		"Ding-DONG! Major donation received. Tii reciprocates, majorly.",
	],
	"super_donation_20x_xp": [
		"PING! PING! Tii's major random reward algorithm has been tripped!",
		"PING! PING! ALERT! Tii is randomly super-pleased!",
		"PING! PING! ALERT! Major Random Reward triggered!",
	],
	"super_donation_5x_xp": [
		"Biddly-boop-boop-BING! Donation extra-reward notification!",
		"Biddly-boop-boop-BING! Tii is randomly pleased.",
		"Biddly-boop-boop-BING! Random reward triggered.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-62,"y":-162,"w":122,"h":162},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALN0lEQVR42rWXWVBb5xXH1SYzTWyk\nqw1tCGMDBswiQIBALJIQSICQ0AJiF2LfDGazDQ6rg41jG4zBeI0DdsALxjaJMSRt2trTPmWmM0n7\n1DxknJm+9M3Tp8705d9zrzzp5CHTIRaa+c+9utK93++e833n\/D8e7xd82r\/6imnd2jK1PHvmat\/e\nntyNOra2knl78Wnb2TG2bW+tVH+6+qr042XoLy0h\/vRFRE6cR+jgaYj6JiE6NgFR5whER0ch7P4A\nwt5xMHSN3zkM8dERRI6dQ9HMLPLvrL6q2Ni407q97XxrsJbt7YjWZ59\/415dRcRJguinQQem6DgF\ncc8YJB3DkLQMQdLYD6m\/D6ENxzhJWdE1sa8HAk8jQlwN2O\/ygd8yCMHwDJjpK7B+uob251uvfhEo\nm0Y2YlX37yHhzAXs7\/kAIa0DELQOQtg8AEnrcQ4itLYbMm8bQh31kDn9UJDk9jooXI2QufwILW+B\nrLoTkso2iGo7wdC9wq4RMMfPgJm6jJiFW6jZ2AA71u4At7c2rcsrEB4fewM3iJCqNvCd9WActZA4\nfQglEFlRJaQGO2QGB2Q5NsiyiyHPtkGeS9dYGcsgK\/BwLyBxN0JE0RQ19nHRFxKkYOQcBINjcK\/c\nwa4A6+8\/ROX6OuTDZwJw9d0QlDdBmO+AMN0IoUYP0ZE0iOK0EMWmQBSTDNFhzU\/FXmN\/o\/+Ik7Ig\nTMmBKK8EYoqssKodAopoiL8X2tkraN9+vjvAxPqe1\/UP1rkbLddv48gATfocK4HRQAkZAbjY1ABE\ndBLEPyP2twBoauAeuleYZsDhpm6YLi6gbuMxN0bdvQe7A9T1jq4d8rRCf+oM6h4+4h7S\/PQpXItL\npCvIOTaII2VViC1xIba47P8qo6UTuQMn4b56A030HPZ5rBqfPIG2+wRND8fuAPW9p4yJ\/n7Ii2ny\n25uhGToNfeNRVK495B7sf7j+4yA\/p5bNTVQsXUfrs2fcd+f5S9w1z61lGE9\/hDh6nlBvg4TgVOaK\n17teybqjp9YOOBqhsPlpRbYhqrYH0rohqLunENZ3FofHLiN6aglRH15D1PhlRI1eQPRYQJGnPkKk\n3Yf4Mh9yxs\/hUMdJqH29CLFUIyTPCX5uGRh9CURZxVAVeKHKc+++1IjSvEx6x\/A3KooiB+lsg7S8\nG9KaAYjrT0DcTAW5dQJMxxSER2ewv3EEIQ0nAvINIaR2APzqPggqe8Ev9YNPIHyTBwKCE2YRnM5K\ncOU4WOqbf6tindzcvxlWRLWtxAe5oxkydwdCvT2QVFMhrh2ExD9MpWMYTHkXBK4OOnZz54yHziny\ngqLaAFgeRS27FEJdMcEVQZ7noig39AWl1SXVdM2rCqqgIMmstZCVNHBpl9gbISZosaMFQlsDhKWN\nAdHLiOg\/DEVNQFASgmMXgpTSKqHoKY2eTaXZExHUfhztaDImVPe\/iqMIHSQIWa6TBiYZ3ZCYKiDO\nr4DE7OUkNrkholRG0Uuktk4iZ2Ae1RfuItZW9w91vtvI26tP4fBNxjd7Z7Pv9lPUX7qHWFc7JBkW\nSDNLSEWQZtGqpPRJSZH0Erqj56HtOIdMOromrmD0\/ud+l326z+2Y2TtIQWLuZP\/sHI5dXoKayoQw\nLos6R0ZAUWmcmIPJkCfkIqN9mgPMHZiDffDD199\/\/z1TVTEz7y6d9u8ZoCzDcqf82Ak0TJ5HSKwO\n\/Oh0CA6lgDmUSmApEL4RPywBaloQ6V3nYRqax4mrd3Fh5prx4vmFSd5efhSZxd\/qqY8eKSX7lJgL\nfpweTHwOhLFZYKJJMZlgDpMiNBASdGbvLNL9J3FrYx2PHq2+OHZqyJ9UW+XcE7h90nCVMqvkP3Kd\nDYIkIxgNGYcUM5jkAjCJRojoKEo2c0fmsI6LbLTVh7yeGXzwyQa+\/HJndHxxxpjm9TJ7FL3CJrm2\nABJtMfg0x1g4YRy5FK0VknRyKnRdnF4MaXopZClWSONyIUvIRyrVzPqLKxCptZo9TW9Yju2hOCmf\nImeCQGOgVdyAOPKI8Z4mxJc345C5AgqCDdPZoc4ohYL+K0\/Mh\/RILgq6xiGNN9TuKaA02fhPUaKB\n0mtAUk0bYslRK6lwK6j2KS01UBVWQ0kdQmX0\/KgY1m3HGxGhp0KtLV7dMzh+nC5GSAtClFoAQYwO\nYTS4ojRgJv6nBk5yti1Se2SlKKTOk2CGTFOI0AzH66BCVcTnOVlxgDE6vyzdAklyPgTRGYiq6kSo\nsxWhZa3U9tq5c7b9cdfsTWTzWzixkOpsL8JyK6HUu2neWlKCBliZaJj0Jhjmh28+YkydoysHDS5I\n4nMJUAdJiR9Zw2dhm78O+8INOJZuwXXtNqpuraDyxjK8Vz9G2aVrCKUoq\/UeyJMK6eikKJb0BTWK\nDTqrf\/zc3JmupTVUTV+HItUCIdU5SVkbimevwffoKbxr62jZ2cHAn\/4I4\/kr5HL6ET84jZL5W5CS\nTQvPqaQFUwi5pgCqXM9mUAEvLd83fjQ5ict3V9By+S6Khi7QPiMbkoqjKJq7jo7n22gl9b74PSof\nPEZ474fIu3iDM7adm1tky\/pwwFANRRrt\/BLNOGCuehU0OOvgePLis2fG5T\/8DhO3rqP3xn3Uz61C\nmmCAqKYf+gs3UfvgCXwbm\/A9\/RzVDx+jcGkF0SOzKFhYRtdnWxCRuVWlOxBuIuObRlvSrDJ2\/\/Gr\nILmXYcY6NOrf\/uvXuLLzBY4vr6NtaR3imCzEDJ2F4vgcoieWED15lez\/G03Sd3IuUWOLiKHfmKZT\nUCRbKIq1lN5KqE2VNI\/zM4MCaDkxbry08dD5xd++Rs+5UYzc3UBeQz+EUeRcOqfAjCxyEpxcADO8\nyElwMiD+4FzgvH0CCo0FqkwP1Gyq9S5IM0qCZ7fmnjyZnH+8homV2xhb20SKw0\/WKguSHuoMpxch\nmVqAZGwOkol5SKcWIR6fD2iUvUbfqYMokq3cQlHpyyGlziJKMNYEDfDmV39hruz8FtPrn+H4J4\/I\nsegIUA9pfjlkVVT7arogr++BvK4HyvpjUNaRKMoq\/yDklZ2QlzZAmVwENQGq86o5QLHGPJnnOONk\nFRTI4ZUH35xafQqtw8e5FEkKuejUYkhYM5BGxiC1iBaAHcr0MoTrK6BKtVEvdiBMWwollReV1oYI\nUwOluJYzEWKNabLAc3bTQO46KICmtuMv2uaXwT+khZAMgCTDDlmWG\/JsandUhMOMdQHRSg030DHd\njgOUzlhbDyJyqhCeWY6IfAI01tAqdkNMDaC9fz54xpVJynshJoMgIKMg0lo4WxWa5YQih910VyOM\nIqM2+TgptXYugmEU0UhjPQ4S8AGCPGimjmKshbd7CHc+\/eT17OxSkHZ1JtO7IbHpfxalWgkwL+D9\n0ggw8w0grUw1RU6d70MYuxDY9LJ1j9IdaW5COEUs0tKKg4XNUFOZsdT3IsvTsMjLyeEHBY5ntlvf\nj037VsAW55QCDjA0k\/a51PhZQKWh+t8qQw2ll9yLtoTmnR1hBMkCHrZ2ILKgmRObYgWlXphk+td7\nqabnvNzCJp7Fono7QLs3jGcurf+1zriwLz77B+ZINoQaM20rHRyghIDEmY7vxBm279i5qKDVqmIX\nRooNSo2V7H4HoqztiKApoMx0YZ\/WssPTF17k5VhO0XO9PIv98NtHscgrpofpePm22vfSTCvva\/Je\nvp9ieLk\/Jf\/l\/tTCl+9mWRd42dbpd3TmRVGi8e+SpIIffqMr+Dgk1XyPyS27GZLjWNyXXbr4G33R\nRZ7B1sErdOfySjxqys57wXetVreMV+hM4hWUaXgO7yGeszr8R9m9B36ismoVr5A2R6y83nd+yXD\/\nBemmQk49UGmLAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "\/c2.glitch.bz\/items\/2010-04\/1271458910-1321.swf",
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

log.info("npc_shrine_uralia_ti.js LOADED");

// generated ok 2012-10-29 11:52:11 by lizg
