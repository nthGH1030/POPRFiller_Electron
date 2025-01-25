import {extractDataFromExcel, readFile, readExcelFile, extractDataFromPOPR} from '../utils/readFile.js';
import {writePO, writePR} from '../utils/writeFile.js';
import { toArrayBuffer } from '../utils/Parser_toArrayBuffer.js';
import fs from 'fs';
import path from 'path';

//test for handle PO

//test if data are indeed written in the correct cell
//Write a template PO with a predefined data, read the PO and check if the input are written match

/*
describe('Test writePO to write correct data in excel' , () => {
    let writtenData

    beforeAll( async () => {
        //extract data to ready to write into file
        const masterTablePath = path.join(__dirname, '../secrets/Master table_test.xlsx');
        const buffer = await fs.promises.readFile(masterTablePath);
        const bufferArray = toArrayBuffer(buffer);
        const worksheet = await readExcelFile(bufferArray, 'POPR summary');
        const row = 24;
        const data = await extractDataFromExcel(worksheet, row);

        //write data into file
        const templatePath = path.join(__dirname, '../secrets/test_template_PO.xlsx');
        const templateBuffer = await fs.promises.readFile(templatePath);
        const tempalteBufferArray = toArrayBuffer(templateBuffer);
        const templateWorksheet = await readExcelFile(tempalteBufferArray, 'PO_Input')
        
        const {filename, buffer: fileWritten} = await writePO(data, templateWorksheet)

        //read the data in the file written
        const fileWrittenBufferArray = toArrayBuffer(fileWritten);
        const fileWrittenWorksheet = await readExcelFile(fileWrittenBufferArray, 'PO_Input')
        writtenData = await extractDataFromPOPR(fileWrittenWorksheet)

    })
    

    test('Write a PO with correct data', async() => {
        
        const matchData = {
            'PO Number': 'TestingPoNumber2',
            'Entity': 'Test Venue (Get Rich Quick Limited)',
            'Description of purchase': 'Testing Purchase Description',
            'Type of expenses': 'Capex',
            'Capex Nature': 'Soft Cost',
            'Amount': 100000,
            'Vendor': 'Get Rich Quick Limited',
            'Staff': '',
            'Change': '',
            'Change Date': ''
        }

        await expect(Promise.resolve(writtenData)).resolves.toStrictEqual(matchData)
    })
})

describe('Test writePR to write correct data in excel', () => {
    let writtenData

    beforeAll (async () => {
        //extract data to ready to write into file
        const masterTablePath = path.join(__dirname, '../secrets/Master table_test.xlsx');
        const buffer = await fs.promises.readFile(masterTablePath);
        const bufferArray = toArrayBuffer(buffer);
        const worksheet = await readExcelFile(bufferArray, 'POPR summary');
        const row = 25;
        const data = await extractDataFromExcel(worksheet, row);

        //write data into file
        const templatePath = path.join(__dirname, '../secrets/test_template PR.xlsx');
        const templateBuffer = await fs.promises.readFile(templatePath);
        const tempalteBufferArray = toArrayBuffer(templateBuffer);
        const templateWorksheet = await readExcelFile(tempalteBufferArray, 'PR_Input')

        const {filename, buffer: fileWritten} = await writePR(data, templateWorksheet)

        //read the data in the file written
        const fileWrittenBufferArray = toArrayBuffer(fileWritten);
        const fileWrittenWorksheet = await readExcelFile(fileWrittenBufferArray, 'PR_Input')
        writtenData = await extractDataFromPOPR(fileWrittenWorksheet)
        console.log('PR' ,writtenData)
    })

     test('Write a PR with correct data',async () => {
        const matchData = {
            'PO Number': 'TestingPoNumber2',
            'Entity': 'Test Venue (Get Rich Quick Limited)',
            'Description of purchase': 'Testing Purchase Description - Interim payment 1',
            'Payment Requested': 100000,
            'Invoice Delivery Date': '2024-01-08T00:00:00.000Z',
            'Invoice Number': '013245',
            'Type of expenses': 'Capex',
            'Capex Nature': 'Soft Cost',
            'Cumulative payment': 100000,
            'PO Amount': 100000,
            'Vendor': 'Get Rich Quick Limited',
            'Staff': '',
        }
        //handle date format
        matchData['Invoice Delivery Date'] = new Date(matchData['Invoice Delivery Date'])

        await expect(Promise.resolve(writtenData)).resolves.toStrictEqual(matchData)

     })
})

*/