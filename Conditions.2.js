var condition = {
	buff_active : (name, target) => {
		if(target['s'][name]){
			return true;
		}
		return false;
	},

	same_map : (player, target) => {
		var map = null;
		if(behavior[ "memory" ][ "getFromLocalStorage" ]){
			map = localStorage.getItem( "map" );
			if( map == character.map ) return true
		}
		return false
	},

	different_map : (player, target) => {
		return (!condition.same_map(player, target))
	},

	buff_ending : (name, target) => {
		if(target)
			return (target["s"][name]["ms"] < 1000) //if there's less than a second remaining, its safe to assume the buff is ending
	},
	
	can_cast : (name, player) => {
		skill_data = parent.G.skills[name]
		if(skill_data){
			if(skill_data["mp"] >= 0){
				return (player["mp"] >= skill_data["mp"])
			}
		}
		return false
	},

	not_walking : (player, target) => {
		return !behavior[ "memory" ][ "long_walk" ]
	},

	has_agro : (player, target) => {
		return (target.agro >= .3)
	},

	not_has_agro : (player, target) => {
		return !condition.has_agro(player, target)
	},
	
	health_below : (percent, player) => {
		if(player)
			return (percentage(player['hp'], player['max_hp']) <= percent)
		return false
	},
	
	health_above : (percent, player) => {
		if(player)
			return (percentage(player['hp'], player['max_hp']) >= percent)
		return false
	},
	
	mana_below : (percent, player) => {
		if(player)
			return (percentage(player['mp'], player['max_mp']) <= percent)
		return false
	},
	
	mana_above : (percent, player) => {
		if(player)
			return (percentage(player['mp'], player['max_mp']) >= percent)
		return false
	},

	party_health_below : (percent, player) => {
		party = get_party()
		living = 0
		below_threshold = 0
		for(member in party){
			if(party[member]){
				if(!party[member].rip){
					if( percentage(party[member]['hp'], party[member]['max_hp']) <= percent ){
						below_threshold++
					}
				}
			}
		}
		return (below_threshold == living && living > 0)
	},

	compound_possible(){
		for(item of inventory.items){
			if(item){
				var scroll = inventory[ "scroll" ][ "compound" ][ item_grade(item) ]
				var possible = inventory.compound.possible({
					name: item.name,
					level: item.level
				})
				if(possible && !character.q.compound && !character.q.upgrade) {
					return true
				}
			}
		}
		return false
	}
}