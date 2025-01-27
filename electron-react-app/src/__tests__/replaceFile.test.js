//This unit test check if the upload new template and select new template works correctly

/*
    test1: if an uploaded template is properly saved to a directory
    test2: check if the database is appended correctly
    test3: check if the database is updated correctly for duplicated template
    test4: check if you can selecting a new template works correctly
*/

describe( 'Test upload a new template function', () => {
    test('If an uploaded template is saved to correct directory' , () => {
        /*
            i can use file system from nodejs here
            but how do i mock a file system without actually creating a file and check
        */
    })
    test('if the database is created and can be accessed' , () => {
        /*
            see if database directory is created
            see if database is saved to the directory
            see if database can be accessed
            see if the database content can be parsed
        */
    })
    test('if the database is appended correctly' , () => {
        /*
            Mock a database connection
            Make a database filepath
            Make a data entry
            append the data entry to the database
            get the database to check if the mock resolved value is correct
        */
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