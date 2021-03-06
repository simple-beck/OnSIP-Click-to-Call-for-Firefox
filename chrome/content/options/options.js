onsip.optionsDataBoolean = [];
onsip.optionsDataInteger = [];
onsip.optionsDataString  = [];

// Handles changing the options page
onsip.changePage = function (pageList) {
  onsip.storeOptions();
  document.getElementById("onsip-options-iframe").setAttribute("src", pageList.selectedItem.value);
};

// Initializes the options dialog
onsip.initializeOptions = function () {
  var pageDocument = document.getElementById("onsip-options-iframe").contentDocument;

  
  // If the from address preference is set
  if (onsip.optionsDataString["onsip.call.setup.from.address"]) {
    onsip.log('SETTING :: Initial options');
    onsip.log( onsip.optionsDataString["onsip.call.setup.from.address"] );
    pageDocument.getElementById("onsip.call.setup.from.address").value = onsip.optionsDataString["onsip.call.setup.from.address"];
  } else if (onsip.isPreferenceSet("onsip.call.setup.from.address")) {
    
    onsip.log('TEMP :: getting onsip.call.setup.from.address')
    onsip.log(onsip.getStringPreference("onsip.call.setup.from.address"))

    pageDocument.getElementById("onsip.call.setup.from.address").value = onsip.getStringPreference("onsip.call.setup.from.address");
  }

  // Password
  if(onsip.optionsDataString['onsip.call.setup.user.password']){
      pageDocument.getElementById('onsip.call.setup.user.password').value = onsip.optionsDataString['onsip.call.setup.user.password'];
  }else if ( onsip.isPreferenceSet( 'onsip.call.setup.user.password' )) {
      pageDocument.getElementById('onsip.call.setup.user.password').value =  onsip.getStringPreference('onsip.call.setup.user.password');
  }

  // Highrise Url
  if(onsip.optionsDataString['onsip.call.setup.highrise.url']){
      pageDocument.getElementById('onsip.call.setup.highrise.url').value = onsip.optionsDataString['onsip.call.setup.highrise.url'];
  }else if ( onsip.isPreferenceSet( 'onsip.call.setup.highrise.url' )) {
      pageDocument.getElementById('onsip.call.setup.highrise.url').value =  onsip.getStringPreference('onsip.call.setup.highrise.url');
  }
  // Highrise Token
  if(onsip.optionsDataString['onsip.call.setup.highrise.token']){
      pageDocument.getElementById('onsip.call.setup.highrise.token').value = onsip.optionsDataString['onsip.call.setup.highrise.token'];
  }else if ( onsip.isPreferenceSet( 'onsip.call.setup.highrise.token' )) {
      pageDocument.getElementById('onsip.call.setup.highrise.token').value =  onsip.getStringPreference('onsip.call.setup.highrise.token');
  }
  // Highrise Timezone
  if(onsip.optionsDataString['onsip.call.setup.timezone']){
      pageDocument.getElementById('onsip.call.setup.timezone').value = onsip.optionsDataString['onsip.call.setup.timezone'];
  }else if ( onsip.isPreferenceSet( 'onsip.call.setup.timezone' )) {
      pageDocument.getElementById('onsip.call.setup.timezone').value =  onsip.getStringPreference('onsip.call.setup.timezone');
  }
};


// Saves the user's options
onsip.saveOptions = function () {
  onsip.log('SETTING :: Saving options');
  var parentWindow = null;
  var option       = null;
  var optionValue  = null;

  var iFrame       = document.getElementById("onsip-options-iframe");
  var pageDocument = iFrame.contentDocument;

  // Validate accounts
  var params = {
      'username' : pageDocument.getElementById('onsip.call.setup.from.address').value,
      'password' : pageDocument.getElementById('onsip.call.setup.user.password').value,
      'url' : 'http://www.jnctn.com/restapi'
  }
  onsip.log('SETTINGS :: params -> ');
  onsip.log(JSON.stringify(params));
  // Set validating message
  var optionsMessage = pageDocument.getElementById('options.message');
  optionsMessage.value = "validating ...";
  onsip.setBooleanPreference('highrise.enabled', false);

  onsip.isCredentialsValid({
      onSuccess : function(data){
          onsip.log('SETTINGS :: Credentials valid');
            sessionId = data.seesionId;
            userId = data.userId;
            onsip.getOnsipUserInfo({
                onSuccess : function(data) {
                    onsip.log('data');
                    
                    onsip.log('1');
                    onsip.setBooleanPreference('onsip.enabled', true);
                    onsip.log(data.Name);
                    onsip.setStringPreference('onsip.call.setup.user.name', data.Name);

                    onsip.log('2');
                    onsip.setStringPreference('onsip.call.setup.user.password', pageDocument.getElementById('onsip.call.setup.user.password').value) ;
                    onsip.log('3');
                    onsip.setStringPreference('onsip.call.setup.from.address', pageDocument.getElementById("onsip.call.setup.from.address").value)
                    onsip.log('4');
                    var onsipAddress = onsip.getStringPreference("onsip.call.setup.from.address");

                    if (onsipAddress.indexOf("@") != -1) {
                        onsip.setStringPreference("onsip.call.setup.to.domain",
                        onsipAddress.substring(onsipAddress.indexOf("@")+1) );
                    }

                    // Highlight
                    pageDocument.getElementById('onsip.options.general.from.address.label').style.color = '#000';
                    pageDocument.getElementById('onsip.options.general.user.password.label').style.color = '#000';

                    onsip.log('isHighriseCredentialsEntered' + isHighriseCredentialsEntered());
                    // validate highrise data
                    if(isHighriseCredentialsEntered()){
                        var highriseParams = {};
                        highriseParams.url = pageDocument.getElementById('onsip.call.setup.highrise.url').value;
                        highriseParams.token = pageDocument.getElementById('onsip.call.setup.highrise.token').value;
                        // Check highrise credentials
                        highrise.isCredentialsValid({
                            onSuccess : function () {
                                pageDocument.getElementById('onsip.call.setup.highrise.url.label').style.color = '#000';
                                pageDocument.getElementById('onsip.call.setup.highrise.token.label').style.color = '#000';

                                // Store credentials
                                onsip.setStringPreference('onsip.call.setup.highrise.url', formatUrl(pageDocument.getElementById('onsip.call.setup.highrise.url').value));
                                onsip.setStringPreference('onsip.call.setup.highrise.token', pageDocument.getElementById('onsip.call.setup.highrise.token').value);
                                onsip.setStringPreference('onsip.call.setup.timezone', pageDocument.getElementById('onsip.call.setup.timezone').value);

                                onsip.log('SETTING :: highrise enabled');
                                onsip.setBooleanPreference('highrise.enabled', true);

                                optionsMessage.value = 'your settings are saved';
                            },
                            onError : function () {
                                // Error wrong credentials provided
                                pageDocument.getElementById('onsip.call.setup.highrise.url.label').style.color = '#FF1111';
                                pageDocument.getElementById('onsip.call.setup.highrise.token.label').style.color = '#FF1111';

                                optionsMessage.value = 'Incorrect Highrise credentials provided';

                            }},
                            highriseParams
                        );
                    }else{
                        optionsMessage.value = 'your settings are saved';
                    }
                    
                },
                onError : function() {
                    // show an error message
                    pageDocument.getElementById('onsip.options.general.from.address.label').style.color = '#FF1111';
                    pageDocument.getElementById('onsip.options.general.user.password.label').style.color = '#FF1111';

                    optionsMessage.value = 'Incorrect Onsip credentials provided';
                }
            },
            data);
      },
      onError : function(){
          //  Show an error message
            pageDocument.getElementById('onsip.options.general.from.address.label').style.color = '#FF1111';
            pageDocument.getElementById('onsip.options.general.user.password.label').style.color = '#FF1111';
            optionsMessage.value = 'Incorrect Onsip credentials provided';
      }}, params
  );


  // Loop through the boolean options
  for (option in onsip.optionsDataBoolean) {
    if (onsip.optionsDataBoolean.hasOwnProperty(option)) {
      onsip.setBooleanPreference(option, onsip.optionsDataBoolean[option]);
    }
  }
  
  // Loop through the integer options
  for (option in onsip.optionsDataInteger) {
    if (onsip.optionsDataInteger.hasOwnProperty(option)) {
      optionValue = onsip.optionsDataInteger[option];
    
      // If the option value is set
      if (optionValue) {
        onsip.setIntegerPreference(option, optionValue);
      } else if(onsip.isPreferenceSet(option)) {
        onsip.deletePreference(option);
      }
    }
  }
  
  // Loop through the string options
  for (option in onsip.optionsDataString) {

    if (onsip.optionsDataString.hasOwnProperty(option)) {

      optionValue = onsip.optionsDataString[option];
      
      // If the option value is set or the preference currently has a value
      if(optionValue || onsip.isPreferenceSet(option)) {
        onsip.setStringPreference(option, optionValue);
      }
    }
  }
  
  return false;
};

onsip.getOnsipUserInfo = function(callback, params){

    var xhr = new XMLHttpRequest();
    var url = 'http://www.jnctn.com/restapi';
    var dataToSend = 'Action=UserRead&Output=json&UserId='+ params.userId +'&SessionId=' +params.sessionId;
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function(){
        if(this.readyState == 4){
            if( this.status == 200 ){
                  onsip.log(this.responseText);
                dataReceived = eval('(' + this.responseText + ')');
                if( dataReceived.Response.Context.Action.IsCompleted == 'true' ){
                    onsip.log('request is complete');
                    onsip.log(dataReceived.Response.Result.UserRead.User.Contact.Name);
                    var userInfo = { Name : dataReceived.Response.Result.UserRead.User.Contact.Name };
                    if(callback){callback.onSuccess(userInfo);}
                }else{
                    onsip.log('request is not complete');
                    if(callback){callback.onError();}
                }
            }
        }
    };
    xhr.send( dataToSend );
}

/**
 * Validate onsip credentials
 */
onsip.isCredentialsValid = function( callback, params ){

    var xhr = new XMLHttpRequest();
//    var url = params.url;
    var url = 'http://www.jnctn.com/restapi';
    var dataToSend = 'Action=SessionCreate&Output=json&Username=' +params.username +'&'+ 'Password='+params.password;
    
    onsip.log(dataToSend);

    xhr.open('POST', url, true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function(){
        if(this.readyState == 4){
            if (xhr.status == 200) {
                dataReceived = eval('(' + xhr.responseText + ')');
                if (dataReceived.Response.Context.Session.IsEstablished  == 'true'){
                    successData = {};

                    successData.sessionId = dataReceived.Response.Context.Session.SessionId;
                    successData.userId = dataReceived.Response.Context.Session.UserId;
                    
                    if( callback.onSuccess ){callback.onSuccess(successData);}
                }else{
                    if( callback.onSuccess ){callback.onError();}
                }
            }
        }
    }
    xhr.send(dataToSend);
}

/**
 * Check if highrise credentials entered
 *  return bool
 */
function isHighriseCredentialsEntered(){
    var iFrame       = document.getElementById("onsip-options-iframe");
    var pageDocument = iFrame.contentDocument;

    if( pageDocument.getElementById('onsip.call.setup.highrise.url').value != 0){
        return true;
    }
    if( pageDocument.getElementById('onsip.call.setup.highrise.token').value != 0){
        return true;
    }
    return false;
}