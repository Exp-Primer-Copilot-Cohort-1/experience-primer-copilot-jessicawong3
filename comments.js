// Create web server
// Start: node comments.js

// Load modules
var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var url = require('url');
var path = require('path');

// Create server
http.createServer(function (request, response) {

    // Get the URL
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    var pathname = url_parts.pathname;

    // Log the request
    console.log(request.method + ' ' + request.url);

    // If this is a POST request, process the form input
    if (request.method == 'POST') {
        processPost(request, response, function () {
            console.log(request.post);
            // Use request.post here

            // Redirect to the home page
            response.writeHead(302, { 'Location': '/' });
            response.end();
        });
    } else {
        // Handle GET requests
        switch (pathname) {
            case '/':
                display_form(response);
                break;
            case '/comments':
                display_comments(response);
                break;
            default:
                display_404(pathname, response);
                break;
        }
    }
}).listen(8000);

// Display the comment form
function display_form(response) {
    response.writeHead(200, { 'Content-Type': 'text/html' });

    // Read and display the form
    fs.readFile('./form.html', function (err, data) {
        response.write(data);
        response.end();
    });
}

// Display the comments
function display_comments(response) {
    response.writeHead(200, { 'Content-Type': 'text/html' });

    // Read and display the comments
    fs.readFile('./comments.txt', function (err, data) {
        response.write('<h1>Comments</h1>');
        response.write('<div id="comments">');
        response.write(data);
        response.write('</div>');
        response.end();
    });
}

// Display a 404 page
function display_404(pathname, response) {
    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.write('<h1>Not Found</h1>');
    response.write('<p>The requested URL ' + pathname + ' was not found on this server.</p>');
    response.end();
}

// Process the form input
function processPost(request, response, callback) {
    var queryData = '';

    //