var express = require('express');
var morgan = require('morgan');
var path = require('path');

var Pool=require('pg').Pool;

var config= {
    user: 'anshuspanda',
    database: 'anshuspanda',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));

var articles = {
    "article-one": {
        title: "Article One",
        name: "Article One | Anshu S Panda",
        date: "01/02/2018",
        content: `
        <p>This is the place where the article one is shown.This is the place where the article one is shown.This is the place where the article one is shown.This is the place where the article one is shown.This is the place where the article one is shown.This is the place where the article one is shown.</p>
        `
    },
    "article-two": {
        title: "Article Two",
        name: "Article Two | Anshu S Panda",
        date: "07/02/2018",
        content: `
        <p>This is the place where the article two is shown.This is the place where the article two is shown.This is the place where the article two is shown.This is the place where the article two is shown.This is the place where the article two is shown.This is the place where the article two is shown.</p>
        `
    },
    "article-three": {
        title: "Article Three",
        name: "Article Three | Anshu S Panda",
        date: "27/02/2018",
        content: `
        <p>This is the place where the article two is shown.</p>
        `
    }
};

function createTemplate(data){
    var title=data.title;
    var date=data.date;
    var name=data.name;
    var content=data.content;
    
    var htmltemplate=`
    <html>
    <head>
        <title>
            ${title}
        </title>
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <body>
        <div class="container">
            <div>
                <a href="/">Home</a>
            </div>
            <h3>
                ${name}
            </h3>        
            <h4>${date}</h4>
            <div>
                ${content}
            </div>
        </div>
        </body>
    </html>
    `;
    
    return htmltemplate;
    
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/articles/:articleName',function(req, res){
    
    pool.query("SELECT * FROM article WHERE title=$1", [req.params.articleName], function(err, result) {
        if(err) {
            result.status(500).send(err.toString());
        }
        else {
            if(res.rows===0) {
                result.status(404).send("Article Not Found");
            } else {
                var articleData=result.rows[0];
                result.send(createTemplate(articleData));
            }
        }
        
    })

});

var pool=new Pool(config);
app.get('/test-db',function(req,res) {
    pool.query("SELECT * FROM test", function(err,result) {
       if(err) {
           res.status(500).send(err.toString());
       } 
       else {
           res.send(JSON.stringify(result));
       }
    });
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
