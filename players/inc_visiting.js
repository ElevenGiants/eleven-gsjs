function visiting_can_opt_in() {
	// Player must be level 5 or over...
	if (this.stats.level < 4){
		return {ok: 0, error: 'low_level'};
	}

	// Player must have a home...
	if (!this.home || !this.home.exterior){
		return {ok: 0, error: 'no_home'};
	}

	// Player must have 3 cultivations...
	var jobs = this.home.exterior.cultivation_count_all_items();
	if (jobs < 3){
		return {ok: 0, error: 'no_cultivation', jobs: jobs};
	}

	// Player must have a butler...
	if (!this.has_butler()){
		return {ok: 0, error: 'no_butler'};
	}

	// All good!
	return {ok: 1};
}

function visiting_opt_in() {
	// Check if we already have opted in.
	if (this.home_allow_visits){
		return {ok: 1};
	}

	// Check if we can opt in.
	var ret = this.visiting_can_opt_in();
	if (!ret.ok) {
		return ret;
	}

	// All clear, lets opt-in!
	var visiting_group = api.apiFindObject(config.visiting_group);
	if (!visiting_group) {
		return this.sendActivity("Uh-oh! I can't seem to find the street list. Please try again later.");
	}
	var rsp = visiting_group.opt_in(this);
	if (rsp.ok) {
		this.home_allow_visits = true;
		this.sendActivity("You've been opted in - you will recieve random visitors to your street.");
	}
	else {
		this.sendActivity("Something seems to have gone wrong. Please try again later!");
	}
	return {ok: 1};
}

function visiting_opt_out() {
	// Check if we already have opted out.
	if (!this.home_allow_visits){
		return {ok: 1};
	}

	// All clear, lets opt-out!
	var visiting_group = api.apiFindObject(config.visiting_group);
	if (!visiting_group) {
		return this.sendActivity("Uh-oh! I can't seem to find the street list. Please try again later.");
	}
	var rsp = visiting_group.opt_out(this);
	if (rsp.ok) {
		delete this.home_allow_visits;
		this.sendActivity("You've been opted out - you will no longer receive random visitors to your street.");
	}
	else {
		this.sendActivity("Something seems to have gone wrong. Please try again later!");
	}
	return {ok: 1};
}

function visiting_visit_random() {
	var visiting_group = api.apiFindObject(config.visiting_group);
	if (!visiting_group) {
		return this.sendActivity("Uh-oh! I can't seem to find the street list. Please try again later.");
	}

	var target = visiting_group.fetch();
	if (!target) {
		return this.sendActivity("I couldn't find a street to send you to. Sorry about that!");
	}

	var ret = this.houses_visit(target);
	if (ret.ok) {
		this.achievements_increment('visit_random', target, 1);
	}
	else {
		this.sendActivity("We ran in to a problem teleporting you to a street. Please try again!");
	}
}
