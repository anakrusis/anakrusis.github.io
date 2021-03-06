class EntityBody extends Entity {
	constructor(x, y, dir, radius){
		super(x,y,dir);
		this.name = "Body";
		this.color = [255, 255, 255];
		this.renderPriority = 3;
		
		this.radius = radius;
		this.terrainSize = 16;
		this.terrain = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		this.canEntitiesCollide = false;
		
		this.gravUUID = null;
		
		this.explored = false;
	}
	
	render(){;
		
		super.render();
		
		//if (cam_zoom > MAX_INTERPLANETARY_ZOOM){
			
			
		//}
		
	}
	
	update(){
		this.dir += this.rotSpeed;
		this.ticksExisted++;
	}
	
	getLODSlice(startindex, endindex){
		if (startindex < 0){
			startindex += this.terrainSize;
		}
		
		var ende = endindex;
		if (endindex < startindex){
			ende += this.terrainSize;
		}
		startindex /= Math.pow(2, lod); startindex = Math.floor(startindex);
		ende   /= Math.pow(2, lod); ende   = Math.floor(ende);
		var adjustedSize = this.terrainSize / Math.pow(2, lod); adjustedSize = Math.floor(adjustedSize);
		
		var points = [];
		for (var i = startindex; i <= (ende+1); i++){
			
			var index = loopyMod(i, adjustedSize);
			//var adjustedindex = terrainindex / ( Math.pow( 2, lod ) )
			
			
			//var angle = this.dir + (index * (2 * Math.PI) / this.terrainSize)
            //var pointx = rot_x(angle, this.radius + this.terrain[index] + radial_offset, 0.0) + this.x;
            //var pointy = rot_y(angle, this.radius + this.terrain[index] + radial_offset, 0.0) + this.y;
			
			var pointx = rot_x(this.dir, this.forms[lod][2 * index], this.forms[lod][(2 * index) + 1]) + this.x;
			var pointy = rot_y(this.dir, this.forms[lod][2 * index], this.forms[lod][(2 * index) + 1]) + this.y;
			
			points.push(pointx); points.push(pointy);
		}
		return points;
	}
	
	// returns a "pizza slice" of points on the body, for optimization
	// (nowadays planets and other bodies are so big, that getAbsolutePoints() is really slow to iterate through, and can have up to thousands of elements)
	getAbsPointsSlice(startindex, endindex, radial_offset){
		
		if (!radial_offset){ var radial_offset = 0; }
		
		if (startindex < 0){
			startindex += this.terrainSize;
		}
		
		var ende = endindex;
		if (endindex < startindex){
			ende += this.terrainSize;
		}
		
		//startindex /= Math.pow(2, lod); startindex = Math.floor(startindex);
		//endindex   /= Math.pow(2, lod); endindex   = Math.floor(endindex);
		
		var points = [];
		for (var i = startindex; i <= (ende+1); i++){
			
			var index = loopyMod(i, this.terrainSize);
			
			var angle = this.dir + (index * (2 * Math.PI) / this.terrainSize)
            var pointx = rot_x(angle, this.radius + this.terrain[index] + radial_offset, 0.0) + this.x;
            var pointy = rot_y(angle, this.radius + this.terrain[index] + radial_offset, 0.0) + this.y;
			
			//var pointx = rot_x(this.dir, this.forms[lod][index], 0.0) + this.x;
			//var pointy = rot_y(this.dir, this.forms[lod][index], 0.0) + this.y;
			
			points.push(pointx); points.push(pointy);
		}
		return points;
	}
	
	getLODPoints(){

        var absPoints = [];
		var adjustedSize = this.terrainSize / Math.pow(2, lod); adjustedSize = Math.ceil(adjustedSize);

        for (var i = 0; i < this.forms[lod].length; i++){

			var index = loopyMod(i, adjustedSize);
			var pointx = rot_x(this.dir, this.forms[lod][2 * index], this.forms[lod][(2 * index) + 1]) + this.x;
			var pointy = rot_y(this.dir, this.forms[lod][2 * index], this.forms[lod][(2 * index) + 1]) + this.y;
			
			absPoints.push(pointx); absPoints.push(pointy);
        }

        return absPoints;
    }
	
	getAbsolutePoints(){

        var absPoints = [];

        for (var i = 0; i < this.terrainSize; i++){
            var angle = this.dir + (i * (2 * Math.PI) / this.terrainSize);

            var pointx = rot_x(angle, this.radius + this.terrain[i], 0.0) + this.x;
            var pointy = rot_y(angle, this.radius + this.terrain[i], 0.0) + this.y;
			
			absPoints.push(pointx); absPoints.push(pointy);
        }

        return absPoints;
    }
	
	getRenderPoints(){
		
		var ap = this.getAbsolutePoints();
		
/* 		var amt = 2
		
		for (i = 0; i < ap.length; i += amt){
			
			ap.splice(i, 2);
		}
		 */
		return ap;
		
	}
	
	getRadius(){ return this.radius; }
	
	getGravityBody(){
		return server.world.chunks[this.getChunk().x][this.getChunk().y].bodies[this.gravUUID];
	}
	
	isOnScreen(){
		//var tx = tra_x(this.x); var ty = tra_y(this.y);
		//var ind = client.world.getPlayer().getTerrainIndex();
		var ind = CollisionUtil.indexFromEntityAngle( client.world.getPlayer(), this );
		var slice = this.getAbsPointsSlice( ind, ind );
		var tx = tra_x(slice[0]); var ty = tra_y(slice[1]);
		return ((tx > -(100*cam_zoom) && tx < width+(100*cam_zoom)) && (ty > -(100*cam_zoom) && ty < height+(100*cam_zoom)));
		//return true;
	}
}