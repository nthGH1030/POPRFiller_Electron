import{findIndexRow} from './readFile'

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

    for(const [key, value] of columnMap) {
        
        if(extractedObj['Entity'] === value) {
            
              return {isEntityValid: true}
            }
    }

    return {isEntityValid: false, 
        message: 'The Entity you input is not valid, please revise the excel and re-upload a new file'}
  
}

export async function checkDate(field, extractedObj) {
    const dateToCheck = Date.parse(extractedObj[field])

    if(isNaN(dateToCheck)) {
        if (extractedObj[field] !== 'N/A' && 
            extractedObj[field] !== ''){
                return {isDateValid : false, message:
                    `The Field ${field} should either be a date, N/A or empty`
                    }
            }
            else {
                return {isDateValid : true}
            }
    } 
    return {isDateValid : true}
}

/*
// PO Change Date: Check if it is a valid date Object
export async function checkPORequestDate(extractedObj) {
    const poChangeDate = Date.parse(extractedObj['PO Change Request Date'])
    
    if(isNaN(poChangeDate)) {
        if (extractedObj['PO Change Request Date'] !== 'N/A' && 
            extractedObj['PO Change Request Date'] !== ''){
                return {isDateValid : false, message:
                    `The Field "PO Change Request Date" should either be a date, N/A or empty`
                    }
            }
            else {
                return {isDateValid : true}
            }
    } 
    return {isDateValid : true}
}

//Devliery date : Check if it is a valid date Object
export async function checkDeliveryDate(extractedObj) {    

    const deliveryDate = Date.parse(extractedObj['Delivery date']) 

    if(isNaN(deliveryDate)) {

        if(extractedObj['Delivery date'] !== 'N/A' && 
            extractedObj['Delivery date'] !== '') {
               
                return {isDateValid : false, message:
                    `The Field "Delivery date" should either be a date, N/A or empty`
                }
            }
            else {
                return {isDateValid : true}
            }
    }
    return {isDateValid : true}
}
*/

//Payment related: Check if they are valid Numbers
export async function checkNumber(extractedObj) {
    let isPOAmountValid = true;
    let isPOChangeAmountValid = true;
    let isPaidReuqestValid = true;
    let isTotalPaidValid = true;

    for (const key in extractedObj) {
        
        if(isNaN(extractedObj[key])) {
            
            if(extractedObj[key] !== 'N/A' && extractedObj[key] !== '') {
                
                if (key === 'Approved PO amount') {
                    isPOAmountValid = false;
                } else if (key === 'PO Change Request') {
                    isPOChangeAmountValid = false;
                } else if (key === 'Paid Requested') {
                    isPaidReuqestValid = false;
                } else if (key === 'Total Payment paid') {
                    isTotalPaidValid = false;
                }
            }
        }
    }
    return {isPOAmountValid ,  
            isPOChangeAmountValid,     
            isPaidReuqestValid, 
            isTotalPaidValid,
            }

}

