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
   
  let indexValueMap = new Map();
  indexRowObj.eachCell((cell, colNumber) => {
    
    indexValueMap.set(colNumber, cell.value);
    
  })
  return indexValueMap;
} 

export function findAllValueInTargetRow(targetRowObj){
  let targetRowValueMap = new Map();
    targetRowObj.eachCell({includeEmpty: true}, (cell, colNumber) => {
      
      if (cell.value === undefined || cell.value === null) {
        cell.value = '';
      } 
      else if (typeof cell.value === 'object'  && cell.value.hasOwnProperty('result')) {
        cell.value = cell.value.result
      }
  
      targetRowValueMap.set(colNumber, cell.value);
      
    })
    return targetRowValueMap;
  } 


//This function reads the a excel worksheet and extract data from a row
export async function extractDataFromExcel(worksheet, targetRow) {
  
  if (isNaN(targetRow)) {
    throw new TypeError(`The row input: ${targetRow} is not a number`)
  }

  try {
    //Construct the extractedObj by using index as key and target as value
    let extractedObj = {}
    const indexRowObject = findIndexRow(worksheet, '#Key_Row') 
    const indexRowMap = findAllValueInIndexRow(indexRowObject)
    const targetRowObj = worksheet.getRow(targetRow)
    const targetRowMap =findAllValueInTargetRow(targetRowObj)

    indexRowMap.forEach((indexValue, colNumber) => {
      if(targetRowMap.has(colNumber)) {
        const targetValue = targetRowMap.get(colNumber);
        extractedObj[indexValue] = targetValue
      }
    })

    console.log('the target row is',targetRow, extractedObj)

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


//This function extract data from a PO / PR file for testing purpose
export async function extractDataFromPOPR(worksheet) {

  try {
    let extractedObj = {}
    const indexRowObject = findIndexRow(worksheet, '#Key_Row') 
    const indexRowMap = findAllValueInIndexRow(indexRowObject)
    const indexRowNumber = indexRowObject.number
    const targetRowNumber = indexRowNumber + 1;
    const targetRowObj = worksheet.getRow(targetRowNumber)
    const targetRowMap =findAllValueInTargetRow(targetRowObj)
  
    indexRowMap.forEach((indexValue, colNumber) => {
      if(targetRowMap.has(colNumber)) {
        const targetValue = targetRowMap.get(colNumber);
        extractedObj[indexValue] = targetValue
      }
    })
  
  console.log(`POPR data is: ${extractedObj}`)

    return extractedObj
    
  } catch (error) {
    console.log("Failed to extract data from POPR: ", error)
  }
}


