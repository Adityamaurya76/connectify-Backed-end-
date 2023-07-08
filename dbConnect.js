const mongoose = require('mongoose');

 module.exports = async () =>{
    const mongoUri="mongodb+srv://Aditya_maurya:UESaw0qrtmaVPsZa@cluster0.pnpnplj.mongodb.net/?retryWrites=true&w=majority";
    try{
        await mongoose.connect(mongoUri,{
            useUnifiedTopology: true,
          
        });
       
    } catch(error){
       console.log(error);
       process.exit(1);
    } 
 }





































