
//This function writes to a PO worksheet with data provided
export async function writePO(extractedObj, templateWorksheet) 
{
    try {
      //Set up an object in template to be replaced by data in the central table
      let PO = {
        "PO Number": "C2",
        "Entity": "C3",
        "Purchase description / Payment Certification reason": "C4",
        "Type of expense": "C5",
        "Capex Nature": "C6",
        "Approved PO amount": "C7",
        "Vendor": "C8",
        "staff": "C9",
        "PO Change Request" : "C12",
        "PO Change Request Date" : "C13" 
      }
      //Loop through the template
      for (let [key, value] of Object.entries(PO)) {

        let cellAddress = value;

        // Find the match key in extractedobj and template, replace the value
        if (key in extractedObj) {

          //Skip blank case
          if(extractedObj[key]=== "") {
            continue
          }
          else {
            
            templateWorksheet.getCell(cellAddress).value = extractedObj[key];
          }
         
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

//This function writes to a PR worksheet with data provided
export async function writePR(extractedObj, templateWorksheet)
  {
    try{
        
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
            
                templateWorksheet.getCell(cellAddress).value = extractedObj[key];
                
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
