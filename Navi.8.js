class Box {
    constructor(x1, y1, x2, y2) {
        this.x1 = Math.min(x1, x2);
        this.y1 = Math.min(y1, y2);
        
        this.x2 = Math.max(x1, x2);
        this.y2 = Math.max(y1, y2);
        
        this.visible = false
        this.visuals = {}
    }

    get width(){ return this.x2 - this.x1 }
    set width(width){ return this.x2 = this.x1 + width }

    get height(){ return this.y2 - this.y1 }
    set height(height){ return this.y2 = this.y1 + height }

    contains(x, y){
        //box contains these coordinates
        return ( this.x1 < x && x < this.x2 && this.y1 < y && y < this.y2 );
    }

    intersects(box){
        //box intersects with this box
        return (this.x1 <= box.x2 &&
            box.x1 <= this.x2 &&
            this.y1 <= box.y2 &&
            box.y1 <= this.y2);
    }

    draw(color){
        if(!color) color=0xF38D00
        if(!this.visible){
            this.visible = true;
            this.visuals[ "lines" ] = [];
            this.visuals[ "lines" ].push(draw_line( this.x1, this.y1, this.x2, this.y1, 1, color ))
            this.visuals[ "lines" ].push(draw_line( this.x2, this.y1, this.x2, this.y2, 1, color ))
            this.visuals[ "lines" ].push(draw_line( this.x2, this.y2, this.x1, this.y2, 1, color ))
            this.visuals[ "lines" ].push(draw_line( this.x1, this.y2, this.x1, this.y1, 1, color ))
        }
    }

    undraw(){
        for(i in this.visuals[ "lines" ])
            this.visuals[ "lines" ][i].destroy();
        this.visible = false;
    }
}

class QuadTree extends Box{
    constructor( region, obstacles ) {
        //@param region: Box()
        //@param obstacles: [Box(), ...]
        super(region.x1, region.y1, region.x2, region.y2)
        this.resolution = 25;
        this.obstacles = obstacles;
        this.quads = [];
        this.center = {
            x: this.x1 + ((this.x2 - this.x1) / 2),
            y: this.y1 + ((this.y2 - this.y1) / 2)
        }
        var self = this;
        if(this.obstacles.length > 0){
            this.subdivide()
        }
        else{
            this.draw(0x009569)
        }
    }

    subdivide(){
        var largest = Math.max(this.x2 - this.x1, this.y2 - this.y1);
        if( largest > this.resolution ){
            var regions = [
                new Box(this.x1, this.y1, this.center.x, this.center.y),
                new Box(this.center.x, this.y1, this.x2, this.center.y),
                new Box(this.x1, this.center.y, this.center.x, this.y2),
                new Box(this.center.x, this.center.y, this.x2, this.y2)
            ] 

            for(var region of regions){
                var obstacles = []
                if(region.contains(character.x, character.y)) game_log(region.contains(character.x, character.y))
                for(var obstacle of this.obstacles){
                    if(region.intersects(obstacle)){
                        obstacles.push(obstacle);
                    }
                }
                this.quads.push(new QuadTree(region, obstacles));
            }
        }
        //if( this.obstacles.length == 0 ) this.draw(0x009569)
    }
    
    drawTree(){
        if( this.obstacles.length == 0 ) this.draw(0x009569)
        for(var region of this.quads){
            region.drawTree()
        }
    }
}

var Navi = {
    data: {},

    plan: () => {
        Navi.data.spawns = Navi.grep.spawns();
        Navi.data.obstacles = Navi.grep.obstacles();
        Navi.draw.map();
    },

    draw:{
        map: () => {
            for(i in Navi.data.spawns)
                Navi.data.spawns[i].draw(0x4BA8FF)

            for(i in Navi.data.obstacles)
                Navi.data.obstacles[i].draw(0xC01025)
        }
    },

    Box: (boundaries) => {
        //Wrapper object
        return new Box( boundaries[0], boundaries[1], boundaries[2], boundaries[3] );
    },

    grep: {
        mapbox: () => {

        },

        spawns: () => {
            var monsterSpawns = G.maps[character.map].monsters
            var spawnboxes = []
            for( i in monsterSpawns ){
                if( monsterSpawns[i].boundary )
                spawnboxes.push( Navi.Box( monsterSpawns[i].boundary ) );
                if( monsterSpawns[i].boundaries){
                    for( b in monsterSpawns[i].boundaries ){
                        spawnboxes.push( new Box( 
                            monsterSpawns[i].boundaries[b] 
                        ) );
                    }
                }
            }
            return spawnboxes;
        },

        obstacles: () => {
            Navi.data.min_x = Infinity;
            Navi.data.max_x = -Infinity;
            Navi.data.min_y = Infinity;
            Navi.data.max_y = -Infinity;
            var obstacles = [];
            var map_data = G.maps[character.map].data
            for (var line of map_data.x_lines) {
                Navi.data.min_x = Math.min(Navi.data.min_x, line[0]);
                Navi.data.max_x = Math.max(Navi.data.max_x, line[0]);
                obstacles.push(Navi.Box([ line[0] - 3, line[1] - 3, line[0] + 3, line[2] + 7 ]));
            }
            for (var line of map_data.y_lines) {
                Navi.data.min_y = Math.min(Navi.data.min_y, line[0]);
                Navi.data.max_y = Math.max(Navi.data.max_y, line[0]);
                obstacles.push(Navi.Box([ line[1] - 3, line[0] - 3, line[2] + 3, line[0] + 7 ]));
            }
            return obstacles;
        },

        quadtree(){
            if(!Navi.data.obstacles) Navi.data.obstacles = Navi.grep.obstacles();
            Navi.data.quadtree = new QuadTree(
                new Box(Navi.data.min_x, Navi.data.max_y, Navi.data.max_x, Navi.data.min_y),
                Navi.data.obstacles
            );
        }
    } 
}