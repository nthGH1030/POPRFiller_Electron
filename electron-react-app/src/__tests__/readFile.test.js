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

//Test if a key value pairs are indeed returned from successful case

//Test if row number is invalid

//Test if formulas or value is handled properly

//Test a hugh excel file and measure the performance

//Test if the extracted data are correct