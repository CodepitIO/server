angular.module('General')
	.value('Languages', {
		"c": "C",
		"cpp": "C++",
		"cpp11": "C++11",
		"java": "Java",
	})
	.value('TextEditorLanguageMode', {
		"c": "text/x-csrc",
		"cpp": "text/x-c++src",
		"cpp11": "text/x-c++src",
		"java": "text/x-java",
		"": "",
	});
