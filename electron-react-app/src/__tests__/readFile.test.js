import {extractDataFromExcel, readFile, readExcelFile} from '../utils/readFile.js';
import masterTable from '../secrets/Master table_test.xlsx';

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



//test('read an excel and get an non-existent worksheet')

//Test if worksheet is not found

//Test if a key value pairs are indeed returned from successful case



//Test if row number is invalid

//Test if excel is empty or malformed

//Test if formulas or value is handled properly

//Test a hugh excel file and measure the performance

//Test if the extracted data are correct