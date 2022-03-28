public with sharing class AccountController {
    @AuraEnabled (cacheable=true)
    public static List<Account> getAccounts() {
        return AccountService.getAllAccounts();     
    }

    @AuraEnabled
    public static void deleteAccount(Id accountId) { 
        try {   
            delete new Account(Id = accountId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void updateAccount(Id accountId, String field, String value) { 
        try { 
            Map<String, String> valueByFieldName = new Map<String, String>{field=>value};
            Map<Id, Map<String, String>> valueByFieldNameById = new Map<Id, Map<String, String>>{accountId => valueByFieldName};
            SobjectService.updateFeildsValue(valueByFieldNameById);      
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}