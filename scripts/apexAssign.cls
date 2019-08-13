user u = [select id, userroleid from user where firstname = 'Security'];
PrivateTestObject__c pto = [select id from PrivateTestObject__c where name = '3'];

PrivateTestObject__Share share = new PrivateTestObject__Share();
share.ParentId = pto.Id;
share.AccessLevel = 'edit';
share.UserOrGroupId = u.Id;
share.rowCause = Schema.PrivateTestObject__Share.RowCause.Because__c;


insert share;