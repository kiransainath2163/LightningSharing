import LightningDatatable from 'lightning/datatable';

export default class ExtendedDatatable extends LightningDatatable {
  static customTypes = {
    deleteRowButton: {
      template: deleteRow,
      // Provide template data here if needed
      typeAttributes: ['attrA', 'attrB'],
    }
    //more custom types here
  };
}
