exports.remove = function (model, _primarycontactnumber, response){
    console.log('Deleting contact with primary number: ' + _primarycontactnumber);
    model.findOne({primarycontactnumber: _primarycontactnumber}, function(error, data){
        if(error){
            console.log(error);
            if(response !== null){
                response.writeHead(500, {'Content-type' : 'text/plain'});
                response.end('Internal server error');
            }
            return;
        }else{
            if(!data){
                console.log('Not found');
                if(response !== null){
                    response.writeHead(404, {'Content-type':'text/plain'});
                    response.end('Not found');
                }
                return;
            }else{
                data.remove(function(error){
                    if(!error){
                        data.remove();
                    }else{
                        console.log(error);
                    }
                });
                if(response !== null){
                    response.send('Deleted');
                }
                return;
            }
        }
    });
}

exports.update = function (model, requestBody, response) {
    var primarynumber = requestBody.primarycontactnumber;
    model.findOne({primarycontactnumber: primarynumber}, function(error, data) {
        if (error) {
            console.log(error);
            if (response !== null) {
                response.writeHead(500,{'Content-type': 'text/plain'});
                response.end('Internal server error');
            }
            return;
        }else {
            var contact = toContact(requestBody, model);
            if (!data) {
                console.log('Contact with primary number : ' + primarynumber + 'does not exist. The contact will be created');
                contact.save(function (error) {
                    if (!error) {
                        contact.save();
                    }
                });

                if (response !== null) {
                    response.writeHead(201, {'Content-type': 'text/plain'});
                    response.end('Created');
                }
                return;
            }

            data.firstname = contact.firstname;
            data.lastname = contact.lastname;
            data.title = contact.title;
            data.company = contact.company;
            data.jobtitle = contact.jobtitle;
            data.primarycontactnumber = contact.primarycontactnumber;
            data.othercontactnumbers = contact.othercontactnumbers;
            data.emailaddresses = contact.emailaddresses;
            data.primaryemailaddress = contact.primaryemailaddress;
            data.groups = contact.groups;

            data.save(function (error) {
                if (!error) {
                    console.log('Successfully updated contact with primary number : ' + primarynumber);
                    data.save();
                } else {
                    console.log('Error on save');
                }
            });

            if (response !== null) {
                console.log('Updated');
            }
        }
    });
}

exports.create = function (model, requestBody, response){
    var contact = toContact(requestBody, model);
    var primarynumber = contact.primarycontactnumber;
    console.log('pippo');
    contact.save(function (error){
       if(!error){
           contact.save();
       }else{
           console.log('Checking if saving failed due to already existing primary number :' + primarynumber);
           model.findOne({primarycontactnumber: primarynumber}, function(error, data){
              if(error){
                  console.log(error);
                  if(response !== null){
                      response.writeHead(500, {'Content-type' : 'text/plain'});
                      response.end('Internal server error');
                  }
                  return;
              } else{
                  var contact = toContact(requestBody, model);
                  if(!data){
                      console.log('The contact does not exist. It will be created');
                      contact.save(function(error){
                         if(!error){
                             contact.save();
                         } else{
                             console.log(error);
                         }
                      });

                      if(response !== null){
                          response.writeHead(201, {'Content-type' : 'text/plain'});
                          response.end('Created');
                      }
                      return;
                  }else{
                      console.log('Updating contact with primary number :' + primarynumber);

                      data.firstname = contact.firstname;
                      data.lastname = contact.lastname;
                      data.title = contact.title;
                      data.company = contact.company;
                      data.jobtitle = contact.jobtitle;
                      data.primarycontactnumber = contact.primarycontactnumber;
                      data.othercontactnumbers = contact.othercontactnumbers;
                      data.emailaddresses = contact.emailaddresses;
                      data.primaryemailaddress = contact.primaryemailaddress;
                      data.groups = contact.groups;

                      data.save(function(error){
                          if(!error){
                              data.save();
                              response.end('Updated');
                              console.log('Successfully updated the contact with primary number :' + primarynumber);
                          }else{
                              console.log('Error while saving contact with primary number :' + primarynumber);
                              console.log(error);
                          }
                      });
                  }
              }
           });
       }
    });
}

function toContact(body, Contact){
    return new Contact({
        firstname: body.firstname,
        lastname: body.lastname,
        title: body.title,
        company: body.company,
        jobtitle: body.jobtitle,
        primarycontactnumber: body.primarycontactnumber,
        primaryemailaddress: body.primaryemailaddress,
        emailaddresses: body.emailaddresses,
        groups: body.groups,
        othercontactnumbers: body.othercontactnumbers
    });
}

exports.findByNumber = function(model, _primarycontactnumber, response){
    model.findOne({primarycontactnumber : _primarycontactnumber}, function(error, result){
       if(error){
           console.log(error);
           response.writeHead(500, {'Content-type':'text/plain'});
           response.end('Internal server error');
       } else{
           if(!result){
               if(response !== null){
                   response.writeHead(404, {'Content-type' : 'text/plain'});
                   response.end('File not found');
               }
               return;
           }
           if(response !== null){
               response.setHeader('Content-type','application/json');
               response.send(result);
           }
           console.log(result);
       }
    });
}

exports.list = function(model, response){
    model.find({}, function(error, result){
       if(error){
           console.log(error);
           return null;
       }

       if(response !== null){
           response.setHeader('Content-type', 'application/json');
           response.end(JSON.stringify(result));
       }
       return JSON.stringify(result);
    });
}