var waitTime = 0

var autoparty = (party, delta, leader=false) => {
    if( leader ){
        if( waitTime <= 0 ){
            for(i in behavior[ "memory" ][ "partymembers" ]){
                var memberName = behavior[ "memory" ][ "partymembers" ][ i ]
                if(!party[memberName] && waitTime <= 0){
                    waitTime = 5000;
                    send_party_invite( memberName )
                }
            }
        }
        else {
            waitTime -= delta;
        }
    }
    else if ( behavior[ "memory" ][ "autorequest" ] ){
        memberName = behavior[ "memory" ][ "autorequest" ][i]
        waitTime = 5000
        send_party_request(memberName)
    }
}

var on_party_invite = ( name ) => {
    if( behavior[ "memory" ][ "autoaccept" ].includes( name ) && !behavior[ "memory" ][ "leader" ]) {
        accept_party_invite( name );
    }
}

var on_party_request = ( name ) => {
    game_log("request received")
    if( behavior[ "memory" ][ "autoaccept" ].includes( name ) && behavior[ "memory" ][ "leader" ]) {
        accept_party_request( name );
    }
}