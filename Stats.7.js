var stats = {
	gold : 0,
	time_spent : 0,
	last_gold : character.gold,
	last_time : Date.now()
}

setInterval(()=>{
	var now = Date.now();
	var delta = now - stats.last_time;
	stats.time_spent += delta;
	stats.gold = character.gold - stats.last_gold;
	stats.last_time = now;
}, 1000)

var show_stats = () => {
	var divider = ( stats.time_spent / 1000 );
	var time = new Date( stats.time_spent );
	var hours = time.getHours() - 1;
	game_log( hours + ":" + time.getMinutes() + ":" + time.getSeconds() )
	game_log( "Gold earned: " + stats.gold )
	game_log( "Gold per minute: " + ( stats.gold / divider ) * 60)
}

map_key("B","snippet","show_stats()")