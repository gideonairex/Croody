'use strict';

function Robot ( map, config ) {
	// Initialise Direction
	this.direction = 'NESW';

	// Initialize Robot
	this.status      = 'GOOD';
	this.position    = config.position;
	this.coordinates = config.coordinates;
	this.instruction = config.instruction;
	this.map         = map;

}

Robot.prototype.process = function Robot ( scents ) {

	// Process the instruction
	for ( var i = 0; i < this.instruction.length; i++ ) {

		// transition point
		var transition;

		switch ( this.instruction[ i ] ) {
			case 'F' :

				// Process forward
				this.forward( scents );
				break;

			case 'R' :

				// Pivot to the right
				transition = this.direction.indexOf( this.position );
				if ( transition === 3 ) {
					this.position = this.direction[ 0 ];
				} else {
					this.position = this.direction[ transition + 1 ];
				}
				break;

			case 'L' :

				// Pivot to the left
				transition = this.direction.indexOf( this.position );
				if ( !transition ) {
					this.position = this.direction[ 3 ];
				} else {
					this.position = this.direction[ transition - 1 ];
				}
				break;

		}

	}

	return;
};

Robot.prototype.forward = function forward ( scents ) {

	var original;
	var i;

	switch ( this.position ) {
		case 'N' :
			original = this.coordinates.y;

			// Increment value
			this.coordinates.y++;

			if ( this.coordinates.y > this.map.y ) {
				// Directly change it to LOST
				this.status = 'LOST';

				// Check for scents
				for ( i = 0; i < scents.length; i++ ) {
					if ( original === scents[ i ].y && this.coordinates.x === scents[ i ].x ) {
						this.status = 'GOOD';
						// Decrement if saved
						this.coordinates.y--;
					}
				}

			}

			break;
		case 'E' :
			original = this.coordinates.x;

			// Increment value
			this.coordinates.x++;

			if ( this.coordinates.x > this.map.x ) {
				// Directly change it to LOST
				this.status = 'LOST';

				// Check for scents
				for ( i = 0; i < scents.length; i++ ) {
					if ( original === scents[ i ].x && this.coordinates.x === scents[ i ].y ) {
						this.status = 'GOOD';
						// Decrement if saved
						this.coordinates.x--;
					}
				}

			}

			break;
		case 'S' :
			original = this.coordinates.y;

			// Decrement value
			this.coordinates.y--;

			if ( this.coordinates.y < 0 ) {
				// Directly change it to LOST
				this.status = 'LOST';

				// Check for scents
				for ( i = 0; i < scents.length; i++ ) {
					if ( original === scents[ i ].y && this.coordinates.x === scents[ i ].x ) {
						this.status = 'GOOD';
						// Increment if saved
						this.coordinates.y++;
					}
				}

			}

			break;

		case 'W' :

			original = this.coordinates.x;

			// Decrement value
			this.coordinates.x--;

			if ( this.coordinates.x < 0 ) {
				// Directly change it to LOST
				this.status = 'LOST';

				// Check for scents
				for ( i = 0; i < scents.length; i++ ) {
					if ( original === scents[ i ].x && this.coordinates.x === scents[ i ].y ) {
						this.status = 'GOOD';
						// Increment if saved
						this.coordinates.x++;
					}
				}

			}

			break;

	}

};

module.exports = Robot;
