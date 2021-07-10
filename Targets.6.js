var target = {
    nearest: () => {
        var target=get_targeted_monster();
        if( !target ){
            target=get_nearest_monster({ min_xp:100 });
            if( !target ){
                set_message("No Monsters");
                return false;
            }
        }
        return target
    },

    specific: (name) => {
        var target=get_targeted_monster();
        if( !target )
        {
            for(i in parent.entities){
                if(parent.entities[i].name == name){
                    parent.d_text(shuffle(["Hanz! Get ze flammenwerfer!", "There he is!", name + "! Get 'em!", "It will be the battle of the century.", "CHAAAAAAARGE!", ])[0],character,{color:shuffle(["#68B3D1","#D06F99","#6ED5A3","#D2CF5A"])[0]});
                    target = get_monster( i )
                }
            }
        }
        return target
    }
}