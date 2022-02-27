# Files manager

# Description
This is a backend file management application which allows users to manage their files. This is similar to google drive where the user is able to create files and folders. upload files, move or rename files and folders, delete them when needed as well. it is written in JavaScript. This is created using Express, mongoose and AWS.

# How to Install and Run the Project
- clone the project
- cd ./filesystems2
- npm install
- create env file with - 
     ```
     jwt_secret = // a key for jwt
     db_pass = //mongoatlas password
     PORT = // port to listen for requests
     keyID = // aws s3 keyid
     secretAccessKey = //aws s3 access key
     ```
- npm start

# Using the application and ita APIS- 
  ## Adding a new user (post request)
    path - user/register
    body  {
        "name": //user name,
        "email": // email id,
        "password:" //password
    }
  ## Login (post request)
    path - user/login
    body  {
        "email": // email id,
        "password:" //password
    }
 
  ### For every api call please add the token as bearer token for authentication after logging in
  
  ## Create a folder/Directory (post request)
    path - /files/create/folder 
    body  {
        "fname": //folder name
        "parent": // parent folder id
    }
  
 ## Create a file (post request)
    path - /files/create/file
    body  {
        "fname": //folder name
         "parent": // parent folder id
    }
    
 ## Change folder/directory (get request)
    path - /files/changedir
    params  {
        "parent": // id of the selected folder
    }
    
 ## Rename file/folder (post request)
    path - /files/rename/:id
    body  {
        "newname": // New name,
        "folder" : Boolean // if folder- true else folder- false
    }
    params:{
      id // id of selected folder
    }
    
 ## Move folder/directory (patch request)
    path - /files/move/folder/:id 
    body  {
        "newfold": // id of the new folder 
    }
     params:{
      id // id of selected folder i.e to be moved
    }
    
 ## Moving a file  (patch request)
    path - /files/move/file/:id 
    body  {
        "newfold": // id of the new folder 
    }
     params:{
      id // id of selected folder i.e to be moved
    }
    
 ## File upload (post request)
    path - /files/upload 
    form-data  {
        "parent": // id of the new folder 
        "files": // file needed to be uploaded
    }
    
 ## Delete folder (delete request)
    path - /files/remove/folder/:id 
     params:{
      id // id of selected folder i.e to be moved
    }
    
## Delete file (delete request)
     path - /files/remove/file/:id 
     params:{
      id // id of selected folder i.e to be moved
    }

### Document of Important Technical Decisions -
        Link - https://docs.google.com/document/d/14rUe4f629v5Hcdw2J1KFK7XrUlyf2fQLkNA1moEMqSs/edit?usp=sharing

### Link to the backend application 
        Deployed Link - https://filesystems97.herokuapp.com/
