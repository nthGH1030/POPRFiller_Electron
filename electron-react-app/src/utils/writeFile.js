const {findIndexRow, findAllValueInIndexRow} = require('./readFile.js');

//This function writes to a PO worksheet with data provided
export async function writePOPR(extractedObj, templateWorksheet , templateType) 
{
    try {
      
      const indexRowObj = findIndexRow(templateWorksheet, '#Key_Row') 
      const indexRowMap = findAllValueInIndexRow(indexRowObj)
      const indexRowNumber = indexRowObj.number
      const targetRowNumber = indexRowNumber + 1; 
      
      //Assign the targetCell value with the value in extractedObj
      indexRowMap.forEach((indexValue, colNumber) => {
        let targetValue = extractedObj[indexValue]
        let targetCell = templateWorksheet.getRow(targetRowNumber).getCell(colNumber);

        if(indexValue in extractedObj) {
          targetCell.value = targetValue
        } 
        else if(indexValue === 'staff'){
          targetCell.value = localStorage.getItem('staff');
        }
        else if (targetValue === undefined){
          alert(`The name of ${indexValue} in Key_Row of template does not match with the one in central table`)
        }  
      } )

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
