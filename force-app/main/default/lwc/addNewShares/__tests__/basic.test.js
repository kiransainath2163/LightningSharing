// createElement is what we'll use to create our component under test
import { createElement } from 'lwc';

// Import module under test by convention <namespace>/<moduleName>
import addNewShares from 'c/addNewShares';
import getSharings from '@salesforce/apex/LightningSharing.getSharings';
import doSOSL from '@salesforce/apex/LightningSharing.doSOSL';

import { registerLdsTestWireAdapter } from '@salesforce/wire-service-jest-util';
import { getRecordUi } from 'lightning/uiRecordApi';

const mockGetRecordUI = require('./data/privateTestObjectRecordUI.json');

describe('loads outer component with data', () => {

  it('loads empty', () => {
    // const getRecordUIWireAdapter = registerLdsTestWireAdapter(getRecordUi);
    const element = createElement('c-add-new-shares', {
      is: addNewShares
    });
    document.body.appendChild(element);

    // there should be action buttons
    const combobox = element.shadowRoot.querySelector(
      'lightning-combobox'
    );
    expect(combobox).toBeTruthy();

    // const buttons = element.shadowRoot.querySelectorAll('lightning-button');
    // expect(buttons).toHaveLength(2);
  });

  it('loads a record from recordUi', async () => {

    const element = createElement('c-add-new-shares', {
      is: addNewShares
    });
    document.body.appendChild(element);

    const getRecordUIWireAdapter = registerLdsTestWireAdapter(getRecordUi);
    await getRecordUIWireAdapter.emit(mockGetRecordUI);

    // const card = element.shadowRoot.querySelector('lightning-card');
    // expect(card.title).toBe('PrivateTestObject__c: 0');
    const combobox = element.shadowRoot.querySelector(
      'lightning-combobox'
    );
    expect(combobox).toBeTruthy();
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });
});
