import {extractDataFromExcel, readFile, readExcelFile} from '../utils/readFile.js';
import fs from 'fs';
import path from 'path';
import * as ExcelJS from "exceljs";

//Test if error will be throw if the excel file does not exist
test('read an non-existent excel', async() => {
    await expect(
        readFile('path/to/nonexistent/file.xlsx')).rejects.toThrow(
            TypeError('The provided file is not an excel spreedsheet'))
})

//Test if error will be throw if the file is not an excel extension
test('read a non-excel file', async() => {
    await expect(
        readFile('path/to/nonexistent/file.txt')).rejects.toThrow(
            TypeError('The provided file is not an excel spreedsheet'))
})

//Test if excel is malformed
test('read an corrupted excel file', async() => {
    const corruptedExcelPath = path.join(__dirname, '../secrets/test_corrupted_excel.xlsx');
    const sheet = 'non-existing-worksheet';

    const buffer = await fs.promises.readFile(corruptedExcelPath);

    await expect(
        readExcelFile(buffer, sheet)).rejects.toThrow(
            TypeError("The provided file is not a valid Excel spreadsheet or is corrupted."));
})

// Assuming readExcelFile is adjusted to accept a buffer or workbook, not just a path
test('read an non-existent worksheet', async () => {
    const masterTablePath = path.join(__dirname, '../secrets/Master table_test.xlsx');
    const sheet = 'non-existing-worksheet';
    
    const buffer = await fs.promises.readFile(masterTablePath);

    await expect(
        readExcelFile(buffer, sheet)).rejects.toThrow(
            TypeError(`Worksheet ${sheet} not Found.`));
});


//Test if row number is invalid
test ('throw an error for invalid row number' , async () => {
    const masterTablePath = path.join(__dirname, '../secrets/Master table_test.xlsx');
    const row = 'InvalidRow'

    const buffer = await fs.promises.readFile(masterTablePath);
    
    await expect (
        extractDataFromExcel(buffer, row)).rejects.toThrow(
            TypeError(`The row input: ${row} is not a number`)
        );
})
        
//Test the return key value pairs of a standard PO row 
test('read and return correct key value pairs in row 13 of test template', async() => {
    const masterTablePath = path.join(__dirname, '../secrets/Master table_test.xlsx');
    const row = 13

    const buffer = await fs.promises.readFile(masterTablePath);

    const data = {
        'Bundle': 'Project testing1',
        'Entity': 'Test Location (Get Rich Fast Limited)',
        'PO Number': 'TestingPoNumber',
        'Vendor': 'Get Rich Fast Limited',
        'Type of expense': 'Capex',
        'Capex Nature': 'Hard Cost',
        'Purchase description / Payment Certification reason': 'Testing Purchase Description',
        'Approved PO amount': 300000,
        'PO Change Request': '',
        'PO Change Request Date': '',
        'Total Payment paid': 'N/A',
        'Paid Requested': 'N/A',
        'Delivery date': 'N/A',
        'Invoice number': 'N/A'
    }

    await expect(Promise.resolve(extractDataFromExcel(buffer,row))).resolves.toStrictEqual(
        data
    )
})

//Test the return key value pairs of a standard PO row 
test('read and return correct key value pairs in row 13 of test template', async() => {
    const masterTablePath = path.join(__dirname, '../secrets/Master table_test.xlsx');
    const row = 13

    const buffer = await fs.promises.readFile(masterTablePath);

    const data = {
        'Bundle': 'Project testing1',
        'Entity': 'Test Location (Get Rich Fast Limited)',
        'PO Number': 'TestingPoNumber',
        'Vendor': 'Get Rich Fast Limited',
        'Type of expense': 'Capex',
        'Capex Nature': 'Hard Cost',
        'Purchase description / Payment Certification reason': 'Testing Purchase Description',
        'Approved PO amount': 300000,
        'PO Change Request': '',
        'PO Change Request Date': '',
        'Total Payment paid': 'N/A',
        'Paid Requested': 'N/A',
        'Delivery date': 'N/A',
        'Invoice number': 'N/A'
    }

    await expect(Promise.resolve(extractDataFromExcel(buffer,row))).resolves.toStrictEqual(
        data
    )
})

//Test the return key value pairs of a PO revision
test('read and return correct key value pairs in row 14 of test template', async() => {
    const masterTablePath = path.join(__dirname, '../secrets/Master table_test.xlsx');
    const row = 14

    const buffer = await fs.promises.readFile(masterTablePath);

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
    

    await expect(Promise.resolve(extractDataFromExcel(buffer,row))).resolves.toStrictEqual(
        data
    )
})


//Test the return key value pairs of a PR
test('read and return correct key value pairs in row 16 of test template', async() => {
    const masterTablePath = path.join(__dirname, '../secrets/Master table_test.xlsx');
    const row = 16

    const buffer = await fs.promises.readFile(masterTablePath);

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
    

    await expect(Promise.resolve(extractDataFromExcel(buffer,row))).resolves.toStrictEqual(
        data
    )
})

