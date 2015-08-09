module.exports = {
  verdictName: {
    "-4": "Compilando...",
    "-3": "Executando...",
    "-2": "Ligando...",
    "-1": "Enviado para Correção",
    "0": "Pendendo",
    "1": "Aceito",
    "2": "Resposta Errada",
    "3": "Tempo Limite Excedido",
    "4": "Erro de Compilação",
    "5": "Erro durante Execução",
    "6": "Limite de Memória Excedido",
    "7": "Limite de Escrita Excedido",
    "8": "Erro de Apresentação",
    "9": "Erro Desconhecido",
    "10": "Uso de função restrita",
    "11": "Erro de submissão"
  },

  get_language: function(x) {
    if (x == "cpp") return "C++";
    else if (x == "c") return "C";
    else if (x == "java") return "Java";
    else if (x == "pascal") return "Pascal";
    else return x;
  },

  get_char: function(x) {
      return String.fromCharCode(65 + x);
  },

  status_color: function(x) {
    if (x == 1) return "success";
    else if (x == 2) return "error";
    else if (x == 8) return "warning";
    else if (x > 2) return "info";
    else return "";
  }
}
