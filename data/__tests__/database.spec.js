const {
    addMessage,
    changeMessage,
    getMessage,
    getMessages,
    removeMessage,
    getUsers,
    getUser,
    getViewer,
    clearAll
} = require('../database');

describe('Basic DB tests', () => {
    describe('Messages operations tests', () => {
        beforeEach(clearAll);
        it('should add message to db and return id', () => {
            const messageId = addMessage('text');
            expect(messageId).toBeDefined();
            expect(getMessages()).toEqual([{date: null, edited: null, id: '0', text: 'text', user: 'me'}]);
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
            const oldDate = getMessage(msgId).date;
            changeMessage(msgId, newText);
            const changedMessage = getMessage(msgId);
            expect(changedMessage.text).toBe(newText);
            expect(changedMessage.edited).toBe(true);
            expect(changedMessage.date).not.toBe(oldDate);
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
            expect(getUsers()).toEqual([{id: 'me'}]);
        });
        it('should return a user id by id', () => {
            expect(getUser('me')).toEqual('me');
        });
        it('should return a view for current user', () => {
            expect(getViewer()).toEqual('me');
        });
    });
});