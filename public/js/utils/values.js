angular.module('General')
	.value('Languages', {
		'c': 'C',
		'cpp': 'C++',
		'cpp11': 'C++11',
		'java': 'Java',
	})
	.value('TextEditorLanguageMode', {
		'c': 'text/x-csrc',
		'cpp': 'text/x-c++src',
		'cpp11': 'text/x-c++src',
		'java': 'text/x-java',
		'': '',
	})
	.value('OJName', {
		'la': 'LiveArchive',
		'uva': 'UVa',
		'cf': 'Codeforces',
		'uri': 'URI Online Judge',
		'spoj': 'Spoj',
		'spojbr': 'SpojBR',
		'huxley': 'Huxley',
		'timus': 'Timus',
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
		},
		'2': {
			text: 'Resposta Errada',
			class: 'red-submission',
		},
		'3': {
			text: 'Tempo Limite Excedido',
			class: 'blue-submission',
		},
		'4': {
			text: 'Erro de Compilação',
			class: 'blue-submission',
		},
		'5': {
			text: 'Erro durante Execução',
			class: 'blue-submission',
		},
		'6': {
			text: 'Limite de Memória Excedido',
			class: 'blue-submission',
		},
		'7': {
			text: 'Limite de Escrita Excedido',
			class: 'blue-submission',
		},
		'8': {
			text: 'Erro de Formatação',
			class: 'yellow-submission',
		},
		'9': {
			text: 'Erro Desconhecido',
			class: 'grey-submission',
		},
		'10': {
			text: 'Uso de função restrita',
			class: 'blue-submission',
		},
		'11': {
			text: 'Submissão inválida',
			class: 'grey-submission',
		},
		'12': {
			text: 'Erro de Submissão',
			class: 'grey-submission',
		},
		'15': {
			text: 'Rascunho',
			class: 'grey-submission',
		},
	});
