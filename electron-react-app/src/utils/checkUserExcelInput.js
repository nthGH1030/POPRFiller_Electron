import{findIndexRow} from './readFile'

/*
    This script provide function that check the excel uploaded by user,
    it provide feedbacks on whether there is anything wrong with the user input
*/

//Entity check: check whether they are of an approved list of entity
export async function checkEntity(centralEntityWorksheet, extractedObj) {

    const indexRowObj = findIndexRow(centralEntityWorksheet, '#Key_Row')
    const endPoint = findIndexRow(centralEntityWorksheet, 'End of reference information')
    //find and return a list of approved entity
    let column
    indexRowObj.eachCell((cell, colNumber) => {
        if(cell.value === 'Approved Entity') {
        column =  colNumber
        }
    })
    
    //Get a Map of column value
    const columnObj = centralEntityWorksheet.getColumn(column);
    let columnMap = new Map();
    columnObj.eachCell((cell, rowNumber) => {
      if(rowNumber >= indexRowObj.number + 1 && rowNumber <= endPoint.number - 1) {
        columnMap.set(rowNumber, cell.value)
      }
    })

    //check if the entity in extractedObj is inside the list of approved entity
    columnMap.forEach((value) => {

        if(extractedObj['Entity'] === value) {
          return true
        }
    })

    return {isEntityValid: false, 
        message: 'The Entity you input is not valid, please revise the excel and re-upload a new file'}
  
}
//Devliery date / PO Change Date: Check if it is a valid date Object

//Payment related: Check if they are valid Numbers
