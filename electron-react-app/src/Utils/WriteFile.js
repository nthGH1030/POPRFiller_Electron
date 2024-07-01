import {readExcelFile, readPreloadExcelFile} from './ReadFile';


export async function handlePO(templatePO, extractedObj, staff) 
{
    try {
      staff !== null && localStorage.setItem('staff', staff);
      let POSheet = 'Purchase Requisition';
  
      //Get the template work sheet
      const templateWorksheet = await readPreloadExcelFile(templatePO, POSheet);
  
      //Replace the value in the respective field in the template 
      let PO = {
        "PO Number": "F3",
        "Entity": "C9",
        "Purchase description / Payment Certification reason": "C14",
        "Type of expense": "C17",
        "Approved PO amount": "C19",
        "Vendor": "C37",
        "staff": "C44"
      }
  
      for (let [key, value] of Object.entries(PO)) {
        // Get the corresponding cell address
        let cellAddress = value;
        if (key in extractedObj) {
          // Replace the cell value
          templateWorksheet.getCell(cellAddress).value = extractedObj[key];
          //console.log(templateWorksheet.getCell(cellAddress).value)
        }
        if(key === 'staff'){
          templateWorksheet.getCell(cellAddress).value = localStorage.getItem('staff');
        }
      }
  
      // Save as a new file 
      const outputFilename = 'PO'+ extractedObj['PO Number'] + '.xlsx';
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

export async function handlePR(templatePR, extractedObj, staff)
  {
    try{
      staff !== null && localStorage.setItem('staff', staff);
        
        let PRSheet = 'Payment Request'
        const templateWorksheet = await readExcelFile(templatePR, PRSheet);

        //Replace the value in the respective field in the template 
        let PR = {        
            'Entity': 'C7',
            'PO Number': 'D13',
            'Vendor': 'C16',
            'Capex Nature': 'C36',
            'Purchase description / Payment Certification reason': 'C25',
            'Approved PO amount': 'D39',
            'Total Payment paid': 'D42',
            'Paid Requested': 'C19',
            'Delivery date': 'C22',
            'Invoice number': 'D31',
            "staff": "C44"
        }
    
        for (let [key, value] of Object.entries(PR)) {
          // Get the corresponding cell address
          let cellAddress = value
            if (key in extractedObj) {
            
                // Replace the cell value
                if (key === 'Total Payment paid') {
                  const formulaResult = extractedObj[key].result;
                  
                  templateWorksheet.getCell(cellAddress).value = formulaResult;
                }
                else {
                  templateWorksheet.getCell(cellAddress).value = extractedObj[key];
                }
            }
            else if(key === 'staff'){
              templateWorksheet.getCell(cellAddress).value = localStorage.getItem('staff');;
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

    } catch(error) {
        console.log('PRWriteFileError:', error);
    }
  }
