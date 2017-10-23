import {mount} from 'enzyme';
import EditMessageInput, {PureEditMessageInput} from '../EditMessageInput';
import * as React from 'react';
import {TextField, Button} from 'material-ui';

describe('EditMessageInput tests', () => {
    it('should set initial value from props', () => {
        const component = mount(<EditMessageInput text="test" onCancel={jest.fn()} onSave={jest.fn()} />);
        expect(component.find(TextField).props().defaultValue).toBe('test');
    });
    it('should call cancel callback on cancel button click', () => {
        const onCancel = jest.fn();
        const onSave = jest.fn();
        const component = mount(<EditMessageInput text="test" onCancel={onCancel} onSave={onSave} />);
        const isCancelButton = button => button.props().color !== 'primary';
        const cancelButton = component.find(Button).filterWhere(isCancelButton);
        cancelButton.simulate('click');
        expect(onCancel).toHaveBeenCalled();
        expect(onSave).not.toHaveBeenCalled();
    });
    it('should call save callback with current value on save button click', () => {
        const onCancel = jest.fn();
        const onSave = jest.fn();
        const isSaveButton = button => button.props().color === 'primary';
        const component = mount(<EditMessageInput text="test" onCancel={onCancel} onSave={onSave} />);
        const save = component.find(Button).filterWhere(isSaveButton);
        save.simulate('click');
        expect(onCancel).not.toHaveBeenCalled();
        expect(onSave).toHaveBeenCalled();
        expect(onSave.mock.calls[0]).toEqual(['test']);
    });
    it('should update current value on field value change', () => {
        const component = mount(
            <PureEditMessageInput text="test" classes={{}} onCancel={jest.fn()} onSave={jest.fn()} />
        );
        const textField = component.find(TextField).find('input');
        textField.simulate('change', {target: {value: 'Hello'}});
        expect(component.state('value')).toBe('Hello');
    });
});
