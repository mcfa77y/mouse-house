const db = require('./database')
String.prototype.capitalize = function(){
       return this.replace( /(^|\s|_)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
      };
// Constructor
class Base_Controller {
  constructor(bar, fname, lname){
    // always initialize all instance properties
    this.namae = bar;
    this.first_name=fname
    this.last_name=lname
  }

  name() {console.log("my name is " + this.first_name +" " +this.last_name)}

  models() {
    return db.discoverAndBuildModels( this.namae, {
            visited: {},
            associations: true
        })
        .then((models) => {
            return models[ this.namae.toLowerCase().capitalize().replace('_','')]
        })
}

}

// export the class instance
module.exports = Base_Controller;