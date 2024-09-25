import * as ExcelJS from "exceljs";

//This function reads the central excel and extract the data from it
export async function extractDataFromExcel(filename, row) {
  try {
    if (isNaN(row)) {
      throw new TypeError(`The row input: ${row} is not a number`)
    }

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
    console.log('the row is',row, extractedObj)
    
    return extractedObj
    })

    } catch(error) {
      console.log("Failed to extract data from excel: ", error)
      throw error
    }
  
} 

function validateExcelFile(file) {
  const validMimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const validExtension = ".xlsx";

  //Check MIME type
  if(file.type != validMimeType) {
    throw new TypeError("The provided file is not an excel spreedsheet")
  }

  //check file extension
  const fileExtension = file.name.split('.').pop();
  if(fileExtension.toLowerCase() != validExtension) {
    throw new TypeError("The provided file is not an excel spreedsheet")
  }
}

//This function create a filereader and read file as a bufferArray
export async function readFile(filename) {

  validateExcelFile(filename)

  return new Promise((resolve, reject) => {
    if(!(filename instanceof Blob)) {
      throw new TypeError("The provided file is not a Blob object")
    }

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

    if (!worksheet) {
      throw new TypeError(`Worksheet ${sheetName} not Found.`)
    }
      return worksheet

  } catch (error) {
    
    if (error.message.includes("Can't find end of central directory")) {
      console.log(error);
      throw new TypeError("The provided file is not a valid Excel spreadsheet or is corrupted.");
    }
    else if (!(error instanceof TypeError)) {
      console.log('Other Error:', error);
    }

    throw error;
  }

}