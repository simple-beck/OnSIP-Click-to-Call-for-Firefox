function HTMLParser(aHTMLString){
  var html = document.implementation.createDocument("http://www.w3.org/1999/xhtml", "html", null),
    body = document.createElementNS("http://www.w3.org/1999/xhtml", "body");
  html.documentElement.appendChild(body);

  body.appendChild(Components.classes["@mozilla.org/feed-unescapehtml;1"]
    .getService(Components.interfaces.nsIScriptableUnescapeHTML)
    .parseFragment(aHTMLString, false, null, body));

  return body;
}

/**
 * function to get first child, FireFox fix
 */
function getFirstChild(el){
  var firstChild = el.firstChild;
  while(firstChild != null && firstChild.nodeType == 3){ // skip TextNodes
    firstChild = firstChild.nextSibling;
  }
  return firstChild;
}

function setRequestedDetails(item){
    
    onsip.setStringPreference('requestedNumber', extractPhoneNumber(item.fromURI));
}

function isCreatedDetailsMatchRequested(item){
    
    var numberToCall = extractPhoneNumber(item.toURI);
    onsip.log("onsip.getStringPreference('requestedNumber')");
    onsip.log(numberToCall);
    onsip.log(onsip.getStringPreference('requestedNumber'));
    
    if(numberToCall == onsip.getStringPreference('requestedNumber')){
        return true;
    }else{
        return false;
    }
}

function clearRequestedNumber(){
    onsip.setStringPreference('requestedNumber', false);
}

function testTabid(tab){

}

/**
 * GetPhoneExtension
 */
function getPhoneExtension( phoneNumber ){
    var extension = phoneNumber.match( /(ext|x|ex)\s{0,3}.{0,3}\d{2,5}/g );
    if(extension ){
        return extension[0] ;
    }
}

/** /(ext|x|ex)\s{0,3}.{0,3}\d{2,5}/
 * Get Domain from address
 */
function getDomain(address) {
	return address.substring(address.indexOf('@') + 1);
}

/**
 * Clean phone number
 */
function cleanPhoneNo(str) {
	return str.replace(/[^\d]/g, '');
}

/**
 *
 */
function escapeRegExp(str) {
	var specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", "g"); // .*+?|()[]{}\
	return str.replace(specials, "\\$&");
}

/**
 *
 */
Array.prototype.unique = function () {
	var r = new Array();
	o:for(var i = 0, n = this.length; i < n; i++) {
		for(var x = 0, y = r.length; x < y; x++) {
			if(r[x]==this[i]) {
				continue o;
			}
		}

		r[r.length] = this[i];
	}

	return r;
}

/**
 * Format Url
 */
function formatUrl(str){
    var res = str.replace(/(http[s]?:\/\/)+/, '');
    return 'https://' + res;
}

function isArray(obj){return(typeof(obj.length)=="undefined")?false:true;}

/**
 * Get a customer with a matching phone number
 */
function getRightCustomer(number, arrayToSearch, extension ){
    // Prepare var to campare to
    if( extension ){
        number += cleanPhoneNo(extension);
    }

    // get root element
    var customers = arrayToSearch.documentElement.childNodes;

    // loop through contacts to match a number
    for(var i=0; i < customers.length; ++i){


        if(customers[i].nodeType == 1){

            // get a phone number
            var phoneNumbers = customers[i].getElementsByTagName('phone-numbers')[0];
            var phoneNumbersArray = phoneNumbers.childNodes;

            if(phoneNumbersArray.length > 0){
                 for(var j=0; j< phoneNumbersArray.length; ++j){

                     if(phoneNumbersArray[j].nodeType == 1){
                         // get ini number
                        var initialPhoneNumber = phoneNumbersArray[j].getElementsByTagName('number')[0].childNodes[0].nodeValue;
                        var cleanPhoneExt = getPhoneExtension( initialPhoneNumber );

                        cleanPhoneNumber = removeExtention( initialPhoneNumber );
                        cleanPhoneNumber = cleanPhoneNo(cleanPhoneNumber);
                        if(cleanPhoneNumber.length == 10){
                            cleanPhoneNumber = '1' + cleanPhoneNumber;
                        }
                        if(cleanPhoneExt ){
                            cleanPhoneNumber += cleanPhoneNo(cleanPhoneExt);
                        }
                        if(cleanPhoneNumber.match(number)){
                            var customer = {};
                            customer.name = customers[i].getElementsByTagName('first-name')[0].childNodes[0].nodeValue + ' ' + customers[i].getElementsByTagName('last-name')[0].childNodes[0].nodeValue;
                            customer.id = customers[i].getElementsByTagName('id')[0].childNodes[0].nodeValue;
                            return customer;
                        }
                     }
                 }
            }
         }
    }
    // if no matches found null will be returned
    return null;
}

/**
 * Get a company with a matching phone number
 *  need to be merged with a getRightCustomer
 */
function getRightCompany(number, arrayToSearch){
 
    // get root element
    var companies = arrayToSearch.documentElement.childNodes;
    // loop through contacts to match a number
    for(var i=0; i < companies.length; ++i){

        if(companies[i].nodeType == 1){

            // get a phone number
            var phoneNumbers = companies[i].getElementsByTagName('phone-numbers')[0];

            var phoneNumbersArray = phoneNumbers.childNodes;
            if(phoneNumbersArray.length > 0){
                for(var j=0; j< phoneNumbersArray.length; ++j){
                    if(phoneNumbersArray[j].nodeType == 1){
                        var cleanPhoneNumber = phoneNumbersArray[j].getElementsByTagName('number')[0].childNodes[0].nodeValue;
                        cleanPhoneNumber = cleanPhoneNo(cleanPhoneNumber);
                        if(cleanPhoneNumber.length == 10){
                            cleanPhoneNumber = '1' + cleanPhoneNumber;
                        }

                        // if number matches then we return the customer
                        if(cleanPhoneNumber.match(number)){
                            var company = {};
                            company.name = companies[i].getElementsByTagName('name')[0].childNodes[0].nodeValue ;
                            company.id = companies[i].getElementsByTagName('id')[0].childNodes[0].nodeValue;
                            return company;
                        }
                    }
                }

            }
        }
    }
    // if no matches found null will be returned
    return null;
}

function removeExtention(str){
    return str.replace( /(ext|x|ex)\s{0,3}.{0,3}\d{2,5}/g, '');
}

/**
 * get formatted current browser time and date
 */
function getDateAndTime(timezone){
    if(!timezone){
        timezone = '';
    }
    var m_names = new Array("January", "February", "March",
    "April", "May", "June", "July", "August", "September",
    "October", "November", "December");
    var d = new Date();
    var a_p = '';
    var curr_hour = d.getHours();
    if (curr_hour < 12){
       a_p = "AM";
    }else{
        a_p = "PM";
    }

    if (curr_hour == 0){
        curr_hour = 12;
    }

    if (curr_hour > 12){
        curr_hour = curr_hour - 12;
    }

    var curr_min = d.getMinutes();

    curr_min = curr_min + "";

    if (curr_min.length == 1){
        curr_min = "0" + curr_min;
    }

    return curr_hour  + ':' + curr_min + ' ' + a_p + ' '+ timezone + ' on ' +m_names[d.getMonth()] + ' ' + d.getDate();+ ', ' + d.getFullYear();
}

/**
 * Get TimeZone Abbrevation
 */
function getTimezoneAbbrevation(time){
 
    var timezones = {
        '-12.0' : 'MST',
        '-11.0' : 'MST',
        '-10.0' : 'HAST',
        '-9.0' : 'AKST',
        '-8.0' : 'PST',
        '-7.0' : 'PDT',
        '-6.0' : 'CST',
        '-5.0' : 'EST',
        '-4.0' : 'AST',
        '-3.5' : 'NST',
        '-3.0' : 'ADT',
        '-2.5' : 'NDT',
        '-2.0' : 'EST',
        '-1.0' : 'EST',
        '1.0' : 'EST',
        '2.0' : 'EST',
        '3.0' : 'EST',
        '3.5' : 'EST',
        '4.0' : 'EST',
        '4.5' : 'EST',
        '5.0' : 'EST',
        '5.5' : 'EST',
        '5.75' : 'EST',
        '6.0' : 'EST',
        '7.0' : 'EST',
        '8.0' : 'EST',
        '9.0' : 'EST',
        '9.5' : 'EST',
        '10.0' : 'EST',
        '11.0' : 'EST',
        '12.0' : 'EST'
    }
    return timezones[time];
}

/**
 * Trim the input string
 */
function trim(str, chars) {
	return ltrim(rtrim(str, chars), chars);
}

/**
 * Remove spaces from left of the input
 */
function ltrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

/**
 * Remove spaces from the Right of the string
 */
function rtrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

/**
 * Extract phone number
 */
function extractPhoneNumber(str){
    str = str.replace(/sip:/, '');
    return str.replace(/@[a-z0-9._]+/, '');
}