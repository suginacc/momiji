"use strict";

function escapeHTML(html) {
    var p = document.createElement('p');
    p.innerText = html;
    return p.innerHTML;
}

function rep_post(i, msgid) {
    fetch('https://api.sugina.cc/board/manage', {
        method: 'POST',
        body: JSON.stringify({
            boardId: msgid,
            reply: document.getElementById("textarea_" + i).value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(res) {
        document.getElementById("textarea_" + i).value = "";
        refreshBoard();
    });
}

function refreshBoard() {
    fetch('https://api.sugina.cc/board/manage')
    .then(function(response) {
        return response.json();
    })
    .then(function(messages) {
        var content = "<table><th>Time</th><th>User Name</th><th>Message</th><th>Reply Message</th>";
        for (var i = 0; i < messages.length; i++) {
            var replyField = "<textarea id=\"textarea_" + i + "\"></textarea>"
            + "<br /><button onclick=\"rep_post(" + i + ", " + messages[i].msgid + ")\">Post</button>";

            content += "<tr>"
            + "<td>" + messages[i].time + "</td>"
            + "<td>" + messages[i].userName + "</td>"
            + "<td>" + escapeHTML(messages[i].message) + "</td>"
            + "<td>" + (messages[i].replymsg ? escapeHTML(messages[i].replymsg) : replyField) + "</td>"
            + "</tr>";
        }
        content += "</table>";
        document.getElementById("div_table").innerHTML = content;
    });
}

fetch('https://api.sugina.cc/isadmin')
.then(function(response) {
    return response.json();
})
.then(function(res) {
    refreshBoard();
})
.catch(function(response) {
    document.body.innerHTML = "<h1>Please become an administrator to use this feature!</h1>";
});
