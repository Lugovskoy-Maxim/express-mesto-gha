class errorNotFaund extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = { errorNotFaund };
