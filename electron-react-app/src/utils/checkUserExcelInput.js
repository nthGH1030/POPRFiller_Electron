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
export async function checkDate(extractedObj) {
    const poChangeDate = Date.parse(extractedObj['PO Change Request Date'])
    if(!isNaN(poChangeDate) || 
        extractedObj['PO Change Request Date'] === 'N/A' || 
        extractedObj['PO Change Request Date'] === '') {
        return {isPOChangeDateValid : false, message:
            'The Field "PO Change Date should either be a date, N/A or empty"'
        }
    }

    const deliveryDate = Date.parse(extractedObj['Delivery date']) 
    if(!isNaN(deliveryDate) || 
        extractedObj['Delivery date'] === 'N/A' || 
        extractedObj['Delivery date'] === '') {
        return {isDeliveryDateValid : false, message:
            'The Field "PO Change Date should either be a date, N/A or empty"'
        }
    }
}

//Payment related: Check if they are valid Numbers
export async function checkNumber(extractedObj) {

    for (const value in extractedObj) {
        if(value === extractedObj['Approved PO amount'] || 
            value === extractedObj['PO Change Request'] ||
            value === extractedObj['Paid Requested'] ||
            value === extractedObj['Total Payment paid']
        ) {

            if(!isNaN(value) || value !== 'N/A' || value !== '')
            return {
                valid: false,
                message: `${extractedObj['Approved PO amount']} 
                    should either be a date, N/A or empty`
            } 
        }
    }
}

