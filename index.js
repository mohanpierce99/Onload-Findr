const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');



var server = require("http").Server(app);
let io = require("socket.io")(server);
var hash = {};
var mapping = {};

app.use(cors());

const ExpressPeerServer = require('peer').ExpressPeerServer;

//CONFIG PEER-JS SERVER
var peerserver = ExpressPeerServer(server, {
	debug: true
});

app.use('/peer', peerserver);


app.use(express.static("./"));

io.on("connection", (socket) => {
    socket.on("createproom", (val) => {
        let whcode = val["whcode"];
        if(mapping[whcode]){
            console.log("error")
            socket.emit("wherror1","nn");
            console.log("errorified")

        } else{
            let url =val["url"];
            mapping[whcode] = url;
            let d =  whcode;
            console.log("new applicant")
            console.log(d);
            socket.room = d;
            socket.join(d);
            socket.emit("userstat", d);
            console.log("Socket joined rooom : " + d);
        }

    });


    socket.on("joinproom",(val) => {
        let whcode = val["whcode"];
        let url = val["url"];
        if(mapping[whcode]){
            if(mapping[whcode] == url){
                let d =  whcode;
                console.log("new applicant")
                console.log(d);
                socket.room = d;
                socket.join(d);
                socket.emit("userstat", d);
                console.log("Socket joined rooom : " + d);
            } else{
                console.log(mapping[whcode])
                socket.emit("whredirect",{whcode,url: mapping[whcode]});
            }

        } else {
            socket.emit("wherror","");
        }

    })

	socket.on("joinroom", (url) => {
        console.log("jroom",url);
        if(!hash[url]){
            hash[url] = {
                i:0,
                j:0,
                arr:[]
            };
        }
        let d;
        if(hash[url].arr.length == 0){
            d = url+"&0";
            console.log("sub-g",d);
             
            hash[url].arr.push(d);
        }else{
            if(hash[url].arr.length != hash[url].j){
                d = hash[url].arr[hash[url].j++];
            } else if(hash[url].j != hash[url].i){
                d = hash[url].arr[hash[url].i++];
            } else{
                d = url+"&"+hash[url].arr.length;
                hash[url].arr.push(d);
            }
        }
		console.log("new applicant")
		console.log(d);
		socket.room = d;
		socket.join(d);
		socket.emit("userstat", d);
		console.log("Socket joined rooom : " + d);
	});

	socket.on("signal", (obj) => {
        console.log("signalled  =>" + obj.id);
        console.log("===");
        socket.peerid=obj.id;
        console.log(obj.room);
		io.sockets.in(obj.room).emit("signalnewclient", obj.id);
	})


    socket.on("disconnect", () => {
        console.log("disconeeeeee",mapping);
        hash=hash;
        mapping=mapping;
        if(!("room" in socket)){
            return;
        }
        if(!mapping[socket.room]){
            let url = socket.room.slice(0,socket.room.match(/&[0-9]+$/).index);
            let index = hash[url].arr.indexOf(socket.room);
            if(index >= hash[url].j){
                let temp = hash[url].arr.pop();
                if(index != hash[url].arr.length ){
                    hash[url].arr[index] = temp;
                }
                console.log("1-0",hash)
            } else if(index >= hash[url].i){
                [ hash[url].arr[index] , hash[url].arr[hash[url].j-1] ] = [hash[url].arr[hash[url].j-1],hash[url].arr[index]];
                hash[url].j-- ;
                console.log("2-1",hash)
            } else{
                [ hash[url].arr[index] , hash[url].arr[hash[url].i-1] ] = [hash[url].arr[hash[url].i-1],hash[url].arr[index]];
                hash[url].i-- ;
                console.log("3-2",hash)
            }
            let roomdeadsoc=socket.room;
            console.log()
        } else{
            if( io.sockets.adapter.rooms[socket.room]==undefined){
                delete mapping[socket.room];
            }
        }
        socket.leave(socket.room);
        console.log("left room bro",mapping)
        console.log(socket.peerid);
        io.sockets.in(socket.room).emit("left", socket.peerid);
        
	})
});




server.listen(process.env.PORT || 3300);