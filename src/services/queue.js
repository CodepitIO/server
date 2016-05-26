'use strict';

const async = require('async'),
	fs = require('fs'),
	kue = require('kue'),
	path = require('path'),
	util = require('util');

const DownloadFile = require('../utils/functions').downloadFile,
	Exception = require('../utils/exception'),
	Problem = require('../models/problem');

// --- SUBMISSION QUEUE ---

var SubmissionQueue = kue.createQueue({
	redis: {
		host: 'redis'
	},
	jobEvents: false,
});

exports.SubmissionQueue = SubmissionQueue;

// --- IMPORT QUEUE ---

const PROBLEM_PDF_TEMPLATE =
	'<div class="problem-pdf-wrapper">' +
	'<mrt-pdf url="%s.pdf" containerid="problem-pdf-container"></mrt-pdf>' +
	'</div>';
const ID_PATTERN = /problems\/([\d\w]+)/;

function importPdf(filePath, problem, callback) {
	let url = problem.originalUrl;
	let pdfPath = filePath.replace(/html$/i, 'pdf');
	DownloadFile(url, pdfPath, (err) => {
		if (err) return callback(err);
		let html = util.format(PROBLEM_PDF_TEMPLATE, 'problems/' + problem._id);
		return importHtml(filePath, html, callback);
	});
}

function importHtml(filePath, html, callback) {
	fs.writeFile(filePath, html, 'utf8', callback);
}

let ImportQueue = async.queue((filePath, callback) => {
	let id = filePath.match(ID_PATTERN)[1];
	async.waterfall([
		async.reflect(async.apply(fs.stat, filePath)),
		(stat, next) => {
			if (!stat.error) return callback();
			return Problem.findById(id, next);
		},
		(problem, next) => {
			if (!problem) return next(Exception.InvalidOperation);
			if (problem.isPdf) return importPdf(filePath, problem, next);
			if (!problem.imported) return next(Exception.InvalidOperation);
			return importHtml(filePath, problem.html, next);
		},
	], callback);
}, 1);

exports.ImportQueue = ImportQueue;
