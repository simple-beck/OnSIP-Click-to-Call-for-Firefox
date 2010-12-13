// Global vars            
var activeTabId = 0;
OnsipApp = {};
var requestStack = Array();
var requestStackState = false;


OnsipApp.OX = function() {
  con: undefined;
  /**
   * Get Input values
   * @param formID
   * @param inputName
   */
  function _getFormValue(formID, inputName) {
    return $('form#' + formID + ' input[name=' + inputName + ']').val();
  }
  
  /**
   * Log a message
   * @param message text
   */
  function _addOutput(msg) {
      onsip.log(msg);
  }

  return {
    /**
     * Setup connection
     */
    setup: function (con) {
      var handlers = {};

      var adapter = OX.ConnectionAdapter.extend({
        _callbacks: [],

        jid: function () {return con.jid;},

        registerHandler: function (event, handler) {
          function wrapped(stanza) {
            var packetAdapter = {
              getFrom: function () {return stanza.getAttribute('from');},
              getType: function () {return stanza.getAttribute('type');},
              getTo:   function () {return stanza.getAttribute('to');},
              getNode: function () {return stanza;}
            };

            var newArgs = [packetAdapter];
            for (var i = 1, len = arguments.length; i < len; i++) {
              newArgs.push(arguments[i]);
            }

            handler.apply(this, newArgs);
            return true;
          }

          this.unregisterHandler(event);
          handlers[event] = con.addHandler(wrapped, null, event,
                                           null, null, null);
        },

        unregisterHandler: function (event) {
          if (handlers[event]) {
            con.deleteHandler(handlers[event]);
            delete handlers[event];
          }
        },

        send: function (xml, cb, args) {
          var parser = new DOMParser();
          var parcedElement = parser.parseFromString(xml, "text/xml");
          var node = parcedElement.firstChild;
          if (cb) {
            function wrapped(stanza) {
              var packetAdapter = {
                getFrom: function () {return stanza.getAttribute('from');},
                getType: function () {return stanza.getAttribute('type');},
                getTo:   function () {return stanza.getAttribute('to');},
                getNode: function () {return stanza;}
              };

              var newArgs = [packetAdapter];
              for (var i = 0, len = args.length; i < len; i++) {
                newArgs.push(args[i]);
              }

              cb.apply(this, newArgs);
              return false;
            }

            var id = node.getAttribute('id');
            if (!id) {
              id = con.getUniqueId();
              node.setAttribute('id', id);
            }

            this._callbacks[id] = con.addHandler(wrapped, null, null,
                                                 null, id, null);
          }
          
          node.setAttribute('xmlns', 'jabber:client');
          return con.send(node);
        }
      });

      this.con = OX.Connection.extend({connection: adapter});
      this.con.initConnection();

      this.con.ActiveCalls.registerSubscriptionHandlers();
      this.con.ActiveCalls.registerHandler('onPublish',
                                           this._handleActiveCallPublish);
      this.con.ActiveCalls.registerHandler('onRetract',
                                           this._handleActiveCallRetract);
      this.con.ActiveCalls.registerHandler('onPending',
                                           this._handleActiveCallPending);
      this.con.ActiveCalls.registerHandler('onSubscribed',
                                           this._handleActiveCallSubscribe);
      this.con.ActiveCalls.registerHandler('onUnsubscribed',
                                           this._handleActiveCallUnsubscribe);
    },

    /**
    *  Authorize
    * @param FormID
    */
    authorize: function (formID) {
      var sip = _getFormValue(formID, 'sip-address'),
          pw  = _getFormValue(formID, 'password'),
          jid = _getFormValue(formID, 'jid');

      this.con.Auth.authorizePlain(sip, pw, jid, {
        onSuccess: function (packet) {
          var f      = packet.getNode().getElementsByTagName('x')[0].getElementsByTagName('field')[0],
              expiry = f.getElementsByTagName('value')[0].firstChild.nodeValue,
              note   = packet.getNode().getElementsByTagName('command')[0].getElementsByTagName('note')[0];

          _addOutput(note.firstChild.nodeValue + ', Authorized until: ' + expiry);
        },

        onError: function (packet) {
          _addOutput('AuthorizePlain Error');
        }
      });

      return false;
    },

    /**
     * Initiate a Call
     */
    createCall: function (formID) {
      var to   = _getFormValue(formID, 'to'),
          from = _getFormValue(formID, 'from');

      this.con.ActiveCalls.create(to, from, {
        onSuccess: function (packet) {
        },

        onError: function (packet) {
        }
      });

      return false;
    },


    /**
     * Subscribe To node in order to recieve an incoming call
     */
    subscribeActiveCalls: function (node) {
        onsip.log('BOSH :: Subscribe to active Calls?');
        this.con.ActiveCalls.subscribe(node, {
        onSuccess: function ( reqURI, finalURI, packet ) {
            onsip.log('BOSH :: Calls Subscribe Success');
        },

        onError: function (reqURI, finalURI, packet) {
            onsip.log('BOSH :: Calls Subscribe Error');
        }
      });
    },

    /**
     * Unsubscribe from node
     */
    unsubscribeActiveCalls : function( node, item, callback ){
      
        this.con.ActiveCalls.unsubscribe( node, {
            onSuccess: function( uri ){
                onsip.log('BOSH :: Calls Unsubscribe Success');
                callback.onSuccess();
            },
            onError: function(uri){
                onsip.log('BOSH :: Calls Unsubscribe Error');
                callback.onError();
            }
        }, item );
    },

    /**
     * Get Subscription to node
     */
    getActiveCallsSubscriptions : function(node, connectCallback){
        onsip.log('BOSH :: Get Subscribtions');
        this.con.ActiveCalls.getSubscriptions(node,{
            onSuccess: function(requestedURI, finalURI, subscriptions, packet){
                onsip.log('BOSH :: Get Subscribtions SUCCESS');

                onsip.log('BOSH :: got ' + subscriptions.length  + ' Active subscribtions ' );
 
                var subscriptionArray = new Array();
                var subscribedNode = '/me/'+onsip.getStringPreference('onsip.call.setup.from.address');
                
                for(var i = subscriptions.length-1; i >= 0; --i ){
                    var temp = {jid :subscriptions[i].jid, sid: subscriptions[i].subid};
                    subscriptionArray.push(temp);
                }

                onsip.log('BOSH :: subscriptions array length - - ' + subscriptionArray.length);
          
                // Unsubscribe Recursively by JID
                unsubscribeRecursively(node, subscriptions.length, subscriptionArray, connectCallback);
            },
            onError: function(requestedURI, finalURI, packet){
                onsip.log('BOSH :: Get Subscribtions ERROR');
            }
        });
    },

    /**
     * Listener for a Call Restract
     */
    _handleActiveCallRetract: function ( itemURI ) {
      onsip.log('BOSH :: Call RETRACT');
      onsip.theApp.showMessage(' ');
      requestStackState = false;
      requestStack = [];
      onsip.setStringPreference('onsip.number.extension', '');
    },
    
    /**
     *  Listener for active calls
     */
    _handleActiveCallPublish: function (item) {
      onsip.log('BOSH :: Call state : '+ item.dialogState);
      onsip.flog(item);
       // Send Content script that call was retracted
       switch(item.dialogState){
           case "created":
               onsip.log('BOSH ::::: created');
               if(!isCreatedDetailsMatchRequested(item)){
                   onsip.log('2');
                    var phoneNumber = extractPhoneNumber( item.toURI );
                    onsip.log('3');
                    onsip.log("onsip.getBooleanPreference('highrise.enabled')");
                    onsip.log(onsip.getBooleanPreference('highrise.enabled'));
                    onsip.log('4');
                    if(onsip.getBooleanPreference('highrise.enabled')){
                        onsip.log('5');
                        // prepare params for hirise Info retrival
                        var params = {};
                        params.url = onsip.getStringPreference('onsip.call.setup.highrise.url') + '/companies.xml';
                        params.token = onsip.getStringPreference('onsip.call.setup.highrise.token');
                        
                      highrise.getFromHighrise({
                          onSuccess: function(data){
                               var company = getRightCompany( phoneNumber, data );
                                if( company  != null ){

                                    company.type = 'companies';
                                    onSipUserName = onsip.getStringPreference('onsip.call.setup.user.name');

                                    var note = '<note> <body> ' + onSipUserName +' called ' + company.name  + ' at '+ getDateAndTime(getTimezoneAbbrevation(onsip.getStringPreference('onsip.call.setup.timezone'))) +'</body> </note>';

                                    var params = {};
                                    params.token = onsip.getStringPreference('onsip.call.setup.highrise.token');
                                    params.url = onsip.getStringPreference('onsip.call.setup.highrise.url');
                                    highrise.addNoteToCustomerProfile(company, note, params);

                                    // Show message
                                    onsip.log('CONTENT :: show message');
                                    onsip.theApp.showMessage('Calling ' +company.name + ' : ' + phoneNumber);

                                }else{
                                        // prepare params for hirise Info retrival
                                        var params = {};
                                        params.url = onsip.getStringPreference('onsip.call.setup.highrise.url') + '/people.xml';
                                        params.token = onsip.getStringPreference('onsip.call.setup.highrise.token');

                                       highrise.getFromHighrise({
                                          onSuccess : function(data) {
                                              customer = getRightCustomer(phoneNumber, data);
                                              if(customer != null){
                                                  onSipUserName = onsip.getStringPreference('onsip.call.setup.user.name');
                                                  var note = '<note> <body> ' + onSipUserName + ' called ' + customer.name + ' at '+ getDateAndTime(getTimezoneAbbrevation( onsip.getStringPreference('onsip.call.setup.timezone') )) +'</body> </note>';
                                                  customer.type = 'people';

                                                  var params = {};
                                                  params.token = onsip.getStringPreference('onsip.call.setup.highrise.token');
                                                  params.url = onsip.getStringPreference('onsip.call.setup.highrise.url');
                                                  highrise.addNoteToCustomerProfile(customer, note, params);

                                                   // Show message
                                                    onsip.log('CONTENT :: show message');
                                                    onsip.theApp.showMessage('Calling ' +customer.name + ' : ' + phoneNumber);
                                                    onsip.log('CONTENT :: Calling' +customer.name );

                                              }else{
                                                    // Show message
                                                    onsip.log('CONTENT :: show message');
                                                    onsip.theApp.showMessage('Calling '  + phoneNumber);
                                              }
                                          }
                                      }, params);
                                }
                          }
                      }, params);
                    }else{
                        // Show message
                        onsip.log('CONTENT :: show message');
                        onsip.theApp.showMessage('Calling '  + phoneNumber);
                    }
               }
               break;

            case "requested":
                requestStack.push(item.branch);
                if(!requestStackState){
                    requestStackState = true;
                    setRequestedDetails(item);
                    var phoneNumber = extractPhoneNumber( item.fromURI );
                    ownSipAddress = 'sip:' +onsip.getStringPreference('onsip.call.setup.from.address');
                    var callActionTitle = ' Incoming call from ';
                    if( item.toURI == ownSipAddress && item.callSetupID == null ){
                        callActionTitle = ' Calling ';
                    }

                    if(onsip.getBooleanPreference('highrise.enabled')){
                        onsip.log('APP :: GET highrise Companies');

                        // prepare params for hirise Info retrival
                        var params = {};
                        params.url = onsip.getStringPreference('onsip.call.setup.highrise.url') + '/companies.xml';
                        params.token = onsip.getStringPreference('onsip.call.setup.highrise.token');

                     highrise.getFromHighrise({
                            onSuccess: function(data){
                                 var company  = null;
                                 var extension = null;

                                 onsip.flog(onsip.getStringPreference('onsip.number.extension'));
                                 
                                 if(onsip.getStringPreference('onsip.number.extension') == ''){
                                     onsip.log('APP :: EXTENSION FALSE');
                                     company = getRightCompany( phoneNumber, data );
                                 }else{
                                     onsip.log('APP :: EXTENSION TRUE');
                                     extension = onsip.getStringPreference('onsip.number.extension');
                                 }
                                 if( company  != null ){
                                     company.type = 'companies';
                                      onSipUserName = onsip.getStringPreference('onsip.call.setup.user.name');
                                     if( item.toURI == ownSipAddress && item.callSetupID == null ){
                                         var note = '<note> <body> ' + onSipUserName +' called ' + company.name + ' at '+ getDateAndTime(getTimezoneAbbrevation( onsip.getStringPreference('onsip.call.setup.timezone') )) +'</body> </note>';
                                     }else{
                                         var note = '<note> <body> ' + company.name +' called ' + onSipUserName + ' at '+ getDateAndTime(getTimezoneAbbrevation( onsip.getStringPreference('onsip.call.setup.timezone') )) +'</body> </note>';
                                     }
                                     var params = {};
                                     params.url = onsip.getStringPreference('onsip.call.setup.highrise.url');
                                     highrise.addNoteToCustomerProfile(company, note, params);

                                    // Show message
                                    onsip.log('CONTENT :: show message');
                                    onsip.theApp.showMessage(callActionTitle +' '+ company.name +' : '+ phoneNumber);

                                 }else{
                                    // prepare params for hirise Info retrival
                                    var params = {};
                                    params.url = onsip.getStringPreference('onsip.call.setup.highrise.url') + '/people.xml';
                                    params.token = onsip.getStringPreference('onsip.call.setup.highrise.token');

                                      highrise.getFromHighrise({
                                          onSuccess : function(data) {
                                              customer = getRightCustomer(phoneNumber, data, extension);
                                              if(customer != null){
                                                   onSipUserName = onsip.getStringPreference('onsip.call.setup.user.name');
                                                  if( item.toURI == ownSipAddress && item.callSetupID == null ){
                                                      var note = '<note> <body> ' + onSipUserName + ' called ' + customer.name + ' at '+ getDateAndTime(getTimezoneAbbrevation(  onsip.getStringPreference('onsip.call.setup.timezone') )) +'</body> </note>';
                                                  }else{
                                                      var note = '<note> <body> ' + customer.name + ' called ' + onSipUserName + ' at '+ getDateAndTime(getTimezoneAbbrevation(  onsip.getStringPreference('onsip.call.setup.timezone') )) +'</body> </note>';
                                                  }
                                                  customer.type = 'people'
                                                  params.url = onsip.getStringPreference('onsip.call.setup.highrise.url');
                                                  highrise.addNoteToCustomerProfile(customer, note, params)

                                                    // Show message
                                                    onsip.log('CONTENT :: show message');
                                                    onsip.theApp.showMessage(callActionTitle +' '+ customer.name +' : '+ phoneNumber);
                                              }else{
                                                 // Show message
                                                onsip.log('CONTENT :: show message');
                                                onsip.theApp.showMessage(callActionTitle +' : '+ phoneNumber);
                                              }
                                          }
                                      }, params);
                                 }
                            }
                        }, params);
                    }else{
                        // Simple call
                         // Show message
                        onsip.log('CONTENT :: show message');
                        onsip.theApp.showMessage(callActionTitle +' : '+ phoneNumber);
                    }
                }
                break;

            case "confirmed":
                ownSipAddress = 'sip:' +onsip.getStringPreference('onsip.call.setup.from.address');
                if( item.toURI !=  ownSipAddress){
                    clearRequestedNumber();
                }
 
            default :
                break;

       }
    },

    _handleActiveCallSubscribe: function (uri) {
      onsip.log('BOSH :: handling subscribtion');
    },

    _handleActiveCallUnsubscribe: function (uri) {
      onsip.log('BOSH :: handling unsubscription');
    },

    _handleActiveCallPending: function (uri) {
      onsip.log('BOSH :: handling Pending CALL');
    },

    pushRosterGroups: function (formID) {
      var jid = null;
      this.con.Rosters.pushRosterGroups(jid, {
        onSuccess: function (packet) {
          onsip.log('successful roster push');
        },

        onError: function (packet) {
          onsip.log('ERROR: roster push failed.');
        }
      });

      return false;
    },

    requestRoster: function (formID) {
      var iq    = OX.XMPP.IQ.extend(),
          query = OX.XMPP.Stanza.extend();

      var callbacks = {
        onSuccess: function (packet) {
          onsip.log('successful roster request');
        },

        onError: function (packet) {
          onsip.log('ERROR: roster request failed.');
        }
      };

      iq.type('get');
      query.name = 'query';
      query.attr('xmlns', 'jabber:iq:roster');
      iq.addChild(query);

      OnsipApp.OX.con.send(iq.toString(), function (packet) {
        if (!packet)
          return;

        if (packet.getType() === 'error' && callbacks.onError) {
          callbacks.onError(packet);
        } else if (callbacks.onSuccess) {
          callbacks.onSuccess(packet);
        }
      }, []);

      return false;
    },

    addRosterItem: function (formID) {
      var name   = _getFormValue(formID, 'name'),
          jid    = _getFormValue(formID, 'jid'),
          groups = [ _getFormValue(formID, 'group') ],
          iq     = OX.XMPP.IQ.extend(),
          query  = OX.XMPP.Stanza.extend(),
          item   = OX.XMPP.Stanza.extend();

      var callbacks = {
        onSuccess: function (packet) {
          onsip.log('Succesfully added roster item.');
        },

        onError: function (packet) {
          onsip.log('ERROR: roster add failed.');
        }
      };

      iq.type('set');
      query.name = 'query';
      query.attr('xmlns', 'jabber:iq:roster');
      item.name = 'item';
      item.attr('jid', jid);
      item.attr('name', name);

      for (var i = 0;  i < groups.length; i++) {
        groupStanza = OX.XMPP.Stanza.extend();
        groupStanza.name = 'group';
        groupStanza.text = groups[i];
        item.addChild(groupStanza);
      }
      iq.addChild(query.addChild(item));

      OnsipApp.OX.con.send(iq.toString(), function (packet) {
        if (!packet)
          return;

        if (packet.getType() === 'error' && callbacks.onError) {
          callbacks.onError(packet);
        } else if (callbacks.onSuccess) {
          callbacks.onSuccess(packet);
        }
      }, []);

      return false;
    },

    deleteRosterItem: function (formID) {
      var jid   = _getFormValue(formID, 'jid'),
          iq    = OX.XMPP.IQ.extend(),
          query = OX.XMPP.Stanza.extend(),
          item  = OX.XMPP.Stanza.extend();

      var callbacks = {
        onSuccess: function (packet) {
          onsip.log('Succesfully deleted roster item.');
        },

        onError: function (packet) {
          onsip.log('ERROR: roster delete failed.');
        }
      };

      iq.type('set');
      query.name = 'query';
      query.attr('xmlns', 'jabber:iq:roster');
      item.name = 'item';
      item.attr('jid', jid);
      item.attr('subscription', 'remove');

      iq.addChild(query.addChild(item));

      OnsipApp.OX.con.send(iq.toString(), function (packet) {
        if (!packet)
          return;

        if (packet.getType() === 'error' && callbacks.onError) {
          callbacks.onError(packet);
        } else if (callbacks.onSuccess) {
          callbacks.onSuccess(packet);
        }
      }, []);

      return false;
    },

    _handleRostersIq: function (packet) {
     var items = packet.getElementsByTagName('x')[0].getElementsByTagName('item');
     for (var i=0; i < items.length; i++) {
       var name         = items[i].attributes["name"].value,
           jid          = items[i].attributes["jid"].value,
           group        = items[i].getElementsByTagName('group')[0].firstChild.nodeValue,
           uniqueFormId = 'add-roster-item-' + jid.replace(/@/, '').replace(/\./g, ''),
           action       = items[i].attributes["action"].value;

       if (action == 'add') {
         _addOutput('#rosters_xmpp_onsip_com .xmpp_roster', name +
                    '<form id="' + uniqueFormId + '" action="#">' +
                    '<input type="hidden" name="name" id="name" value="' + name + '"/>' +
                    '<input type="hidden" name="jid" id="jid" value="' + jid + '"/>' +
                    '<input type="hidden" name="group" id="group" value="' + group + '"/>' +
                    '<input type="submit" value="Add Item"/></form>');
         $('#' + uniqueFormId).bind('submit', function (e) {
                 e.preventDefault();
                 OnsipApp.OX.addRosterItem(uniqueFormId);
          });
       } else if (action == 'modify') {
         _addOutput('#rosters_xmpp_onsip_com .xmpp_roster', name +
                    '<form id="' + uniqueFormId + '" action="#">' +
                    '<input type="hidden" name="name" id="name" value="' + name + '"/>' +
                    '<input type="hidden" name="jid" id="jid" value="' + jid + '"/>' +
                    '<input type="hidden" name="group" id="group" value="' + group + '"/>' +
                    '<input type="submit" value="Modify Item"/></form>');
         $('#' + uniqueFormId).bind('submit', function (e) {
                 e.preventDefault();
                 OnsipApp.OX.addRosterItem(uniqueFormId);
         });
       } else if (action == 'delete') {
         _addOutput('#rosters_xmpp_onsip_com .xmpp_roster', name +
                    '<form id="' + uniqueFormId + '" action="#">' +
                    '<input type="hidden" name="name" id="name" value="' + name + '"/>' +
                    '<input type="hidden" name="jid" id="jid" value="' + jid + '"/>' +
                    '<input type="hidden" name="group" id="group" value="' + group + '"/>' +
                    '<input type="submit" value="Delete Item"/></form>');
         $('#' + uniqueFormId).bind('submit', function (e) {
                 e.preventDefault();
                 OnsipApp.OX.deleteRosterItem(uniqueFormId);
         });
       }
     }

      var id   = packet.attributes["id"].value;
      var from = packet.attributes["to"].value;
      var to   = packet.attributes["from"].value;
      var iq    = OX.XMPP.IQ.extend();
      iq.from(from);
      iq.to(to);
      iq.type('result');
      iq.attr('id', id);
      OnsipApp.OX.con.send(iq.toString());

      return true;
    },

    _handleEjabberdIq: function (packet) {
      if (packet.getElementsByTagName('query')[0]) {
        var items = packet.getElementsByTagName('query')[0].getElementsByTagName('item');
        for (var i = 0; i < items.length; i++) {
          if (items[i].attributes["subscription"].value != 'remove') {
            var item  = items[i],
                name_str   = item.attributes["name"].value,
                jid_str    = item.attributes["jid"].value,
                groups_str = '',
                groups     = item.getElementsByTagName('group');
            if (groups) {
              for (var j = 0; j < groups.length; j++) {
                if (groups[j].firstChild) {
                  if (groups_str != '') groups_str += ", ";
                  groups_str += groups[j].firstChild.nodeValue;
                } else {
                  groups_str = "n/a";
                }
              }
            }
            _addOutput('#rosters_xmpp_onsip_com .current_roster',
                       name_str + ' :: ' + jid_str + ' :: ' + groups_str);
          }
        }
      }

      var id   = packet.attributes["id"].value;
      var from = packet.attributes["to"].value;
      var to   = packet.attributes["from"].value;
      var iq    = OX.XMPP.IQ.extend();
      iq.from(from);
      iq.to(to);
      iq.type('result');
      iq.attr('id', id);
      OnsipApp.OX.con.send(iq.toString());
      return true;
    }
  };
}();

OnsipApp.Strophe = function() {
  var con;

  function htmlEnc(str) {
    return str.split(/&/).join("&amp;")
              .split(/;/).join("&semi;")
              .split(/</).join("&lt;")
              .split(/>/).join("&gt;");
  }

  function handleStatusChanged(status) {
    switch (status) {
    //  CONNECTED
    case Strophe.Status.CONNECTED:
      onsip.log('BOSH :: connected =)');
      
      // Unsubscribe from node
      var callbackConnect = {
          connect : function(){
               OnsipApp.OX.subscribeActiveCalls('/me/'+onsip.getStringPreference('onsip.call.setup.from.address'))
          }
      }
   
      OnsipApp.OX.getActiveCallsSubscriptions('/me/'+onsip.getStringPreference('onsip.call.setup.from.address'), callbackConnect);

      // Subscribe to recieve incomming calls
      onsip.log('BOSH :: OnsipApp.OX.subscribeActiveCalls');
      //OnsipApp.OX.subscribeActiveCalls('/me/'+onsip.getStringPreference('onsip.call.setup.from.address'));
      onsip.setStringPreference('userJid', con.jid );
      con.send($pres().tree());
      break;

    // DISCONNECTED
    case Strophe.Status.DISCONNECTED:
      onsip.log('BOSH :: disconnected =(');
      setUpOnSipListener();
      break;

    default:
       break;
    }
  }

  function logMessage(xml, outbound) {
    var sent = (!!outbound) ? 'outbound' : 'inbound',
        msg  = "<div class='msg %s'>" + htmlEnc(xml) + "</div>";
  }

  return {
    /**
     * doLogin , function for logging in
     */
    doLogin: function (aForm) {
      var jid  = aForm.username.value;
          pass = aForm.password.value;
      con.connect(jid, pass, handleStatusChanged);

      OnsipApp.OX.setup(con);
    },

    quit: function() {
      con.send($pres({type: 'unavailable'}).tree());
      con.disconnect();
      onsip.log('loged out');
    },

    init: function() {
      con = new Strophe.Connection('https://dashboard.onsip.com/http-bind/');
      con.rawInput  = function (data) {logMessage(data, false);};
      con.rawOutput = function (data) {logMessage(data, true);};

      con.addHandler(OnsipApp.OX._handleRostersIq, 'http://jabber.org/protocol/rosterx', 'iq', 'set', null, null);
      con.addHandler(OnsipApp.OX._handleEjabberdIq, 'jabber:iq:roster', 'iq', 'set', null, null);
      con.addHandler(OnsipApp.OX._handleEjabberdIq, 'jabber:client', 'iq', 'result', null, null);
    }
  };
}();

var onerror = function (e) {
  OnsipApp.Strophe.quit();
  onsip.log('onerror');
  return false;
};



/**
 * recursive unsubscribtion
 */
function unsubscribeRecursively(node, subscribtionNumber, subscriptions, connectCallback){
    onsip.log('BOSH :: unsubscribeRecursively');
    
    var item = subscriptions.pop();
    if(subscribtionNumber > 0){
        onsip.log('RECURSIVE :: we have more than 0  subscriptions');
        // do our job
        OnsipApp.OX.unsubscribeActiveCalls(
            node,
            item,{
            onSuccess : function(){
                onsip.log('RESURSIVE :: unsubscribe SUCCESS');
                if( subscribtionNumber > 0 ){
                    unsubscribeRecursively(node, --subscribtionNumber, subscriptions, connectCallback);
                }
            },
            onError : function(){
                if(subscribtionNumber == 0 ){
                    connectCallback.connect();
                }
            }
        });
        
    }else{
         onsip.log('RECURSIVE :: We DO NOT HAVE any subscriptions');
         connectCallback.connect();
    }
}