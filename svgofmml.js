#! /usr/bin/env node

/*************************************************************************
 *
 *  svgofxml
 *
 *  Uses MathJax to convert a MathML XML to SVG.
 *
 * ----------------------------------------------------------------------
 */
var mjAPI = require('mathjax-node-sre');
var argv = require('yargs')
	.strict()
	.usage('$0 [options] xmlfile > file.svg')
	.options({
		linebreaks: {
			boolean: false,
			describe: 'perform automatic line-breaking',
		},
		speech: {
			boolean: true,
			default: true,
			describe: 'include speech text',
		},
		font: {
			default: 'TeX',
			describe: 'web font to use',
		},
		ex: {
			default: 6,
			describe: 'ex-size in pixels',
		},
		width: {
			default: 0,
			describe: 'width of container in ex',
		},
		extensions: {
			default: '',
			describe: "extra MathJax extensions e.g. 'Safe,TeX/noUndefined'",
		},
		out: {
			default: '',
			describe: 'write to file instead of stdout',
		},
	}).argv;
fs = require('fs');

function proc(err, data) {
	if (err) {
		return console.log(err);
	} else if (data.test(/\s*<\s*\?/)) {
	// } else {
		// mathjax does not like pre proc
		JSDOM = require('jsdom');
		const DOMParser = new JSDOM.JSDOM('').window.DOMParser;
		data = new DOMParser().parseFromString(data, 'text/xml').documentElement.outerHTML;
	}

	let conf = {
		math: data,
		format: 'MathML',
		svg: true,
		speakText: argv.speech,
		ex: argv.ex,
		width: argv.width,
		displayAlign: 'left',
		useGlobalCache: false,
		useFontCache: false,
		// addMMLclasses: true,
		linebreaks: argv.linebreaks,
	};

	mjAPI.typeset(conf, function (data) {
		if (data.errors) {
			console.error(data.errors);
		} else if (argv.out) {
			fs.writeFile(argv.out, data.svg, function (err) {
				if (err) {
					return console.error(err);
				}
			});
		} else {
			console.log(data.svg);
		}
	});
}
if (1) {
	if (argv.font === 'STIX') argv.font = 'STIX-Web';
	mjAPI.config({
		MathJax: {
			SVG: {
				addMMLclasses: true,
				displayAlign: 'left',
				useGlobalCache: false,
				useFontCache: false,
				font: argv.font,
			},
		},
		extensions: argv.extensions,
	});

	mjAPI.start();
}
if (argv._.length < 1 || argv._[0] == '-') {
	proc(false, fs.readFileSync(0, 'utf-8'));
} else {
	fs.readFile(argv._[0], 'utf8', proc);
}
