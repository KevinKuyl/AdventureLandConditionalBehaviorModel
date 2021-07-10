var action = {
	follow( target ){
		if( target ){
			var d  = true_distance( character, target );
			var follow = behavior[ "memory" ][ "leader" ] ? !is_in_range( target ) : d >= 75;
			if( follow ){
				set_message( "Following " + target[ "name" ] );
				if( d >= 300 ){
					//plan a route if the distance is too great or if the target is in a different map
					if(!behavior[ "memory" ][ "long_walk" ]){
						behavior[ "memory" ][ "long_walk" ] = true;
						
						smart_move({
							x: character.x + ( target.x - character.x ) / 3,
							y: character.y + ( target.y - character.y ) / 3
						}, () => {
							behavior[ "memory" ][ "long_walk" ] = false;
						})
					}
				}
				else{
					//distance is not too great, lets preserve some power
					move(
						character.x + ( target.x - character.x ) / 3,
						character.y + ( target.y - character.y ) / 3
					);
				}
			}
			if(!get_player(target.name) && target[ "type" ] == "character"){
				enter_door();
			}
		}
		else {
			game_log( "Lost target" );
		}
	},

	goto(location){
		set_message("Relocating")
		behavior.memory.bAttacking = false
		if(behavior[ "memory" ][ "leader" ]){
			//find the lowest speed of party members
			var party = get_party();
			var lowest = null
			for(member in party){
				player = get_player(member)
				if(!lowest || player.speed <= lowest.speed)
					lowest = player
			}
			//juuust a little slower than the slowest member, to allow them to catch up
			cruise( lowest.speed -5 ) 
		}
		smart_move(location, () =>{
			behavior.memory.bAttacking = true
			cruise(500)
		})
	},

	heal( skill, target ){
		set_message( "Healing " + target[ "name" ] );
		if( skill ){
			action.use_skill( skill, target )
		}
		else {
			if( is_in_range( target ))
				heal( target );
			else
				action.follow( target );
		}
	},

	regenerate(){
		if ( can_use("regen_mp")) {
            // We have less MP than HP, so let's regen some MP.
        	action.use_skill("regen_mp")
            reduce_cooldown("regen_mp", Math.min(...parent.pings))
        } else if (can_use("regen_hp")) {
            // We have less HP than MP, so let's regen some HP.
            action.use_skill("regen_hp")
            reduce_cooldown("regen_hp", Math.min(...parent.pings))
        }
	},
	
	attack( skill, target ) {
		set_message( "Attacking " + target[ "name" ] );
		if( skill ){
			action.use_skill( skill, target )
		}
		else {
			if( can_attack( target ) && is_in_range( target ))
				attack( target );
			else
				action.follow( target );
		}
	},
	
	use_skill( skill, target ) {
		if(target)
			action.follow( target );
		if(is_in_range( target, skill ) && !is_on_cooldown( skill )){
			use_skill( skill, target );
		}
	},

	transfer: {
		items(name){
			var target = get_player(name)
			var d = distance(character, target);
			if( d && d < 200 ){
				for(i in character.items){
					if(character.items[i] ){
						var q = character.items[i].q || 1;
						send_item(name, i, q)
					}
				}
			}
		},

		gold(name, amount){
			var target = get_player(name)
			var d = distance(character, target);
			if( d && d < 200 ){
				send_gold(name, amount)
			}
		}
	}
}