import {createUser} from '../database';

const {clearAll, addMessage} = require('../database');
const {graphql} = require('graphql');
const {schema} = require('../schema');
const user = {id: 'userId', name: 'userName', avatar: 'avatar', password: 'password'};
describe('schema tests', () => {
    beforeEach(clearAll);
    it('should initially show 0 messages', () => {
        const query = `query { 
            chat {
                totalCount  
            }
        }`;
        const rootValue = {};
        return graphql(schema, query, rootValue).then(({data}) => {
            expect(data.chat.totalCount).toBe(0);
        });
    });
    it('should show all messages on request', () => {
        createUser(user);
        addMessage('test', 'userId');
        const query = `query { 
            chat {
                totalCount,
                messages {
                    edges {
                        cursor
                        node {
                            id
                            text
                            date
                            edited,
                            user {
                                    avatar
                                }
                        }
                    }
                }
            }
        }`;
        const rootValue = {};
        const context = {user};
        return graphql(schema, query, rootValue, context).then(({data}) => {
            expect(data.chat.totalCount).toBe(1);
            expect(data.chat.messages.edges[0].node).toMatchObject({
                text: 'test',
                edited: false
            });
            expect(data.chat.messages.edges[0].node.user.avatar).toBe('avatar');
        });
    });
    it('should run add message mutation correctly', () => {
        const query = `mutation { 
            newMessage (input: {text: "test", user: "userId"}) {
                chat {
                    totalCount,
                    messages {
                        edges {
                            cursor
                            node {
                                id
                                text
                                date
                                edited,
                                user {
                                    avatar
                                }
                            }
                        }
                    }               
                },
                messageEdge {
                    node {
                        id
                        text
                    }
                }
            }
        }`;
        const rootValue = {};
        const context = {user};
        return graphql(schema, query, rootValue, context).then(({data}) => {
            expect(data.newMessage.chat.messages.edges[0].node).toMatchObject({
                text: 'test',
                edited: false
            });
            expect(data.newMessage.messageEdge.node.text).toBe('test');
        });
    });
    it('should run edit message mutation correctly and update date and edited flag', () => {
        const addQuery = `mutation { 
            newMessage (input: {text: "test", user: "userId"}) {
                chat {
                    totalCount,
                    messages {
                        edges {
                            cursor
                            node {
                                id
                            }
                        }
                    }               
                }
            }
        }`;
        const rootValue = {};
        let id, date;
        return graphql(schema, addQuery, rootValue)
            .then(({data}) => {
                const node = data.newMessage.chat.messages.edges[0].node;
                id = node.id;
                date = node.date;
                const query = `mutation { 
                editMessage (input: {text: "test2", id: "${id}"}) {
                    message {
                        id
                        text
                        date
                        edited
                    }
                }
            }`;
                return graphql(schema, query, rootValue);
            })
            .then(({data}) => {
                const message = data.editMessage.message;
                expect(message.id).toBe(id);
                expect(message.date).not.toBe(date);
                expect(message.edited).toBe(true);
            });
    });
    it('should run remove message mutation correctly', () => {
        const addQuery = `mutation { 
            newMessage (input: {text: "test", user: "userId"}) {
                chat {
                    totalCount,
                    messages {
                        edges {
                            cursor
                            node {
                                id
                            }
                        }
                    }               
                }
            }
        }`;
        const rootValue = {};
        let id;
        const context = {user};
        return graphql(schema, addQuery, rootValue, context)
            .then(({data}) => {
                const node = data.newMessage.chat.messages.edges[0].node;
                id = node.id;
                const query = `mutation { 
                removeMessage (input: {id: "${id}"}) {
                    deletedMessageId
                }
            }`;
                return graphql(schema, query, rootValue);
            })
            .then(({data}) => {
                expect(data.removeMessage.deletedMessageId).toBe(id);
            });
    });
});
