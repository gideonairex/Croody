'use strict';

// Call third party modules
var Code = require( 'code' );
var Lab  = require( 'lab' );

// BDD tools
/*global describe:true it:true before:true after:true*/
/*jshint -W079*/
var lab      = exports.lab = Lab.script();
var before   = lab.before;
var describe = lab.describe;
var it       = lab.it;
var expect   = Code.expect;

// Require robot
var Robot = require( '../lib/robot' );

describe( 'Robot', function () {

	var robots  = [];
	var outputs = [];

	// Instantiate robot object
	before( function ( done ) {

		// Stub data
		// Map Coordinates
		var map = {
			'x' : 5,
			'y' : 3
		};

		// Robot configurations
		var configs = [ {
			'position'    : 'E',
			'coordinates' : {
				'x' : 1,
				'y' : 1
			},
			'instruction' : 'RFRFRFRF'
		}, {
			'position'    : 'N',
			'coordinates' : {
				'x' : 3,
				'y' : 2
			},
			'instruction' : 'FRRFLLFFRRFLL'
		}, {
			'position'    : 'W',
			'coordinates' : {
				'x' : 0,
				'y' : 3
			},
			'instruction' : 'LLFFFLFLFL'
		} ];

		// Robot expected output
		outputs = [ {
			'position'    : 'E',
			'status'      : 'GOOD',
			'coordinates' : {
				'x' : 1,
				'y' : 1
			}
		}, {
			'position'    : 'N',
			'status'      : 'LOST',
			'coordinates' : {
				'x' : 3,
				'y' : 3
			}
		}, {
			'position'    : 'S',
			'status'      : 'GOOD',
			'coordinates' : {
				'x' : 2,
				'y' : 3
			}
		} ];

		// Iterate to all robots
		for ( var i = 0; i < configs.length; i++ ) {
			robots[ i ] = new Robot( map, configs[ i ] );
		}

		done();

	} );

	it( 'Should be an object with properties and methods', function  ( done ) {

		for ( var i = 0; i < robots.length; i++ ) {
			var robot = robots[ i ];
			expect( robot ).to.be.an.object();
			expect( robot.position ).to.exist().and.to.an.string();
			expect( robot.coordinates ).to.exist().and.to.be.a.object();
			expect( robot.status ).to.exist().and.to.be.a.string();
			expect( robot.process ).to.be.a.function();
			expect( robot.forward ).to.be.a.function();
			expect( robot.map ).to.be.an.object();
		}

		done();

	} );

	it( 'Should be equal to output after process', function ( done ) {

		var scents = [];

		for ( var i = 0; i < robots.length; i++ ) {
			var robot = robots[ i ];
			var output = outputs[ i ];
			robot.process( scents );

			// Push all robots that have fallen
			if ( robot.status === 'LOST' ) {
				scents.push( robot.coordinates );
			}

			expect( robot.position ).to.equal( output.position );
			expect( robot.coordinates ).to.deep.equal( output.coordinates );
			expect( robot.status ).to.equal( output.status );
		}

		done();

	} );

} );
