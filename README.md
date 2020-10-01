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

- http://localhost:8080/api/users/signup :
    > Send a `POST` request with JSON params "email" and "password" to create User

- http://localhost:8080/api/users/signin :
    > Send a `POST` request with JSON params "email" and "password" to sign in User

- http://localhost:8080/api/users/all :
    > Send a `GET` request with Admin Token in to `req.headers` to get Users list

- http://localhost:8080/api/users/user/:id :
    > Send a `GET` request to get User Data. Required Admin Token or Requested User Token 

    > Send a `PUT` request with JSON params to update User Data. Required Admin Token to apdate User to Admin. Required Requested User Token to update other personal data

    > Send a `DELETE` request with Admin Token or Requested User Token to delete User

- http://localhost:8080/api/users/adminfather : ** DO NOT USE IN PRODUCTION! **
    > Send a `POST` request to create Test Admin User  

    > Send a `GET` request to sign in Test Admin User

