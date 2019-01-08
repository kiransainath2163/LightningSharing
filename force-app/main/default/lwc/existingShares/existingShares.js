import { LightningElement, api, wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

import getSharings from '@salesforce/apex/LightningSharing.getSharings';

import {
  buttonStylingSingle,
  sharingButtonColumns,
  shareUpdate,
  shareDelete
} from 'c/sharingButtonSupport';

export default class ExistingShares extends NavigationMixin(LightningElement) {
  @api recordId;
  @track tableData = [];

  // call this when you know the sharing table is out of sync
  @api refresh() {
    console.log('ExistingShares: refreshing');
    refreshApex(this._refreshable);
  }

  _refreshable;

  constructor() {
    super();
    this.columns = [
      { label: 'User or Group', fieldName: 'UserOrGroupType' },
      { label: 'Type', fieldName: 'SubType' },
      {
        label: 'Name',
        type: 'button',
        typeAttributes: {
          label: {
            fieldName: 'UserOrGroupName'
          },
          name: 'view',
          variant: 'base'
        }
      },
      { label: 'Reason', fieldName: 'RowCause' },
      { label: 'Access Level', fieldName: 'AccessLevel' }
    ].concat(sharingButtonColumns);
  }

  @wire(getSharings, { recordId: '$recordId' })
  wiredSharings(result) {
    this._refreshable = result;
    if (result.error) {
      console.log(result.error);
    } else if (result.data) {
      const sharings = JSON.parse(result.data);
      console.log('ExistingShares: sharing updated', sharings);
      const newArray = [];
      sharings.forEach(sharing => {
        newArray.push({
          ...sharing,
          ...buttonStylingSingle(sharing)
        });
      });
      this.tableData = newArray;
    }
  }

  async handleRowAction(event) {
    console.log('heard action called');
    console.log(event);
    console.log(JSON.parse(JSON.stringify(event.detail)));

    switch (event.detail.action.name) {
      case 'view':
        this.viewRecordRouter(event.detail.row);
        break;
      case 'none':
        // await this.deleteShare(event.detail.row);
        await shareDelete(event.detail.row.UserOrGroupID, this.recordId);
        this.refresh();
        break;
      case 'read':
        await shareUpdate( event.detail.row.UserOrGroupID, this.recordId, 'Read' );
        this.refresh();
        // await this.updateShares(event.detail.row, 'Read');
        break;
      case 'read_write':
        // await this.updateShares(event.detail.row, 'Edit');
        await shareUpdate( event.detail.row.UserOrGroupID, this.recordId, 'Edit' );
        this.refresh();
        break;
    }

    // options for the actions
  }

  viewRecordRouter(row) {
    if (row.UserOrGroupType === 'User') {
      this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
          recordId: row.UserOrGroupID,
          actionName: 'view'
        }
      });
    } else if (row.UserOrGroupType === 'Group') {
      console.error('group routing not implemented yet');
    }
  }

  // async deleteShare(row) {
  //   try {
  //     const apexResults = await deletePerm({
  //       UserOrGroupID: row.UserOrGroupID,
  //       recordId: this.recordId
  //     });
  //     console.log(apexResults);
  //     // return refreshApex(this._refreshable);
  //     this.refresh();
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  // async updateShares(row, level) {
  //   try {
  //     const apexResults = await upsertPerm({
  //       UserOrGroupID: row.UserOrGroupID,
  //       recordId: this.recordId,
  //       level
  //     });
  //     console.log(apexResults);
  //     this.refresh();
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }
}
