const bcrypt = require ('bcryptjs');


const helpers={};

helpers.ecryptPassword =async (password) =>{
 const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
return hash;
  
};
//metodo comparar contraseña
helpers.matchPassword = async (password, savedPassword) =>{
  return await bcrypt.compare(password, savedPassword);
}


module.exports= helpers;
