
const db = require('monk')('localhost:27017/tododb');
const users = db.get('coder');

exports.test = async (ctx,next) =>{
    // ctx.body = "test";
    // return;

//    users.insert({ name: 'YanDong'})
    let data = await users.find({name:"YanDong"});  
    console.log(data);
    ctx.body = data;
}