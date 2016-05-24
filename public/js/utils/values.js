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
		'-4': 'Compilando...',
		'-3': 'Executando...',
		'-2': 'Compilando...',
		'-1': 'Enviado para Correção',
		'0': 'Pendendo',
		'1': 'Aceito',
		'2': 'Resposta Errada',
		'3': 'Tempo Limite Excedido',
		'4': 'Erro de Compilação',
		'5': 'Erro durante Execução',
		'6': 'Limite de Memória Excedido',
		'7': 'Limite de Escrita Excedido',
		'8': 'Erro de Formatação',
		'9': 'Erro Desconhecido',
		'10': 'Uso de função restrita',
		'11': 'Submissão inválida',
		'12': 'Erro de Submissão',
		'15': 'Rascunho'
	});
