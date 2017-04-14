angular.module('General')
	.value('Languages', {
		'c': 'C',
		'cpp': 'C++',
		'cpp11': 'C++11',
		'java': 'Java',
		'python2.7': 'Python 2.7',
		'python3': 'Python 3',
	})
	.value('TextEditorLanguageMode', {
		'c': 'text/x-csrc',
		'cpp': 'text/x-c++src',
		'cpp11': 'text/x-c++src',
		'java': 'text/x-java',
		'python2.7': 'text/x-python',
		'python3': 'text/x-python',
		'': '',
	})
	.value('OJName', {
		'la': 'LiveArchive',
		'uva': 'UVa',
		'cf': 'Codeforces',
		'cfgroups': 'Codeforces Gym',
		'cfgym': 'Codeforces Gym',
		'uri': 'URI Online Judge',
		'spoj': 'Spoj',
		'spojbr': 'SpojBR',
		'huxley': 'Huxley',
		'timus': 'Timus',
		'kattis': 'Kattis',
		'codechef': 'CodeChef',
		'poj': 'POJ',
		'zoj': 'ZOJ',
		'toj': 'TOJ',
	})
	.value('Verdict', {
		'-4': {
			text: 'Compilando...',
			class: 'white-submission',
		},
		'-3': {
			text: 'Executando...',
			class: 'white-submission',
		},
		'-2': {
			text: 'Compilando...',
			class: 'white-submission',
		},
		'-1': {
			text: 'Enviado para Correção...',
			class: 'white-submission',
		},
		'0': {
			text: 'Pendendo',
			class: 'white-submission',
		},
		'1': {
			text: 'Aceito',
			class: 'green-submission',
			notification: 'success',
		},
		'2': {
			text: 'Resposta Errada',
			class: 'red-submission',
			notification: 'error',
		},
		'3': {
			text: 'Tempo Limite Excedido',
			class: 'blue-submission',
			notification: 'info',
		},
		'4': {
			text: 'Erro de Compilação',
			class: 'blue-submission',
			notification: 'info',
		},
		'5': {
			text: 'Erro durante Execução',
			class: 'blue-submission',
			notification: 'info',
		},
		'6': {
			text: 'Limite de Memória Excedido',
			class: 'blue-submission',
			notification: 'info',
		},
		'7': {
			text: 'Limite de Escrita Excedido',
			class: 'blue-submission',
			notification: 'info',
		},
		'8': {
			text: 'Erro de Formatação',
			class: 'yellow-submission',
			notification: 'warning',
		},
		'9': {
			text: 'Erro Desconhecido',
			class: 'grey-submission',
			notification: 'info',
		},
		'10': {
			text: 'Uso de função restrita',
			class: 'blue-submission',
			notification: 'info',
		},
		'11': {
			text: 'Erro Interno',
			class: 'grey-submission',
			notification: 'info',
		},
		'12': {
			text: 'Erro de Submissão',
			class: 'grey-submission',
			notification: 'info',
		},
		'15': {
			text: 'Rascunho',
			class: 'grey-submission',
		},
	});
