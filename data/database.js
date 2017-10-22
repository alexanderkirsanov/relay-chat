const {curry, pipe, prop, find, identity, not} = require('ramda');

class Message {
    constructor(id = '', date = new Date().getTime(), edited = false, text = '', user = 'me') {
        this.date = date;
        this.id = id;
        this.edited = edited;
        this.text = text;
        this.user = user;
    }
}

class User {}

let db = {};
let nextMessageId;
const write = curry((table, payload) => {
    if (!db[table]) {
        db[table] = [];
    }
    db[table].push(payload);
    return payload;
});
const read = curry((table, condition) => {
    return condition(db[table]);
});
const deleteOp = curry((table, condition) => {
    db[table] = db[table].filter(condition);
});
const clearAll = () => {
    db = {
        Users: [{id: 'me'}],
        Messages: []
    };
    nextMessageId = 0;
};

const byId = eId => ({id}) => id === eId;
const createMessage = text => new Message(`${nextMessageId++}`, undefined, undefined, text);
const findById = eId => find(byId(eId));

const addMessage = pipe(createMessage, write('Messages'), prop('id'));
const changeMessage = (id, text) => {
    const message = getMessage(id);
    message.text = text;
    message.date = new Date().getTime();
    message.edited = true;
};
const getMessages = (condition = identity) => read('Messages', condition);
const getMessage = id => getMessages(findById(id));
const removeMessage = id => deleteOp('Messages', pipe(byId(id), not));
const getUsers = (condition = identity) => read('Users', condition);
const getUser = pipe(findById, getUsers, prop('id'));

const getViewer = () => {
    return getUser('me');
};
clearAll();
module.exports = {
    Message,
    User,
    addMessage,
    changeMessage,
    getMessage,
    getMessages,
    removeMessage,
    getUsers,
    getUser,
    getViewer,
    clearAll
};
