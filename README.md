# AdventureLandConditionalBehaviorModel
This is an attempt in making a general purpose code for adventureland: the code MMORPG

This code consists out of several scripts, you'll need to load the code you need in order for it all to work, generally, thats the base, the actions, and conditions. 
depending on what you need beyond this, you might need to load more code. 

Lets use a new character as an example:
```javascript
//we wont be doing anything fancy, so lets load up the basics
load_code( "Base" );
load_code( "Actions" );
load_code( "Conditions" );

var behavior = {
	memory : {},//this is used to set variables later needed
	
	follow : {},//you wont need to be following anyone, just putting it in for completeness
	
	attack : {
		//attack roll here
		default : {
			condition : condition.mana_above,
			value : 15,
			appliesToSelf : true, //condition applies to self, by default it applies to the target, this condition applies to your character
			action : action.attack //we'll perform this action when the condition is true
		}
	},
	
	buff : {
		//buff roll here
	},
	
	heal : {
		//heal roll here
	},
	
	target : {
		//targeting may have conditions and priorities, which go here
		solo: {
			target : target.nearest, //pretty self explainatory
			condition : condition.not_walking, //ditto
			priority : "1" //highest number gets targetted
		}
	}
}

load_code( "MainLoop" ); //the main loop has to be below the behavior definition
```

Now lets say our beginner mage is growing up and is starting to get enough mana to use some skills and not suffer too much of a hit for it, so lets just add a 
mana burst in there:
```javascript
load_code( "Base" );
load_code( "Actions" );
load_code( "Conditions" );

var behavior = {
	memory : {},

	attack : {
		//attack roll here
		default : {
			condition : condition.mana_above,
			value : 15,
			appliesToSelf : true,
			action : action.attack 
		},
		manaburst : {
			condition : condition.mana_above,//when our mana is above....
			value : 75,                      //75%, we have plenty of mana to fire off a mana burst
			appliesToSelf : true,            //yes... to self... was that not clear?
			action : action.use_skill,       //this time we'll use a skill
			skill : "burst"                  //this is documented in G.skills
		}
	},

	target : {
		solo: {
			target : target.nearest,
			condition : condition.not_walking,
			priority : "1" 
		}
	}
}

load_code( "MainLoop" ); 
