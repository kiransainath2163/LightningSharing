import { LightningElement, api } from 'lwc';

export default class MobileButtonGroup extends LightningElement {
    @api row;

    async tileNoneHandler() {
        this.dispatchEvent(
            new CustomEvent('rowaction', this.generateEvent('none'))
        );
    }

    async tileReadHandler() {
        this.dispatchEvent(
            new CustomEvent('rowaction', this.generateEvent('read'))
        );
    }

    async tileReadWriteHandler() {
        this.dispatchEvent(
            new CustomEvent('rowaction', this.generateEvent('read_write'))
        );
    }

    generateEvent(actionType) {
        return {
            detail: {
                row: this.row,
                action: {
                    name: actionType
                }
            }
        };
    }
}
