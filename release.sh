# cleanup
rm -rf src && \
# deploy to the package org
sfdx force:source:convert -d src -r force-app && \
sfdx force:mdapi:deploy -d src -u ltngSharingPkg -w 60 -l RunAllTestsInOrg && \

# create a new package version there
sfdx force:package1:version:create -u ltngSharingPkg --packageid 03346000000L5gS -n "Spring19" -r "https://salesforce.quip.com/AJeQA2j2bMw5" -p "https://salesforce.quip.com/AJeQA2j2bMw5" -m -w 60 -d "spring19, built on LWC. Lots of fixes"

# deploy to the QA org for security review
# sfdx force:package:install --package [package Id from above]  -p 60 -w 60 -u ltngShareQA
rm -rf src