import { Component, OnInit } from '@angular/core';

import { TransferService } from '../../services/transfer.service';

@Component({
    selector: 'act',
    templateUrl: './act.component.html',
    styleUrls: ['./act.component.less']
})
export class ActComponent implements OnInit {
    poorlyFormattedLines: Array<string[]> = [];
    lines: Array<string[]> = [];
    inactiveLines: Array<string[]> = [];

    constructor(
        private transfer: TransferService
    ) { }

    ngOnInit() {
        // TODO: add checks to make sure there is a transfer.rawInput and transfer.delimiter
        this.prepareInput();
    }

    private getLines() {
        /* Find each line of the input and make sure the input is reasonable. */
        let lines = this.transfer.rawInput.trim().split('\n');

        if (lines.length < 2) {
            // TODO: add a message here
            console.log('Found to few lines');
            return false;
        } else if (lines.length > 3000) {
            let confirmation = confirm("There are a lot of lines in the text (" + lines.length + " of them). Working with this many lines may slow your browser down.\n\nDo you want to continue?");
            if (!confirmation) {
                return false;
            }
        }

        return lines;
    }

    private findExpectedLength(lines: string[]) {
        /* Try to make a reasonable guess as to the expected length of each line when it is split by the delimiter. To do this, I'm using the first three lines. */
        let expectedLength: number;
        let l0 = lines[0].split(this.transfer.delimiter).length;
        let l1 = lines[1].split(this.transfer.delimiter).length;
        let l2 = lines[2].split(this.transfer.delimiter).length;

        if (l0 === l1 && l0 === l2) {
            expectedLength = l0;
        } else if (l1 === l2) {
            expectedLength = l1;
        } else if (l0 === l2) {
            expectedLength = l0
        } else {
            // TODO: add a message here
            console.log('Unable to make a good prediction on the expected length of the input based on the first three lines');
        }

        return expectedLength;
    }

    private splitLines(lines: string[]) {
        /* Split each line on the delimiter and make sure everything looks correct. */
        let expectedLength = this.findExpectedLength(lines);

        for (var i = lines.length - 1; i >= 0; i--) {
            let lineArray = lines[i].split(this.transfer.delimiter);
            if (lineArray.length !== expectedLength) {
                this.poorlyFormattedLines.push(lineArray)
            } else {
                this.lines.push(lineArray);
            }
        }
    }

    prepareInput() {
        let lines = this.getLines();
        if (lines) {
            this.splitLines(lines);
        } else {
            // TODO: do something here...
        }
    }

}
