const ExcelJS = require('exceljs');

//This function find the indexRow
export function findIndexRow(worksheet, marker) {
  let rowObject = null;
  worksheet.eachRow((row, rowNumber)=> {
    row.eachCell((cell,colNumber) => {
      if (cell.value === marker) {
        rowObject = row
        return
      }
    })
    if(rowObject) return
  })
  return rowObject
}

export function findAllValueInIndexRow(indexRowObj) {
  let indexValue = []
  indexRowObj.eachCell({includeEmpty: true}, (cell, colNumber) => {
    indexValue.push(cell.value !== undefined && cell.value !== null ? cell.value : '');
  })
  return indexValue;
} 

//This function reads the a excel worksheet and extract data from a row
export async function extractDataFromExcel(worksheet, row) {
  
  if (isNaN(row)) {
    throw new TypeError(`The row input: ${row} is not a number`)
  }

  try {
    /*
    let columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];
    let indexRow = "7";
    

    const extractedObj = {};

    for (let i = 0; i < columns.length; i++) {
    const column = columns[i];

    //setting the key of the object to be the value in index row
    const keyAddress = column.concat(indexRow); 
    const keyValue = worksheet.getCell(keyAddress)?.value || "";

    //setting the value of the object to be the row which user requested
    const cellAddress = column.concat(row);
    const cell = worksheet.getCell(cellAddress);
    const cellValue = cell.formula ? cell.result : (cell.value ?? ""); 

    extractedObj[keyValue] = cellValue;
    }
    console.log('the row is',row, extractedObj)
    
    return extractedObj
    */
    const indexRowObj = findIndexRow(worksheet, '#Key_Row') 
    //console.log(indexRowObj)
    const IndexRowValueArray = findAllValueInIndexRow(indexRowObj)
    //const FilteredIndexRowValueArray = IndexRowValueArray.filter(item => item != '#Key_Row')
    //onsole.log(IndexRowValueArray)
    const rowObject = worksheet.getRow(row)
    const rowValueArray = findAllValueInIndexRow(rowObject)
    //console.log('rowValuearray is: ', rowValueArray)
    

    let extractedObj = {};
    for (let i = 0; i < IndexRowValueArray.length; i++) {
      let key
      let value
      
      key = IndexRowValueArray[i];
      value = rowValueArray[i] || '';

      extractedObj[key] = value;
      

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
export async function readExcelFile(file_bufferArray, sheetName) {

  if (!sheetName || await ifWorkSheetExist(file_bufferArray, sheetName) === false) {
    throw new TypeError(`Invalid sheet: ${sheetName}`)
  }

  if (!file_bufferArray) {
    throw new TypeError(`file_bufferArray not Found.`)
  }

  if (!(file_bufferArray instanceof ArrayBuffer || file_bufferArray instanceof Uint8Array)) {
    throw new TypeError('The file_bufferArray passed in is not an ArrayBuffer or Uint8Array');
  }

  try {
    const workbook = new ExcelJS.Workbook();
    let loadedWorkbook = await workbook.xlsx.load(file_bufferArray);
    console.log(`loadedWorkbook: ${loadedWorkbook}`)

    const worksheet = loadedWorkbook.getWorksheet(sheetName)

    console.log(`Worksheet : ${worksheet}`)

    return worksheet

  } catch (error) {
    console.log(error)
  }
}

//This function loop through all the worksheet in file_bufferArray and returns false if no match is found
export async function ifWorkSheetExist(file_bufferArray, sheetName) {
  
  const workbook = new ExcelJS.Workbook();
  let loadedWorkbook = await workbook.xlsx.load(file_bufferArray); 
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

//This function extract data from a PO / PR file
export async function extractDataFromPOPR(worksheet) {

  try {
  let keyColumn = "B"
  let valueColumn = "C"
  let indexRow = ['2','3','4','5','6','7','8','9','10','11','12','13']
  
  const data = {}
  for (let i = 0; i < indexRow.length; i++) {

    const keyAddress = keyColumn.concat(indexRow[i]);
    let keyValue
      if (!worksheet.getCell(keyAddress).value) {
        continue
      } 
      else
      {
        keyValue = worksheet.getCell(keyAddress).value
      }

    const valueAddress = valueColumn.concat(indexRow[i]);
    const value = worksheet.getCell(valueAddress);
    const valueValue = value.formula ? value.result : (value.value ?? ""); 

    data[keyValue] = valueValue;
    
  }
  
  console.log(`POPR data is: ${data}`)

    return data
  } catch (error) {
    console.log("Failed to extract data from POPR: ", error)
  }


}


