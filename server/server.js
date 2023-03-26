const mongoose = require('mongoose');
const { validate } = require('./codebase');
const Codebase = require('./codebase')

console.log("try to connect mongo")


mongoose.set("strictQuery", false);
const url = 'mongodb://127.0.0.1:27017/code_db'

mongoose.connect(url).then(() => {
    console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});

const defaultValue = { html: "", css: "", js: "" }
const lan = ["html","css","js"]

const io = require('socket.io')(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
})
io.on("connection", socket => {
    socket.on("get-code-html", async codeId => {
        const loaded_data = await findOrCreateNewCode(codeId)
        const {data: _code,_id} = loaded_data
        socket.join(codeId)

        lan.forEach(lan => {
            socket.emit("load-code-" + lan, {client_id: "server", code: _code[lan],_id})
        });



        const sendChangeHtmlHandler = (data) => {
            socket.broadcast.to(codeId).emit("receive-changes-html", data);
            socket.removeAllListeners("send-changes-html", sendChangeHtmlHandler);
        }
        socket.on("send-changes-html", sendChangeHtmlHandler)
    })

    // get code css
    socket.on("get-code-css", codeId => {
        console.log("get-code-css")
        // const data = await findOrCreateNewCode(codeId)
        const data = ""
        socket.join(codeId)
        socket.emit("load-code-css", data)

        const sendChangeCssHandler = (data) => {
            socket.broadcast.to(codeId).emit("receive-changes-css", data);
            socket.removeAllListeners("send-changes-css", sendChangeCssHandler);
            console.log(data)
        }
        socket.on("send-changes-css", sendChangeCssHandler)
    })
    
    // get code js
    socket.on("get-code-js", codeId => {
        console.log("get-code-js")
        // const data = await findOrCreateNewCode(codeId)
        const data = ""
        socket.join(codeId)
        socket.emit("load-code-js", data)

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
