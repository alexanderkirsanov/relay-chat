const {
    addMessage,
    changeMessage,
    getMessage,
    getMessages,
    removeMessage,
    getUsers,
    getUser,
    getChat,
    clearAll
} = require('../database');

describe('Basic DB tests', () => {
    describe('Messages operations tests', () => {
        beforeEach(clearAll);
        it('should add message to db and return id', () => {
            const messageId = addMessage('text');
            expect(messageId).toBeDefined();
            expect(getMessages()).toMatchObject([{edited: false, id: '0', text: 'text', user: 'me'}]);
        });
        it('should add message to db and set current time and edited false', () => {
            const messageId = addMessage('text');
            expect(messageId).toBeDefined();
            const message = getMessages()[0];
            expect(message.date).toBeDefined();
            expect(message.edited).toBe(false);
        });
        it("should generate unique id's", () => {
            const firstMsgId = addMessage('firstMessage');
            const secondMsgId = addMessage('secondMessage');
            expect(firstMsgId).not.toBe(secondMsgId);
        });
        it('should find message correctly', () => {
            const firstMessage = 'first message';
            const msgId = addMessage(firstMessage);
            addMessage('second message');
            expect(getMessage(msgId).text).toBe(firstMessage);
            expect(getMessages().length).toBe(2);
        });
        it('should change message text correctly', () => {
            const initText = 'first message';
            const newText = 'new text';
            const msgId = addMessage(initText);
            changeMessage(msgId, newText);
            const changedMessage = getMessage(msgId);
            expect(changedMessage.text).toBe(newText);
            expect(changedMessage.edited).toBe(true);
        });
        it('should remove message correctly', () => {
            const firstMsgId = addMessage('firstMessage');
            const secondMsgId = addMessage('secondMessage');
            removeMessage(firstMsgId);
            expect(getMessages().length).toBe(1);
            expect(getMessage(secondMsgId)).toBeDefined();
            removeMessage(secondMsgId);
            expect(getMessages().length).toBe(0);
        });
    });
    describe('Users operations tests', () => {
        it('should return all users', () => {
            expect(getUsers()).toEqual([{id: 'me', avatar: 'user'}]);
        });
        it('should return a user by id', () => {
            expect(getUser('me').id).toEqual('me');
        });
        it('should return a chat name', () => {
            expect(getChat()).toEqual('mainChat');
        });
    });
});
