module.exports = {
    isLoggedIn: function(req,res,next){
        if(req.session.user){
            next();
        }else{
            req.flash("error", `You must be logged in...`);
            req.session.save(function(err){
                if(err) next(err);
                res.redirect('/login');
            })
        }

    },
    isMyProfile: function(req,res,next){
        var {id} = req.params;
        if(req.session.user && id == req.session.user.userId){
            next();
        }else{
            req.flash("error", `This is a profile 
            which isn't yours`);
            req.session.save(function(err){
                if(err) next(err);
                res.redirect('/');
            })
        }

    }
}