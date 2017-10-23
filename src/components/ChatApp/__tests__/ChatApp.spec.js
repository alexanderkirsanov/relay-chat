import {mount} from 'enzyme';
import ChatApp from '../ChatApp';
import * as React from 'react';
import ChatDialog from '../../ChatDialog/ChatDialog';
import TextField from 'material-ui/TextField';
import NewMessageMutation from '../../../mutations/NewMessageMutation';

describe('ChatApp tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    const chat = {
        totalCount: 1,
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
    it('should render header, chat window and text input', () => {
        const component = mount(<ChatApp chat={chat} />);
        expect(component.find(ChatDialog).length).toBe(1);
        expect(component.find(TextField).length).toBe(1);
        expect(component.find('h1').length).toBe(1);
    });
    it('should use plural form for items', () => {
        const chatApp = mount(<ChatApp chat={chat} />);
        expect(chatApp.find('h1').text()).toBe('1 item');
        const chatApp2 = mount(<ChatApp chat={{...chat, totalCount: 2}} />);
        expect(chatApp2.find('h1').text()).toBe('2 items');
    });
    it('should invoke new message mutation on enter', () => {
        const chatApp = mount(<ChatApp chat={chat} relay={{environment: {environment: ''}}} />);
        const textField = chatApp.find(TextField);
        jest.spyOn(NewMessageMutation, 'commit').mockImplementation(() => {});
        textField.simulate('keyPress', {key: 'Enter', target: {value: 'value'}});
        expect(NewMessageMutation.commit).toHaveBeenCalled();
        expect(NewMessageMutation.commit.mock.calls[0]).toMatchObject([{environment: ''}, 'value', chat]);
    });
});
