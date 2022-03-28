import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateAccount from '@salesforce/apex/AccountController.updateAccount';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import deleteAccount from '@salesforce/apex/AccountController.deleteAccount'; 

const ERROR = 'Error';
const ERROR_MESSAGE_FOR_DELETE = 'This record is not deleted';
const SUCCESS = 'Success';
const SUCCESS_MESSAGE_FOR_UPDATE = 'Record is changed';
const HYPEN_SYMBOL = '-';
const FIELD_COMPONENT = 'c-field';
const TD_TAG = 'td';
const EDIT_STYLE = 'slds-is-edited';

export default class TagDatatable extends LightningElement {

    currentRecordInfo;
    isEditDisabled = false;
    isShowFooter = false;
    isEditButtonDisabled = false;

    @wire( getAccounts )  
    accounts

    handleEditButtonClick(event){
        this.isShowFooter = true;
        this.isEditButtonDisabled = true;
    }

    handleChangeValue(event){
        this.currentRecordInfo = event.detail;
        this.highlightCell();

    }

    handleCancel(){
        this.cancelActions();
    }

    handleSave(){
        if(this.currentRecordInfo){
            updateAccount(({
                accountId : this.currentRecordInfo.recordId,
                field : this.currentRecordInfo.fieldName,
                value : this.currentRecordInfo.value
            })).then(()=>{
                refreshApex(this.accounts);
                this.cancelActions();
                this.displayNotification(SUCCESS, SUCCESS_MESSAGE_FOR_UPDATE, SUCCESS);
            })
        } else {
            this.cancelActions();
        }
    } 
    
    handleDelete(event){
        let recordId = event.target.value;
        deleteAccount({
            accountId: recordId
        })
        .then(() => {
            refreshApex(this.accounts);
            })
            .catch((error) => {
                this.displayNotification(ERROR_MESSAGE_FOR_DELETE, error.body.message, ERROR);
            });
    }

    handlemouseenter(event){
        this.template.querySelectorAll(FIELD_COMPONENT).forEach(element=>{
            if(event.target.id.split(HYPEN_SYMBOL)[0]==element.recordId && event.target.dataset.label==element.fieldName){
                element.showEditButton();
            }
        });
    }

    handlemouseleave(event){
        this.template.querySelectorAll(FIELD_COMPONENT).forEach(element=>{
            if(event.target.id.split(HYPEN_SYMBOL)[0] == element.recordId && event.target.dataset.label == element.fieldName){
                element.hideEditButton();
            }
        });
    }

    cancelActions(){
        this.isShowFooter = false;
        this.isEditButtonDisabled = false;
        this.template.querySelectorAll(FIELD_COMPONENT).forEach(element=>element.cancelEdit());
        this.cancelHighlightCell();
    }

    highlightCell(){
        this.template.querySelectorAll(TD_TAG).forEach(element=>{
            if(
                element.id.split(HYPEN_SYMBOL)[0] == this.currentRecordInfo.recordId && 
                element.dataset.label == this.currentRecordInfo.fieldName
            ){
                element.classList.add(EDIT_STYLE);
            }
        });
    }

    cancelHighlightCell(){
        this.template.querySelectorAll(TD_TAG).forEach(element=>{
            if(
                element.id.split(HYPEN_SYMBOL)[0] == this.currentRecordInfo.recordId && 
                element.dataset.label == this.currentRecordInfo.fieldName
            ){
                element.classList.remove(EDIT_STYLE);
            }
        });  
    }

    displayNotification(title, message, variant) {
        const toastEvt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(toastEvt);
    }
}