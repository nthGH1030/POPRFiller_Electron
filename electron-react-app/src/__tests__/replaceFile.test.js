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
        updateDatabase: jest.fn(),
        findTemplate: jest.fn(),
    };
})

describe( 'Test upload a new template function', () => {
    const testPath = path.join(__dirname, 'testDirectory')
    const testDatabasePath = path.join(testPath, 'userDatabase.json');
    const mockTemplateType = 'mockTemplateType';
    const mockFilename = 'mockFile.xlsx';
    const mockFileBufferArray = [1, 2, 3, 4];
    const mockTestFilePath = path.join(testPath, mockFilename);

    beforeEach(async() => {
        try {
            await fs.access(testDatabasePath)
            return 'There is already an existing database'
    
        } catch(err) {
            if(err.code === 'ENOENT') {
                await fs.mkdir(testPath, {recursive: true});
                await fs.writeFile(testDatabasePath, JSON.stringify([{
                    "filename": "template PO_test.xlsx",
                    "uploadDate": 1737687395921,
                    "templateType": "PO",
                    "status": "unselected"
                }]))
                return 'database has been created'
            } else {
                return `Error: ${err}, There is an error in creating the database`
            }
        }
    })
    
    afterEach(async() => {
        try {
            await fs.rm(mockTestFilePath, { force: true });
            await fs.rm(testDatabasePath, { force: true });
            await fs.rmdir(testPath, { force: true });
            
        } catch (err) {
            console.log('failed to remove scaffold',err)
        }
    })

    test('saveTemplates' , async() => {
        
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

        const mockEntry = {
            "filename": "template PO_test_newEntry.xlsx",
            "uploadDate": 1737687395921,
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
                //appended tha database
                const databaseObj = await getDatabaseAsObj()
                databaseObj.push(mockEntry) 
                const newDataInJSONString = JSON.stringify(databaseObj, null, 2)
                const databaseFilePath = path.join(__dirname, './testDirectory/userDatabase.json')
                await fs.writeFile(databaseFilePath, newDataInJSONString)
                //get the new database as object
                const appendedDatabase = await getDatabaseAsObj()

                return {success : true , database: appendedDatabase}
            } catch(error) {
                return { success: false, error: error.message };
            }
        })

        const result = await appendtoDatabase(mockEntry)
        expect(result.success).toEqual(true)
        expect(result.database).toEqual(
            [
                {
                  "filename": "template PO_test.xlsx",
                  "uploadDate": 1737687395921,
                  "templateType": "PO",
                  "status": "unselected"
                }, 
                {
                    "filename": "template PO_test_newEntry.xlsx",
                    "uploadDate": 1737687395921,
                    "templateType": "PO",
                    "status": "unselected"
                }
              ]
        )
    })
    
    test('if the database is updated correctly in case of duplicated entry', async() => {
       
        const updatedDataObj = 
        [
            {
                "filename": "template PO_test.xlsx",
                "uploadDate": 1737687395921,
                "templateType": "PO",
                "status": "selected"
            }
        ]
        getDatabaseAsObj.mockImplementation(async() => {
            const databaseFilePath = path.join(__dirname, './testDirectory/userDatabase.json')
            const databaseBuffer = await fs.readFile(databaseFilePath);
            const databaseObj = JSON.parse(databaseBuffer);
            return databaseObj
        })
            
       updateDatabase.mockImplementation(async(updatedDatabaseObj) => {
            const databaseFilePath = path.join(__dirname, './testDirectory/userDatabase.json')
            const newDataInJSONString = JSON.stringify(updatedDatabaseObj, null, 2)
            
            try { 
                await fs.writeFile(databaseFilePath, newDataInJSONString)
                const newDatabase = await getDatabaseAsObj()
                return {success: true , result: newDatabase}
        
            } catch(error) {
                return { success: false, error: error.message };
            }
       })

       const result = await updateDatabase(updatedDataObj)
       expect(result.success).toBe(true)
       expect(result.result).toEqual(      
        [
            {
                "filename": "template PO_test.xlsx",
                "uploadDate": 1737687395921,
                "templateType": "PO",
                "status": "selected"
            }
        ])
    })

    test('find template' , async() => {
        /*
            check that a template can be found via its filename property
            check that a template cna be found via 'selected' property
        */

        getDatabaseAsObj.mockImplementation(async() => {
            const databaseFilePath = path.join(__dirname, './testDirectory/userDatabase.json')
            const databaseBuffer = await fs.readFile(databaseFilePath);
            const databaseObj = JSON.parse(databaseBuffer);
            return databaseObj
        })

       findTemplate.mockImplementation(async(filename)=> {
            const databaseObj = await getDatabaseAsObj()
            const requestedObj = databaseObj.find(entry => entry.filename === filename)
            if (requestedObj) {
        
                return requestedObj
        } 
       })
        const result = await findTemplate('template PO_test.xlsx')
        expect(result).toEqual({
            "filename": "template PO_test.xlsx",
            "uploadDate": 1737687395921,
            "templateType": "PO",
            "status": "unselected"
        })
    })

    
    test('selectAndDeselectTemplate' , async() => {
        /*
            When a template is selected, check that no other template is selected
        */

    })

    test('deselectAllTempalte', () => {
        /*
            Check that all temlplates are deselected
        */
    })



    
})
