import * as ExcelJS from "exceljs";


//This function reads the a excel worksheet and extract data from a row
export async function extractDataFromExcel(worksheet, row) {
  
  if (isNaN(row)) {
    throw new TypeError(`The row input: ${row} is not a number`)
  }

  try {

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
    console.log('the row is',row, extractedObj)
    
    return extractedObj
    
    } catch(error) {
      console.log("Failed to extract data from excel: ", error)
      throw error
    }
  
} 

//This function takes a file uploaded by user and return it as buffer array
export async function readFileUpload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsArrayBuffer(file);
  
    reader.onload = () => {
      resolve(reader.result)
    }
  
    reader.onerror = (error) => {
      reject(`File uploaded failed to be read as buffer array : ${error}`)
    }
  })

}

//This function Takes an excel file in buffer array and return one of its worksheet
export async function readExcelFile(file, sheetName) {

  if (!sheetName || await ifWorkSheetExist(file, sheetName) === false) {
    throw new TypeError(`Invalid sheet: ${sheetName}`)
  }

  if (!file) {
    throw new TypeError(`File not Found.`)
  }

  if (!(file instanceof ArrayBuffer || file instanceof Uint8Array)) {
    throw new TypeError('The file passed in is not an ArrayBuffer or Uint8Array');
  }

  try {
    const workbook = new ExcelJS.Workbook();
    let loadedWorkbook = await workbook.xlsx.load(file);
    console.log(`loadedWorkbook: ${loadedWorkbook}`)

    const worksheet = loadedWorkbook.getWorksheet(sheetName)

    console.log(`Worksheet : ${worksheet}`)

    return worksheet

  } catch (error) {
    console.log(error)
  }
}

//This function loop through all the worksheet in file and returns false if no match is found
export async function ifWorkSheetExist(file, sheetName) {
  
  const workbook = new ExcelJS.Workbook();
  let loadedWorkbook = await workbook.xlsx.load(file); 
  let foundSheet = false ;
  loadedWorkbook.eachSheet( function (worksheet) {
    
    if (worksheet.name === sheetName) {
      foundSheet = true  
      return
    }     
  })
  console.log(foundSheet)

  return foundSheet
}