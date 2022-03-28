import { LightningElement, api } from 'lwc';

const ICON_BUTTON_TAG = 'lightning-button-icon';
const HIDDEN_STYLE = 'slds-hidden';
const EDIT_BUTTON_CLICK_EVENT = 'editbuttonclick';
const CHANGE_VALUE_EVENT = 'changevalue';

export default class Field extends LightningElement {
    @api value;
    @api recordId;
    @api fieldName;
    @api isEditButtonDisabled;
    isInputShown=false;

    @api
    cancelEdit(){
        this.isInputShown = false;
    }
    
    @api
    showEditButton(){
        this.template.querySelector(ICON_BUTTON_TAG).classList.remove(HIDDEN_STYLE);
    }

    @api
    hideEditButton(){
        this.template.querySelector(ICON_BUTTON_TAG).classList.add(HIDDEN_STYLE);
    }

    handleEditButton(){
        this.isInputShown = true;
        this.dispatchEvent(new CustomEvent(EDIT_BUTTON_CLICK_EVENT));
    }

    handleChange(event){
        let currentValue = event.target.value;
        this.dispatchEvent(new CustomEvent(CHANGE_VALUE_EVENT, { detail:        
            {recordId : this.recordId, fieldName : this.fieldName, value : currentValue}}));
    }

}