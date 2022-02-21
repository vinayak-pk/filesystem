const {connect} = require('mongoose');
require('dotenv').config();

// database connection
module.exports = ()=>{
    return connect(`mongodb+srv://ghostdb:${process.env.db_pass}@cluster0.rvlac.mongodb.net/filemanagement?retryWrites=true&w=majority`)
}