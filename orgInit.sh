sfdx force:org:create -a ltngshare -f config/project-scratch-def.json -s -d 1
sfdx force:source:push
sfdx force:user:permset:assign -n TestingPerms

# create some records
sfdx force:data:tree:import -f data/PrivateTestObject__c.json
sfdx force:data:tree:import -f data/ReadOnlyTestObject__c.json

sfdx force:user:password:generate
sfdx force:org:open