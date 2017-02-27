// init group.
function init() {
    if (!this.locations) {
        this.locations = [];
    }
}

// fetch random player from opt-in list.
function fetch() {
    this.init();
    return this.locations[Math.floor(Math.random() * this.locations.length)];
}

// opt-in to house visiting.
function opt_in(pc) {
    this.init();
    this.locations.push(pc.tsid);
    return {ok: 1};
};

// opt-out of house visiting.
function opt_out(pc) {
    delete this.locations[this.locations.indexOf(pc.tsid)];
    return {ok: 1};
};
