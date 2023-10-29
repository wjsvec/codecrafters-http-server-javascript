const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        console.log(String(data).split("\r\n"))
        if(String(data).split("\r\n")[0].split(" ")[1] =="/"){
            socket.write("HTTP/1.1 200 OK\r\n\r\n");
        }
        else if(String(data).split("\r\n")[0].split(" ")[1].slice(0,5) =="/echo"){
            var res = ["HTTP/1.1 200 OK",
                "Content-Type: text/plain",
                "Content-Length: 3",           
                "abc"];
            confirm.log(res.join("\r\n"))
            socket.write(res.join("\r\n"))
        }
        else{
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        }
        
        socket.end();
1
    });
    
  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");
