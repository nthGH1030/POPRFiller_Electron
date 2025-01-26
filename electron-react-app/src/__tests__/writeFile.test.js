import {extractDataFromExcel, readFile, readExcelFile, extractDataFromPOPR} from '../utils/readFile.js';
import {writePOPR} from '../utils/writeFile.js';
import { toArrayBuffer } from '../utils/Parser_toArrayBuffer.js';
import fs from 'fs';
import path from 'path';

//test for handle PO

//test if data are indeed written in the correct cell
//Write a template PO with a predefined data, read the PO and check if the input are written match


describe('Test writePOPR to write correct data in PO' , () => {
    let writtenData
    let staff;

    beforeAll( async () => {

        // Mock localStorage for the value of 'staff'
        const localStorageMock = (() => {
        let localStorage = {};
        return {
          getItem: jest.fn((key) => localStorage[key] || null),
          setItem: jest.fn((key, value) => {
            localStorage[key] = value.toString();
          }),
          removeItem: jest.fn((key) => {
            delete localStorage[key];
          }),
          clear: jest.fn(() => {
            localStorage = {};
          })
        };
      })();

        Object.defineProperty(global, 'localStorage', { value: localStorageMock });
        localStorage.setItem('staff', 'John Doe');
        staff = localStorage.getItem('staff');
        console.log('localStorage staff:', localStorage.getItem('staff'));

        //extract data to ready to write into file
        const centralTablePath = path.join(__dirname, '../demoTemplate/Central record_demo.xlsx');
        const buffer = await fs.promises.readFile(centralTablePath);
        const bufferArray = toArrayBuffer(buffer);
        const worksheet = await readExcelFile(bufferArray, 'POPR summary');
        const row = 5;
        const extractedObj = await extractDataFromExcel(worksheet, row);

        //write data into file
        const templatePath = path.join(__dirname, '../demoTemplate/template PO_demo.xlsx');
        const templateBuffer = await fs.promises.readFile(templatePath);
        const tempalteBufferArray = toArrayBuffer(templateBuffer);
        const templateWorksheet = await readExcelFile(tempalteBufferArray, 'PO_Input')
        
        const {filename: outputFilename, buffer: fileWritten} = 
            await writePOPR(extractedObj, templateWorksheet, 'PO')

        //read the data in the file written
        const fileWrittenBufferArray = toArrayBuffer(fileWritten);
        const fileWrittenWorksheet = await readExcelFile(fileWrittenBufferArray, 'PO_Input')
        writtenData = await extractDataFromPOPR(fileWrittenWorksheet)

    })

    afterAll(() => {
        // Restore the original localStorage implementation
        jest.restoreAllMocks();
      });
    
    
    test('Write a PO with correct data', async() => {
        console.log('Test staff:', staff); // Debugging statement
        const date = new Date('2025-01-20');
        const matchData = {
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
            'Invoice number': 'N/A',
            'staff': staff,
        }

        await expect(Promise.resolve(writtenData)).resolves.toStrictEqual(matchData)
    })
})
/*
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