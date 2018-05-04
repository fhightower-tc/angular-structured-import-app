import { Injectable } from '@angular/core';

@Injectable()
export class TransferService {
    rawInput: string = '';
    delimiter: string = '';
    ignoreFirstLine: boolean = false;

    constructor() { }

}
