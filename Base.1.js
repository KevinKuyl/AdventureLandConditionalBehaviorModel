map_key("Q","snippet","toggleAgressor()")

var percentage = ( part, whole ) => {
	if( !isNaN( whole ) && !isNaN( whole ))
		return (( part / whole ) * 100 );
}

var toggleAgressor = () => {
	behavior.memory.bAttacking = !behavior.memory.bAttacking;
	set_message( "Awaiting Orders" );
}

var nearest_door = () => {
	var doors = G.maps[character.map][ "doors" ]
	var closest = {
		distance: 1000000,
		d: null,
		x: 0,
		y: 0
	}
	
	for(i in doors){
		var d = distance( character, {
			x: doors[ i ][ 0 ],
			y: doors[ i ][ 1 ]
		})
		if( d < closest.distance ) {
			closest.distance = d;
			closest.d = doors[ i ];
			closest.name = doors [ i ][ 4 ]
			closest.x = doors[ i ][ 0 ];
			closest.y = doors[ i ][ 1 ];
		}
	}
	return closest;
}

var show_nearest_door = ( closest ) => {
	closest = closest || nearest_door()
	game_log( "Distance: " + closest.distance )
	game_log( "To : " + closest.d[ 4 ] )
	game_log( "" )
}

var enter_door = () => {
	closest = nearest_door()
	transport( closest.name, closest.d[5] )
}

var true_distance = (a, b) => {
    let x_dist = b.x - a.x;
    let y_dist = b.y - a.y;
    return Math.sqrt( x_dist * x_dist + y_dist * y_dist );
}

class IntervalTimer{
    start(callback, t) {
        this.stop();
        this.id = setInterval(() => {
            callback.call(this);
        }, t);
    }
    stop() {
        if (this.id) {
            clearInterval(this.id);
            this.id = null;
        }
    }
}

