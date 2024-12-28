/*
const handleFileChange = (uploadedFile) => {
    setFile(uploadedFile);
}

const handleDropZoneClick = () => {
    fileInputRef.current.click();
};

const handleFileDrop = (uploadedFile) => {
    setFile(uploadedFile);
}

const handleApplyClick = async (
    parseFile, 
    checkForDuplicate,
    getUserConfirmation,
    updateDatabase, 
    appendFileToDatabase,
    saveTemplates) => {

    //handle database operation
    const filename = file.name
    const JSON = await parseFile(filename, mode)
    const duplicate = await checkForDuplicate(JSON)
    const fileArrayBuffer = await file.arrayBuffer();

    if (duplicate === null) {
        const appendResult = await appendFileToDatabase(JSON)
        console.log(appendResult)

        const saveResult = await saveTemplates(fileArrayBuffer ,filename, mode)
        console.log(saveResult)
    } else {
        const updateResult = await updateDatabase(duplicate)
        console.log('The updated database is : ', updateResult)

        const userConfirmation = await getUserConfirmation(
            'A file with duplicate filename is found, do you wish to replace it? ')
        console.log('userConfirmation is :', userConfirmation)

        if (userConfirmation === 'Yes') {
            const saveResult = await saveTemplates(fileArrayBuffer, filename, mode)
            console.log(saveResult)
        } else {
            return
        }          
    }
}

*/

/*

 const handleApplyClick = async (
        file, 
        mode, 
        parseFile, 
        checkForDuplicate,
        getUserConfirmation,
        updateDatabase, 
        appendFileToDatabase,
        saveTemplates) => {

        //handle database and file saving operation
        const filename = file.name
        const JSON = await parseFile(filename, mode)
        const duplicate = await checkForDuplicate(JSON)

        if (duplicate === null) {
            const appendResult = await appendFileToDatabase(JSON)
            console.log(appendResult)

            const saveResult = await saveTemplates(file, mode)
            console.log(saveResult)

        } else {

            const userConfirmation = await getUserConfirmation(
                'A file with duplicate filename is found, do you wish to replace it? ')
            console.log('userConfirmation is :', userConfirmation)

            if (userConfirmation === 'Yes') {
                const saveResult = await saveTemplates(file, mode)
                console.log(saveResult)
            } else {
                return
            }   
            const updateResult = await updateDatabase(duplicate)
            console.log('The updated database is : ', updateResult)
        }
    }
*/