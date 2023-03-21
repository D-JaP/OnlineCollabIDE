const mongoose = require('mongoose');
const { validate } = require('./codebase');
const Codebase = require('./codebase')


// await mongoose.connect('mongodb://localhost/code_db');
const defaultValue = {html:"",css:"",js:""}

const io = require('socket.io')(3001,{
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
})

io.on("connection",socket =>{
    socket.on("send-changes-html", value => {
        socket.broadcast.emit("receive-changes-html", value);
    })
    socket.on("send-changes-css", value => {
        socket.broadcast.emit("receive-changes-css", value);
    })
    socket.on("send-changes-js", value => {
        socket.broadcast.emit("receive-changes-js", value);
    })
})


// async function findOrCreateNewCode(id){
//     if (id == null) return 

//     const codebase = await Codebase.findById(id)
//     if (codebase) return codebase
//     else return Codebase.create({_id:id,data: defaultValue})

// }
