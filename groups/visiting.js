// init group.
function init() {
    if (!this.locations) {
        this.locations = [];
    }
}

// fetch random player from opt-in list.
function fetch(pc) {
    this.init();
    var ret = this.locations[Math.floor(Math.random() * this.locations.length)];
	// make sure there are a few people in the visiting list before using a while loop.
	if (this.locations.length >= 3) {
		while (ret === pc.tsid) {
			ret = this.locations[Math.floor(Math.random() * this.locations.length)];
		}
	}
    return ret;
}

// opt-in to house visiting.
function opt_in(pc) {
    this.init();
    this.locations.push(pc.tsid);
    return {ok: 1};
}

// opt-out of house visiting.
function opt_out(pc) {
    this.locations.splice(this.locations.indexOf(pc.tsid), 1);
    return {ok: 1};
}
