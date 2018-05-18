const db = require('monk')('localhost:27017/tododb');
const users = db.get('coder');
const xss = require('xss')
const uuid = require('uuid')
const config = require('../config/default.json')
const _todo = db.get('todo');
const crond = require('../server/crond');


function GetDateStr(t = new Date().getTime(),AddDayCount = 1) { 
    var dd = new Date(t); 
    dd.setHours(9,0,0,0);
    return dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
    // var y = dd.getFullYear(); 
    // var m = dd.getMonth()+1;
    // var d = dd.getDate(); 
    // return y+"-"+m+"-"+d; 
} 

function time_range(beginTime, endTime) {
      var strb = beginTime.split (":");
      if (strb.length != 2) {
        return false;
      }
     
      var stre = endTime.split (":");
      if (stre.length != 2) {
        return false;
      }
     
      var b = new Date ();
      var e = new Date ();
      var n = new Date ();
     
      b.setHours (strb[0]);
      b.setMinutes (strb[1]);
      e.setHours (stre[0]);
      e.setMinutes (stre[1]);
     
      if (n.getTime () - b.getTime () > 0 && n.getTime () - e.getTime () < 0) {
        return true;
      } else {
    // console.log ("当前时间是：" + n.getHours () + ":" + n.getMinutes () + "，不在该时间范围内！");
        return false;
      }
    }

exports.addtodo = async (ctx , next) => {
    let todos = ctx.request.body;
    let usertime = ctx.request.body.day || GetDateStr(new Date().getTime(),0);
    let u = ctx.tokenVerify;
    let dbData = await _todo.findOne({uuid:u.uuid},{
        sort: {"day": -1},
        limit: 1,
    })
    let day = GetDateStr(new Date(usertime).getTime(),0);
    if(dbData && dbData.day > day ){
        ctx.body = {
            msg:`${usertime} Todo已记录!`,
            err:true
        };
        return;
    }else if(dbData && dbData.day  == day ){
        ctx.body = {
            msg:`${usertime} Todo已记录!`,
            err:true
        };
        return;
    }
 
    let data = {
        uuid:u.uuid,
        day:day,
        todo:Array.isArray(todos.todo) ? todos.todo : [],
        text:todos.note,
        state:0
    }
    _todo.insert(data);
    if(day === GetDateStr(new Date().getTime(),0)  && time_range("08:55", "18:00")){
        crond._sendEmail(data,u);
    }
    let _tomorrow = new Date(GetDateStr(data.day));
    ctx.body = {
        msg:`${new Date(data.day).getMonth() + 1}月${new Date(data.day).getDate()}日 Todo 保存成功`,
        data:todos,
        day:`${_tomorrow.getFullYear()}-${_tomorrow.getMonth() +1 }-${_tomorrow.getDate()}`,
        err:false
    };
    return

    // ctx.body = {
    //     msg:'保存失败,请刷新页面重试!',
    //     ree:false
    // };

}



exports.gettime = async (ctx , next) => {
    console.log(ctx.request.ip);
    let u = ctx.tokenVerify;
    let dbData = await _todo.findOne({uuid:u.uuid},{
        sort: {"day": -1},
        limit: 1,
    })

    let day = GetDateStr();
    let am = time_range("00:00", "18:00")
    // let pm = time_range("18:00", "23:59")
    if(dbData && dbData.day > GetDateStr(new Date().getTime(),0) ){
        day = GetDateStr(dbData.day);
    }else if(dbData && dbData.day < GetDateStr(new Date().getTime(),0) ){
        day = GetDateStr(new Date().getTime(),0)
    }else if(!dbData && am ){
        day = GetDateStr(new Date().getTime(),0)
    }
    let _date = new Date(day);
    ctx.body = {
        day:`${_date.getFullYear()}-${_date.getMonth() + 1}-${_date.getDate()}`
    }
}