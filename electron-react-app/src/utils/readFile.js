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
  indexRowObj.eachCell((cell, colNumber) => {
    
    indexValue.push({[colNumber]: cell.value});
    
  })
  return indexValue;
} 

export function findAllValueInTargetRow(targetRowObj){
  let targetRowValue = []
  targetRowObj.eachCell({includeEmpty: true}, (cell, colNumber) => {
    
    if (cell.value === undefined || cell.value === null) {
      cell.value = '';
    } 
    else if (typeof cell.value === 'object'  && cell.value.hasOwnProperty('result')) {
      cell.value = cell.value.result
    }

    targetRowValue.push({[colNumber]: cell.value});
    
  })
  return targetRowValue;
} 


//This function reads the a excel worksheet and extract data from a row
export async function extractDataFromExcel(worksheet, targetRow) {
  
  if (isNaN(targetRow)) {
    throw new TypeError(`The row input: ${targetRow} is not a number`)
  }

  try {
    
    const indexRowObject = findIndexRow(worksheet, '#Key_Row') 
    const keyValuePairsInIndexRow = findAllValueInIndexRow(indexRowObject)
    //const FilteredIndexRowValueArray = IndexRowValueArray.filter(item => item != '#Key_Row')
    
    let extractedObj = {}
    let colNumberInIndexRow
    let rowValueInIndexRow
    let colNumberInTargetRow
    let rowValueInTargetRow

    //setting the key of the object to be the value in index row
    const targetRowObj = worksheet.getRow(targetRow)
    const keyValuePairsInTargetRow =findAllValueInTargetRow(targetRowObj)
    //console.log('keyValuePairsInTargetRow', keyValuePairsInTargetRow)
    //console.log('keyValuePairsInIndexRow', keyValuePairsInIndexRow)

    for (let i = 0; i < keyValuePairsInIndexRow.length; i++) {
      colNumberInIndexRow = Object.keys(keyValuePairsInIndexRow[i])[0]
      rowValueInIndexRow = Object.values(keyValuePairsInIndexRow[i])[0]
      colNumberInTargetRow = Object.keys(keyValuePairsInTargetRow[i])[0]
      rowValueInTargetRow = Object.values(keyValuePairsInTargetRow[i])[0]
      /*
      console.log(`Index ${i}:`);
      console.log(`colNumberInIndexRow: ${colNumberInIndexRow}, rowValueInIndexRow: ${rowValueInIndexRow}`);
      console.log(`colNumberInTargetRow: ${colNumberInTargetRow}, rowValueInTargetRow: ${rowValueInTargetRow}`);
      if( colNumberInIndexRow === colNumberInTargetRow) {
        extractedObj[rowValueInIndexRow] = rowValueInTargetRow;
      } 
        
        */
      extractedObj[rowValueInIndexRow] = rowValueInTargetRow;
    }

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

//This test function no longer works
/*
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

*/
