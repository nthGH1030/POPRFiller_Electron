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

    for(const [key,value] of columnMap) {
        
        if(extractedObj['Entity'] === value) {
            
              return {isEntityValid: true}
            }
    }

    return {isEntityValid: false, 
        message: 'The Entity you input is not valid, please revise the excel and re-upload a new file'}
  
}
//Devliery date / PO Change Date: Check if it is a valid date Object
export async function checkDate(extractedObj) {
    const poChangeDate = Date.parse(extractedObj['PO Change Request Date'])
    
    if(!isNaN(poChangeDate)) {
        if (extractedObj['PO Change Request Date'] !== 'N/A' || 
            extractedObj['PO Change Request Date'] !== ''){
                return {isDateValid : false, message:
                    `The Field "PO Change Request Date" should either be a date, N/A or empty`
                    }
            }
    } 
        

    const deliveryDate = Date.parse(extractedObj['Delivery date']) 

    if(!isNaN(deliveryDate)) {
        if(extractedObj['Delivery date'] !== 'N/A' || 
            extractedObj['Delivery date'] !== '') {
                return {isDateValid : false, message:
                    `The Field "Delivery date" should either be a date, N/A or empty`
                }
            }
    }

    return {isDateValid : true}
}

//Payment related: Check if they are valid Numbers
export async function checkNumber(extractedObj) {

    for (const key in extractedObj) {
        if (key === 'Approved PO amount' || 
            key === 'PO Change Request' ||
            key === 'Paid Requested' ||
            key === 'Total Payment paid'
        ) {
            console.log('the key is , ' , key)
            if(!isNaN(extractedObj[key])) {
                console.log(extractedObj[key], 'is not a number')
                if(extractedObj[key] !== 'N/A' || extractedObj[key] !== '') {
                    console.log(extractedObj[key], 'is N/A or empty string')
                    return {
                        isPaymentValid: false,
                        message: `"${key}" should either be a Number, N/A or empty`
                    }
                }
            }
        }
    }
    return {isPaymentValid: true}

}

