const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');

const TEAL        = "2D6E74";
const TEAL_CLARO  = "E8F4F5";
const AMARELO     = "F5F1A8";
const CINZA_CLARO = "F4F4F4";
const BRANCO      = "FFFFFF";
const PRETO       = "333333";

const noBorder  = () => ({ style: BorderStyle.NONE, size: 0, color: "FFFFFF" });
const noBorders = () => ({ top: noBorder(), bottom: noBorder(), left: noBorder(), right: noBorder() });
const bord      = (c = "CCCCCC") => ({ style: BorderStyle.SINGLE, size: 1, color: c });
const borders   = (c = "CCCCCC") => ({ top: bord(c), bottom: bord(c), left: bord(c), right: bord(c) });

function cell(children, { bg = null, bold = false, color = PRETO, width = 4500,
  align = AlignmentType.LEFT, vAlign = VerticalAlign.CENTER,
  borderColor = "CCCCCC", noBord = false } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: noBord ? noBorders() : borders(borderColor),
    shading: bg ? { fill: bg, type: ShadingType.CLEAR } : undefined,
    verticalAlign: vAlign,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: Array.isArray(children) ? children : [
      new Paragraph({
        alignment: align,
        children: [new TextRun({ text: children, bold, color, font: "Arial", size: 20 })]
      })
    ]
  });
}

function p(text, { bold = false, color = PRETO, size = 20, space = 120,
  align = AlignmentType.JUSTIFIED } = {}) {
  return new Paragraph({
    alignment: align, spacing: { after: space },
    children: [new TextRun({ text, bold, color, font: "Arial", size })]
  });
}

function pRuns(runs, { space = 120, align = AlignmentType.JUSTIFIED } = {}) {
  return new Paragraph({
    alignment: align, spacing: { after: space },
    children: runs.map(r => new TextRun({ font: "Arial", size: 20, color: PRETO, ...r }))
  });
}

function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 }, spacing: { after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 20, color: PRETO })]
  });
}

function secao(texto) {
  return new Table({
    width: { size: 9026, type: WidthType.DXA }, columnWidths: [9026],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: 9026, type: WidthType.DXA }, borders: noBorders(),
      shading: { fill: TEAL, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 160, right: 160 },
      children: [new Paragraph({
        children: [new TextRun({ text: texto, bold: true, color: BRANCO, font: "Arial", size: 24 })]
      })]
    })] })]
  });
}

function subSecao(texto) {
  return new Paragraph({
    spacing: { before: 160, after: 80 },
    children: [new TextRun({ text: texto, bold: true, color: TEAL, font: "Arial", size: 22 })]
  });
}

function subSub(texto) {
  return new Paragraph({
    spacing: { before: 100, after: 60 },
    children: [new TextRun({ text: texto, bold: true, color: PRETO, font: "Arial", size: 20 })]
  });
}

function destaque(texto) {
  return new Table({
    width: { size: 9026, type: WidthType.DXA }, columnWidths: [9026],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: 9026, type: WidthType.DXA }, borders: noBorders(),
      shading: { fill: AMARELO, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 200, right: 200 },
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: texto, bold: true, color: TEAL, font: "Arial", size: 20, italics: true })]
      })]
    })] })]
  });
}

function caixaCalculo(linhas) {
  return new Table({
    width: { size: 9026, type: WidthType.DXA }, columnWidths: [9026],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: 9026, type: WidthType.DXA },
      borders: borders("CCCCCC"),
      shading: { fill: "F8F8F8", type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 200, right: 200 },
      children: linhas.map(l => new Paragraph({
        alignment: AlignmentType.LEFT, spacing: { after: 40 },
        children: [new TextRun({ text: l, font: "Courier New", size: 20, color: TEAL, bold: true })]
      }))
    })] })]
  });
}

function caixaInfo(titulo, descricao) {
  return new Table({
    width: { size: 9026, type: WidthType.DXA }, columnWidths: [300, 8726],
    rows: [new TableRow({ children: [
      new TableCell({
        width: { size: 300, type: WidthType.DXA }, borders: noBorders(),
        shading: { fill: TEAL, type: ShadingType.CLEAR },
        children: [new Paragraph({ children: [new TextRun("")] })]
      }),
      new TableCell({
        width: { size: 8726, type: WidthType.DXA },
        borders: { ...noBorders(), left: bord(TEAL) },
        shading: { fill: TEAL_CLARO, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 160, right: 120 },
        verticalAlign: VerticalAlign.TOP,
        children: [
          new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: titulo, bold: true, color: TEAL, font: "Arial", size: 20 })] }),
          new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 0 }, children: [new TextRun({ text: descricao, font: "Arial", size: 20, color: PRETO })] })
        ]
      })
    ]})]
  });
}

function esp(n = 1) {
  return new Paragraph({ children: [new TextRun("")], spacing: { after: n * 80 } });
}

const doc = new Document({
  styles: { default: { document: { run: { font: "Arial", size: 20, color: PRETO } } } },
  sections: [{
    properties: {
      page: { size: { width: 11906, height: 16838 }, margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({
        children: [
          new Table({
            width: { size: 9026, type: WidthType.DXA }, columnWidths: [2000, 7026],
            rows: [new TableRow({ children: [
              new TableCell({
                width: { size: 2000, type: WidthType.DXA }, borders: noBorders(),
                shading: { fill: TEAL, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 160, right: 160 },
                children: [new Paragraph({ children: [new TextRun({ text: "ASCEND", bold: true, color: BRANCO, font: "Arial", size: 28 })] })]
              }),
              new TableCell({
                width: { size: 7026, type: WidthType.DXA }, borders: noBorders(),
                shading: { fill: TEAL, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 160, right: 160 },
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: "ECFO – Sprint 2 · MRU · FIAP", color: BRANCO, font: "Arial", size: 18 })]
                })]
              })
            ]})]
          }),
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: AMARELO, space: 1 } },
            children: [new TextRun("")]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: TEAL, space: 4 } },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: "Engenharia Mecatrônica · FIAP · 2026", font: "Arial", size: 16, color: "888888" }),
            new TextRun({ text: "\tPágina ", font: "Arial", size: 16, color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "888888" }),
          ]
        })]
      })
    },

    children: [

      // ── CAPA ────────────────────────────────────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { before: 200, after: 40 },
        children: [new TextRun({ text: "ASCEND", bold: true, color: TEAL, font: "Arial", size: 52 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { after: 40 },
        children: [new TextRun({ text: "Estacionamento Vertical Autônomo", color: PRETO, font: "Arial", size: 24 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { after: 40 },
        children: [new TextRun({ text: "ECFO – Sprint 2", bold: true, color: TEAL, font: "Arial", size: 26 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { after: 200 },
        children: [new TextRun({ text: "Movimento Retilíneo Uniforme em um Sistema Inteligente de Elevadores para Veículos", color: PRETO, font: "Arial", size: 20 })]
      }),
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: AMARELO, space: 4 } },
        spacing: { after: 300 }, children: [new TextRun("")]
      }),

      // ── CONTRACAPA ──────────────────────────────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { before: 80, after: 40 },
        children: [new TextRun({ text: "ASCEND – Estacionamento Vertical Autônomo", bold: true, color: TEAL, font: "Arial", size: 26 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { after: 200 },
        children: [new TextRun({ text: "ECFO – Sprint 2: MRU em Sistemas de Elevadores Inteligentes", color: PRETO, font: "Arial", size: 20 })]
      }),

      new Table({
        width: { size: 9026, type: WidthType.DXA }, columnWidths: [2520, 6506],
        rows: [
          ["Instituição",      "FIAP"],
          ["Curso",            "Engenharia Mecatrônica"],
          ["Turma",            "1EMR"],
          ["Disciplina",       "ECFO / Challenge"],
          ["Empresa Parceira", "OTIS Elevadores"],
          ["Professor",        "Nivaldo Zafalon Junior"],
          ["Ano",              "2026"],
        ].map(([l, v]) => new TableRow({ children: [
          cell(l, { bg: TEAL_CLARO, bold: true, color: TEAL, width: 2520 }),
          cell(v, { width: 6506 })
        ]}))
      }),

      esp(2),

      new Table({
        width: { size: 9026, type: WidthType.DXA }, columnWidths: [4000, 1800, 3226],
        rows: [
          new TableRow({ children: [
            cell("Nome",   { bg: TEAL, bold: true, color: BRANCO, width: 4000, borderColor: TEAL }),
            cell("RM",     { bg: TEAL, bold: true, color: BRANCO, width: 1800, align: AlignmentType.CENTER, borderColor: TEAL }),
            cell("E-mail", { bg: TEAL, bold: true, color: BRANCO, width: 3226, borderColor: TEAL }),
          ]}),
          ...([
            ["Beatriz Gonçalves",   "572149", "beatriz.cabral@fiap.com.br",  BRANCO],
            ["Hugo Mariutti",       "568941", "hugo.mariutti@fiap.com.br",   CINZA_CLARO],
            ["Kawuan Mizael",       "569474", "kawuan.mizael@fiap.com.br",   BRANCO],
            ["Manoela de Almeida", "571373", "manoela.almeida@fiap.com.br", CINZA_CLARO],
          ].map(([n, rm, email, bg]) => new TableRow({ children: [
            cell(n,     { bg, width: 4000 }),
            cell(rm,    { bg, width: 1800, align: AlignmentType.CENTER }),
            cell(email, { bg, width: 3226 }),
          ]})))
        ]
      }),

      esp(2),
      destaque('"O futuro das cidades exige eficiência, automação e otimização."'),
      esp(2),

      // ── 3.1 ─────────────────────────────────────────────────────────────
      secao("3.1 — Descrição do Sistema"),
      esp(),
      p("A etapa escolhida para análise é o deslocamento vertical da plataforma principal do ASCEND, responsável por elevar os veículos do nível térreo até os andares superiores da estrutura cilíndrica do estacionamento. Essa é a operação mais frequente e crítica do sistema, pois ocorre a cada novo veículo estacionado."),
      esp(),

      ...[
        ["1) Etapa analisada",
         "O grupo selecionou o movimento da plataforma elevatória central durante o trajeto de subida, partindo do térreo (posição 0) até o primeiro andar disponível."],
        ["2) Objeto que se movimenta",
         "A plataforma elevatória — uma base metálica motorizada que sustenta o veículo durante o transporte vertical. No protótipo em escala 1:18, essa plataforma é acionada por um motor de passo, permitindo controle preciso da posição."],
        ["3) Percurso considerado",
         "O percurso analisado é a subida da plataforma desde o térreo (S₀ = 0 m) até 1,50 m de altura, correspondendo ao primeiro andar do protótipo em escala. No sistema real, esse trajeto equivale a aproximadamente 2,7 metros entre andares (escala 1:18)."],
        ["4) Sensor ou método de monitoramento",
         "Será utilizado o sensor ultrassônico HC-SR04, fixado na parte superior interna da estrutura, medindo continuamente a distância até a plataforma. O sensor emite pulsos ultrassônicos e calcula a posição com base no tempo de retorno do eco. A saída digital é processada pelo Arduino Uno, que converte os dados de tempo em posição e calcula a velocidade instantânea da plataforma."],
        ["5) Importância do controle de velocidade e tempo",
         "Controlar velocidade e tempo nessa etapa é essencial por três razões principais. Primeiro, o elevador precisa parar com precisão de ±2 mm na altura correta para que a esteira retrátil se alinhe com a vaga. Segundo, uma velocidade irregular pode indicar sobrecarga ou falha mecânica, permitindo que o sistema acione uma parada de emergência antes de um dano maior. Terceiro, o tempo de subida define diretamente o tempo de espera do usuário."],
      ].flatMap(([t, d]) => [caixaInfo(t, d), esp()]),

      esp(),

      // ── 3.2 ─────────────────────────────────────────────────────────────
      secao("3.2 — Coleta e Simulação dos Dados"),
      esp(),
      p("Como o protótipo ainda está em fase de desenvolvimento (Sprint 4 prevista para junho de 2026), os dados foram estimados a partir de uma situação realista, considerando o motor de passo NEMA 17 com velocidade configurada a 0,30 m/s — valor compatível com sistemas comerciais de estacionamento automatizado em escala reduzida. Os dados apresentam pequenas variações (±0,01 m/s) para simular as imprecisões reais de um motor de passo em operação."),
      esp(),

      p("Tabela 1 — Posição da plataforma em função do tempo (subida – 1º andar)", { bold: true, align: AlignmentType.CENTER }),
      esp(),
      new Table({
        width: { size: 5000, type: WidthType.DXA }, columnWidths: [2500, 2500],
        rows: [
          new TableRow({ children: [
            cell("Tempo (s)", { bg: TEAL, bold: true, color: BRANCO, width: 2500, align: AlignmentType.CENTER, borderColor: TEAL }),
            cell("Posição (m)", { bg: TEAL, bold: true, color: BRANCO, width: 2500, align: AlignmentType.CENTER, borderColor: TEAL }),
          ]}),
          ...([
            ["0", "0,00"], ["1", "0,30"], ["2", "0,61"],
            ["3", "0,90"], ["4", "1,20"], ["5", "1,51"],
          ].map(([t, s], i) => new TableRow({ children: [
            cell(t, { bg: i%2===0?BRANCO:CINZA_CLARO, width: 2500, align: AlignmentType.CENTER }),
            cell(s, { bg: i%2===0?BRANCO:CINZA_CLARO, width: 2500, align: AlignmentType.CENTER }),
          ]})))
        ]
      }),

      esp(2),

      // ── 3.3 ─────────────────────────────────────────────────────────────
      secao("3.3 — Cálculo da Velocidade Média"),
      esp(),

      subSub("1) Velocidade média entre o primeiro e o último ponto"),
      caixaCalculo(["v = ΔS / Δt", "v = (1,51 − 0,00) / (5 − 0)", "v = 1,51 / 5", "v = 0,302 m/s"]),
      esp(),

      subSub("2) Velocidade média entre cada intervalo"),
      esp(),
      p("Tabela 2 — Velocidades intermediárias", { bold: true, align: AlignmentType.CENTER }),
      esp(),
      new Table({
        width: { size: 9026, type: WidthType.DXA }, columnWidths: [2000, 2200, 2000, 2826],
        rows: [
          new TableRow({ children: [
            cell("Intervalo (s)", { bg: TEAL, bold: true, color: BRANCO, width: 2000, align: AlignmentType.CENTER, borderColor: TEAL }),
            cell("ΔS (m)",        { bg: TEAL, bold: true, color: BRANCO, width: 2200, align: AlignmentType.CENTER, borderColor: TEAL }),
            cell("Δt (s)",        { bg: TEAL, bold: true, color: BRANCO, width: 2000, align: AlignmentType.CENTER, borderColor: TEAL }),
            cell("v (m/s)",       { bg: TEAL, bold: true, color: BRANCO, width: 2826, align: AlignmentType.CENTER, borderColor: TEAL }),
          ]}),
          ...([
            ["0 → 1", "0,30 − 0,00", "1", "0,30"],
            ["1 → 2", "0,61 − 0,30", "1", "0,31"],
            ["2 → 3", "0,90 − 0,61", "1", "0,29"],
            ["3 → 4", "1,20 − 0,90", "1", "0,30"],
            ["4 → 5", "1,51 − 1,20", "1", "0,31"],
          ].map(([inv, ds, dt, v], i) => new TableRow({ children: [
            cell(inv, { bg: i%2===0?BRANCO:CINZA_CLARO, width: 2000, align: AlignmentType.CENTER }),
            cell(ds,  { bg: i%2===0?BRANCO:CINZA_CLARO, width: 2200, align: AlignmentType.CENTER }),
            cell(dt,  { bg: i%2===0?BRANCO:CINZA_CLARO, width: 2000, align: AlignmentType.CENTER }),
            cell(v,   { bg: i%2===0?BRANCO:CINZA_CLARO, width: 2826, align: AlignmentType.CENTER, bold: true, color: TEAL }),
          ]})))
        ]
      }),
      esp(),
      p("Análise: as velocidades intermediárias variam entre 0,29 m/s e 0,31 m/s, com média de 0,302 m/s. A variação máxima em relação à média é de apenas 0,01 m/s (~3,3%), o que é muito pequena. Portanto, o movimento pode ser considerado aproximadamente uniforme, pois a velocidade se mantém praticamente constante ao longo de todo o trajeto. Essa pequena variação é esperada em sistemas reais e se deve a imprecisões mecânicas e variações de carga."),

      esp(2),

      // ── 3.4 ─────────────────────────────────────────────────────────────
      secao("3.4 — Gráfico Posição × Tempo"),
      esp(),
      p("O gráfico posição × tempo foi construído com os dados da Tabela 1. A linha de tendência linear inserida apresentou a seguinte equação:"),
      esp(),
      caixaCalculo(["S(t) = 0,302·t + 0,0033  ≈  0,30·t", "R² = 0,9997"]),
      esp(),
      p("O coeficiente de determinação R² = 0,9997, muito próximo de 1, confirma que os pontos se ajustam muito bem a uma reta — característica fundamental do MRU."),
      esp(),

      subSub("Identificação dos parâmetros da equação"),
      esp(),
      new Table({
        width: { size: 9026, type: WidthType.DXA }, columnWidths: [3200, 5826],
        rows: [
          new TableRow({ children: [
            cell("Parâmetro",  { bg: TEAL, bold: true, color: BRANCO, width: 3200, borderColor: TEAL }),
            cell("Valor e interpretação", { bg: TEAL, bold: true, color: BRANCO, width: 5826, borderColor: TEAL }),
          ]}),
          ...([
            ["Velocidade pelo gráfico",  "v = 0,302 m/s — coeficiente angular da reta (valor que multiplica t)"],
            ["Posição inicial (S₀)",      "S₀ = 0,0033 m ≈ 0 m — termo independente da equação (valor de S quando t = 0)"],
            ["Equação do movimento",      "S(t) = 0,302·t — simplificando o termo inicial praticamente nulo"],
            ["Linearidade do gráfico",   "R² = 0,9997 — altíssima linearidade, confirmando comportamento MRU"],
          ].map(([a, b], i) => new TableRow({ children: [
            cell(a, { bg: i%2===0?TEAL_CLARO:CINZA_CLARO, bold: true, color: TEAL, width: 3200, vAlign: VerticalAlign.TOP }),
            cell(b, { bg: i%2===0?BRANCO:CINZA_CLARO, width: 5826, align: AlignmentType.JUSTIFIED, vAlign: VerticalAlign.TOP }),
          ]})))
        ]
      }),
      esp(),
      p("A interpretação física é direta: como o coeficiente angular representa a inclinação da reta e, na equação do MRU (S = S₀ + v·t), o coeficiente que multiplica o tempo é a velocidade, concluímos que a plataforma sobe a 0,302 m/s de forma praticamente constante. O valor próximo de zero do termo independente indica que a plataforma partiu do térreo (posição zero), o que é coerente com a situação física descrita."),

      esp(2),

      // ── 3.5 ─────────────────────────────────────────────────────────────
      secao("3.5 — Aplicação ao Controle Industrial"),
      esp(),

      subSub("1) Tempo para subir 3 metros"),
      caixaCalculo(["t = S / v = 3,00 / 0,302 ≈ 9,93 s"]),
      esp(),
      p("A plataforma levaria aproximadamente 9,93 segundos para subir 3 metros. Esse valor é relevante para o dimensionamento do tempo de atendimento do sistema: se cada operação de estacionamento exige em média uma subida e uma descida, o tempo mínimo de movimentação vertical é de ~20 segundos por veículo — informação fundamental para calcular a capacidade de atendimento do ASCEND."),
      esp(),

      subSub("2) Tempo para atingir o 4º nível"),
      caixaCalculo(["Altura do 4º nível: 4 × 1,50 m = 6,00 m", "t = 6,00 / 0,302 ≈ 19,87 s ≈ 20 s"]),
      esp(),
      p("O carro levaria aproximadamente 20 segundos para chegar ao 4º nível. Esse dado é essencial para o sistema de IA do ASCEND: ao receber a solicitação de estacionamento, o algoritmo pode calcular antecipadamente o tempo de espera do usuário e exibi-lo no aplicativo, melhorando a experiência operacional."),
      esp(),

      subSub("3) Ganho com aumento de 20% na velocidade"),
      caixaCalculo(["v' = 0,302 × 1,20 = 0,362 m/s", "t' = 6,00 / 0,362 ≈ 16,57 s", "Ganho: 19,87 − 16,57 = 3,30 s  (~16,6% de redução)"]),
      esp(),
      p("Em um sistema com alta demanda, como um shopping com dezenas de operações por hora, esse ganho se traduz em maior capacidade de atendimento e menor fila na entrada. Contudo, aumentar a velocidade exige motores mais potentes, maior consumo energético e maior precisão no sistema de freagem, o que deve ser avaliado em conjunto com os limites mecânicos do protótipo."),
      esp(),

      subSub("4) Falha sem monitoramento de posição"),
      p("Sem monitoramento contínuo de posição, o sistema perderia a referência de onde a plataforma se encontra durante o movimento. A falha mais grave seria o elevador ultrapassar o andar correto e colidir com a estrutura superior (overrun), potencialmente danificando o veículo e o mecanismo. Além disso, sem dados de posição, seria impossível detectar uma parada inesperada por sobrecarga ou falha no motor, e o sistema continuaria enviando comandos para uma plataforma parada — situação que pode gerar superaquecimento nos drivers de controle e danos irreversíveis ao motor de passo."),
      esp(),

      subSub("5) Exibição em interface em tempo real"),
      p("As informações de posição e velocidade apareceriam no aplicativo do ASCEND em forma de dashboard em tempo real, com os seguintes elementos:"),
      ...["Indicador vertical animado mostrando a posição atual da plataforma (andar por andar)",
          "Valor numérico da velocidade atual em m/s",
          "Barra de progresso indicando o percentual do trajeto concluído",
          "Contador regressivo com o tempo estimado de chegada à vaga",
          "Alertas visuais em vermelho caso a velocidade caia abaixo de um limiar mínimo (indicando possível falha) ou ultrapasse o máximo configurado (risco de colisão)",
        ].map(t => bullet(t)),
      esp(),
      p("Essas informações seriam transmitidas do Arduino para o servidor via módulo ESP32, usando protocolo MQTT, e exibidas no aplicativo em tempo inferior a 1 segundo."),

      esp(2),

      // ── 3.6 ─────────────────────────────────────────────────────────────
      secao("3.6 — Conclusão"),
      esp(),
      p("O estudo do Movimento Retilíneo Uniforme mostrou-se diretamente aplicável ao projeto ASCEND de diversas formas:"),
      esp(),
      ...[
        ["Redução do tempo de espera",    "Conhecer a velocidade exata da plataforma permite que o sistema calcule e informe ao usuário o tempo preciso de espera, possibilitando ainda simulações de diferentes velocidades para encontrar o equilíbrio ideal entre rapidez e segurança mecânica."],
        ["Posicionamento preciso",         "A equação S(t) = S₀ + v·t permite que o controlador Arduino calcule exatamente quando interromper o motor para que a plataforma pare na altura correta — a diferença entre um estacionamento funcional e um sistema que trava ou danifica veículos."],
        ["Controle do elevador",           "O modelo matemático do MRU serve como base para a lógica de controle embarcada: a partir da posição atual e da velocidade medida, o sistema pode prever a posição futura e antecipar o comando de frenagem com a antecedência necessária."],
        ["Otimização do fluxo",            "Com dados históricos de tempo de subida e descida, o algoritmo de IA do ASCEND pode organizar a fila de entrada priorizando vagas nos andares mais rápidos de acessar, reduzindo o tempo total de operação."],
        ["Segurança operacional",          "Qualquer desvio da velocidade esperada — detectado pela comparação entre a posição medida e a posição prevista pelo modelo MRU — aciona automaticamente uma parada de emergência, evitando colisões e danos estruturais."],
        ["Monitoramento em tempo real",    "Os parâmetros do MRU (posição e velocidade) são as grandezas fundamentais exibidas no dashboard do aplicativo, permitindo que o operador acompanhe o estado do sistema em qualquer momento e tome decisões baseadas em dados concretos."],
      ].flatMap(([t, d]) => [caixaInfo(t, d), esp()]),

      destaque("O MRU não é apenas um conceito teórico neste projeto: ele é a base matemática que sustenta o controle, a segurança e a inteligência operacional do ASCEND."),

      esp(2),

      // ── FONTES ──────────────────────────────────────────────────────────
      secao("Fontes de Informação"),
      esp(),
      ...["HALLIDAY, D.; RESNICK, R.; WALKER, J. Fundamentos de Física, Vol. 1. LTC, 2006. Cap. 2.",
          "Material de aula: Aula 07 – ECFO – Física do Movimento – MRU. Prof. Dr. Nivaldo Zafalon Junior, FIAP, 2026.",
          "Documentação do projeto ASCEND – Project Charter e Sprint 01. Equipe ASCEND, FIAP, 2026.",
          "Arduino Official Documentation – https://www.arduino.cc/reference/en/",
          "HC-SR04 Ultrasonic Sensor Datasheet – https://www.electroschematics.com/hc-sr04-datasheet/",
          "OTIS Elevadores – Apresentação do Challenge 2026 (material fornecido pela FIAP).",
          "INMETRO – Vocabulário Internacional de Metrologia (VIM) – https://www.inmetro.gov.br",
        ].map(t => bullet(t)),

      esp(2),
      destaque('"O futuro das cidades exige eficiência, automação e otimização." — ASCEND, 2026'),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("./Sprint2_ECFO_ASCEND.docx", buf);
  console.log("Gerado com sucesso!");
}).catch(err => { console.error(err); process.exit(1); });