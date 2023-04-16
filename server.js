const mongoose = require('mongoose');
const { validate } = require('./models/codebase');
const Codebase = require('./models/codebase');
const express = require('express');
const cors = require('cors');

// database connect
mongoose.set("strictQuery", false);
const url = 'mongodb+srv://root:root@cloudy.0vdc0vq.mongodb.net/test'
mongoose.connect(url).then(() => {
    console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});

const defaultValue = { html: "", css: "", js: "" }
const lan = ["html","css","js"]

// login 
const app = require("./auth")
app.use(cors({
    // origin: 'http://localhost:3000',
    // methods: ['GET', 'POST'],
}))



// serve static file

const path = require('path');

// const port = process.env.PORT || 5000;
// // Serve static files from the React app
app.use(express.static(path.join(path.dirname(__dirname),'app','client','cloudy_ide', 'build')));
// Handles any requests that don't match the above
app.get('*', (req, res) => {
  res.sendFile(path.join(path.dirname(__dirname),'app','client','cloudy_ide','build','index.html'));
});
const server = app.listen(process.env.PORT, ()=> {
    console.log("login server start on port 8080")
})

  



const io = require('socket.io')(server)

io.on("connection", socket => {
    socket.on("get-code-html", async codeId => {
        console.log("get-code-html")
        const loaded_data = await findOrCreateNewCode(codeId)
        const {data: _code,_id} = loaded_data
        socket.join(codeId)

        socket.emit("load-code-html", {client_id: "server", code: _code['html'],_id})
        console.log("load-code-html")

        // lan.forEach(lan => {
        //     socket.emit("load-code-" + lan, {client_id: "server", code: _code[lan],_id})
        //     console.log("load-code-"+lan)
        // });



        const sendChangeHtmlHandler = (data) => {
            socket.broadcast.to(codeId).emit("receive-changes-html", data);
            socket.removeAllListeners("send-changes-html", sendChangeHtmlHandler);
        }
        socket.on("send-changes-html", sendChangeHtmlHandler)
    })

    // get code css
    socket.on("get-code-css", async codeId => {
        console.log("get-code-css")
        const loaded_data = await findOrCreateNewCode(codeId)
        const {data: _code,_id} = loaded_data
        socket.join(codeId)
        socket.emit("load-code-css", {client_id: "server", code: _code['css'],_id})
        console.log("load-code-css")

        const sendChangeCssHandler = (data) => {
            socket.broadcast.to(codeId).emit("receive-changes-css", data);
            socket.removeAllListeners("send-changes-css", sendChangeCssHandler);
            console.log(data)
        }
        socket.on("send-changes-css", sendChangeCssHandler)
    })
    
    // get code js
    socket.on("get-code-js", async codeId => {
        console.log("get-code-js")
        const loaded_data = await findOrCreateNewCode(codeId)
        const {data: _code,_id} = loaded_data
        socket.join(codeId)

        socket.emit("load-code-js", {client_id: "server", code: _code['js'],_id})
        console.log("load-code-js")
        const sendChangeJsHandler = (data) => {
            socket.broadcast.to(codeId).emit("receive-changes-js", data);
            socket.removeAllListeners("send-changes-js", sendChangeJsHandler);
        }
        socket.on("send-changes-js", sendChangeJsHandler)
    })

    
    lan.forEach(lan => {
        socket.on("save-code-" + lan, data => {
            Codebase.findByIdAndUpdate(
                data._id, 
                {
                $set: { ['data.'+lan]: data.code }},
                { new: true },

                function(err, docs) {
                    if (err) {
                        // console.log(err)
                    }
                    else {
                        // console.log("Updated User : ", docs);
                    }
                }
            )

        })
    });
})


async function findOrCreateNewCode(id) {
    if (id == null) return

    const codebase = await Codebase.findById(id)
    // console.log("codebase" ,codebase)
    if (codebase) return codebase
    
    return Codebase.create({ _id: id, data: defaultValue })
}


