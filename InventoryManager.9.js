var inventory = {
	get items(){return character.items},
	
	scroll: {
		compound : ["cscroll0", "cscroll1", "cscroll2"],
		upgrade : ["scroll0", "scroll1", "scroll2"]
	},
	
	sort(){
		return 0
	},
	
	find: {
		items(filter){
			var ids = []
			for(i in inventory.items){
				var approved = []
				if(inventory.items[i]){
					for(key in filter){
						approved.push( inventory.items[i][key] === filter[key] ) 
					}
					if(approved.every((v) => {return v === true})) ids.push(i)
				}
			}
			return ids;
		},
		
		item(filter){
			for(i in inventory.items){
				var approved = []
				if(inventory.items[i]){
					for(key in filter){
						approved.push( inventory.items[i][key] === filter[key] ) 
					}
					if(approved.every((v) => {return v === true})) return i;
				}
			}
			return -1
		},

        highest(filter){
            var ids = inventory.find.items(filter)
            var highest = null;
            for(id of ids){
                var item = inventory.items[id]
                highest = !highest || item.level > highest.level ? item : highest;
            }
            return highest;
        },

        lowest(filter){
            var ids = inventory.find.items(filter)
            var lowest = null;
            for(id of ids){
                var item = inventory.items[id]
                highest = !highest || item.level < lowest.level ? item : lowest;
            }
            return highest;
        }
	},
	
	compound: {
        possible(filter){
            var ids = inventory.find.items(filter)
            var scroll = inventory[ "scroll" ][ "compound" ][ item_grade(character.items[ids[0]]) ]
            if( ids.length > 2 && inventory.find.item({ name: scroll }).length > 0 ) 
                return ids;
            return false 
        },

		item(filter){
			if(!character.q.compound){
				var items = inventory.find.items(filter)
                var scroll = inventory[ "scroll" ][ "compound" ][ item_grade(character.items[items[0]]) ]
				if(items.length >= 3){
                    compound(
						items[0], items[1],items[2], 
						inventory.find.item({ name: scroll })
					)
				}
			}
		},
		
		all(filter, scroll, callback){
			new IntervalTimer((self)=>{
				if(inventory.find.items(filter).length > 3){
					inventory.compound.item(filter, scroll)
				}
				else{
					self.stop()
					if(callback) callback()
				}
			}, 1000 / 2) //run twice a second
		}
	},
	
	upgrade(filter, scroll){
		if(!character.q.upgrade){
			if(item >= 0 && scroll >= 0){
				upgrade( 
					inventory.find.item(filter), 
					inventory.find.item({ name: scroll }) )
			}
		}
	}
}