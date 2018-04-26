import { Component, OnInit } from '@angular/core';

import { MainComponent } from '../../main.component';
import { TransferService } from '../../services/transfer.service';

@Component({
    selector: 'import',
    templateUrl: './import.component.html',
    styleUrls: ['./import.component.less']
})
export class ImportComponent implements OnInit {
    delimiter: string = '';
    rawInput: string = '';

    constructor(
        private main: MainComponent,
        private transfer: TransferService
    ) { }

    ngOnInit() {
    }

    submit() {
        this.transfer.rawInput = this.rawInput;
        this.transfer.delimiter = this.delimiter;
        this.main.goTo('act');
    }

}
