# A Purchase Form Filler 
---
# Overview <br>
This is an electron application that allow user to read a master table in an excel file, copy a specific row of data, create and write to anotehr excel file.<br>

A central table shall be uploaded by user to the application and the application will read it, then extract a specific row of its data and write it onto either `template PO` or `template PR`.

The application is written using React and Electron. It is supported on both Windows and MacOS.

In order to properly utilize the app, you must create both `./secrets/template PO.xlsx` and `'./secrets/template PR.xlsx'` yourself. 

# API testing
Work in Progress

# How to install and run this projects

### `npm install`
Install all the dependecies of the project

### `npm run start`
Runs React in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run electron`
Runs electron in the development mode.
In order to run the app in development mode, you shall first run `npm run start`, then run `npm run electron` in a separate terminal window. This is because in development mode, electron loads the React app from localhost:3000, which needs to be spun up before running electron.

### `npm run build-all`
Runs `npm run build` and then `npm run make`, it utilize electron-forge to package the application into a build version, and then package the build version into an executable for the operating system it is run on. The current setup does not support cross-platform packaging

