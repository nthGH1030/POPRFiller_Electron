import {extractDataFromExcel, readExcelFile} from '../utils/readFile.js';
import { toArrayBuffer } from '../utils/Parser_toArrayBuffer.js';
import fs from 'fs';
import path from 'path';

describe ('Test for invalid input', () => {
    let buffer;
    let bufferArray;

    beforeAll(async ()=> {
    
        const masterTablePath = path.join(__dirname, '../secrets/Master table_test.xlsx');
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
    /*
    //Test if excel is malformed
    test('read an corrupted excel file', async() => {
        const corruptedExcelPath = path.join(__dirname, '../secrets/test_corrupted_excel.xlsx');
        const sheet = 'non-existing-worksheet';

        buffer = await fs.promises.readFile(corruptedExcelPath);
        bufferArray = toArrayBuffer(buffer);

        await expect(
            readExcelFile(bufferArray, sheet)).rejects.toThrow(
                TypeError('The file passed in is not a buffer Array'));
    })
    */
})

describe ('read and return correct data from excel table', () => {

    let buffer
    let bufferArray
    let worksheet

    beforeAll(async ()=> {
    
        const centralTablePath = path.join(__dirname, '../demoTemplate/Central record_demo.xlsx');
        buffer = await fs.promises.readFile(centralTablePath);
        bufferArray = toArrayBuffer(buffer);
        worksheet = await readExcelFile(bufferArray, 'POPR summary');
    })

    //Test the return key value pairs of a standard PO row 
    test('read and return correct key value pairs in row 14 of test template', async() => {

        const row = 14
        const date = Date.parse('2025-01-20')
        const data = {
            'Bundle': 'Project X',
            'Entity': 'Get Rich Fast Limited',
            'PO Number': 'A0123456789',
            'Vendor': 'PaymeNow Limited',
            'Type of expense': 'Capex',
            'Capex Nature': 'Soft Cost',
            'Purchase description / Payment Certification reason': 'Consultancy service from GetRich Fast Limited',
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
    //Test the return key value pairs of a PO revision
    test('read and return correct key value pairs in row 14 of test template', async() => {

        const row = 14

        const data = {
            'Bundle': 'Project testing1',
            'Entity': 'Test Location (Get Rich Fast Limited)',
            'PO Number': 'TestingPoNumber-R1',
            'Vendor': 'Get Rich Fast Limited',
            'Type of expense': 'Capex',
            'Capex Nature': 'Hard Cost',
            'Purchase description / Payment Certification reason': 'Testing Purchase Description',
            'Approved PO amount': 350000,
            'PO Change Request': 50000,
            'PO Change Request Date': "2024-05-08T00:00:00.000Z",
            'Total Payment paid': 'N/A',
            'Paid Requested': 'N/A',
            'Delivery date': 'N/A',
            'Invoice number': 'N/A'
        }
        //handle date format
        data['PO Change Request Date'] = new Date(data['PO Change Request Date'])
        
        await expect(Promise.resolve(extractDataFromExcel(worksheet,row))).resolves.toStrictEqual(
            data
        )
    })

        //Test the return key value pairs of a PO revision
        test('read and return correct key value pairs in row 15 of test template', async() => {

            const row = 15
    
            const data = {
                'Bundle': 'Project testing1',
                'Entity': 'Test Location (Get Rich Fast Limited)',
                'PO Number': 'TestingPoNumber-R2',
                'Vendor': 'Get Rich Fast Limited',
                'Type of expense': 'Capex',
                'Capex Nature': 'Hard Cost',
                'Purchase description / Payment Certification reason': 'Testing Purchase Description',
                'Approved PO amount': 550000,
                'PO Change Request': 200000,
                'PO Change Request Date': "2024-09-08T00:00:00.000Z",
                'Total Payment paid': 'N/A',
                'Paid Requested': 'N/A',
                'Delivery date': 'N/A',
                'Invoice number': 'N/A'
            }
            //handle date format
            data['PO Change Request Date'] = new Date(data['PO Change Request Date'])
            
            await expect(Promise.resolve(extractDataFromExcel(worksheet,row))).resolves.toStrictEqual(
                data
            )
        })
    
    


    //Test the return key value pairs of a PR
    test('read and return correct key value pairs in row 16 of test template', async() => {

        const row = 16

        const data = {
            Bundle: 'Project testing1',
            Entity: 'Test Location (Get Rich Fast Limited)',
            'PO Number': 'TestingPoNumber',
            Vendor: 'Get Rich Fast Limited',
            'Type of expense': 'Capex',
            'Capex Nature': 'Hard Cost',
            'Purchase description / Payment Certification reason': 'Testing Purchase Description - Interim payment 1',
            'Approved PO amount': 450000,
            'PO Change Request': '',
            'PO Change Request Date': '',
            'Total Payment paid': 10000,
            'Paid Requested': 10000,
            'Delivery date': '2024-01-08T00:00:00.000Z',
            'Invoice number': '006537'
        }
        //handle date format
        data['Delivery date'] = new Date(data['Delivery date'])
        
        await expect(Promise.resolve(extractDataFromExcel(worksheet,row))).resolves.toStrictEqual(
            data
        )
    })

    //Test the return key value pairs of a PR - 2
    test('read and return correct key value pairs in row 17 of test template', async() => {
        const row = 17

        const data = {
            'Bundle': 'Project testing1',
            'Entity': 'Test Location (Get Rich Fast Limited)',
            'PO Number': 'TestingPoNumber',
            'Vendor': 'Get Rich Fast Limited',
            'Type of expense': 'Capex',
            'Capex Nature': 'Hard Cost',
            'Purchase description / Payment Certification reason': 'Testing Purchase Description - Interim payment 2',
            'Approved PO amount': 450000,
            'PO Change Request': '',
            'PO Change Request Date': '',
            'Total Payment paid': 110000,
            'Paid Requested': 100000,
            'Delivery date': '2024-01-24T00:00:00.000Z',
            'Invoice number': '/testing/testing/123'
        }
        //handle date format
        data['Delivery date'] = new Date(data['Delivery date'])
        
        await expect(Promise.resolve(extractDataFromExcel(worksheet,row))).resolves.toStrictEqual(
            data
        )
    })

    //Test the return key value pairs of a PR - 3
    test('read and return correct key value pairs in row 18 of test template', async() => {

        const row = 18

        const data = {
            'Bundle': 'Project testing1',
            'Entity': 'Test Location (Get Rich Fast Limited)',
            'PO Number': 'TestingPoNumber',
            'Vendor': 'Get Rich Fast Limited',
            'Type of expense': 'Capex',
            'Capex Nature': 'Hard Cost',
            'Purchase description / Payment Certification reason': 'Testing Purchase Description - Interim payment 3',
            'Approved PO amount': 300000,
            'PO Change Request': '',
            'PO Change Request Date': '',
            'Total Payment paid': 310000,
            'Paid Requested': 50000,
            'Delivery date': '2024-03-24T00:00:00.000Z',
            'Invoice number': '5135'
        }
        //handle date format
        data['Delivery date'] = new Date(data['Delivery date'])
        
        await expect(Promise.resolve(extractDataFromExcel(worksheet,row))).resolves.toStrictEqual(
            data
        )
    })
*/
})

    
