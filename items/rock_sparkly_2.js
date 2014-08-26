//#include include/mining.js, include/npc_conversation.js, include/cultivation.js

var label = "Sparkly Rock";
var version = "1347307658";
var name_single = "Sparkly Rock";
var name_plural = "Sparkly Rock";
var article = "a";
var description = "The most desperate-to-be-loved mineral you could ever hope to meet, this minable mini-mountain brings a touch of disco to out-of-the-way places. Full of high-value chunks and crushable minerals, every major miner seeks their own vein of sparkly.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = "rock_sparkly_1";
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["rock_sparkly_2", "rock_sparkly", "mineable_rock"];
var has_instance_props = true;

var classProps = {
	"rock_type"	: "sparkly",	// defined by mineable_rock (overridden by rock_sparkly_2)
	"pc_action_distance"	: "75",	// defined by mineable_rock
	"conversation_offset_y"	: "0",	// defined by rock_sparkly
	"conversation_offset_x"	: "-6"	// defined by rock_sparkly
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.chunks_remaining = "50";	// defined by mineable_rock
	this.instanceProps.cultivation_max_wear = "40";	// defined by mineable_rock
	this.instanceProps.cultivation_wear = "";	// defined by mineable_rock
}

var instancePropsDef = {
	chunks_remaining : ["How many chunks remain in this rock"],
	cultivation_max_wear : ["Max wear"],
	cultivation_wear : ["Current wear"],
};

var instancePropsChoices = {
	chunks_remaining : [""],
	cultivation_max_wear : [""],
	cultivation_wear : [""],
};

var verbs = {};

verbs.remove = { // defined by mineable_rock
	"name"				: "remove",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Pour {$stack_name} on {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return this.proto_class && stack.class_tsid == 'wine_of_the_dead';
	},
	"conditions"			: function(pc, drop_stack){

		if (this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state:null};
		if (this.proto_class && drop_stack && drop_stack.class_tsid == 'wine_of_the_dead') return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var it = pc.getAllContents()[msg.target_itemstack_tsid];
		if (!it) return false;

		msg.target = this;
		return it.verbs['pour'].handler.call(it, pc, msg);
	}
};

verbs.talk_to = { // defined by mineable_rock
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "I have something to tell you!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var convos = pc.conversations_offered_for_class(this.class_tsid);
		if (convos.length) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 1;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var convos = pc.conversations_offered_for_class(this.class_tsid);
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

verbs.regenerate = { // defined by mineable_rock
	"name"				: "regenerate",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Regenerate this rock",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'potion_rocky_regeneration_solution' ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		function has_potion(it){ return it.class_tsid == 'potion_rocky_regeneration_solution' ? true : false; }
		var potion = pc.findFirst(has_potion);
		if (potion) {
			if (this.getInstanceProp('chunks_remaining') >= 50) return {state:'disabled', reason:'This rock is not worn down enough to need regeneration.'}
			
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		function is_potion(it){ return it.class_tsid == 'potion_rocky_regeneration_solution' ? true : false; }
		var potion = pc.findFirst(is_potion);

		if (!potion){
			return false;
		}

		msg.target = this;

		return potion.verbs['pour'].handler.call(potion, pc, msg);
	}
};

verbs.mine = { // defined by mineable_rock
	"name"				: "mine",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Or, drag pick to rock. Costs $energy_cost energy and takes $seconds seconds",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Mine this {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		if (this.getClassProp('rock_type') == 'metal_rock'){
			return stack.class_tsid == 'fancy_pick' && stack.isWorking() ? true : false;
		}
		else{
			return stack.is_pick && stack.isWorking() ? true : false;
		}
	},
	"proximity_override"			: 150,
	"conditions"			: function(pc, drop_stack){

		var required_skill = 'mining_1';
		if (!pc.skills_has(required_skill)){
			return {state:'disabled', reason:"You need to know "+pc.skills_get_name(required_skill)+" to use this."};
		}

		if (this.getClassProp('rock_type') == 'metal_rock'){
			function is_fancy_pick(it){ return it.is_pick && it.isWorking() && it.class_tsid == 'fancy_pick' ? true : false; }
			if (!pc.items_has(is_fancy_pick, 1)){
				return {state: 'disabled', reason: "You'll need a Fancy Pick first."};
			}
		}
		else{
			function is_pick(it){ return it.is_pick && it.isWorking() ? true : false; }
			if (!pc.items_has(is_pick, 1)){
				return {state: 'disabled', reason: "You'll need a pick first."};
			}
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		// this assumes we'll use the best pick we have...
		function is_fancy_pick(it){ return it.class_tsid =='fancy_pick' && it.isWorking() ? true : false; }
		var pick = pc.findFirst(is_fancy_pick);
		if (!pick){
			function is_pick(it){ return it.class_tsid =='pick' && it.isWorking() ? true : false; }
			pick = pc.findFirst(is_pick);
		}

		if (pick.class_tsid == 'fancy_pick'){
			return pc.trySkillPackage('mining_fancypick');
		}else{
			return pc.trySkillPackage('mining');
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var required_skill = 'mining_1';
		if (!pc.skills_has(required_skill)){
			return false;
		}

		if (this.getClassProp('rock_type') == 'metal_rock' && msg.force_pick){
			pc.sendActivity("This humdrum, everyday pick is far too brittle to mine a metal rock!");
			return true;
		}

		if (msg.target_item_class || msg.target_itemstack_tsid){
			return this.startMining(pc, msg);
		}
		else{
			function is_fancy_pick(it){ return it.class_tsid =='fancy_pick' && it.isWorking() ? true : false; }
			var pick = pc.findFirst(is_fancy_pick);
			if (!pick || msg.force_pick){
				function is_pick(it){ return it.class_tsid =='pick' && it.isWorking() ? true : false; }
				pick = pc.findFirst(is_pick);
				if (!pick){
					return false;
				}
			}

			return this.startMining(pc, pick.class_tsid);
		}
	}
};

function make_config(){ // defined by mineable_rock
	var ret = {};
	ret = this.buildConfig(ret);
	return ret;
}

function onCreate(){ // defined by mineable_rock
	this.initInstanceProps();
	this.state = 1;

	this.apiSetPlayersCollisions(true);
	this.apiSetHitBox(400, 400);
}

function onLoad(){ // defined by mineable_rock
	if (!this.hitBox){
		this.apiSetPlayersCollisions(true);
		this.apiSetHitBox(400, 400);
	}

	if (this.label != this.name_single) this.label = this.name_single;
}

function onPlayerCollision(pc){ // defined by mineable_rock
	if (!this.isUseable()) return;

	if (this.conversations){
		for (var i=0; i<this.conversations.length; i++){
			if (pc.conversations_offer(this, this.conversations[i])){
				return pc.conversations_offer_bubble(this);
			}
		}
	}
}

function onPlayerExit(pc){ // defined by mineable_rock
	if(!this.helpers) {
		return;
	}

	if(this.helpers[pc.tsid]) {
		this.removeMiner(pc);
	}

	if(pc['!mining']) {
		delete pc['!mining'];
	}
}

function onPrototypeChanged(){ // defined by mineable_rock
	this.onLoad();
}

function conversation_canoffer_the_first_rock_3(pc){ // defined by conversation auto-builder for "the_first_rock_3"
	var chain = {
		id: "the_first_rock",
		level: 3,
		max_level: 4
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "the_first_rock_2")){
		return true;
	}
	return false;
}

function conversation_run_the_first_rock_3(pc, msg, replay){ // defined by conversation auto-builder for "the_first_rock_3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "the_first_rock_3";
	var conversation_title = "The First Rock";
	var chain = {
		id: "the_first_rock",
		level: 3,
		max_level: 4
	};
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	if (!msg.choice){
		choices['0']['the_first_rock_3-0-2'] = {txt: "Fact?", value: 'the_first_rock_3-0-2'};
		this.conversation_start(pc, "Here’s a tidbit for you, princess: Sparklies were the very very first rock there ever was. Fact.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_first_rock_3', msg.choice);
	}

	if (msg.choice == "the_first_rock_3-0-2"){
		choices['1']['the_first_rock_3-1-2'] = {txt: "Seriously?", value: 'the_first_rock_3-1-2'};
		this.conversation_reply(pc, msg, "Fact. Heard that from the mouth of a particularly senior Zillot Fabulist, we did. They always said that when Patufet was trying to win the hand of Petronella, her father sent him to pluck stars from the sky. When he came back and presented her pa with a bag full of stars, he was given the hand of Petronella, and the stars used to stuff the mattress of their marital bed.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_first_rock_3', msg.choice);
	}

	if (msg.choice == "the_first_rock_3-1-2"){
		choices['2']['the_first_rock_3-2-2'] = {txt: "It’s funny, because I heard…", value: 'the_first_rock_3-2-2'};
		this.conversation_reply(pc, msg, "Would I lie to you? So the compacted matter that resulted, when the mattress was shaken out, rolled down into the caverns and settled. Making Sparkly rocks the very first, most important rock.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_first_rock_3', msg.choice);
	}

	if (msg.choice == "the_first_rock_3-2-2"){
		choices['3']['the_first_rock_3-3-2'] = {txt: "I just might.", value: 'the_first_rock_3-3-2'};
		this.conversation_reply(pc, msg, "You heard wrong, treacle. Now, you are dismissed: Take a little sliver of silvery history, if you’ve got that fancy pick of yours handy.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_first_rock_3', msg.choice);
	}

	if (msg.choice == "the_first_rock_3-3-2"){
		choices['4']['the_first_rock_3-4-2'] = {txt: "Yikes.", value: 'the_first_rock_3-4-2'};
		this.conversation_reply(pc, msg, "Do. You can’t tell, but I’m totally winking at you right now.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_first_rock_3', msg.choice);
	}

	if (msg.choice == "the_first_rock_3-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_genesis_of_a_rock_1(pc){ // defined by conversation auto-builder for "genesis_of_a_rock_1"
	var chain = {
		id: "genesis_of_a_rock",
		level: 1,
		max_level: 4
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

	if ((pc.conversations_has_completed(null, "the_chronicles_of_peat")) && (pc.conversations_has_completed(null, "the_first_rock_4"))){
		return true;
	}
	return false;
}

function conversation_run_genesis_of_a_rock_1(pc, msg, replay){ // defined by conversation auto-builder for "genesis_of_a_rock_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "genesis_of_a_rock_1";
	var conversation_title = "The Genesis of a Rock";
	var chain = {
		id: "genesis_of_a_rock",
		level: 1,
		max_level: 4
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
		choices['0']['genesis_of_a_rock_1-0-2'] = {txt: "Close enough?", value: 'genesis_of_a_rock_1-0-2'};
		this.conversation_start(pc, "Come closer, come closer.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_1', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_1-0-2"){
		choices['1']['genesis_of_a_rock_1-1-2'] = {txt: "Thanks?", value: 'genesis_of_a_rock_1-1-2'};
		this.conversation_reply(pc, msg, "There’s no such thing. You smell like flowers!!!", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_1', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_1-1-2"){
		choices['2']['genesis_of_a_rock_1-2-2'] = {txt: "A rock.", value: 'genesis_of_a_rock_1-2-2'};
		this.conversation_reply(pc, msg, "Not a problem, hotstuff. Now. Look at me, look closely. Gaze deeply into the compacted complex depths of my mineral beauty. What do you see?", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_1', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_1-2-2"){
		choices['3']['genesis_of_a_rock_1-3-2'] = {txt: "A slightly sparkly rock?", value: 'genesis_of_a_rock_1-3-2'};
		this.conversation_reply(pc, msg, "Oh. That’s all?", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_1', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_1-3-2"){
		choices['4']['genesis_of_a_rock_1-4-2'] = {txt: "Um…", value: 'genesis_of_a_rock_1-4-2'};
		this.conversation_reply(pc, msg, "Oh. You big tease. What you MEANT to say, if you weren’t so busy playing hard to get, was that you can see the heart of a million stars, boiled down into a perfect sparkling mass. THAT was what you meant to say.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_1', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_1-4-2"){
		choices['5']['genesis_of_a_rock_1-5-2'] = {txt: "If you say so…", value: 'genesis_of_a_rock_1-5-2'};
		this.conversation_reply(pc, msg, "Oh YOU! Stop flirting with me!  Honestly! You’re incorrigible!", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_1', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_1-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_genesis_of_a_rock_3(pc){ // defined by conversation auto-builder for "genesis_of_a_rock_3"
	var chain = {
		id: "genesis_of_a_rock",
		level: 3,
		max_level: 4
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "genesis_of_a_rock_2")){
		return true;
	}
	return false;
}

function conversation_run_genesis_of_a_rock_3(pc, msg, replay){ // defined by conversation auto-builder for "genesis_of_a_rock_3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "genesis_of_a_rock_3";
	var conversation_title = "The Genesis of a Rock";
	var chain = {
		id: "genesis_of_a_rock",
		level: 3,
		max_level: 4
	};
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	if (!msg.choice){
		choices['0']['genesis_of_a_rock_3-0-2'] = {txt: "Actually, I just happened to be passing…", value: 'genesis_of_a_rock_3-0-2'};
		this.conversation_start(pc, "I knew you’d be back. You can’t keep away. It’s my irresistible star-power sucking you in…", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_3', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_3-0-2"){
		choices['1']['genesis_of_a_rock_3-1-2'] = {txt: "Something about stars? And Zille?", value: 'genesis_of_a_rock_3-1-2'};
		this.conversation_reply(pc, msg, "OOOH you TEASE, you. Now, where was I?…", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_3', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_3-1-2"){
		choices['2']['genesis_of_a_rock_3-2-2'] = {txt: "Anyway…", value: 'genesis_of_a_rock_3-2-2'};
		this.conversation_reply(pc, msg, "And you pretend you’re not hanging on to every word, you little maniac!", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_3', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_3-2-2"){
		choices['3']['genesis_of_a_rock_3-3-2'] = {txt: "And that would be you?", value: 'genesis_of_a_rock_3-3-2'};
		this.conversation_reply(pc, msg, "Well, Zille didn’t just steal the stars. Zille didn’t need to. Friendly, enraptured by her beauty, imagined the stars to rain down in clusters upon her, while he clung hard to the moons above, shouting protestations of love, and telling her to do with them as she wished, and create for herself the most beautiful rocks she could imagine.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_3', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_3-3-2"){
		choices['4']['genesis_of_a_rock_3-4-2'] = {txt: "I… Oh, whatever.", value: 'genesis_of_a_rock_3-4-2'};
		this.conversation_reply(pc, msg, "Well GOODNESS, you’re not backwards in coming forward, are you? Why yes that WOULD be me, thanks for noticing. You little flatterer, you.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_3', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_3-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_tales_of_the_sparkly_1(pc){ // defined by conversation auto-builder for "tales_of_the_sparkly_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

	if ((pc.stats.level >= 5) && (pc.getQuestStatus("donate_to_all_shrines") == 'done')){
		return true;
	}
	return false;
}

function conversation_run_tales_of_the_sparkly_1(pc, msg, replay){ // defined by conversation auto-builder for "tales_of_the_sparkly_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "tales_of_the_sparkly_1";
	var conversation_title = "Tales of the Sparkly";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	choices['6'] = {};
	choices['7'] = {};
	if (!msg.choice){
		choices['0']['tales_of_the_sparkly_1-0-2'] = {txt: "Yes.", value: 'tales_of_the_sparkly_1-0-2'};
		this.conversation_start(pc, "Ooooooh, it’s YOU!", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'tales_of_the_sparkly_1', msg.choice);
	}

	if (msg.choice == "tales_of_the_sparkly_1-0-2"){
		choices['1']['tales_of_the_sparkly_1-1-2'] = {txt: "Pri…?", value: 'tales_of_the_sparkly_1-1-2'};
		this.conversation_reply(pc, msg, "I was just thinking about you, princess.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'tales_of_the_sparkly_1', msg.choice);
	}

	if (msg.choice == "tales_of_the_sparkly_1-1-2"){
		choices['2']['tales_of_the_sparkly_1-2-2'] = {txt: "Right?…", value: 'tales_of_the_sparkly_1-2-2'};
		this.conversation_reply(pc, msg, "Well, not about you specifically. More about Glitches in general.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'tales_of_the_sparkly_1', msg.choice);
	}

	if (msg.choice == "tales_of_the_sparkly_1-2-2"){
		choices['3']['tales_of_the_sparkly_1-3-2'] = {txt: "Really?!?", value: 'tales_of_the_sparkly_1-3-2'};
		this.conversation_reply(pc, msg, "You know, this might be the first age, but you were not the first two-legged blips to pop from the combined minds of the giants.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'tales_of_the_sparkly_1', msg.choice);
	}

	if (msg.choice == "tales_of_the_sparkly_1-3-2"){
		choices['4']['tales_of_the_sparkly_1-4-2'] = {txt: "But…", value: 'tales_of_the_sparkly_1-4-2'};
		this.conversation_reply(pc, msg, "Oh, you should have seen the others though. Dark clouds over their heads, some of them, wouldn’t smile for love nor tickling, swords in hand, beards full of grizzle. Bleh! Filthy, they were!", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'tales_of_the_sparkly_1', msg.choice);
	}

	if (msg.choice == "tales_of_the_sparkly_1-4-2"){
		choices['5']['tales_of_the_sparkly_1-5-2'] = {txt: "What’s that?", value: 'tales_of_the_sparkly_1-5-2'};
		this.conversation_reply(pc, msg, "Oh, they didn’t last. There were more, too. Shouty ones, twitchy fingered short ones, they weren’t around for long, I’ll tell you that. I’ll tell you this, too…", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'tales_of_the_sparkly_1', msg.choice);
	}

	if (msg.choice == "tales_of_the_sparkly_1-5-2"){
		choices['6']['tales_of_the_sparkly_1-6-2'] = {txt: "Of course.", value: 'tales_of_the_sparkly_1-6-2'};
		this.conversation_reply(pc, msg, "You’re FAR more my type, handsome.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'tales_of_the_sparkly_1', msg.choice);
	}

	if (msg.choice == "tales_of_the_sparkly_1-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_tales_of_the_sparkly_2(pc){ // defined by conversation auto-builder for "tales_of_the_sparkly_2"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "tales_of_the_sparkly_1")){
		return true;
	}
	return false;
}

function conversation_run_tales_of_the_sparkly_2(pc, msg, replay){ // defined by conversation auto-builder for "tales_of_the_sparkly_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "tales_of_the_sparkly_2";
	var conversation_title = "Tales of the Sparkly";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	choices['6'] = {};
	choices['7'] = {};
	if (!msg.choice){
		choices['0']['tales_of_the_sparkly_2-0-2'] = {txt: "I was just walking past, actually.", value: 'tales_of_the_sparkly_2-0-2'};
		this.conversation_start(pc, "Oh! It’s you! I knew you couldn’t keep yourself away.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'tales_of_the_sparkly_2', msg.choice);
	}

	if (msg.choice == "tales_of_the_sparkly_2-0-2"){
		choices['1']['tales_of_the_sparkly_2-1-2'] = {txt: "Because it’s true?…", value: 'tales_of_the_sparkly_2-1-2'};
		this.conversation_reply(pc, msg, "Tsh!!! They all say that. ", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'tales_of_the_sparkly_2', msg.choice);
	}

	if (msg.choice == "tales_of_the_sparkly_2-1-2"){
		choices['2']['tales_of_the_sparkly_2-2-2'] = {txt: "*Sigh*.", value: 'tales_of_the_sparkly_2-2-2'};
		this.conversation_reply(pc, msg, "You reckon?! No! The stardust in your tiny organs is magnetically drawn to my sparkly oriness. I won’t hear any different.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'tales_of_the_sparkly_2', msg.choice);
	}

	if (msg.choice == "tales_of_the_sparkly_2-2-2"){
		choices['3']['tales_of_the_sparkly_2-3-2'] = {txt: "Riiight. Can you go back a bit?", value: 'tales_of_the_sparkly_2-3-2'};
		this.conversation_reply(pc, msg, "Whatever, treacle. Point is, you and I? Running into each other? Clearly meant to be. It is a conflagration just like the coming together of the eleven random giants in this mighty age of giants. And just like this one, singular era of giants, our love shall be giant, like a…", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'tales_of_the_sparkly_2', msg.choice);
	}

	if (msg.choice == "tales_of_the_sparkly_2-3-2"){
		choices['4']['tales_of_the_sparkly_2-4-2'] = {txt: "The bit about the single age of the giants?", value: 'tales_of_the_sparkly_2-4-2'};
		this.conversation_reply(pc, msg, "Hmn? Ah. Yes, my chewy little pickle, for you anything. The stardust in your tiny organs…", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'tales_of_the_sparkly_2', msg.choice);
	}

	if (msg.choice == "tales_of_the_sparkly_2-4-2"){
		choices['5']['tales_of_the_sparkly_2-5-2'] = {txt: "No?", value: 'tales_of_the_sparkly_2-5-2'};
		this.conversation_reply(pc, msg, "Oh. Well, there are eleven giants, who all came into being at once, shortly after this world did. They exist to keep the thing in balance… but the giants didn’t create the world.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'tales_of_the_sparkly_2', msg.choice);
	}

	if (msg.choice == "tales_of_the_sparkly_2-5-2"){
		choices['6']['tales_of_the_sparkly_2-6-2'] = {txt: "Of course.", value: 'tales_of_the_sparkly_2-6-2'};
		this.conversation_reply(pc, msg, "No, Flossy! The world created the giants, of course!…", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'tales_of_the_sparkly_2', msg.choice);
	}

	if (msg.choice == "tales_of_the_sparkly_2-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"the_first_rock_3",
	"genesis_of_a_rock_1",
	"genesis_of_a_rock_3",
	"tales_of_the_sparkly_1",
	"tales_of_the_sparkly_2",
];

function getDescExtras(pc){
	var out = [];
	out.push([2, "Mining this yields <a href=\"\/items\/423\/\" glitch=\"item|sparkly\">Chunks of Sparkly<\/a>."]);
	out.push([2, "Mining this requires a <a href=\"\/items\/424\/\" glitch=\"item|pick\">Pick<\/a> or a <a href=\"\/items\/425\/\" glitch=\"item|fancy_pick\">Fancy Pick<\/a>."]);
	return out;
}

var tags = [
	"mineable",
	"no_trade",
	"mining"
];

var responses = {
	"gem_drop_amber": [
		"Here - small, garish, and has a dead bug in, yet still oddly pleasing.",
		"What do you mean ONLY amber?! It's still a gem, chum",
	],
	"gem_drop_diamond": [
		"Woah! Best friend this bulky are many carats. Also: many currants.",
		"OH! The glory of super-compressed coal!",
	],
	"gem_drop_moonstone": [
		"Oh my! It is like you've pulled a moon from the sky. So... glowy!",
		"Take! Display it, love it... Or sell it… whatever, I'm easy",
	],
	"gem_drop_ruby": [
		"Ah! A rich, blood-hued, passionate stone. If on the small side.",
		"Better than pearl? Maybe. Worth its weight in currants? Yes.",
	],
	"gem_drop_sapphire": [
		"Want this? A little blingy for my taste, but if you like showing off...",
		"Feel blue? Well, I'm not feeling it at all, so you take it",
	],
	"metal_rock_disappeared": [
		"The spirit of metal be with you, man. ROCK ON.",
		"Goodnight Cleveland!",
		"Fade to Black, man. Fade to black.",
		"Long live METAL!",
		"MELTDOWN!",
	],
	"mine_beryl": [
		"Hey! To the left a little next time.",
		"Ughh, you're so frikkin' picky.",
		"I wasn't cut out for this.",
		"Not in the face! Oh. Wait. No face.",
		"If you need any tips on technique, just axe.",
		"Pick on someone else, will you?",
		"You're on rocky ground, Glitch.",
		"I feel like you're taking me for granite.",
		"Well, at least that's a weight off me mined.",
		"You sure have one big axe to grind.",
	],
	"mine_dullite": [
		"Ooof. I feel lighter already.",
		"Mmm, thanks, I've been itching there all day.",
		"Ow. Ow-hangover. Ow-my-head. Ow.",
		"Not bad. Work on your backswing.",
		"You're really picking this up.",
		"Nothing wrong with a sedimentary lifestyle, chum.",
		"I should have been a wrestler. I'm rock-hard! Hee!",
		"Ah. You've taken a lode of my mind.",
		"You sure have an apatite for this.",
		"Woah. I'm tuff. But you're tuffer.",
	],
	"mine_max_beryl": [
		"I'm way too gneiss to you.",
		"*sigh* You're just going to pick up and leave me anyway.",
		"Stone me, you're persistent.",
		"Well, you just keep on rocking, doncha?",
		"Fine, get your rocks off. Then leave me in peace.",
	],
	"mine_max_dullite": [
		"Igneous is bliss. Ta-da!",
		"May I just say: you're rocking this.",
		"Well THAT's taken a weight off my mind.",
		"Stand back: admire my chiseled good looks.",
		"Hey! Pick like that, I'll be nothin' but gravel soon!",
	],
	"mine_max_metal_rock": [
		"Gotta whole lotta METAL!",
		"That pick goes all the way up to eleven, man.",
		"Nice work! Countdown to pick-axtinction! YEAH!",
		"You’re Zincing BIG! WOO!",
		"How much more metal could this be? None. None more metal.",
	],
	"mine_max_sparkly": [
		"Super chunks of sparkly joy! WHEEE!",
		"Are you trying to pick me up?",
		"Pretty sparkles! Oh yes: I'm no common ore.",
		"When I see you, sparkles fly!",
		"Sure, I'm no gem, but there's more of me to love!",
	],
	"mine_metal_rock": [
		"Slave to the GRIND, kid! ROCK ON!",
		"I’d feel worse if I wasn’t under such heavy sedation.",
		"Sweet! Air pickaxe solo! C'MON!",
		"Yeah. Appetite for destruction, man. I feel ya.",
		"LET THERE BE ROCK!",
		"Those who seek true metal, we salute you!",
		"YEAH, man! You SHOOK me!",
		"All hail the mighty metal power of the axe!",
		"Metal, man! METAL!",
		"Wield that axe like a metal-lover, man!",
	],
	"mine_sparkly": [
		"Here! What's mined is yours!",
		"Pick me! Pick me!",
		"I sparkle! You sparkle! Sparkles!",
		"Oooh, you're cute. You into carbon-dating?",
		"Oh yeah! Who's your magma?!?",
		"Yay! You picked me!",
		"Hey, cutestuff! You make me sliver.",
		"You crack me up, Glitchy!",
		"Yay! Everything should sparkle! Except maybe vampires.",
		"Together, we'll make the world sparkly, Glitchy",
	],
	"rock_disappeared": [
		"Oof, where'd I go?",
		"brb",
		"kbye",
		"A la peanut butter sammiches",
		"Alakazam!",
		"*poof*",
		"I'm all mined out!",
		"Gone to the rock quarry in the sky",
		"Yes. You hit rock bottom",
		"All rocked out for now",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-81,"y":-151,"w":162,"h":151},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH90lEQVR42uWZe2xbZxnGVwrb2Og6\n0IboWhi7sA0x2IbEChWi1UBjmxBFojDo\/kCjm\/iDTUOAAK3rJAS7kAkG7XrLpUmbNtc2zv3mJHbi\n2LGT2E4cO3Z8j+92fIvt3JM9vO+X43QITXQkXSqw9OgcH8f5fud5L997kuuu+397AdhKuo20i3QH\n6ZZrCW4LaSfpIU808wM6Pkp64JqBlJx7hCQzT0aivkji13S+j3Qf6SPXAuDdpO9YQymr0R2G1ur1\n0\/sfS05+YrPhric96IykX7EEk7AGExhxhzARiJbR9cdIt2824MdJDw+6Y0qzPwnPVAb20BSGHL44\nXf8u6TObDXhDNDO7R+eK5myhFCYTOYy6g1CZXdDZvAX0+ac3PQcV46E\/a50xOKLT8CVnoXcG0D\/u\nRb3GFCLAmzcVLjUzv98USKf95Bw76EvNQW2dRLPOgpZhGwpb1A9vKuD84rLCG89iyDMFvTcOd2Ie\nrUNWNGrHUd6jx4nm\/rc3Dc6fxd5QDmDFZoHs4urxknoMRW0anO3Wo7hD59kUOLkrud3gS6ac8XlM\nEVQgC2QWIM5PNvejun8Mxe1aoTqd7UeUizd+qICdpvBeuSWIHmsIel8a7uSCcI\/dZKjTrRqc6dSh\nzeDAkDsGqvIhoz95kEC3fyiAxkDmZ06ya4jyzh6ZhsYVw6AnjmFfSgBW9o1AbrTDFk4jmMohOj0L\ntT2CQbvvWe6dVx3Ql0EpuxWdWcFEbAZjwRRM1KgZ+KLGgpo+I6jCEUjOYHnlXUzPLhBcAJpx93EC\nvOuqAwYyy57IzGrucWg596zRHByxDDSOMHxTKaQJisEY1BNNYsDq4X26kgC\/eLV2jZt4hApn8SWG\nYyiG43N2M5hZxniI8nGKqOkVprD6kzlyMQeLL4phRwBdhgkTDxcbDXazNIjyjLcnswRZen4VkFqN\ngGMnFRY\/9cIphNKzWFxeETtLIDWDUW8EaosHvWY3ZGrmw7aNhPs66Re5Rfw2lJr9DS1en55bFs7F\nSUGpB+o8SZSrxtFnCwrncgtLcFK4uUh6Ca6TCqZdP4ELCj2Ob+TuQnAHcvNLAiYxswQ3Lco7R3B6\nAfE5wEk7h2zYhbO9FiFzIIkAOZjIzQvAUX8CDVozaql5l8oHRY881aR6acNyTueMHTOHMiAHQUyI\nZubhp7ZBbsJFudZh8uKizi7cK1Wa6VoGseycALRQPhomEzhHWx73RRa3oBNNKtlGAd4iNwcGOY9S\nlHOzBEkmUlUuwEfDgY+SX++JCcBLQ04B6SZ3I5k5TGXnRXj1k3EByNseu8eAfDwtH96+EYDbVPYw\nJpNzwr3p+XfB+TeVXaAw50QIJ6gQmgxuAcfiqTpJN8CVbCT3BlxRatqjOEPhPa8wimMFvT\/Vot6\/\nbsBqreuH3Hw98RnYw9NwRjOiMg2uoDh3xqaFk11mHy70W0WIR8ixhaVl2CJp6NxTGKaqZvdYDJff\no2sHLKXrBizrm3ibR3gWjfQi4Ud9CcgNNijH3AQxTe+T0JJLDMdh9ieyWFpZgVaC09H3atSWtf2Z\nXWTYUvlQat2ALSOTCgUNA8M063XTYMAzHy\/KVVlH\/WzAGYWGxNdqtHbh4gQNrXOLy+JntbQ\/8+dV\n\/eY1wHyh8PFcj2HvugCLlTZFg9ELuSUg1G7yU1XGUUU5VEzzHudb30SY8iyGLvqcAbXOiNg9GLCb\nbo6PtQPWtdzLFwlr3cPs6Z5xT43OhSbjJFpNPnSMBVCn96KsxyAWkFFI2SGlLSSm6bohF3poN+EH\nJxVPLhTeTnNAVLkYvwgyL\/7+X2s61zfMnuweR+WAE23kXN2wR2xjHPJzSpNYoJ4Ae8ZDUNK1LkoB\nlomeNpW2sAgvu6t2RCCjm2Ln8oXCx6K2ARwprCXV\/Hdhfqd7\/M56+sWneqyo0jpRqqJmrHag0TCJ\nMsWoAGzSO9FBDnG\/45toGvFRa4kLcSqYqKj4evOIdy2secCCijYBePhk9T9ouY9+ELYtpOvfuNT7\nNAOeIBfPa5zCQV6sk8NM8x4vVjlgR+uoXzjHBcPhbx\/z034cppTwi9A36N0obLucd3+r7cKrRRcl\n92rxq4JCbjefu1LIj5FuIu062qiRceUyIDvHkEVKG87TObUIsdgFCj\/\/TJXIUx+qB92r0rnFtXIq\nmvzuwe2Fcm4NjPX7Y+U2WuvLpAdI95C2\/yc4\/kPP50lfO9tnzTBYHpDVYPCiUEmLtmhwVKZABQFW\nal3knEfcwGU5UNI9cnlbk\/rfn8oa1uB+d\/Ssfec99z9Ga32V9CDpC1fi3g4G\/Nb+g08V1KkN1eRC\nca9NQPJ566iPtrNVV14714gKFTXgnjFUaWwoUZiFiuRGnGrV\/su+y3qrqmMN7uWTldmv7Nl3gNba\nLQHeSdompdf7vvjvePxo+EnJ8t1Pv3Tkhdcr2lX8AF7SOYx6nRU1qlEcq1eKhdjFPMD76XhjH14v\nb36vc45vPnngWfr93yDxXHi7lFZXXCj5PPyUFO5Hdz\/+vQN\/+HtJ6Tv1yizD\/fGMbG1BPi+obPs3\nvTecebCfvPjyazvuuvdxTiHSQxLcjZI5H\/i1Vfoy5+Ud7Oq+7x985vlX3yp+\/khBCeu5V\/5y5tDh\nN0sPHX6j7LL4\/ZulT\/z05y8+efDQC08989wvd95937clqEdI\/MB0m2TElo18NNkqwd4qLbCL9Fkp\nf1j3Sqlxv9Q2+LOdUl7vkM63\/s\/81+Cfadh8jybMCdMAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "\/c2.glitch.bz\/items\/2012-08\/rock_sparkly_2-1345764211.swf",
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
	"mineable",
	"no_trade",
	"mining"
];
itemDef.keys_in_location = {
	"n"	: "mine",
	"e"	: "regenerate",
	"o"	: "remove",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("rock_sparkly_2.js LOADED");

// generated ok 2012-09-10 13:07:38 by martlume
