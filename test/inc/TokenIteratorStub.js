/**
	* Represent token sequence the way it's easy to navigate
	*
	* @constructor
	* @alis module:TokenIterator
	* @param {Object[]} tokens
	* @param {Object.<number, number>} posIndexMapInjection
	* @returns {TokenIterator}
	*/
	var TokenIterator = function( tokens, posIndexMapInjection ) {
		var pos = 0,
				posIndexMap = posIndexMapInjection || [];
		// Update position X index map on the first run
		if ( !posIndexMap.length ) {
			tokens.forEach(function( el, inx ){
				posIndexMap[ el.range[ 0 ] ] = inx;
			});
		}
		return {

			/**
			* Iterator interface
			*/

		  /**
			* Check if the end of the sequence reached
			* @returns {boolean}
			*/
			valid: function(){
				return typeof tokens[ pos ] !== "undefined";
			},
			/**
			* Move to the next element
			*/
			next: function(){
				pos++;
			},
			/**
			* Check if the end of the sequence reached
			* @returns {boolean}
			*/
			key: function(){
				return pos;
			},
			/**
			* Rewind the sequence
			*/
			rewind: function() {
				pos = 0;
			},
			/**
			* Get the current token
			* @returns {Object}
			*/
			current: function() {
				return tokens[ pos ];
			},
			/**
			* Move to the token corresponding given in-code position
			* @param {number} lPos
			* @returns {TokenIterator}
			*/
			findByPos: function( lPos ) {
				if ( typeof posIndexMap[ lPos ] === "undefined" ) {
					throw new RangeError( "No token associated with the position " + lPos );
				}
				pos = posIndexMap[ lPos ];
				return this;
			},
				/**
			 * Group boundaries are not present in the SyntaxTree,
			 * find the group opening token
			 * <(>((1)))
			 * @param {number} leftBoundaryPos
			 */
			findGroupOpener: function( leftBoundaryPos ) {
				var i = 0, el;
				do {
					el = this.get( --i );
				} while( el && el.type === "Punctuator" && el.value === "(" && el.range[ 0 ] > leftBoundaryPos );
				pos = pos + i + 1;
				return this;
			},
			/**
			 * Group boundaries are not present in the SyntaxTree,
			 * find the group closing token
			 * (((1))<)>
			 * @param {number} rightBoundaryPos
			 */
			findGroupCloser: function( rightBoundaryPos ) {
				var i = 0, el;
				do {
					el = this.get( ++i );
				} while( el && el.type === "Punctuator" && el.value === ")" && el.range[ 1 ] < rightBoundaryPos );
				pos = pos + i - 1;
				return this;
			},

			/**
			* Get token by a given offset
			* @param int offset (can be negative)
			* @return {object}
			*/
			get: function( offset ) {
				return tokens[ pos + offset ];
			}
		};
	};

module.exports = TokenIterator;