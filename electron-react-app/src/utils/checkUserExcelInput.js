import{findIndexRow, findAllValueInIndexRow, findAllValueInTargetRow, 
    extractDataFromExcel} from './readFile'

/*
    This script provide function that check the excel uploaded by user,
    it provide feedbacks on whether there is anything wrong with the user input
*/

//Entity check: check whether they are of an approved list of entity
function checkEntity(worksheet) {
    const indexRowObj = findIndexRow(worksheet, '#Key_Row')
    const indexValueMap = findAllValueInIndexRow(indexRowObj)
    const endPoint = findIndexRow(worksheet, 'End of reference information')

    //find and return a list of approved entity
    console.log(indexRowObj)

}
//Devliery date / PO Change Date: Check if it is a valid date Object

//Payment related: Check if they are valid Numbers
