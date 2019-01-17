import { LightningElement, api, track, wire } from 'lwc';

import Search from '@salesforce/label/c.Search';
import PublicGroups from '@salesforce/label/c.PublicGroups';
import Roles from '@salesforce/label/c.Roles';
import Users from '@salesforce/label/c.Users';
import For from '@salesforce/label/c.For';
import TooManyResultsMessage from '@salesforce/label/c.TooManyResultsMessage';
import Type3 from '@salesforce/label/c.TooManyResultsMessage';

import getSharings from '@salesforce/apex/LightningSharing.getSharings';
import doSOSL from '@salesforce/apex/LightningSharing.doSOSL';

import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import {
  buttonStyling,
  sharingButtonColumns,
  shareUpdate,
  shareDelete
} from 'c/sharingButtonSupport';

export default class AddNewShares extends LightningElement {
  @api recordId;
  @track label = {
    Search,
    TooManyResultsMessage,
    Type3,
    For
  };
  @track searchString = '';

  get tooManyResults() {
    return this.searchResults.length > 199;
  }

  // call this when you know the sharing table is out of sync
  @api refresh() {
    console.log('addNewShares: refreshing');
    refreshApex(this._refreshable);
  }

  _refreshable;

  types = [
    { value: 'group', label: PublicGroups },
    { value: 'userrole', label: Roles },
    { value: 'user', label: Users }
  ];

  selectedType = 'user';

  columns = [{ label: 'Name', fieldName: 'Name' }].concat(sharingButtonColumns);

  @track searchResults = [];
  @track searchDisabled = false;

  existingShares = [];

  @wire(getSharings, { recordId: '$recordId' })
  wiredSharings(result) {
    this._refreshable = result;
    if (result.error) {
      console.log(result.error);
    } else if (result.data) {
      console.log(JSON.parse(result.data));
      this.existingShares = JSON.parse(result.data);
      this.updateSharingLevelButtons();
    }
  }

  typeChange(event) {
    this.selectedType = event.detail.value;
    console.log(`type is now ${this.selectedType}`);

    // clear the results
    this.searchResults = [];
    // TODO: how clear the search box
  }

  async actuallySearch() {
    console.log('actually searching!');
    this.searchResults = [];
    this.searchDisabled = true;

    const results = JSON.parse(
      await doSOSL({
        searchString: this.searchString,
        objectType: this.selectedType
      })
    );

    console.log(results);
    const finalResults = [];

    results.forEach(result => {
      // make some types a bit nicer
      if (this.selectedType === 'user') {
        result.Name = `${result.Name} (${this.translateTypes(
          result.UserType
        )})`;
      } else if (this.selectedType === 'group') {
        result.Name = `${result.Name} (${this.translateTypes(result.Type)})`;
      }
      finalResults.push(result);
    });

    this.searchResults = finalResults;
    this.updateSharingLevelButtons();
    this.searchDisabled = false;
  }

  searchEventHandler(event) {
    const searchString = event.detail.value
      .trim()
      .replace(/\*/g)
      .toLowerCase();

    if (searchString.length <= 2) {
      return;
    }

    this.searchString = searchString;
  }

  listenForEnter(event) {
    if (event.code === 'Enter') {
      this.actuallySearch();
    }
  }

  updateSharingLevelButtons() {
    const newArray = [];

    this.searchResults.forEach(result => {
      newArray.push({
        ...result,
        ...buttonStyling(result.Id, this.existingShares)
      });
    });

    this.searchResults = newArray;
  }

  async handleRowAction(event) {
    console.log('heard action called');
    console.log(event);
    console.log(JSON.parse(JSON.stringify(event.detail)));

    switch (event.detail.action.name) {
      case 'read':
        try {
          await shareUpdate(event.detail.row.Id, this.recordId, 'Read');
          this.refresh();
        } catch (e) {
          this.toastTheError(e, 'shareUpdate-read');
        }
        break;
      case 'read_write':
        try {
          await shareUpdate(event.detail.row.Id, this.recordId, 'Edit');
          this.refresh();
        } catch (e) {
          this.toastTheError(e, 'shareUpdate-edit');
        }
        break;
      case 'none':
        try {
          await shareDelete(event.detail.row.Id, this.recordId);
          this.refresh();
        } catch (e) {
          this.toastTheError(e, 'shareUpdate-edit');
        }
    }
  }

  translateTypes(userType) {
    if (userType === 'PowerCustomerSuccess') {
      return 'Customer + Sharing';
    } else if (userType === 'PowerPartner') {
      return 'Partner';
    } else if (userType === 'CustomerSuccess') {
      return 'Customer';
    } else if (userType === 'CsnOnly') {
      return 'Chatter';
    } else if (userType === 'CSPLitePortal') {
      return 'High Volume Customer';
    } else {
      return userType;
    }
  }

  toastTheError(e, source) {
    console.error(source, e);
    this.dispatchEvent(
      new ShowToastEvent({
        message: e.body.message,
        variant: 'error'
      })
    );
  }
}
