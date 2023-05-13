
const sql = require("mssql");

const config = {
  server: "localhost",
  database:"VirtualPetDB",
  user:"testUser",
  password:"",
  trustServerCertificate:true
};

// sql.on("error",err=>
// console.log(err)
// )

sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();
       
    // query to the database and get the records
    request.query('select * from Pet', function (err, recordset) {
        
        if (err) console.log(err)

        // send records as a response
        console.log(recordset);
        
    });
});
