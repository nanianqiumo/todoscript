// crond
const schedule = require('node-schedule');
const db = require('monk')('localhost:27017/tododb');
const nodemailer = require('nodemailer');  
const _todo = db.get('todo');
const _user = db.get('coder');

module.exports ={
    scheduleCronstyle: async ()=>{
        schedule.scheduleJob('59 54 8 * * *', function(){
            // schedule.scheduleJob('*/3 * * * * *', function(){
                module.exports._check()
        }); 
    },
    _check:async (now = false)=>{
        var today = new Date().setHours(9,0,0,0);
        let todos = await _todo.find({day:today,state:0});
        if(!todos) return
        todos.forEach(async e => {
            let u = await _user.findOne({uuid:e.uuid});
            // let _randomTime = Math.floor(Math.random()*11+20)*1000 * 60;
            if(now){
                module.exports._sendEmail(e,u);
            }else{
                let _randomTime = module.exports.getRandom(1,30) * 1000 * 60;
                (async function(e,u){
                    let send = await setTimeout( module.exports._sendEmail,_randomTime,e,u);
                })(e,u)
            }
        });
    },
    _sendEmail:async (e,u) => {
        console.log(`user: ${u.username} , sendTime: ${new Date()}`);
        let transporter = nodemailer.createTransport({  
            service: 'qq',  
            auth: {  
              user: u.fromemail,  
              pass: u.fromkey  
            
            }  
        });
        let items = `<p class="_row"><span class="_key">Todo:</span></p>`;
        e.todo.forEach((t,i)=>{
            items += `<p class="_row"><span class="_key">${i}</span>,<span class="_val">${t}</span></p>`;
        })
        let html = `<style>._content{padding:20px;}._key{font-weight:600;font-size:130%;font-style:italic;padding-right:10px;}._val{padding-left:5px;}</style>
        <div class="_content">
        ${items}
        <p class="_row">${e.text}</p>
        <div style="displsy:block;text-align:right;padding-right:20%;padding-top:30px;">by - ${u.username}</div>
        </div>
        `;
        let mailOptions = {  
            from: u.fromemail, // 发送者  
            to: u.toemail, // 接受者,可以同时发送多个,以逗号隔开  
            subject: `ToDo List - ${u.username}`, // 标题  
            //text: 'Hello world', // 文本  
            html: html  
        };
        await transporter.sendMail(mailOptions, function (err, info) {  
            if (err) {  
              console.log(err);  
              return;  
            }  
            _todo.update({
                _id:e._id
            },{
                $set: { state: 1 }
            })
            console.log('发送成功');  
        }); 
    },
    getRandom: (min, max) => {
        let r = Math.random() * (max - min);
        let re = Math.round(r + min);
        re = Math.max(Math.min(re, max), min);
        return re;
    }
    
}
