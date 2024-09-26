import {extractDataFromExcel, readFile, readExcelFile} from '../utils/readFile.js';
import fs from 'fs';
import path from 'path';

//test for handle PO

//test if data are indeed written in the correct cell
//Write a template PO, check the file with readFile to verify the input

describe('Test handlePO to write correct data in excel' , () => {
    let buffer
    //extractedObj for testing purpose
    beforeAll( async () => {
        const masterTablePath = path.join(__dirname, '../secrets/Master table_test.xlsx');
        buffer = await fs.promises.readFile(masterTablePath);
        const testData = await extractDataFromExcel(buffer, 24)
    })
    

    test('successfully write and save as an excel for row', async() => {
        
    })
})