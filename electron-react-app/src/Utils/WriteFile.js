import {readExcelFile} from './ReadFile';


export async function handlePO(templatePO, extractedObj) 
{
    try {
      let POSheet = 'PO_Input';
  
      //Get the template work sheet
      const templateWorksheet = await readExcelFile(templatePO, POSheet);
  
      //Replace the value in the respective field in the template 
      let PO = {
        "PO Number": "C2",
        "Entity": "C3",
        "Purchase description / Payment Certification reason": "C4",
        "Type of expense": "C5",
        "Capex Nature": "C6",
        "Approved PO amount": "C7",
        "Vendor": "C8",
        "staff": "C9"
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

export async function handlePR(templatePR, extractedObj)
  {
    try{
        
        let PRSheet = 'PR_Input'
        const templateWorksheet = await readExcelFile(templatePR, PRSheet);

        //Replace the value in the respective field in the template 
        let PR = {   
            'PO Number': 'C2',     
            'Entity': 'C3',
            'Purchase description / Payment Certification reason': 'C4',
            'Paid Requested': 'C5',
            'Delivery date': 'C6',
            'Invoice number': 'C7',
            'Type of expenses': 'C8',
            'Capex Nature': 'C9',
            'Total Payment paid': 'C10',
            'Approved PO amount': 'C11',
            'Vendor': 'C12',
            "staff": "C13"
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
