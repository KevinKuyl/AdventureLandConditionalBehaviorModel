behavior[ "memory" ][ "lastUpdate" ]  = Date.now();
setInterval(function(){
	var now = Date.now();
	var delta = now - behavior[ "memory" ][ "lastUpdate" ];
	var party = get_party()
	var leader = behavior[ "memory" ][ "leader" ] || false;
	if(behavior[ "memory" ][ "partymembers" ])
		autoparty(party, delta, leader=leader);
	
	use_hp_or_mp();
	loot();
	action.regenerate();
	
	if(leader){
		localStorage.setItem( "map", character.map )
		localStorage.setItem( "x", character.x )
		localStorage.setItem( "y", character.y )
	}

	for(member in party){
		player = get_player(member)
		
		//update the tank
		if(player){
			if(player["ctype"] == "warrior"){
				behavior["memory"]["tank"] = player;
			}
		};

		//anyone need heals?
		for(h in behavior["heal"]){
            value = behavior[ "heal" ][ h ][ "value" ];
			skill = behavior[ "heal" ][ h ][ "skill" ];
			if( behavior[ "heal" ][ h ][ "condition" ]( value, player )){
				behavior[ "heal" ][ h ][ "action" ](skill, player)
			}
		}
		
		//how about a buff then?
		for(b in behavior["buff"]){
			value = behavior[ "buff" ][ b ][ "value" ];
			skill = behavior[ "buff" ][ b ][ "skill" ];
			if( behavior[ "buff" ][ b ][ "condition" ]( value, character )){
				behavior[ "buff" ][ b ][ "action" ](skill, player)
			}
		}
	}

	//automatically give items to someone
	var autotransfer = get_player(behavior[ "memory" ][ "autotransfer" ])
	if( autotransfer && character.gold > 1000 ){
		action.transfer.items( behavior[ "memory" ][ "autotransfer" ])
		action.transfer.gold( behavior[ "memory" ][ "autotransfer" ], character.gold )
	}

	//do we need to relocate ourselves?
	if(behavior['relocate']){
		for( i in behavior['relocate'] ){
			if(behavior['relocate'][i] && !behavior[ "memory" ][ "upgrading" ]){
				var r = behavior['relocate'][i]
				if( r[ "condition" ]() && r[ "to" ] ){
					var target = r[ "to" ]();
					smart_move(target)
				}
			}
		}
	}

	//follow someone as defined in behavior
	for( c in behavior[ "follow" ] ){
		var target = behavior[ "follow" ][ c ][ "target" ]();
		if( behavior[ "follow" ][ c ]["condition"]() ){
			var value = behavior[ "follow" ][ c ][ "target" ]
			action.follow( behavior[ "follow" ][ c ][ "target" ](value) );
			
			//set pathing array
			var value = behavior[ "follow" ][ c ][ "target" ]
			behavior[ "memory" ][ "path" ] = behavior[ "memory" ][ "path" ] ? behavior[ "memory" ][ "path" ] : []
			if(behavior[ "memory" ][ "path" ].length > 30) behavior[ "memory" ][ "path" ].shift()
			behavior[ "memory" ][ "path" ].push({
				x: behavior[ "follow" ][ c ][ "target" ](value).x,
				y: behavior[ "follow" ][ c ][ "target" ](value).y
			})
		}
		
	};
    
	//select target
	target = null;
	highest_priority = 0;
	for(targetter in behavior["target"]){
		if(behavior["target"][targetter]["condition"]()){
			if(behavior["target"][targetter]["priority"] > highest_priority){
				var t = behavior["target"][targetter]["target"](behavior["target"][targetter]["value"]);
				if(t){
					target = t;
					highest_priority = behavior["target"][targetter]["priority"]
				}
			}
		}
	}
	if(target) change_target(target);
	
	//execute attacks
    if(target){
        for( att in behavior[ "attack" ] ){	
            value = behavior[ "attack" ][ att ][ "value" ];
			skill = behavior[ "attack" ][ att ][ "skill" ];
			if(behavior[ "attack" ][ att ][ "appliesToSelf" ] == true){
				if( behavior[ "attack" ][ att ][ "condition" ]( value, character )){
					behavior[ "attack" ][ att ][ "action" ](skill, target)
				}
			}
			else {
				if( behavior[ "attack" ][ att ][ "condition" ]( value, target )){
					behavior[ "attack" ][ att ][ "action" ](skill, target)
				}
			}
        }
    }

	//do we need to compound our items?
	var d = true_distance(character, find_npc("newupgrade"));
	if(behavior[ "memory" ][ "autocompound" ] && (!character.q.upgrade || !character.q.combine)){
		for(item of inventory.items){
			var d = true_distance(character, find_npc("newupgrade"))
			if(item 
			  && d < 302.1 
			  && character.map == "main"
			  && !behavior[ "memory" ][ "upgrading" ] 
			  && inventory.compound.possible({
				name: item.name,
				level: item.level
			})){
				behavior[ "memory" ][ "upgrading" ] = true
				inventory.compound.item({
					name: item.name,
					level: item.level
				})
			}
		}
		behavior[ "memory" ][ "upgrading" ] = false
	}

	//maintain our stock
	if(behavior[ "memory" ][ "stock" ]){
		for(itemname in behavior[ "memory" ][ "stock" ]){
			var item = inventory.items[inventory.find.item({name: itemname})]
			if(item.q < behavior[ "memory" ][ "stock" ][itemname]){
				buy(itemname, behavior[ "memory" ][ "stock" ][itemname])
			}
		}
	}

	//well, lets check if we need more scrolls then
},1000/4);

//coroutine for switching grind spots, in search of the boss!
if(behavior[ "memory" ][ "grindspots" ]){
	var minutes_to_ms = (min) => {
		return (min * 60) * 1000
	}
	game_log( "Spot switching enabled" );
	game_log( "Interval: " + minutes_to_ms(behavior[ "memory" ][ "grindinterval" ]) + " ms" )
	setInterval(() => {
		behavior[ "memory" ][ "grindingAt" ]++;
		if(behavior[ "memory" ][ "grindingAt" ] >= behavior[ "memory" ][ "grindspots" ].length){
			behavior[ "memory" ][ "grindingAt" ] = 0
		}
		action.goto(behavior[ "memory" ][ "grindspots" ][behavior[ "memory" ][ "grindingAt" ]])
	}, minutes_to_ms(behavior[ "memory" ][ "grindinterval" ]))
}