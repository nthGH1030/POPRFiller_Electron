import {extractDataFromExcel, readFile, readExcelFile} from '../utils/readFile.js';
import masterTable from '../secrets/Master table_test.xlsx';
import corruptedExcel from '../secrets/test_corrupted_excel.xlsx';
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


//Test if excel is  malformed
test('read an corrupted excel file', async() => {
    await expect(readFile(corruptedExcel)).rejects.toThrow(
        TypeError('The provided file is not an excel spreedsheet'))
})

//test('read an excel and get an non-existent worksheet')
test('read an non-existent worksheet' , async() => {
    
    const workbook = new ExcelJS.Workbook();
    const sheet = 'non-existing worksheet'
    await expect(
        readExcelFile(workbook, sheet)).resolves.toBe(undefined)
    
})


//Test if a key value pairs are indeed returned from successful case

//Test if row number is invalid


//Test if formulas or value is handled properly

//Test a hugh excel file and measure the performance

//Test if the extracted data are correct