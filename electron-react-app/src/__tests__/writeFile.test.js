import {extractDataFromExcel, readFile, readExcelFile, extractDataFromPOPR} from '../utils/readFile.js';
import {writePO} from '../utils/writeFile.js';
import { toArrayBuffer } from '../utils/Parser_toArrayBuffer.js';
import fs from 'fs';
import path from 'path';

//test for handle PO

//test if data are indeed written in the correct cell
//Write a template PO with a predefined data, read the PO and check if the input are written match


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

        await expect(Promise.resolve(writtenData)).resolves.toStrictEqual(matchData)
    })
})
