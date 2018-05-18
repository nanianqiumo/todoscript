# todoscript

emmmmm，响应公司号召每天提交Todo List ，于是有了这个脚本来替我按时发送Todo

使用koa2作为后端，提交Todos给服务器记录在mongodb中，每天早晨 8:55 开启定时任务读取当天所有用户需要发送的Todo于 9:30之间随机发送到指定emial;
前后端分离模式开发,采用jwt认证，实现多角色权限 ...

![](snapshot.png)

## Develop

```
git clone https://github.com/nanianqiumo/todoscript.git
npm install
npm start
```

## Technology

### backend

- koa2
- mongodb

### frontend

待定

## TODO

- [ ] 注册页面
- [ ] 查看历史todo以及修改
- [ ] 下次写...

## Tree

```
├── Makefile
├── app.js
├── common
│   └── db.js
├── config.js
├── controllers
│   ├── home.js
│   └── task.js
├── models
│   └── task.js
├── package.json
├── public
│   ├── javascripts
│   │   ├── app.js
│   │   ├── bundle.js
│   │   ├── components
│   │   │   ├── footer.js
│   │   │   ├── header.js
│   │   │   ├── textinput.js
│   │   │   ├── todo.js
│   │   │   ├── todo_app.js
│   │   │   └── todo_list.js
│   │   └── task_store.js
│   └── todomvc-common
│       ├── base.css
│       ├── bg.png
│       ├── bower.json
│       └── readme.md
├── routes.js
├── test
└── views
    └── index.html
```

## License

MIT
