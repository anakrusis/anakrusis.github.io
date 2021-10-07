class BuildingMine extends EntityBuilding {
	
	constructor(x,y,planetuuid, cityuuid, startindex, terrsize){
		super(x,y,planetuuid, cityuuid, startindex, terrsize);
		this.name = "Mine";
		this.productionItem = "iron";
		this.densityaddamt = 0.33;
	}
	
	getRelRenderPoints(){
	return [1.5,-1,1.5,-0.25,-1,-0.25,-1,-1,-0.5,-0.25,0,-1,0.5,-0.25,1,-1,1.5,-0.25,1.5,-1,-1,-1,-1,1,-1,0.25,1.5,0.25,1.5,1,-1,1,-0.5,0.25,0,1,0.5,0.25,1,1,1.5,0.25,-1,0.25,-1,-1,]};
}