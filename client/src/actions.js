const ACTIONS = {
    JOIN : 'join' , 
    JOINED : 'joined',  //confirmation of join
    DISCONNECTED : 'disconnected',
    CODE_CHNAGE : 'code_change' , //editor mai code change rerender
    SYNC_CODE : 'sync_code' , 
    LEAVE :'leave' //leave the socket
};

module.exports=ACTIONS;