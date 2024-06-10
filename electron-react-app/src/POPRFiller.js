import templatePO from './secrets/template PO.xlsx' 
import templatePR from './secrets/Template PR.xlsx' 

//const secrets = require('./secrets.json');
const ExcelJS = require('exceljs');

function Generate(filename, row, mode) {
  console.log(mode)
  //console.log(typeof(templatePO))
  //readExcelFile(templatePO, 'Purchase Requisition').then ((worksheet) => {console.log(worksheet)})
  let centralSheet = 'POPR summary';

  readExcelFile(filename, centralSheet)
  .then((worksheet) => {
  // Extract the data 

  let columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  let indexRow = "7";

  const extractedObj = {};

  for (let i = 0; i < columns.length; i++) {
  const column = columns[i];

  const keyAddress = column.concat(indexRow); 
  const keyValue = worksheet.getCell(keyAddress)?.value || "";

  const cellAddress = column.concat(row);
  const cellValue = worksheet.getCell(cellAddress)?.value || "";

  extractedObj[keyValue] = cellValue;
  }

  console.log(extractedObj);
  
  //Call PO or PR
  if (mode === 'PO'){
    handlePO(templatePO, extractedObj)
  }
  else if (mode === 'PR'){
    handlePR(templatePR, extractedObj)
  }
  
  })
  
} 

async function readFile(filename) {
  const fileObject = await getFilefromPath(filename)
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    if (filename instanceof File)
      {
        //console.log('This takes in a file Object')
        //console.log(filename)
        reader.readAsArrayBuffer(filename);
      }
      
    else if (typeof(filename) === 'string')
      {
        //console.log('This takes in a filepath')
        //console.log(fileObject)
        reader.readAsArrayBuffer(fileObject);
      }
      
    
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}

async function readExcelFile(filename, sheetName) {
  try{
    const buffer = await readFile(filename);
    const workbook = new ExcelJS.Workbook();
    const file = await workbook.xlsx.load(buffer);
    const worksheet = file.getWorksheet(sheetName)
      return worksheet
  } catch (error) {
      console.log('ReadFileError:', error);
  }
}


/*
async function readTemplate(filename, sheetName) {
  try{
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.read(filename);
      const worksheet = workbook.getWorksheet(sheetName);
      //console.log(worksheet)
      return worksheet
  } catch (error) {
      console.log('ReadTemplateError:', error);
  }
}
*/

async function getFilefromPath(filePath){
  try {
    const response = await fetch(filePath);
    const file = await response.blob();
    return file;
  } catch (error) {
    console.error('Error getting file from path:', error);
    throw error;
  }
}

async function handlePO(templatePO, extractedObj) 
{
    try {
      let POSheet = 'Purchase Requisition';
  
      //Open the template 
      const templateWorksheet = await readExcelFile(templatePO, POSheet);
      console.log(templateWorksheet)
  
      //Replace the value in the respective field in the template 
      let PO = {
        "PO Number": "F3",
        "Entity": "C9",
        "Purchase description / Payment Certification reason": "C14",
        "Type of expense": "C17",
        "Approved PO amount": "C19",
        "Vendor": "C37",
        "staff": "C44"
      }
  
      for (let [key, value] of Object.entries(PO)) {
        if (key in extractedObj) {
          // Get the corresponding cell address
          let cellAddress = value;
          // Replace the cell value
          templateWorksheet.getCell(cellAddress).value = extractedObj[key];
        }
      }
  
      // Save as a new file 
      const outputFilename = 'PO'+ extractedObj['PO Number'] + '.xlsx';
      templateWorksheet.workbook.xlsx.writeFile(outputFilename);
      console.log('Workbook saved as a new file:', outputFilename);
    } catch (error) {
      console.log('POWriteFileError:', error);
    }
}

  async function handlePR(templatePR, extractedObj)
  {
    try{
        let PRSheet = 'Payment Request'
        const templateWorksheet = await readExcelFile(templatePR, PRSheet);

        //Replace the value in the respective field in the template 
        let PR = {        
            'Entity': 'C7',
            'PO Number': 'D13',
            'Vendor': 'C16',
            'Capex Nature': 'C36',
            'Purchase description / Payment Certification reason': 'C25',
            'Approved PO amount': 'D39',
            'Total Payment paid': 'D42',
            'Paid Requested': 'C19',
            'Delivery date': 'C22',
            'Invoice number': 'D31'
        }
    
        for (let [key, value] of Object.entries(PR)) {
            if (key in extractedObj) {
                // Get the corresponding cell address
                let cellAddress = value
                // Replace the cell value
                if (key == 'Total Payment paid')
                
                {
                  const formulaResult = extractedObj[key].result;
                  
                  templateWorksheet.getCell(cellAddress).value = formulaResult;

                }
                else {
                  templateWorksheet.getCell(cellAddress).value = extractedObj[key];
                }
                
            }
        }
        // Save as a new file 
        const outputFilename = 'PR'+ extractedObj['PO Number'] + '.xlsx';
        templateWorksheet.workbook.xlsx.writeFile(outputFilename);
        console.log('Workbook saved as a new file:', outputFilename);

    } catch(error) {
        console.log('PRWriteFileError:', error);
    }
  }

export default Generate