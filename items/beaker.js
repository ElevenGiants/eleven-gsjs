//#include include/takeable.js

var label = "Beaker";
var version = "1355086256";
var name_single = "Beaker";
var name_plural = "Beakers";
var article = "a";
var description = "A state-of-the-art beaker, integral for converting compounds into powders. Now available in exciting Pyrex, specifically designed for today's modern clumsy alchemist.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 400;
var input_for = [];
var parent_classes = ["beaker", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "intermediateadmixing_1",	// defined by tool_base (overridden by beaker)
	"points_capacity"	: "0",	// defined by tool_base
	"display_wear"	: "0",	// defined by tool_base
	"can_repair"	: "1"	// defined by tool_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "0";	// defined by tool_base
	this.instanceProps.is_broken = "0";	// defined by tool_base
}

var instancePropsDef = {
	points_remaining : ["Number of hit points remaining"],
	is_broken : ["Is this broken?"],
};

var instancePropsChoices = {
	points_remaining : [""],
	is_broken : [""],
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

verbs.give = { // defined by takeable
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
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
	"sort_on"			: 53,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.repair = { // defined by tool_base
	"name"				: "repair",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "The full repair takes $total_energy energy and $time seconds",
	"is_drop_target"		: true,
	"drop_many"			: true,
	"drop_tip"			: "Repair with your Tinkertool",
	"drop_ok_code"			: function(stack, pc){

		if (this.tsid == stack.tsid) return false;
		if (this.class_tsid == 'tinkertool'){
			if (stack.getClassProp('can_repair') == "0") return false;
			if (stack.isWorking && !stack.isWorking()) return true;
			if (stack.getClassProp('display_wear') == 1 && stack.getInstanceProp('points_remaining') < stack.getClassProp('points_capacity')) return true;
		}
		else if (stack.class_tsid == 'tinkertool'){
			if (this.getClassProp('can_repair') == "0") return false;
			if (this.isWorking && !this.isWorking()) return true;
			if (this.getClassProp('display_wear') == 1 && this.getInstanceProp('points_remaining') < this.getClassProp('points_capacity')) return true;
		}

		return false;
	},
	"conditions"			: function(pc, drop_stack){

		if (this.getClassProp('can_repair') == "0") return {state:null};

		var needs_repair = false;

		if (this.class_tsid == 'tinkertool' && drop_stack){
			if (drop_stack.getClassProp('can_repair') == "0") return {state:null};
			if(drop_stack.class_tsid == 'butterfly_lotion' || drop_stack.class_tsid == 'random_kindness') {
				return {state:null};
			}

			if (drop_stack.getInstanceProp('is_broken') == 1){
				needs_repair = true;
			}
			else if (drop_stack.getInstanceProp('points_remaining') < drop_stack.getClassProp('points_capacity') && drop_stack.getClassProp('display_wear') == 1){
				needs_repair = true;
			}
		}
		else{
			if (this.getInstanceProp('is_broken') == 1){
				needs_repair = true;
			}
			else if (this.getInstanceProp('points_remaining') < this.getClassProp('points_capacity') && this.getClassProp('display_wear') == 1){
				needs_repair = true;
			}
		}

		//if (!needs_repair && this.class_tsid != 'tinkertool') return {state:null};
		if (!needs_repair) return {state:null};

		if ((this.class_tsid != 'tinkertool' || drop_stack) && needs_repair){
			// Find a tinkertool
			function is_tinkertool(it){ return it.class_tsid == 'tinkertool' && it.isWorking() ? true : false; }
			var tinkertool = pc.findFirst(is_tinkertool);

			if (!tinkertool){
				return {state:'disabled', reason: "You need a Tinkertool to repair this."};
			}

			if (!pc.skills_has('tinkering_1')) return {state:'disabled', reason: "You need to know "+pc.skills_get_name('tinkering_1')+" to repair this."};
		}
		else{
			if (needs_repair){
				if (!pc.skills_has('tinkering_3')) return {state:'disabled', reason: "You need to know "+pc.skills_get_name('tinkering_3')+" to repair this."};
			}
			else{
				if (!pc.skills_has('tinkering_1')) return {state:'disabled', reason: "You need to know "+pc.skills_get_name('tinkering_1')+" to use this."};
			}
		}

		//var details = pc.getSkillPackageDetails('tinkering');

		var min_energy = this.getEnergyPerTwoTicksRepair(pc) + 1; // The cost of repairing is 2 ticks minimum

		if (pc.metabolics_get_energy() <= min_energy) return {state:'disabled', reason: "You don't have enough energy to repair this."};

		if (pc.making_is_making()) return {state:'disabled', reason: "You are too busy making something."};

		if (pc['!in_house_deco_mode']){
			return {state:'disabled', reason:"No repairing while decorating."};
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var ret = pc.trySkillPackage('tinkering');
		var details = pc.getSkillPackageDetails('tinkering');
		var duration = Math.ceil((this.getClassProp('points_capacity')-this.getInstanceProp('points_remaining')) / details.tool_wear);

		ret.time = duration;
		duration = Math.max(duration, 2);

		//pc.sendActivity('Duration '+duration);

		// this comes from tinkertool.onTick(), which removes energy every other tick
		ret.min = this.getEnergyPerTwoTicksRepair(pc);
		ret.energy_cost_per = ret.min / 2;


		// Total energy cost is always rounded up to an even number of ticks.
		if ((duration % 2) != 0) {
			duration += 1;
		}

		ret.total_energy = duration * ret.energy_cost_per;

		return ret;
	},
	"handler"			: function(pc, msg, suppress_activity){

		// If this is the tinkertool, we accept items dropped on us, unless we are broken, and then we do the normal thing
		if (this.class_tsid == 'tinkertool' && (!this.needsRepair() || (msg.target_itemstack_tsid && this.isWorking()))){

			if (msg.target_itemstack_tsid){
				var stack = pc.removeItemStackTsid(msg.target_itemstack_tsid);
				if (!stack) return false;

				this.startRepair(stack);
				return true;
			}
			else{
				// We don't have a way to do this yet, so just growl it
				pc.sendActivity('Choose Repair from the item you want to repair, or drag it onto the Tinkertool!');
				return false;
			}
		}
		else{
			// Find a tinkertool
			if (msg.target_itemstack_tsid){
				var tinkertool = pc.removeItemStackTsid(msg.target_itemstack_tsid);
				if (tinkertool.class_tsid != 'tinkertool' || !tinkertool.isWorking()) return false;
			}
			else{
				function is_tinkertool(it){ return it.class_tsid == 'tinkertool' && it.isWorking() ? true : false; }
				var tinkertool = pc.findFirst(is_tinkertool);
			}

			if (!tinkertool && this.class_tsid != 'tinkertool'){
				return false;
			}
			else if (this.class_tsid == 'tinkertool'){
				var tinkertool = this;
			}

			tinkertool.startRepair(this);
		}

		return true;
	}
};

verbs.stir = { // defined by beaker
	"name"				: "stir",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Make powders. You know how to make $recipes_known powders",
	"is_drop_target"		: false,
	"making"			: {
		slots		: 4,
		try_wait	: 5,
		recipes		: [162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 235],
		skills		: ["intermediateadmixing_1"],
		can_discover	: false,
		specify_quantities	: false,
	},
	"conditions"			: function(pc){

		return pc.making_check_allowed(this, "stir");
	},
	"effects"			: function(pc){

		return pc.making_get_effects(this, "stir");
	},
	"handler"			: function(pc, msg, suppress_activity){

		return pc.making_open_interface(this, "stir");
	}
};

function onMakingComplete(pc, recipe_id, count){ // defined by beaker
	var upgrade_id = '';
	var chance_of_bonus = 0;
	var bonus_base_cost_percentage = 0;

	if (pc.imagination_has_upgrade('intermediate_admixing_imagination_2')){
		chance_of_bonus = 0.10;
		bonus_base_cost_percentage = 0.10;
		upgrade_id = 'intermediate_admixing_imagination_2';
	}else if (pc.imagination_has_upgrade('intermediate_admixing_imagination_1')){
		chance_of_bonus = 0.08;
		bonus_base_cost_percentage = 0.06;
		upgrade_id = 'intermediate_admixing_imagination_1';
	}

	if (upgrade_id != ''){
		return this.rollCraftingBonusImagination(	pc, 
										recipe_id, 
										count, 
										upgrade_id, 
										chance_of_bonus, 
										bonus_base_cost_percentage);
	}
}

function doBreak(){ // defined by tool_base
	this.setInstanceProp('is_broken', 1);
	this.updateState();
	this.informClient();

	if (this.getClassProp('can_repair') == 0) return;

	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc || !pc.is_player) return;

	pc.announce_sound('TOOL_BREAKS');

	var txt = "Ooops! You done broke your "+this.name_single+".";
	pc.prompts_add({
		txt		: txt,
		icon_buttons	: false,
		timeout		: 5,
		choices		: [
			{ value : 'ok', label : 'OK' }
		]
	});

	pc.sendActivity(txt);

	pc.quests_inc_counter('tool_broke_'+this.class_tsid, 1);
	if (this.class_tsid == 'irrigator_9000'){
		// http://bugs.tinyspeck.com/5784

		pc.quests_inc_counter('tool_broke_watering_can', 1);
	}
}

function getBaseCost(){ // defined by tool_base
	// [20% of BC] + [80% of BC * current wear/maximum wear)
	// This was producing issues with tools like the gassifier that do not have a points capacity
	if(intval(this.getClassProp('points_capacity'))) {
		return (this.base_cost * 0.2) + (this.base_cost * 0.8 * floatval(this.getInstanceProp('points_remaining')) / intval(this.getClassProp('points_capacity')));
	} else {
		return this.base_cost;
	}
}

function getEnergyPerTwoTicksRepair(pc){ // defined by tool_base
	//if (!pc) { return 0; }

	var details = pc.getSkillPackageDetails('tinkering');

	var energy = Math.round((details.bonus_amount / 100 * ((this.base_cost)/(this.getClassProp('points_capacity')))) * details.tool_wear);

	return energy;
}

function getHitPointModifier(pc){ // defined by tool_base
	return 1;
}

function getTooltipLabel(){ // defined by tool_base
	if (this.getClassProp('display_wear') == 1 && hasIntVal(this.getClassProp('points_capacity')) && this.getClassProp('points_capacity') > 0){
		return this.label + ' ('+floatval(this.getInstanceProp('points_remaining'))+'/'+intval(this.getClassProp('points_capacity'))+')';
	}
	else{
		return this.label;
	}
}

function informClient(){ // defined by tool_base
	var container = this.apiGetLocatableContainerOrSelf();
	if (!container || !container.is_player) return;

	return;
	container.apiSendMsgAsIs({
		type: 'tool_state',
		itemstack_tsid: this.tsid,
		tool_state: this.get_tool_state()
	});
}

function isWorking(points){ // defined by tool_base
	// We need fully-formed instance props
	if (!this.instanceProps || this.instanceProps.points_remaining == undefined){
		this.initInstanceProps();
	}

	// Temp fix to make sure no one's tools became broken unexpectedly
	if (floatval(this.getInstanceProp('points_remaining')) < 0 && intval(this.getClassProp('points_capacity')) != 0){
		this.setInstanceProp('points_remaining', intval(this.getClassProp('points_capacity')));
	}

	// No capacity means it works
	if (!hasIntVal(this.getClassProp('points_capacity')) || intval(this.getClassProp('points_capacity')) == 0) return true;

	// Are we flagged as broken?
	if (intval(this.getInstanceProp('is_broken')) == 1) return false;

	// If we don't display wear, then we're working
	if (intval(this.getClassProp('display_wear')) == 0) return true;

	// Do we have enough points remaining
	if (!points) points = 1;
	var pc = this.getRootContainer();
	if (pc && pc.is_player){
		points *= this.getHitPointModifier(pc);
	}
	return (floatval(this.getInstanceProp('points_remaining')) - points) >= 0 ? true : false;
}

function needsRepair(){ // defined by tool_base
	var needs_repair = false;

	if (this.getInstanceProp('is_broken') == 1){
		needs_repair = true;
	}
	else if (this.getInstanceProp('points_remaining') < this.getClassProp('points_capacity') && this.getClassProp('display_wear') == 1){
		needs_repair = true;
	}

	return needs_repair;
}

function onContainerChanged(oldContainer, newContainer){ // defined by tool_base
	this.updateState();
}

function onConversation(pc, msg){ // defined by tool_base
	if (msg.choice == 'repair-no'){
		this.conversation_end(pc, msg);
	}
	else{
		this.conversation_end(pc, msg);

		var contents = pc.getAllContents();
		if (contents[msg.choice]){
			tinkertool.startRepair(contents[msg.choice]);
		}
		else{
			this.conversation_reply(pc, msg, "Not sure what you mean there...");
		}
	}
}

function onCreate(){ // defined by tool_base
	this.initInstanceProps();
	this.updateLabel();
}

function onLoad(){ // defined by tool_base
	if (this.getInstanceProp('is_broken') == 1) return;
	if (!this.isWorking()){
		this.doBreak();
	}
	else{
		this.updateLabel();
	}
}

function onOverlayDismissed(pc, payload){ // defined by tool_base
	pc.announce_sound_stop(this.class_tsid.toUpperCase());
}

function onPropsChanged(){ // defined by tool_base
	// Set instance prop directly. Don't call setInstanceProp since that will produce a stack overflow
	this.instanceProps['points_remaining'] = floatval(this.instanceProps['points_remaining']);

	this.updateLabel();
	this.updateState();
}

function repair(points){ // defined by tool_base
	this.setInstanceProp('points_remaining', floatval(this.getInstanceProp('points_remaining')) + points);

	if (this.getInstanceProp('points_remaining') > this.getClassProp('points_capacity')){
		this.setInstanceProp('points_remaining', this.getClassProp('points_capacity'));
	}

	if (this.getClassProp('display_wear') == 0 && this.getInstanceProp('points_remaining') == this.getClassProp('points_capacity')){
		this.setInstanceProp('is_broken', 0);
	}
	else if (this.getClassProp('display_wear') == 1 && this.getInstanceProp('points_remaining') > 0){
		this.setInstanceProp('is_broken', 0);
	}

	this.updateLabel();
	this.updateState();

	return this.getClassProp('points_capacity') - this.getInstanceProp('points_remaining');
}

function rollCraftingBonusImagination(pc, recipe_id, count, upgrade_id, chance_of_bonus, bonus_base_cost_percentage){ // defined by tool_base
	if (!pc.imagination_has_upgrade(upgrade_id)) return;

	if (is_chance(chance_of_bonus) || pc.buffs_has('max_luck')){
		var recipe = get_recipe(recipe_id);
		if (!recipe) return;

		var base_cost = 0;
		var item = null;
		var crafting = '';
		for (var i in recipe.outputs){
			item = apiFindItemPrototype(recipe.outputs[i][0]);
			if (item){
				base_cost += item.getBaseCost() * recipe.outputs[i][1] * count;
				if (crafting != '') crafting += ',';
				crafting += recipe.outputs[i][0];
			}
		}

		if (!base_cost) return;

		var change = Math.round(base_cost * bonus_base_cost_percentage);
		var context = {};
		context['tool'] = this.class_id;
		context['crafting'] = crafting;
		context['img_upgrade'] = upgrade_id;
		context['base_cost'] = base_cost;

		var actual = pc.stats_add_xp(change, false, context);

		if (actual > 0) {
			pc.sendActivity('Hey, you got '+actual+' bonus imagination for making that.');
		}
		
	}
}

function updateLabel(){ // defined by tool_base
	if (this.label != this.name_single){
		this.label = this.name_single;
		this.informClient();
	}

	/*if (this.getClassProp('display_wear') == 1 && hasIntVal(this.getClassProp('points_capacity')) && this.getClassProp('points_capacity') > 0){
		this.label = this.name_single + ' (' + this.getInstanceProp('points_remaining') + '/' + this.getClassProp('points_capacity') + ')';
		this.informClient();
	}*/
}

function updateState(){ // defined by tool_base
	if (this.isOnGround()){
		if (this.isWorking()){
			this.setAndBroadcastState('1');
		}
		else{
			this.setAndBroadcastState('broken');
		}
	}
	else{
		if (this.isWorking()){
			this.setAndBroadcastState('iconic');
		}
		else{
			this.setAndBroadcastState('broken_iconic');
		}
	}
}

function use(pc, points){ // defined by tool_base
	if (!this.instanceProps || this.instanceProps.points_remaining == undefined){
		this.initInstanceProps();
	}

	if (this.getClassProp('points_capacity') == 0) return false;

	if (!points) points = 1;

	if (!this.isWorking(points)) return false;

	this.instanceProps.points_remaining = floatval(this.instanceProps.points_remaining) - (points * this.getHitPointModifier(pc));

	// Tools that display wear break at 0
	// Otherwise we roll the dice
	if (this.getInstanceProp('points_remaining') <= 0){
		this.setInstanceProp('points_remaining', 0);

		if (this.getClassProp('display_wear') == 1 || this.has_parent('potion_base')){
			this.doBreak();
		}
		else{
			var chance = 0.10;
			if (this.getClassProp('required_skill')){
				if (pc.skills_get_highest_level(this.getClassProp('required_skill')) == 2){
					chance = 0.05;
				}
			}

			if (is_chance(chance) || pc.buffs_has('max_luck')){
				this.doBreak();
			}
		}
	}

	this.updateLabel();
	return true;
}

// global block from tool_base
var is_tool = true;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("intermediateadmixing_1"))) out.push([1, "You need the skill <a href=\"\/skills\/16\/\" glitch=\"skill|intermediateadmixing_1\">Intermediate Admixing<\/a> to use this."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from an <a href=\"\/items\/1000001\/\" glitch=\"item|npc_streetspirit_alchemical_goods\">Alchemical Goods Vendor<\/a> or a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a>."]);
	return out;
}

var tags = [
	"tool"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-14,"y":-36,"w":27,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIs0lEQVR42s2Yy1fb6BnGs+g+f0I2\n3edPYN0N3barWbSL2c16Tk+bTKenp1MTTBwgQBCQAA4mJsaAMb7g+x1bvt9t+SJLsmxdLdmyLTP0\nUwotkyY9wyQh0TnPkZc\/P8\/7fu\/76c6dD3iKgvAgy3HOJFCMYZwRmnYGKMrp6XScLpJ02trt9Tuf\n68mx\/T+kWcEbIvvfmcv96f0MM70LY9ObQWQachemN8OFP1oxvGrGcfaQJO\/fKlxjMPjGgV5MZTnR\nforJ0+8CXLQmp80oFjRU6tq9akN\/64ABbPL7Kj8wZji+Gqe5VIhkjV6c0jpQUusiOp6TOjazl689\nnDuKTB800ditR5zl+l\/XhNEuN5LT3cHYlOv2l7Ikv5Qg+KXX6eafjJnW99tw5Xt9EZm99YivnlSX\n1gfQ7mqeE7JxhvMEO9SJt909ceCk47iOPTUUkD0LQTz4bI2SJLtab52cFcdyM0\/1dpyNjsqCkKqT\nOjljQjCVLlHUfBGAA3lSLzDiyytAC0LMHiHYzBcDKI7kGnDwv4D1thoAPvpyAMdyJc+I2itAe6Mz\nB2rwywEUxpNSjhG3rwAdjc5jM4LNfnbAGNHRwVj3GTccF7NU7z+A4P3EUifeAIJJov4scDVJmnKU\nkO0QxqiEkVx1oZTquoOnTXL+dRaZ3a\/UwjaGuXvrgDBBLrsQTNPsDQydwTB0HfAYIWaCOA0dlFoz\n2mT+hem2Y26J4n1vuaGPkJxqMJogVa5vuA5oQgiVAuioE4u6TFWtL1fDtzvmKObv7nJzvtEb7A3l\nCRFqs3NvA7panYUwRj03Ahe3EjmjsdX66lbgcEm6d4YSlijBzHBDOcZII9iDUaq3Aa0NfA5uU1ob\ncHE7XpjTI3X\/7TSHIGi81dZChRU3JPm80eQGRgXQHQluXAcEB7UqhlNbEaDdXF31Ip450H9qF5mL\ni7sJjDQA92aZ4SgMDuhakuQXPH77zrsAfQ0SSnS4XUsVW3wezWp0CPJp90JUFL\/1lluLtd5wbSCf\nl7nROKocM17nwf80iQII4n2S7LB70Tb1Uqe4mCk4dlF06pO5VyRp+1mLnuv0RzZhOCyjBO4NOA8N\nXuhh07O34nfrl\/2nr576rwAPSqgqAQATbdpwUsWXnkUS89pa7eCTAHYGg9+FyuhakR3Mi\/IkK4zl\nXJoSlhUHPRbd8bscVABDOLWZ7rDGKNHVbWUrM1Ay69zC8XsfvzkY1hJX3BuMzQAuzfUHqXA8shEE\n9efbnkm7fPYdp8e68zagvUEsZUj2KEWyh4cVdH4lkljZrNaWPyocOx5\/Fa3j22WmP98bT+K90SRB\n9IfHykEdSqeXfwKYLWmuAxor2KNclz3OUZwpjHV31xPFR1AmH\/2oLjYZfgnGKA0hjl\/xw0mMFYV0\n1m1Ihmz6Y8VB7+GL0\/dF\/Boo1qZ1APIkS7FmQ7G+uBCAVzeq1W8\/Cpwgy1NZtH1Y5IZqTpL9\/GgS\n4YfyWUxxL3i6EwDuKQ5ebxJL0LNxHdDTIDeKDG\/NdllrhKD2VuH87Eo651muVj98ieiK\/e0E2Eza\ng\/EOP5KDADAIfh8pgErEShd7Kojm\/zkI3o9LNH9aZHk7iNr+Kl+ff+yLbq3Xah+2REgXF\/cQinFW\naXGOGU2cIF4fM5T9heBJNLL\/zH\/l4LtG3XVAZZJkO8xxieGdRZp3BLDO7kIoOfc0lbV8WLzDsSYJ\nhj7RH69x44mLHcpuAOjJ0OKs4mA4n11+Awjq8H1dfAUYwrraCie4y0zPVQLazFYeq4GLy7XaLxt\/\nF8C9Fvi3ZWYwy44mx8BBB8WLXgxFQolSYRkmudkzklMHrXqLD6fVnhatdjW7aluNVJtrbfVxDVcf\nlVvqfSAQ6SNzFVtA2J6vwvLeMst7\/Ci599gPaxYLxV+2REgj+YcM2oXQ3nCd7g8d1GDspntCqJQM\nR2JHL+Dwxt\/wEFDg2Z8pv3EN9gJ5DKuw8\/UK7EgldCdldP2o2NgwFmsbxkJ97aCMQmWGD9bY3lmF\n5iJFmvU\/T5WfqEPRg6Va7bc3de9uhxdt8WprRXGxK0peWhr7GKAqO9jK0H0o2e1BMbS1GfGe2II4\nA\/mAvFgXcoAFwd5oQ9Z6G7IgOHSMYJACp6hA874GLyRqXC9Rpti4vYiYfzj1LWkyWe1NAR+UWtRz\njJdecuMfQe1NXMxw4iZo2psK2m1xoFg6ZohEvaZw2G0KKHBA7ktAKwAEd2MAh0OgFiEjgDMApTqc\no8mLaQCZqnNiskL3YlA082ImED3SlMtTN4h3kmgLMsRIExMAc4C3A4w4JypI+zngXqJS0Z05je4g\niNh\/cBmvEYLdpq3gG+eAzHUFDocOAKDhEhBsNnaUF7NoT8jUOSFT48S0r9U2r0TTkKZY1v1sQLBK\nwZR0vgXOPDtwz05Lsh1HkVjm9FUq6T5yx2MB0xmIN+SzvInXC+4fTgzcQVDyEg64pwBWgHtAhmID\n2gOAJbYXagn9PCqI+WZPzAE3s1WWT25lShsLhdLPj3lyfuHgpPMjMHddfbC5UAAQHDXWHE5spgBc\nFDRJaFtVD6z+hfK\/nCv51v+Ku4Fca9\/hjtWHuG1Hk3kbEDi5QYiDEiH2i7goFTChX0D5fr7BCXlX\nCw9pKpV\/3qQG748m59nem7NvYh+MJ8XJ+Y9iV5LdSsRJIBg0SQi4+O8GoUH9AReBgz+JWAG8jBhc\novSgJrd0BQR6CXSGUzYAWaz3hCa4lkZvPPaGFxe\/HkzOd8BqVVQiVsYb0R+ZwBzONIWRKQ4Ao0Bn\n7csOvmwSO2gSS+My5ssavGoSPXBSAVQERl6kIfZpX7f7YV8e6KH8G3Y03sL7UrQhSLYiLW5eHTNX\ngO87ZszXuliRvtzU7VTqVn296fR2Ov84ZZiPt3I5Ly5+1ZWkKUySHjT6\/QdlQdTneUGbZlgfTDFw\npMvAIZKCfUQXdhMk7MDbsBUjEiYUDxyhuHa\/1dLpUfSbnVbrRp+D\/wUselnb\/MF\/eAAAAABJRU5E\nrkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "\/c2.glitch.bz\/items\/2012-04\/beaker-1334271206.swf",
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
	"tool"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "repair",
	"t"	: "stir"
};

// generated ok 2012-12-09 12:50:56 by ali
