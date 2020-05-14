declare module "@salesforce/apex/ltngsharing.LightningSharing.canIEditPerms" {
  export default function canIEditPerms(param: {recordId: any}): Promise<any>;
}
declare module "@salesforce/apex/ltngsharing.LightningSharing.deletePerm" {
  export default function deletePerm(param: {UserOrGroupID: any, recordId: any}): Promise<any>;
}
declare module "@salesforce/apex/ltngsharing.LightningSharing.upsertPerm" {
  export default function upsertPerm(param: {UserOrGroupID: any, recordId: any, level: any}): Promise<any>;
}
declare module "@salesforce/apex/ltngsharing.LightningSharing.doSOSL" {
  export default function doSOSL(param: {searchString: any, objectType: any}): Promise<any>;
}
declare module "@salesforce/apex/ltngsharing.LightningSharing.getSharings" {
  export default function getSharings(param: {recordId: any}): Promise<any>;
}
