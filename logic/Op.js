class Op {
    static get id() {
        throw new Error('Not implemented: Op.id() getter');
    }

    static execute(args) {
        throw new Error('Not implemented: Op.execute()');
    }
}

module.exports = Op;