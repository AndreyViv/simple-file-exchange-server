Simple File Exchange Server
====================

The server with a simple API for sharing files from storage. 

GET START
------------

- Clone the repository
- Use `npm install` from your project directory to install dependencies
- Customize the app/config/db-config.js file according to your PostgreSQL settings
- Use `node server.js` to run server

ENDPOINTS
--------------

- http://localhost:8080/api/files :
    > Send a `GET` request to get a list of all existing files data in the storage

- http://localhost:8080/api/files/upload :
    > Send a `POST` request with file form data using the key name "filedata" to upload the file 

- http://localhost:8080/api/files/:id :
    > Send a `GET` request with file ID to get file data (filename and download link)
    > Send a `DELETE` request with file ID to delete the file

- http://localhost:8080/api/files/download/:id :
    > Send a `GET` request with file ID to download the file

