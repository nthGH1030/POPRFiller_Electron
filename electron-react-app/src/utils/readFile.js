import * as ExcelJS from "exceljs";

//This function reads the central excel and extract the data from it
export async function extractDataFromExcel(filename, row) {
  try {
    let centralSheet = 'POPR summary';

  return readExcelFile(filename, centralSheet)
  .then((worksheet) => {
  // Extract the data from the worksheet

  let columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];
  let indexRow = "7";

  const extractedObj = {};

  for (let i = 0; i < columns.length; i++) {
  const column = columns[i];

  //setting the key of the object to be the value in index row
  const keyAddress = column.concat(indexRow); 
  const keyValue = worksheet.getCell(keyAddress)?.value || "";

  //setting the value of hte object to be the row which user requested
  const cellAddress = column.concat(row);
  const cell = worksheet.getCell(cellAddress);
  const cellValue = cell.formula ? cell.result : (cell.value ?? ""); 

  extractedObj[keyValue] = cellValue;
  }
  
  return extractedObj
  })

  } catch(error) {
    console.log("Failed to extract data from excel: ", error)
  }
  
} 

//This function create a filereader and read file as a bufferArray
async function readFile(filename) {

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.readAsArrayBuffer(filename);
      
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(new Error(`Failed to read file as buffer array: ${error}`));
    };
  });
}

//This function read a bufferarray and return an excel worksheet
export async function readExcelFile(filename, sheetName) {
  try{
    const workbook = new ExcelJS.Workbook();
    let file;

    if (filename instanceof File)
      {
        const buffer = await readFile(filename);
        file = await workbook.xlsx.load(buffer);
      }
      else {
        file = await workbook.xlsx.load(filename);
      }
    
    const worksheet = file.getWorksheet(sheetName)
      return worksheet
  } catch (error) {
      console.log('Failed to get the worksheet:', error);
  }
}