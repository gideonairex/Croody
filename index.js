'use strict';

// Load third party libraries
var inquirer = require( 'inquirer' );
var _   = require( 'lodash' );

// Load Robot
var Robot = require( './lib/robot' );

// Preliminary question
var questions = [
	{
		'type'     : 'input',
		'name'     : 'map',
		'message'  : 'Enter map coordinates ( max : 50 ): ',
		'validate' : function validate ( input ) {

			var done = this.async();
			var data = input.trim().split( /[\s]+/ );

			if ( data.length === 2 ) {

				for ( var i = 0; i < data.length; i++ ) {
					var coordinate = parseInt( data[ i ] );

					if ( typeof coordinate !== 'number' ) {
						return done( 'Should be number' );
					}

					if ( coordinate > 50 ) {
						return done( 'Should not exceed 50' );
					}

				}

				return done( true );

			}

			return done( 'Should only have x and y coordinate' );

		}
	},
	{
		'type'    : 'input',
		'name'    : 'count',
		'message' : 'Enter robot count: '
	}
];

// Coordinate template
var cor = {
		'type'    : 'input',
		'name'    : 'coordinate',
		'message' : 'Enter coordinates for robot '
};

// Instruction template
var inst = {
		'type'    : 'input',
		'name'    : 'instruction',
		'message' : 'Enter instructions '
};

inquirer.prompt( questions, function inquire ( answers ) {

	var robotQuestions = [];

	// Declare map
	var temp = answers.map.trim().split( /[\s]+/ );
	var map = {
		'x' : parseInt( temp[ 0 ] ),
		'y' : parseInt( temp[ 1 ] )
	};

	// Create robot questions
	for ( var i = 1; i <= answers.count; i++ ) {

		// Create new questions
		var newInst     = _.cloneDeep( inst );
		newInst.name    = newInst.name + '-' + i;
		newInst.message = newInst.message + i + ':';

		// Create new questions
		var newCor     = _.cloneDeep( cor );
		newCor.name    = newCor.name + '-' + i;
		newCor.message = newCor.message + i + ':';

		// Push it robot questions
		robotQuestions.push( newCor );
		robotQuestions.push( newInst );
	}

	// Ask user questions
	inquirer.prompt( robotQuestions, function inquire ( robots ) {

		var croodies = [];
		var scents   = [];

		for ( var k = 1; k <= answers.count; k++ ) {

			// Retrieve answers
			var coordinates = robots[ 'coordinate-' + k ].trim().split( /[\s]+/ );
			var instruction = robots[ 'instruction-' + k ];

			var config = {
				'coordinates' : {
					'x' : parseInt( coordinates[ 0 ] ),
					'y' : parseInt( coordinates[ 1 ] )
				},
				'position'    : coordinates[ 2 ],
				'instruction' : instruction
			};

			croodies.push( new Robot( map, config ) );

		}

		// Process Robots
		console.log( 'Output:' );

		for ( var j = 0; j < croodies.length; j++ ) {
			var robot = croodies[ j ];
			robot.process( scents );

			// Push all robots that have fallen
			if ( robot.status === 'LOST' ) {
				scents.push( robot.coordinates );
			}
			console.log( 'Robot ' + j + ': \nCoordinates: [ ' + robot.coordinates.x + ', ' + robot.coordinates.y + ' ] \nPosition: ' + robot.position + '\nStatus: ' + robot.status + '\n' );
		}

	} );

} );
