import {extractDataFromExcel, readFile, readExcelFile} from '../utils/readFile.js';
import {writePO} from '../utils/writeFile.js';
import fs from 'fs';
import path from 'path';

//test for handle PO

//test if data are indeed written in the correct cell
//Write a template PO with a predefined data, read the PO and check if the input are written match

/*
describe('Test writePO to write correct data in excel' , () => {
    let buffer;
    let bufferArray;
    let worksheet;
    let row;
    let data;
    let templateWorksheet;

    beforeAll( async () => {
        //extract data to ready to write into file
        const masterTablePath = path.join(__dirname, '../secrets/Master table_test.xlsx');
        buffer = await fs.promises.readFile(masterTablePath);
        bufferArray = toArrayBuffer(buffer);
        worksheet = await readExcelFile(bufferArray, 'POPR summary');
        row = 24;
        data = await extractDataFromExcel(worksheet, row);

        //write data into file
        const templatePath = path.join(__dirname, '../secrets/text_template_PO.xlsx');
        templateBuffer = await fs.promises.readFile(templatePath);
        tempalteBufferArray = toArrayBuffer(templateBuffer);
        templateWorksheet = await readExcelFile(tempalteBufferArray, 'PO_Input')
        
        const {filename,fileWritten} = await writePO(data, templateWorksheet)

        //read the data in the file written
        const fileWrittenBufferArray = toArrayBuffer(fileWritten);
        const fileWrittenWorksheet = await readExcelFile(fileWrittenBufferArray, 'PO_Input')

    })
    

    test('Write a PO with correct data', async() => {
        

        const data = {
            'Bundle': 'Project testing2',
            'Entity': 'Test Location (Get Rich Quick Limited)',
            'PO Number': 'TestingPoNumber2',
            'Vendor': 'Get Rich Quick Limited',
            'Type of expense': 'Capex',
            'Capex Nature': 'Soft Cost',
            'Purchase description / Payment Certification reason': 'Testing Purchase Description',
            'Approved PO amount': 100000,
            'PO Change Request': '',
            'PO Change Request Date': '',
            'Total Payment paid': 'N/A',
            'Paid Requested': 'N/A',
            'Delivery date': 'N/A',
            'Invoice number': 'N/A'
        }
    })
})
*/