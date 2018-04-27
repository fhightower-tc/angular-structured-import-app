import { Component, OnInit } from '@angular/core';

import { TcIndicatorService } from 'threatconnect-ng';

import { TransferService } from '../../services/transfer.service';

declare var $:any;

@Component({
    selector: 'act',
    templateUrl: './act.component.html',
    styleUrls: ['./act.component.less']
})
export class ActComponent implements OnInit {
    poorlyFormattedLines: Array<string[]> = [];
    // TODO: rename this to "activeLines"
    activeLines: Array<string[]> = [];
    inactiveLines: Array<string[]> = [];
    owner: string = '';

    constructor(
        private transfer: TransferService,
        private indicators: TcIndicatorService
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
        // TODO: consider adding a check for the number of rows

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
                this.activeLines.push(lineArray);
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

    private createIndicator(indicator, indicatorType, tags, attributes, fileSize, fileName) {
        /* Create an indicator with the given metadata. */
        // create the indicator
        this.indicators.createIndicator(indicator, this.owner);

        // add tags
        for (var i = tags.length - 1; i >= 0; i--) {
            this.indicators.addTag(tags[i], indicatorType, indicator, this.owner);
        }

        // add attributes
        for (var i = attributes.length - 1; i >= 0; i--) {
            this.indicators.createAttribute(attributes[i].type, attributes[i].value, attributes[i].displayed, indicatorType, indicator, this.owner);
        }

        // TODO: implement handling for file size and file occurrences
    }

    createContent() {
        /* Create content in ThreatConnect. */
        // make sure there is an owner
        if (this.owner === '') {
            // TODO: add a message here...
            console.log("No owner given");
            return;
        }

        let mappings: string[] = [];
        $('select').each(function() {
            mappings.push($(this).val());
        });

        let additionalInputs = [];
        $('.supplementalInput').each(function() {
            additionalInputs.push($(this).val());
        });

        for (var row = this.activeLines.length - 1; row >= 0; row--) {
            let tags: string[] = [];
            let attributes: Array<{
                type: string;
                value: string;
                displayed?: boolean;
            }> = [];
            let fileSize: string = '';
            let fileName: string = '';
            let indicatorType: string = '';
            let indicator: string = '';

            // iterate through each of the columns
            for (var column = mappings.length - 1; column >= 0; column--) {
                switch(mappings[column]) {
                    case 'tag': {
                        tags.push(this.activeLines[row][column]);
                        break;
                    }
                    case 'attribute': {
                        let attributeType = additionalInputs[column];
                        if (attributeType === '') {
                            // TODO: add a message here
                            console.log('No attribute type given');
                        } else {
                            attributes.push({
                                type: attributeType,
                                value: this.activeLines[row][column],
                                displayed: true
                            });
                        }
                        break;
                    }
                    case 'fileSize': {
                        fileSize = this.activeLines[row][column];
                        break;
                    }
                    case 'fileName': {
                        fileName = this.activeLines[row][column];
                        break;
                    }
                    default: {
                        /* This handles any indicator types. */
                        // if the indicator type has already been specified, show a warning that we can currently only handle one indicator type
                        if (indicatorType !== '') {
                            // TODO: add message
                            console.log("Can't handle more than one indicator type");
                        }
                        indicatorType = mappings[column];
                        break;
                    }
                }
            }

            if (indicatorType === '') {
                // TODO: add a message here
                console.log('You need to specify an indicator type');
                return;
            }

            this.createIndicator(indicator, indicatorType, tags, attributes, fileSize, fileName);
        }
    }

    private findEntry(entry, array) {
        /* Return the index of the given entry in the given list. */
        for (var i = array.length - 1; i >= 0; i--) {
            let broken: boolean = false;
            for (var j = entry.length - 1; j >= 0; j--) {
                if (entry[j] !== array[i][j]) {
                    broken = true;
                    break;
                }
            }

            if (!broken) {
                return i;
            }
        }

        return null;
    }

    changeActiveStatus(entry, makeActive) {
        if (makeActive) {
            let entryIndex = this.findEntry(entry, this.inactiveLines);
            this.inactiveLines.splice(entryIndex, 1);
            this.activeLines.push(entry);
        } else {
            let entryIndex = this.findEntry(entry, this.activeLines);
            this.activeLines.splice(entryIndex, 1);
            this.inactiveLines.push(entry);
        }
    }

}
