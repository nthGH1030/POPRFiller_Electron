const {findIndexRow, findAllValueInIndexRow} = require('./readFile.js');

//This function writes to a PO worksheet with data provided
export async function writePOPR(extractedObj, templateWorksheet , templateType) 
{
    try {
      
      const indexRowObj = findIndexRow(templateWorksheet, '#Key_Row') 
      const indexRowValueArray = findAllValueInIndexRow(indexRowObj)
      const indexRowNumber = indexRowObj.number
      const targetRowNumber = indexRowNumber + 1; 
      
      for(let i = 0 ; i < indexRowValueArray.length; i++){
        let targetKey = indexRowValueArray[i];
        let targetCell = templateWorksheet.getRow(targetRowNumber).getCell(i+1); 

        if (targetKey in extractedObj) {
          targetCell.value = extractedObj[targetKey];
        }

        if (indexRowValueArray[i] === 'staff'){
          targetCell.value = localStorage.getItem('staff');
        }
        
      }

      // Save as a new file 
      const outputFilename = templateType + extractedObj['PO Number'] + '.xlsx';
      const buffer = await templateWorksheet.workbook.xlsx.writeBuffer(outputFilename);
      console.log('Workbook saved as a new file:', outputFilename);
      return {
        filename: outputFilename,
        buffer: buffer,
      }
    } catch (error) {
      console.log('POPRWriteFileError:', error);
    }
}

/*
//This function writes to a PR worksheet with data provided
export async function writePR(extractedObj, templateWorksheet)
{
  try {
    
    const indexRowObj = findIndexRow(templateWorksheet, '#Key_Row') 
    const indexRowValueArray = findAllValueInIndexRow(indexRowObj)
    const indexRowNumber = indexRowObj.number
    const targetRowNumber = indexRowNumber + 1; 
    
    for(let i = 0 ; i < indexRowValueArray.length; i++){
      let targetKey = indexRowValueArray[i];
      let targetCell = templateWorksheet.getRow(targetRowNumber).getCell(i+1); 

      if (extractedObj.hasOwnProperty(targetKey)) {
        targetCell.value = extractedObj[targetKey];
      }

      if (indexRowValueArray[i] === 'staff'){
        targetCell.value = localStorage.getItem('staff');
      }
      
    }

    // Save as a new file 
    const outputFilename = 'PR'+ extractedObj['PO Number'] + '.xlsx';
    const buffer = await templateWorksheet.workbook.xlsx.writeBuffer(outputFilename);
    console.log('Workbook saved as a new file:', outputFilename);
    return {
      filename: outputFilename,
      buffer: buffer,
    }
  } catch (error) {
    console.log('POWriteFileError:', error);
  }
}
  */