import {mount} from 'enzyme';
import Message from '../../Message/Message';
import ChatDialog from '../ChatDialog';
import * as React from 'react';

describe('ChatDialog tests', () => {
    it('should render message for each edge', () => {
        const chat = {
            messages: {
                edges: [
                    {
                        node: {
                            id: 1,
                            edited: false,
                            user: {
                                avatar: 'test'
                            },
                            date: 1508768092577,
                            text: 'text'
                        }
                    },
                    {
                        node: {
                            id: 2,
                            edited: false,
                            user: {
                                avatar: 'test'
                            },
                            date: 1508768092577,
                            text: 'text2'
                        }
                    }
                ]
            }
        };
        const component = mount(<ChatDialog chat={chat} user={{name: 'test'}} />);
        expect(component.find(Message).length).toBe(2);
    });
});
