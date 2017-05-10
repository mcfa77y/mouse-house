const db = require('./database')
String.prototype.capitalize = function(){
       return this.replace( /(^|\s|_)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
      };
// Constructor
function Base_Controller(bar, fname, lname) {
  // always initialize all instance properties
  this.namae = bar;
  this.first_name=fname
  this.last_name=lname
}
// class methods
Base_Controller.prototype.name = () => {console.log("my name is " + this.first_name +" " +this.last_name)}

Base_Controller.prototype.models = () => {
	console.log("model name: " + this.namae)
    return db.discoverAndBuildModels( this.namae, {
            visited: {},
            associations: true
        })
        .then((models) => {
            return models[ this.namae.toLowerCase().capitalize()]
        })
}

// export the class
module.exports = Base_Controller;