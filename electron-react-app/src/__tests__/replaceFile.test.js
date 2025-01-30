const fs = require ('fs').promises;
const path = require('path');
const {app} = require('electron');
const { ensureDatabaseExist, getDatabaseAsObj,parseFile, appendtoDatabase, 
    updateDatabase, checkForDuplicate, getUserConfirmation, ensureTemplateDirectoryExist,
    saveTemplates, getFileDatabyTemplateType, selectAndDeselectTemplate, deselectAllTemplate,
    findTemplate, findSelectedTemplate } = require('../utils/manageUserData');
//This unit test check if the upload new template and select new template works correctly

/*
    test1: if an uploaded template is properly saved to a directory
    test2: check if the database is appended correctly
    test3: check if the database is updated correctly for duplicated template
    test4: check if you can selecting a new template works correctly
*/

jest.mock('../utils/manageUserData' , () => {
    const originalModule = jest.requireActual('../utils/manageUserData');
    
    return {
        ...originalModule,
        saveTemplates: jest.fn(),
        appendtoDatabase: jest.fn(),
        getDatabaseAsObj: jest.fn(),
    };
})



describe( 'Test upload a new template function', () => {
    const testPath = path.join(__dirname, 'testDirectory')
    const testDatabasePath = path.join(testPath, 'userDatabase.json');

    const mockTemplateType = 'mockTemplateType';
    const mockFilename = 'mockFile.xlsx';
    const mockFileBufferArray = [1, 2, 3, 4];
    const mockTestFilePath = path.join(testPath, mockFilename);

    beforeAll(async() => {
        
    })
    
    afterAll(async() => {
        try {
            //await fs.rm(testDatabasePath, { force: true });
            await fs.rm(mockTestFilePath, { force: true });
            
        } catch (err) {
            console.log('failed to remove scaffold',err)
        }
    })

    test('If an uploaded template is could be saved to a directory' , async() => {
        /*
            i can use file system from nodejs here
            check if saveTemplate works
        */

        saveTemplates.mockImplementation(async(fileBufferArray, filename, templateType)=> {
            try {
                const buffer = Buffer.from(fileBufferArray)
                const testFilePath = path.join(testPath, filename)
                await fs.writeFile(testFilePath, buffer)
                return {success : true, testFilePath : testFilePath}
            } catch(err) {
                return {success : false}
            }
            
        })

        const result = await saveTemplates(mockFileBufferArray, mockFilename, mockTemplateType)
        const fileExists = await fs.access(result.testFilePath).then(() => true).catch(() => false);

        expect(result. success).toEqual(true)
        expect(fileExists).toBe(true);

    })

    test('if the database is created, accessed and parsed as object' , async() => {
        /*
            see if database directory is created
            see if database is saved to the directory
            see if database can be accessed
            see if the database content can be parsed
        */
        const fileExists = await fs.access(testDatabasePath).then(()=> true).catch(()=> false)
        const databaseObj = await parseFile("template PO_test.xlsx", "PO")

        expect(fileExists).toBe(true)
        expect(databaseObj).toEqual({
            "filename": "template PO_test.xlsx",
            "uploadDate": expect.any(Number),
            "templateType": "PO",
            "status": "unselected"
        })
    })
    test('if the database is appended correctly' , async() => {
        /*
            Make a data entry
            append the data entry to the database
            get the database to check if the mock resolved value is correct
        */
        const mockEntry = {
            "filename": "template PO_test_newEntry.xlsx",
            "uploadDate": Date.now(),
            "templateType": "PO",
            "status": "unselected"
        }

        getDatabaseAsObj.mockImplementation(async() => {
            const databaseFilePath = path.join(__dirname, './testDirectory/userDatabase.json')
            const databaseBuffer = await fs.readFile(databaseFilePath);
            const databaseObj = JSON.parse(databaseBuffer);
            return databaseObj
        })

        appendtoDatabase.mockImplementation(async(mockEntry) => {
            try {
                const databaseObj = await getDatabaseAsObj()
                databaseObj.push(mockEntry) 
                const newDataInJSONString = JSON.stringify(databaseObj, null, 2)
                const databaseFilePath = path.join(__dirname, './testDirectory/userDatabase.json')
                await fs.writeFile(databaseFilePath, newDataInJSONString)
                return {success : true}
            } catch(error) {
                return { success: false, error: error.message };
            }
        })

        const result = await appendtoDatabase(mockEntry)
        expect(result.success).toEqual(true)


    })

    test('if the database is updated correctly in case of duplicated entry', () => {
        /*

        */
    })
})

describe('Test select new template function',() => {
    test('When a template is clicked the database is updated and new template is selected' , () => {

    })
})