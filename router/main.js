module.exports = function(app, fs){

    app.get('/',function(req,res){
        sess = req.session;
       // console.log(sess.username);
       
        res.render('index',{
            title: "MY HOMEPAGE",
            length: 5,
            name: sess.name,
            username: sess.username
        })
      
    });

    //로그인
    app.get('/login/:username/:password', function(req,res){
        var sess;
        sess = req.session;
        fs.readFile( __dirname + '/../data/user.json','utf8',function(err,data){
            var users = JSON.parse(data);
            var username = req.params.username;
            var password = req.params.password;
            var result = { };

            if(!users[username]){
                // UserName not Found
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

        
            if(users[username]["password"] == password){
                result["success"] = 1;
                sess.username = username;
                sess.name = users[username]["name"];
                res.json(result);

            }else{
                result["success"] = 0;
                result["error"] = "incorrect";
                res.json(result);
            }

        })

    });

    //로그아웃
    app.get('/logout', function(req,res){
        sess = req.session;
        if(sess.username){
            req.session.destroy(function(err){
                if(err){
                    console.log(err);
                }else{
                    res.redirect('/');
                }
            })
        }else{
            res.redirect('/');
        }
    });

    app.get('/list', function(req,res){
        fs.readFile(__dirname+'/../data/'+'user.json','utf8',function(err,data){
            console.log(data);
            res.end(data);
        })
    });

    app.get('/getUser/:username', function(req,res){
        fs.readFile( __dirname+'/../data/user.json','utf8',function(err,data){
            var users = JSON.parse(data);
            res.json(users[req.params.username]);
        });
    });

    app.post('/addUser/:username', function(req,res){
        var result      = { };
        var username    = req.params.username;

  
        //Check Req Validity
        if(!req.body['password'] || !req.body['name']){
            result['success'] = 0 ;
            result['error']   = 'invalid request';
            res.json(result);
            return;
        }

        // LOAD DATA & CHECK DUPLICATION
        fs.readFile( __dirname+'/../data/user.json','utf8', function(err,data){
            //console.log(data);
            var users = JSON.parse(data);
            if(users[username]){
                //Duplication found
                result['success'] = 0;
                result['error']   = 'duplicate';
                res.json(result);
                return;
            }
            // ADD TO DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile( __dirname +'/../data/user.json',
                         JSON.stringify(users,null,'\t'),'utf8',function(err,data){
                            result = {'success': 1};
                            res.json(result);
                         });
        });
        
    });

    app.put('/updateUser/:username', function(req,res){
        var result      = { };
        var username    = req.params.username;

        //Check Req Validity
        if(!req.body['password'] || !req.body['name']){
            result['success'] = 0 ;
            result['error']   = 'invalid request';
            res.json(result);
            return;
        }

        // LOAD DATA & CHECK DUPLICATION
        fs.readFile( __dirname+'/../data/user.json','utf8', function(err,data){
            //console.log(data);
            var users = JSON.parse(data);

            // ADD/Modify TO DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile( __dirname +'/../data/user.json',
                         JSON.stringify(users,null,'\t'),'utf8',function(err,data){
                            result = {'success': 1};
                            res.json(result);
                         });
        });

    });   
    
    app.delete('/deleteUser/:username', function(req,res){
        var result = { };

        //Load Data
        fs.readFile( __dirname+'/../data/user.json','utf8', function(err,data){
            var users = JSON.parse(data);
            // IF Not found
            if(!users[req.params.username]){
                result["success"] = 0;
                result["error"]   = 'not found';
                res.json(result);
                return;
            }

            //Delete Form Data
            delete users[req.params.username];

            // Save File
            fs.writeFile( __dirname+'/../data/user.json',
                         JSON.stringify(users, null, '\t'),'utf8',function(err,data){
                             result['success'] = 1;
                             res.json(result);
                             return;
                         })
        })
    });
}