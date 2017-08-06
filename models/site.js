var mongoose = require('mongoose');

//mongoose.connect('mongodb://heroku_d41xhhbh:8noui905v24of65nfletr5eu5s@ds129469.mlab.com:29469/heroku_d41xhhbh');
   // mongoose.connect('mongodb://localhost/pogo')
var Schema = mongoose.Schema;
var siteSchema = new Schema({
        name: {type: String, required: true},
        location: {
            street: String,
            city: String,
            state: String,
            zip: String
        },
        line_rates: [{
            rate: Number,
            date: {type: Date, default: Date.now}
        }],
        mostVisits: Number,
        leastVisits: Number,
        mostPurchases: Number,
        leastPurchases: Number,
        device_id: String,//required to ensure proper device is updating proper site
        image_url: String,
        icon_url: String,
        manager: {
            id: String,
            agent: String,
            business: String,
            email: String
        },
        managers:[{type: Schema.Types.ObjectId, ref: 'user'}]
});


var Site = module.exports = mongoose.model('Site',siteSchema);


module.exports.getSite = function(id,callback){
    console.log('gettin a site at '+id)
    Site.findById(id).populate('managers').exec(callback);
   
   
}
module.exports.monitoredSites = function(ids,callback){
    var query = {_id:ids};
    Site.find(query,callback);
    
}
module.exports.managed_sites = function(ids,callback){
    var managed_sites = [];
    var error;
    console.log('user manages '+ ids.length + ' sites')
    ids.forEach(function(site,index){
        var query = {_id:site};
        Site.find(query,function(err,site){
            if (err){
                error = err;
                callback(err,[]);
            }
            if (site.length > 0){
                console.log('found site '+site)
                managed_sites.push(site[0])
            }
            if(index == ids.length-1){
                callback(null,managed_sites);
            }
        }); 
    });
   
    
}
module.exports.managed_site = function(ids,callback){
    var query = {_id:ids};
    Site.findOne(query,callback);
    
}
module.exports.createSite = function(site,callback){
        Site.create(site,callback);
}
module.exports.getSites = function(callback){
    Site.find(callback);
}
module.exports.updateRate = function(id,rate,callback){
    var newRate = {
        rate: rate
    }
    Site.findById(id,function(err,site){
        if (err) throw err;
        site.line_rates.push(newRate);
        site.save(callback)
    })
}
module.exports.addManager = function(id,man_email,callback){
   User = require('./user');
   User.findOne({email:man_email},function(err,user){
       console.log('looking for user');
       if (err) throw err;
       function isMonitored(siteId){
           return siteId == id
       };
        if(!user.managed_sites.some(isMonitored)){
            user.managed_sites.push(id);
            user.save();
         Site.findById(id,function(err,site){
            console.log(user);
            if (user){
            site.managers.push(user._id);
            site.save(callback);
            }
        });
        }
       
   });
}

module.exports.removeManager = function(id,manager,callback){
   User = require('./user');
   User.findById(manager,function(err,user){
       if(err) throw err;
        Site.findById(id,function(err,site){
            if (err) throw err;
            site.managers = site.managers.filter(function(man){
                return man._id != manager
            })
            site.save(callback)
        });
   });
}
module.exports.removeAllManagers = function(id,manager,callback){
    Site.findById(id,function(err,site){
        if(err) throw err
        User = require('./user');
        for(manager in site.managers){
            User.findById(manager,function(err,manager){
                if(manager != null){
                    manager.managed_sites = manager.managed_sites.filter(function(site){
                        return site != id
                    });
                    manager.save();
                }
            })
        }
        site.managers = [];
        console.log(site.managers);
        site.save(callback);
    });
  
}
module.exports.updateSite = function(id,update,callback){
    var query = {_id: id};
 
    Site.findOneAndUpdate(query,update,{overwrite:true},callback);
}


