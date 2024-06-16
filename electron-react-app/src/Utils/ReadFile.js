import * as ExcelJS from "exceljs";

//This function reads the central excel and extract the data from it
export async function Generate(filename, row) {

  //readExcelFile(templatePO, 'Purchase Requisition').then ((worksheet) => {console.log(worksheet)})
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

//This function that allows reading file from path
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

//This function create a filereader and read file in form of file object or path
async function readFile(filename) {
  const fileObject = await getFilefromPath(filename)
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    if (filename instanceof File)
      {
        reader.readAsArrayBuffer(filename);
      }
      
    else if (typeof(filename) === 'string')
      {
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

//This function read a bufferarray and return an excel worksheet
export async function readExcelFile(filename, sheetName) {
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