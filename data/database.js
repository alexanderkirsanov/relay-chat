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

class User {
    constructor(id, name, avatar, password) {
        this.id = id;
        this.avatar = avatar;
        this.password = password;
        this.name = name;
    }
}

class Chat {}

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
        Users: [createUser({id: 'me', name: 'me', avatar: 'user', password: 'test'})],
        Messages: []
    };
    nextMessageId = 0;
};
const createUserFromPayload = ({id, name, avatar, password}) => new User(id, name, avatar, password);
const byId = eId => ({id}) => id === eId;
const createMessage = (text, user) => new Message(`${nextMessageId++}`, undefined, undefined, text, user);
const findById = eId => find(byId(eId));

const addMessage = pipe(createMessage, write('Messages'), prop('id'));
const changeMessage = (id, text) => {
    const message = getMessage(id);
    message.text = text;
    message.edited = true;
};
const getMessages = (condition = identity) => read('Messages', condition);
const getMessage = id => getMessages(findById(id));
const removeMessage = id => deleteOp('Messages', pipe(byId(id), not));
const getUsers = (condition = identity) => read('Users', condition);
const createUser = pipe(createUserFromPayload, write('Users'));
const getUser = pipe(findById, getUsers);

const getChat = () => {
    return 'mainChat';
};
clearAll();
module.exports = {
    Message,
    User,
    Chat,
    addMessage,
    changeMessage,
    getMessage,
    getMessages,
    removeMessage,
    getUsers,
    getUser,
    getChat,
    clearAll,
    createUser
};
