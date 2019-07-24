# cleanup
rm -rf src && \
# deploy to the package org
sfdx force:source:convert -d src -r force-app && \
sfdx force:mdapi:deploy -d src -u ltngSharingPkg -w 60 -l RunAllTestsInOrg && \

# create a new package version there
sfdx force:package1:version:create -u ltngSharingPkg --packageid 03346000000L5gS -n "Summer19" -r "https://salesforce.quip.com/AJeQA2j2bMw5" -p "https://salesforce.quip.com/AJeQA2j2bMw5" -m -w 60 -d "components for record page and communities"

rm -rf src

# deploy to the QA org for security review
# sfdx force:org:create -f config/project-scratch-def.json -n -a shareTestOrg -d 30 -w 30

sfdx force:package:install --package 04t46000001wr6nAAA -b 60 -w 60 -u shane@ltngsharing.qa

# sfdx force:source:convert -d testSrc -r implementation
# sfdx force:mdapi:deploy -d testSrc -u shareTestOrg -w 60 -l RunAllTestsInOrg

# sfdx force:user:permset:assign -n TestingPerms -u shareTestOrg

# sfdx force:data:tree:import -f data/PrivateTestObject__c.json -u shareTestOrg
# sfdx force:data:tree:import -f data/ReadOnlyTestObject__c.json -u shareTestOrg

# sfdx force:user:password:generate -u shareTestOrg
# sfdx force:user:create generatepassword=true FirstName=Test LastName=Privilege permsets=TestingPerms profileName="Standard User" -u shareTestOrg

# rm -rf testSrc
