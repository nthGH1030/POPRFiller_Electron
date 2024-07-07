import * as ExcelJS from "exceljs";

//This function reads the central excel and extract the data from it
export async function extractDataFromExcel(filename, row) {

  let centralSheet = 'POPR summary';

  return readExcelFile(filename, centralSheet)
  .then((worksheet) => {
  // Extract the data from the worksheet

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
  return extractedObj
  })
} 

//This function create a filereader and read file in form of file object
async function readFile(filename) {

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    //When a file object is passed into the function
    if (filename instanceof File)
      {
        reader.readAsArrayBuffer(filename);
      }
      
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
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
      console.log('ReadFileError:', error);
  }
}