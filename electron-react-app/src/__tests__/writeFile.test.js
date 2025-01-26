import {extractDataFromExcel, readFile, readExcelFile, extractDataFromPOPR} from '../utils/readFile.js';
import {writePOPR} from '../utils/writeFile.js';
import { toArrayBuffer } from '../utils/Parser_toArrayBuffer.js';
import fs from 'fs';
import path from 'path';

//test for handle PO

//test if data are indeed written in the correct cell
//Write a template PO with a predefined data, read the PO and check if the input are written match

let writtenData
let staff

async function writeTestPOPR(row) {
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
    //const row = 5;
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
}

describe('Test writePOPR to write correct data in PO' , () => {


    beforeAll( async () => {
       
       await writeTestPOPR(5)

    })

    afterAll(() => {
        // Restore the original localStorage implementation
        jest.restoreAllMocks();
      });
    
    
    test('Write a PO with correct data', async() => {

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

describe('Test writePR to write correct data in excel', () => {

    beforeAll( async () => {
        await writeTestPOPR(8)
     })
     afterAll(() => {
         // Restore the original localStorage implementation
         jest.restoreAllMocks();
       });
       
     test('Write a PR with correct data', async() => {
        const date = new Date('2025-01-15')
        const matchData = {
             '#Key_Row': "",
             'Bundle': 'Project X',
             'Entity': 'Get Rich Fast Limited',
             'PO Number': 'A0123456789',
             'Vendor': 'PaymeNow Limited',
             'Type of expense': 'Capex',
             'Capex Nature': 'Soft Cost',
             'Purchase description / Payment Certification reason': 'Payment upon 100% completion of service',
             'Approved PO amount': 100000,
             'PO Change Request': "",
             'PO Change Request Date': "",
             'Total Payment paid': 100000,
             'Paid Requested': 75000,
             'Delivery date': date,
             'Invoice number': 'Inv_02',
             'staff': staff,
         }
 
         await expect(Promise.resolve(writtenData)).resolves.toStrictEqual(matchData)
     })
 
 })
 