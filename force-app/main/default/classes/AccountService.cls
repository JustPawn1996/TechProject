public with sharing class AccountService {
    public static List<Account> getAllAccounts() {
        return [SELECT Name, Rating FROM Account];     
    }
}