sfdx force:org:create -a ltngshare -f config/project-scratch-def.json -s -d 1
sfdx force:mdapi:deploy -d experienceBundlePilot -w 20
sfdx shane:github:src:install -g mshanemc -r community-boilerplate -p force-app/main/default -c

# for mobile
sfdx force:user:password:generate


sfdx force:source:push -f
sfdx force:user:permset:assign -n TestingPerms

sfdx force:apex:execute -f scripts/roleAssign.cls 
sfdx force:apex:execute -f scripts/communityUserCreate.cls 

# create some records
sfdx force:data:tree:import -f data/PrivateTestObject__c.json
sfdx force:data:tree:import -f data/ReadOnlyTestObject__c.json

# for security testing
sfdx force:user:create generatepassword=true FirstName=Test LastName=Privilege permsets=TestingPerms profileName="Standard User"

sfdx force:org:open