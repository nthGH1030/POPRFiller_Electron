import {extractDataFromExcel, readExcelFile, extractDataFromPOPR} from '../utils/readFile.js';
import { toArrayBuffer } from '../utils/Parser_toArrayBuffer.js';
import fs from 'fs';
import path from 'path';

describe ('Test for invalid input', () => {
    let buffer;
    let bufferArray;

    beforeAll(async ()=> {
    
        const masterTablePath = path.join(__dirname, '../demoTemplate/Central record_demo.xlsx');
        buffer = await fs.promises.readFile(masterTablePath);
        bufferArray = toArrayBuffer(buffer);
    })

    // Assuming readExcelFile is adjusted to accept a buffer or workbook, not just a path
    test('read an non-existent worksheet', async () => {
        const sheet = 'Non-existing worksheet';
        await expect(
            readExcelFile(bufferArray, sheet)).rejects.toThrow(
                TypeError(`Invalid sheet: ${sheet}`));
    });

    //Test if row number is invalid
    test ('throw an error for invalid row number' , async () => {

        const row = 'InvalidRow'

        await expect (
            extractDataFromExcel(bufferArray, row)).rejects.toThrow(
                TypeError(`The row input: ${row} is not a number`)
            );
    });
})

describe ('read and return correct data from excel table', () => {

    let buffer
    let bufferArray
    let worksheet
    let poBuffer
    let poWorksheet

    beforeAll(async ()=> {
    
        const centralTablePath = path.join(__dirname, '../demoTemplate/Central record_demo.xlsx');
        buffer = await fs.promises.readFile(centralTablePath);
        bufferArray = toArrayBuffer(buffer);
        worksheet = await readExcelFile(bufferArray, 'POPR summary');

        const POtemplatePath = path.join(__dirname, '../demoTemplate/template PO_demo.xlsx');
        poBuffer = await fs.promises.readFile(POtemplatePath);
        bufferArray = toArrayBuffer(poBuffer);
        poWorksheet = await readExcelFile(bufferArray, 'PO_Input');
    })

    //Test the return key value pairs of a standard PO row 
    test('read and return correct key value pairs in row 5 of test template', async() => {

        const row = 5
        const date = new Date('2025-01-20');
        const data = {
            '#Key_Row': "",
            'Bundle': 'Project X',
            'Entity': 'Get Rich Fast Limited',
            'PO Number': 'A0123456789',
            'Vendor': 'PaymeNow Limited',
            'Type of expense': 'Capex',
            'Capex Nature': 'Soft Cost',
            'Purchase description / Payment Certification reason': 'Additional Consultancy service from GetRich Fast Limited',
            'Approved PO amount': 150000,
            'PO Change Request': 50000,
            'PO Change Request Date': date,
            'Total Payment paid': '',
            'Paid Requested': 'N/A',
            'Delivery date': 'N/A',
            'Invoice number': 'N/A'
        }

        await expect(Promise.resolve(extractDataFromExcel(worksheet,row))).resolves.toStrictEqual(
            data
        )
    })
    /*
    //Test the data written in a PO to see if it match
    test('read a PO written with data and check with the expected value using row 5' , async() => {
        const row = 5
        const date = new Date('2025-01-20')
        const data = {
            '#Key_Row': "",
            'Bundle': 'Project X',
            'Entity': 'Get Rich Fast Limited',
            'PO Number': 'A0123456789',
            'Vendor': 'PaymeNow Limited',
            'Type of expense': 'Capex',
            'Capex Nature': 'Soft Cost',
            'Purchase description / Payment Certification reason': 'Additional Consultancy service from GetRich Fast Limited',
            'Approved PO amount': 150000,
            'PO Change Request': 50000,
            'PO Change Request Date': date,
            'Total Payment paid': '',
            'Paid Requested': 'N/A',
            'Delivery date': 'N/A',
            'Invoice number': 'N/A'
        }
        await expect(Promise.resolve(extractDataFromPOPR(poWorksheet))).resolves.toStrictEqual(
            data
        )
    })
        */

})

    
