# todoscript

emmmmm，响应公司号召每天提交Todo List ，于是有了这个脚本来替我按时发送Todo

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
