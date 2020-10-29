#! /usr/bin/env node

/*************************************************************************
 *
 *  svgofxml
 *
 *  Uses MathJax to convert a MathML XML to SVG.
 *
 * ----------------------------------------------------------------------
 */
var mjAPI = require("mathjax-node-sre");
var argv = require("yargs").demand(1).strict().usage("$0 [options] 'math' > file.svg").options({
	linebreaks: {
		boolean: false,
		describe: "perform automatic line-breaking"
	},
	speech: {
		boolean: true,
		default: true,
		describe: "include speech text"
	},
	font: {
		default: "TeX",
		describe: "web font to use"
	},
	ex: {
		default: 6,
		describe: "ex-size in pixels"
	},
	width: {
		default: 0,
		describe: "width of container in ex"
	},
	extensions: {
		default: "",
		describe: "extra MathJax extensions e.g. 'Safe,TeX/noUndefined'"
	}
}).argv;
if (argv.font === "STIX") argv.font = "STIX-Web";
mjAPI.config({
	MathJax: {
		SVG: {
			addMMLclasses: true,
		displayAlign: 'left',
		useGlobalCache: false,
		useFontCache:false,
			font: argv.font
		}
	},
	extensions: argv.extensions
});
mjAPI.start();
fs = require('fs')
fs.readFile(argv._[0], 'utf8', function(err, data) {
	if (err) {
		return console.log(err);
	}
	mjAPI.typeset({
		math: data,
		format: "MathML",
		svg: true,
		speakText: argv.speech,
		ex: argv.ex,
		width: argv.width,
		displayAlign: 'left',
		useGlobalCache: false,
		useFontCache:false,
		// addMMLclasses: true,
		linebreaks: argv.linebreaks
	}, function(data) {
		if (!data.errors) {
			console.log(data.svg)
		}
	});
});
// mjAPI.typeset({
//   math: argv._[0],
//   format: "MathML",
//   svg:true,
//   speakText: argv.speech,
//   ex: argv.ex, width: argv.width,
//   linebreaks: argv.linebreaks
// }, function (data) {
//   if (!data.errors) {console.log(data.svg)}
// });
