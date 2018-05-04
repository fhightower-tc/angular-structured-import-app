import { Component, OnInit } from '@angular/core';

import { MainComponent } from '../../main.component';
import { TransferService } from '../../services/transfer.service';

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

@Component({
    selector: 'import',
    templateUrl: './import.component.html',
    styleUrls: ['./import.component.less']
})
export class ImportComponent implements OnInit {
    delimiter: string = '';
    rawInput: string = '';
    findValue: string = '';
    replaceValue: string = '';

    constructor(
        private main: MainComponent,
        private transfer: TransferService
    ) { }

    ngOnInit() {
    }

    findAndReplace() {
        /* Find all instances of the "findValue" and replace it with the "replaceValue". */
        if (this.findValue === "") {
            // TODO: add a message here...
            console.error("No find value given");
            return;
        }

        this.rawInput = replaceAll(this.rawInput, this.findValue, this.replaceValue);
        // TODO: add a message that the replacement has worked
    }

    submit() {
        this.transfer.rawInput = this.rawInput;
        this.transfer.delimiter = this.delimiter;
        this.main.goTo('act');
    }

}
