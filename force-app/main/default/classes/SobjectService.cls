public with sharing class SobjectService {
    public static void updateFeildsValue(Map<Id, Map <String, String>> valueByFieldNameById) {
        List<Sobject> sobjectsForUpdate = new List<Sobject>();
        for(Id sobjectId : valueByFieldNameById.keySet()){
            Sobject sobj = sobjectId.getSObjectType().newSObject(sobjectId);
            for(String fieldName : valueByFieldNameById.get(sobjectId).keySet()){
                sobj.put(fieldName, valueByFieldNameById.get(sobjectId).get(fieldName));
            }
            sobjectsForUpdate.add(sobj);
        }
        update sobjectsForUpdate;
    }
}
