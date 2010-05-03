// low level user agent parsing, usefull for the most and common use cases
// returns true or false based on the check
exports.browser = function browser( ua ){
	// make sure we are dealing with a lowercase useragent string
	ua = ua.toLowerCase();
	
	// based on work of John Resig
	return {
		version: ( ua.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [ 0, "0" ] )[1],
		webkit: /webkit/.test( ua ),
		opera: /opera/.test( ua ),
		ie: /msie/.test( ua ) && !/opera/.test( ua ),
		firefox: /mozilla/.test( ua ) && !/(compatible|webkit)/.test( ua ),
		chrome: /google/.test( ua ) && /webkit/.test( ua ),
		mobile_safari: /Apple.*Mobile.*Safari/.test( ua )
	}
};

exports.parser = function parser( ua, js_ua ){
	var V1 = V2 = V3 = family = false,
		i = 0, length = browsers.length,
		ua_obj, sequence;
	
	// check we can parse down the ua based the parse object
	function parse( parser_obj ){
		var V1 = V2 = V3 = family = false,
			match;
			
		// check if we have positive match
		match = parser_obj.regexp.exec( ua );
		if( match ){
			// check if we need to replace some items
			if( parser_obj.family_replacement ){
				if( parser_obj.family_replacement.match( /\$1/ ) )
					family = parser_obj.family_replacement.replace( /\$1/, match[0] );
				else
					family = parser_obj.family_replacement;
			} else 
				family = match[1];
			
			// check for which version information is available
			if( parser_obj.V1_replacement )
				V1 = parser_obj.V1_replacement;
			else if( match.length >= 2 )
				V1 = match[2];
			
			if( match.length >= 3 ){
				V2 = match[3];
				if( match.length >= 4 )
					V3 = match[4];
			}
				
			// return the parse results
			return {
				match: match[0], // the matched string
				family: family || "Other",
				V1: V1,
				V2: V2,
				V3: V3
			}
		}
		
		// no match, proceed with feeding me parser_obj's
		return false;
	};
	
	// create a pretty user agent string from the ua object
	function pretty( user_agent ){
		// use a supplied ua obj, or the buildin
		var ua = user_agent ? user_agent : ua_obj
			format = "$0";
		
		// generate a pretty output format
		if( ua.V1 ){
			format += " $1";
			if( ua.V2 ){
				format += ".$2";
				if( ua.V3 ){
					if( /^\d+$/.test( ua.V3 ) )
						format += ".$3";
					else
						format += "$3";
				}
			}
		}
		
		// replace placeholder with actual content
		return format.replace( "$0", ua.family )
					 .replace( "$1", ua.V1 )
					 .replace( "$2", ua.V2 )
					 .replace( "$3", ua.V3 );
	};
	
	// the actual finding of the correct user agent group.
	for( ; i < length; i++ ){
		ua_obj = parse( browsers[i] );
		
		// no need to continue parsing other sequence
		if( ua_obj && ua_obj.family )
			break;
	}
	
	// are we working with a chrome frame perhaps?
	if( js_ua && ua.search( "chromeframe" ) != -1 )
		ua_obj.family = "Chrome Frame(" + ua_obj.family + " " + ua_obj.V1 + ")";
	
	return {
		// return results
		family: ua_obj.family,
		V1: ua_obj.V1,
		V2: ua_obj.V2,
		V3: ua_obj.V3,
		match: ua_obj.match,
		
		// return methods that can be used
		pretty: pretty
	}
};

// doing a .join("|") because its easier to maintain as array,
// if you want raw perfomance, compile this a string. 
var browser_slash_v123_names = [
		'Jasmine',
		'ANTGalio',
		'Midori',
		'Fresco',
		'Lobo',
		'Maxthon',
		'Lynx',
		'OmniWeb',
		'Dillo',
		'Camino',
		'Demeter',
		'Fluid',
		'Fennec',
		'Shiira',
		'Sunrise',
		'Chrome',
		'Flock',
		'Netscape',
		'Lunascape',
		'Epiphany',
		'WebPilot',
		'Vodafone',
		'NetFront',
		'Konqueror',
		'SeaMonkey',
		'Kazehakase',
		'Vienna',
		'Iceape',
		'Iceweasel',
		'IceWeasel',
		'Iron',
		'K-Meleon',
		'Sleipnir',
		'Galeon',
		'GranParadiso',
		'Opera Mini',
		'iCab',
		'NetNewsWire',
		'Iron',
		'Iris'
	].join( "|" ),
	
	browser_slash_v12_names = [
		'Bolt',
		'Jasmine',
		'Maxthon',
		'Lynx',
		'Arora',
		'IBrowse',
		'Dillo',
		'Camino',
		'Shiira',
		'Fennec',
		'Phoenix',
		'Chrome',
		'Flock',
		'Netscape',
		'Lunascape',
		'Epiphany',
		'WebPilot',
		'Opera Mini',
		'Opera',
		'Vodafone',
		'NetFront',
		'Konqueror',
		'SeaMonkey',
		'Kazehakase',
		'Vienna',
		'Iceape',
		'Iceweasel',
		'IceWeasel',
		'Iron',
		'K-Meleon',
		'Sleipnir',
		'Galeon',
		'GranParadiso',
		'iCab',
		'NetNewsWire',
		'Iron',
		'Space Bison',
		'Stainless',
		'Orca'
	].join( "|" ),
	
	// the parser regexp storage, this will be used by the UA parser
	browsers = [
		// TOP CASES
		// opera must go first
		{ regexp: /^(Opera)\/(\d+)\.(\d+) \(Nintendo Wii/, family_replacement:'Wii' },
		
		// must go before browser v1.v2
		// eg: Minefield/3.1a1pre
		{ regexp:/(Namoroka|Shiretoko|Minefield)\/(\d+)\.(\d+)\.(\d+(?:pre)?)/, family_replacement:'Firefox ($1)' },
		{ regexp:/(Namoroka|Shiretoko|Minefield)\/(\d+)\.(\d+)([ab]\d+[a-z]*)?/, family_replacement:'Firefox ($1)' },
		{ regexp:/(SeaMonkey|Fennec|Camino)\/(\d+)\.(\d+)([ab]?\d+[a-z]*)/ },
		// eg: Flock/2.0b2
		{ regexp:/(Flock)\/(\d+)\.(\d+)(b\d+?)/ },
		// eg: Fennec/0.9pre
		{ regexp:/(Fennec)\/(\d+)\.(\d+)(pre)/ },
		{ regexp:/(Navigator)\/(\d+)\.(\d+)\.(\d+)/, family_replacement:'Netscape' },
		{ regexp:/(Navigator)\/(\d+)\.(\d+)([ab]\d+)/, family_replacement:'Netscape' },
		{ regexp:/(Netscape6)\/(\d+)\.(\d+)\.(\d+)/, family_replacement:'Netscape' },
		{ regexp:/(MyIBrow)\/(\d+)\.(\d+)/, family_replacement:'My Internet Browser' },
		{ regexp:/(Firefox).*Tablet browser (\d+)\.(\d+)\.(\d+)/, family_replacement:'MicroB' },
		// Opera will stop at 9.80 and hide the real version in the Version string
		// http://dev.opera.com/articles/view/opera-ua-string-changes/
		{ regexp:/(Fennec)\/(\d+)\.(\d+)(pre)/ },
		
		{ regexp:/(Firefox)\/(\d+)\.(\d+)\.(\d+(?:pre)?) \(Swiftfox\)/, family_replacement:'Swiftfox' },
		{ regexp:/(Firefox)\/(\d+)\.(\d+)([ab]\d+[a-z]*)? \(Swiftfox\)/, family_replacement:'Swiftfox' },
		
		// lowercase konqueror
		{ regexp:/(konqueror)\/(\d+)\.(\d+)\.(\d+)/, family_replacement:'Konqueror' },
		
		
		// MAIN CASES, this will match about 50% of the browsers
		// browsers with v123
		{ regexp:new RegExp( '(' + browser_slash_v123_names + ')\\/(\\d+)\\.(\\d+)\\.(\\d+)' ) },
		// browser with v12
		{ regexp:new RegExp( '(' + browser_slash_v12_names +')\\/(\\d+)\\.(\\d+)' ) },
		// browser v123, space instead of slash
		{ regexp:/(iRider|Crazy Browser|SkipStone|iCab|Lunascape|Sleipnir|Maemo Browser) (\d+)\.(\d+)\.(\d+)/ },
		// browser v12, space instead of slash
		{ regexp:/(iCab|Lunascape|Opera|Android) (\d+)\.(\d+)/ },
		{ regexp:/(IEMobile) (\d+)\.(\d+)/, family_replacement:'IE Mobile' },
		// do these after the "edge" cases
		{ regexp:/(Firefox)\/(\d+)\.(\d+)\.(\d+)/ },
		{ regexp:/(Firefox)\/(\d+)\.(\d+)(pre|[ab]\d+[a-z]*)?/ },
		
		// SPECIAL CASES
		{ regexp:/(Obigo|OBIGO)[^\d]*(\d+)(?:.(\d+))?/, family_replacement:'Obigo' },
		{ regexp:/(MAXTHON|Maxthon) (\d+)\.(\d+)/, family_replacement:'Maxthon' },
		{ regexp:/(Maxthon|MyIE2|Uzbl|Shiira)/, V1_replacement:'0' },
		{ regexp:/(PLAYSTATION) (\d+)/, family_replacement:'PlayStation' },
		{ regexp:/(PlayStation Portable)[^\d]+(\d+).(\d+)/ },
		{ regexp:/(BrowseX) \((\d+)\.(\d+)\.(\d+)/ },
		{ regexp:/(Opera)\/(\d+)\.(\d+).*Opera Mobi/, family_replacement:'Opera Mobile' },
		{ regexp:/(POLARIS)\/(\d+)\.(\d+)/, family_replacement:'Polaris' },
		{ regexp:/(BonEcho)\/(\d+)\.(\d+)\.(\d+)/, family_replacement:'Bon Echo' },
		{ regexp:/(iPod|iPhone|iPad)(?:[a-zA-Z;\s])* OS (\d+)_(\d+)(?:_(\d+))?/ },
		{ regexp:/(Avant)/, V1_replacement:'1' },
		{ regexp:/(Nokia)[EN]?(\d+)/ },
		{ regexp:/(Black[bB]erry)(\d+)/, family_replacement:'Blackberry' },
		{ regexp:/(OmniWeb)\/v(\d+)\.(\d+)/ },
		{ regexp:/(Blazer)\/(\d+)\.(\d+)/, family_replacement:'Palm Blazer' },
		{ regexp:/(Pre)\/(\d+)\.(\d+)/, family_replacement:'Palm Pre' },
		{ regexp:/(Links) \((\d+)\.(\d+)/ },
		{ regexp:/(QtWeb) Internet Browser\/(\d+)\.(\d+)/ },
		{ regexp:/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//, family_replacement:'Safari' },
		{ regexp:/(OLPC)\/Update(\d+)\.(\d+)/ },
		{ regexp:/(OLPC)\/Update()\.(\d+)/, V1_replacement:'0' },
		{ regexp:/(SamsungSGHi560)/, family_replacement:'Samsung SGHi560' },
		{ regexp:/^(SonyEricssonK800i)/, family_replacement:'Sony Ericsson K800i' },
		{ regexp:/(Teleca Q7)/ },
		{ regexp:/(MSIE) (\d+)\.(\d+)/, family_replacement:'Internet Explorer' }
	];