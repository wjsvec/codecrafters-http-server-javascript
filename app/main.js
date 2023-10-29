const net = require("net");
const fs = require('fs');
let dir;
if (process.argv.length > 2 && process.argv[2] == "--directory") {
  dir = process.argv[3];
  if (!dir.endsWith("/")) {
    dir = dir + "/";
  }
1
}


// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        console.log(String(data).split("\r\n"))
        if(String(data).split("\r\n")[0].split(" ")[0] =="POST" && String(data).split("\r\n")[0].split(" ")[1].slice(0,6) =="/files"){
            
            fs.writeFile(dir+String(data).split("\r\n")[0].split(" ")[1].slice(7), "dataToWrite", 'utf8', (err) => {
                if (err) {
                  console.error('无法写入文件:', err);
                  socket.end();
                  return;
                }
              
                socket.write("HTTP/1.1 201 \r\n\r\n");
                socket.end();
              });
            
            return;
        }
        
        if(String(data).split("\r\n")[0].split(" ")[1] =="/"){
            socket.write("HTTP/1.1 200 OK\r\n\r\n");
        }
        else if(String(data).split("\r\n")[0].split(" ")[1].slice(0,5) =="/echo"){
            let res = ["HTTP/1.1 200 OK",
                "Content-Type: text/plain",
                "Content-Length: "+String((String(data).split("\r\n")[0].split(" ")[1].slice(5,)).length -1)+"\r\n",           
                String(data).split("\r\n")[0].split(" ")[1].slice(6,)];
            socket.write(res.join("\r\n"))
        }
        else if (String(data).split("\r\n")[0].split(" ")[1].slice(0,11) =="/user-agent"){
            var res = ["HTTP/1.1 200 OK",
                "Content-Type: text/plain",
                "Content-Length: "+String((String(data).split("\r\n")[2].split(" ")[1]).length )+"\r\n",           
                (String(data).split("\r\n")[2].split(" ")[1])];
            // console.log(res)

            socket.write(res.join("\r\n"))

        }
        else if(String(data).split("\r\n")[0].split(" ")[1].slice(0,6) =="/files"){
            // console.log(String(data).split("\r\n"))
            
            fs.readFile(dir+String(data).split("\r\n")[0].split(" ")[1].slice(7),  (err, content) => {
                
                if (err) {
                    socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
                    socket.end();
                    return;
                }
              
                res = ["HTTP/1.1 200 OK",
                "Content-Type: application/octet-stream",
                "Content-Length: "+String((String(content)).length )+"\r\n",           
                (content).toString()];
                socket.write(res.join("\r\n"));
                return;

               
              });

            
            // console.log(dir+String(data).split("\r\n")[0].split(" ")[1].slice(7))
            return;

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
