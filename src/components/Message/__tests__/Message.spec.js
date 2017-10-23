import {mount} from 'enzyme';
import {PureMessage} from '../Message';
import * as React from 'react';
import {IconButton} from 'material-ui';
import {ListItem, ListItemText} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import DeleteIcon from 'material-ui-icons/Delete';
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import EditMessageInput from '../EditMessageInput';
import EditMessageMutation from '../../../mutations/EditMessageMutation';
import RemoveMessageMutation from '../../../mutations/RemoveMessageMutation';

describe('Message tests', () => {
    let message;
    beforeEach(() => {
        message = {
            edited: false,
            user: {
                avatar: 'test'
            },
            date: 1508768092577,
            text: 'text'
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should show avatar, text, controls, etc in read mode', () => {
        const chat = {};
        const messageCmp = mount(<PureMessage classes={{}} message={message} relay={{environment: {}}} chat={chat} />);
        expect(messageCmp.find(ListItem).length).toBe(1);
        expect(messageCmp.find(Avatar).length).toBe(1);
        expect(messageCmp.find(DeleteIcon).length).toBe(1);
        expect(messageCmp.find(ModeEditIcon).length).toBe(1);
        expect(messageCmp.find(ListItemText).length).toBe(1);
        expect(messageCmp.find(EditMessageInput).length).toBe(0);
    });
    it('should show special background for edited message', () => {
        const chat = {};
        const newMessage = {...message, edited: true};
        const editedMessage = mount(
            <PureMessage classes={{}} message={newMessage} relay={{environment: {}}} chat={chat} />
        );
        expect(editedMessage.find(ListItem).props().style).toMatchObject({backgroundColor: '#e4f3ff'});
        const messageCmp = mount(<PureMessage classes={{}} message={message} relay={{environment: {}}} chat={chat} />);
        expect(messageCmp.find(ListItem).props().style).toMatchObject({backgroundColor: '#FAFAFA'});
    });
    it('should show avatar letter based on avatar field', () => {
        const chat = {};
        const messageCmp = mount(<PureMessage classes={{}} message={message} relay={{environment: {}}} chat={chat} />);
        expect(
            messageCmp
                .find(Avatar)
                .text()
                .trim()
        ).toBe('T');
    });
    it('should render text and time correctly', () => {
        const chat = {};
        const messageCmp = mount(<PureMessage classes={{}} message={message} relay={{environment: {}}} chat={chat} />);
        const {primary, secondary} = messageCmp.find(ListItemText).props('');
        expect(primary).toBe('text');
        expect(secondary).toBe('23/10/2017 16:14');
    });
    it('should show edit field in edit mode', () => {
        const chat = {};
        const messageCmp = mount(<PureMessage classes={{}} message={message} relay={{environment: {}}} chat={chat} />);
        messageCmp.setState({isEditing: true});
        expect(messageCmp.find(EditMessageInput).length).toBe(1);
    });
    it('should invoke edit message mutation and exit from edit mode in case of on save click', () => {
        const chat = {};
        const messageCmp = mount(<PureMessage classes={{}} message={message} relay={{environment: {}}} chat={chat} />);
        messageCmp.setState({isEditing: true});
        jest.spyOn(EditMessageMutation, 'commit').mockImplementation(() => {});
        messageCmp
            .find(EditMessageInput)
            .props()
            .onSave('newValue');
        expect(EditMessageMutation.commit).toHaveBeenCalled();
        expect(EditMessageMutation.commit.mock.calls[0]).toMatchObject([{}, 'newValue', message]);
        expect(messageCmp.state().isEditing).toBe(false);
    });
    it("shouldn't invoke edit message mutation and exit from edit mode in case of on cancel click", () => {
        const chat = {};
        const messageCmp = mount(<PureMessage classes={{}} message={message} relay={{environment: {}}} chat={chat} />);
        messageCmp.setState({isEditing: true});
        jest.spyOn(EditMessageMutation, 'commit').mockImplementation(() => {});
        messageCmp
            .find(EditMessageInput)
            .props()
            .onCancel();
        expect(EditMessageMutation.commit).not.toHaveBeenCalled();
        expect(messageCmp.state().isEditing).toBe(false);
    });
    it('should invoke remove message mutation on delete action', () => {
        const chat = {chat: ''};
        const messageCmp = mount(<PureMessage classes={{}} message={message} relay={{environment: {}}} chat={chat} />);
        jest.spyOn(RemoveMessageMutation, 'commit').mockImplementation(() => {});
        const isRemoveButton = button => button.props()['aria-label'] === 'Delete';
        messageCmp
            .find(IconButton)
            .filterWhere(isRemoveButton)
            .simulate('click');
        expect(RemoveMessageMutation.commit).toHaveBeenCalled();
        expect(RemoveMessageMutation.commit.mock.calls[0]).toMatchObject([{}, message, {chat: ''}]);
    });
});
