class Connector {
  constructor(source, destination, string_cb) {
    this.activated = false;
    this.src = source;
    this.dest = destination;
    this.dest_cb = string_cb;
    this.dest_args = [];
    source.connect(this);
  }

  setCallArgs(args) {
    this.dest_args = args;
  }

  activate() {
    if (!this.activated) {
      this.activated = true;
      this.dest[this.dest_cb](this.dest_args);
      this.activated = false;
    } else {
      console.log('connector already activated');
    }
  }
}

export {Connector}