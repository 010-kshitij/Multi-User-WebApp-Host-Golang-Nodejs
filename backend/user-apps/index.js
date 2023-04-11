const express = require('express');
const path = require('path');
const app = express();

app.all('*', (request, response) => {
    const path_split = request.path.split('/');
    const user = path_split[1];
    const project = path_split[2];
    let path_after_path = request.path.replace(`/${user}/${project}/`,"");
    console.log(path_after_path);
    response.send("htllo"); return;
    if(request.path.replace(`/${user}/${project}/`,"") === '') {
        response.sendFile(
            path.join(__dirname, "projects", user, project,
            "index.html"
        ));    
        return;
    }
    response.sendFile(
        path.join(__dirname, "projects", user, project,
        request.path.replace(`/${user}/${project}/`,"")
    ));
});

app.listen(5000, () => {
    console.log("Server started on port 5000");
});