var highrise = {};

/**
 * Highrise Check is credentials are valid
 */
highrise.isCredentialsValid = function(callback, params) {
    onsip.log('HIGHRISE :: isCredentialsValid CALLED');
    var url = formatUrl(params.url) + '/me.xml';
    var xhr = XMLHttpRequest();
    xhr.mozBackgroundRequest = true;
    xhr.open('GET', url , true, params.token, "dummyPassword");
    
    xhr.onreadystatechange = function(){
        if(this.readyState == 4){
            if (this.status == 200) {
                onsip.log('HIGHRISE :: isCredentialsValid SUCCESS');
                if(callback){callback.onSuccess();}
            } else if( this.status == 401 ){
                onsip.log('HIGHRISE :: isCredentialsValid 401');
                if(callback){callback.onError();}
            } else if (this.status == 0 ){
                onsip.log('HIGHRISE :: isCredentialsValid 0');
                if(callback){callback.onError();}
            }
        }
    }
    // Send
    xhr.send();
}

/**
 * Get some Info From Highrise
 */
highrise.getFromHighrise = function(callback, params){
    var url = params.url;
    var token = params.token;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true, token, 'DummyPass');
    xhr.onreadystatechange = function () {
        if( this.readyState == 4 ){
            if( this.status == 200 ){
                onsip.log('HIGHRISE :: Retrived info');
                if( callback ){callback.onSuccess(this.responseXML);}
            }else{
                onsip.log('HIGHRISE :: Error Retriving info');
                if( callback ){callback.onError();}
            }
        }
    }
    // Send
    xhr.send(null);
}

/**
 *  Add Note to customers profile on highrise
 */
highrise.addNoteToCustomerProfile = function (customer, note, params){
    onsip.log('HIGHRISE :: Add note called');

    var url = params.url +"/" +customer.type+ "/"+ customer.id +"/notes.xml";
    var token = params.token;

    // Let's try to add a note
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true, token, 'DummyPass');
    xhr.setRequestHeader('Content-Type', 'application/xml')
    xhr.onreadystatechange = function() {
        if( this.readyState == 4 ){
            if( this.status == 201 ){
                onsip.log('HIGHRISE :: Added note');
            }else{
                onsip.log('HIGHRISE :: Error while adding note');
            }
        }
    }
    // Send a note
    xhr.send(note);
}

