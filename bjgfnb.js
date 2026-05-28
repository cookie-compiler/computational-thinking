const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');

// ── PALETA ──────────────────────────────────────────────────────────────────
const TEAL        = "2D6E74";
const TEAL_CLARO  = "E8F4F5";
const AMARELO     = "F5F1A8";
const CINZA_CLARO = "F4F4F4";
const BRANCO      = "FFFFFF";
const PRETO       = "333333";

// ── HELPERS ─────────────────────────────────────────────────────────────────
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

// ── DOCUMENTO ───────────────────────────────────────────────────────────────
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
                  children: [new TextRun({ text: "Sprint 2 — Computational Thinking · FIAP", color: BRANCO, font: "Arial", size: 18 })]
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
      // ── CAPA ──────────────────────────────────────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { before: 200, after: 40 },
        children: [new TextRun({ text: "ASCEND", bold: true, color: TEAL, font: "Arial", size: 52 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { after: 60 },
        children: [new TextRun({ text: "Estacionamento Vertical Autônomo", bold: true, color: TEAL, font: "Arial", size: 28 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { after: 200 },
        children: [new TextRun({ text: "Relatório Técnico — Sprint 2 · Computational Thinking for Engineering", color: PRETO, font: "Arial", size: 22 })]
      }),
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: AMARELO, space: 4 } },
        spacing: { after: 200 }, children: [new TextRun("")]
      }),

      // Identificação
      new Table({
        width: { size: 9026, type: WidthType.DXA }, columnWidths: [2520, 6506],
        rows: [
          ["Instituição",      "FIAP"],
          ["Curso",            "Engenharia Mecatrônica"],
          ["Turma",            "1EMR"],
          ["Disciplina",       "Computational Thinking for Engineering"],
          ["Professora",       "Michele Bazana de Souza"],
          ["Empresa Parceira", "OTIS Elevadores"],
          ["Entrega",          "Sprint 2 — 2º Entregável"],
          ["Ano",              "2026"],
        ].map(([l, v]) => new TableRow({ children: [
          cell(l, { bg: TEAL_CLARO, bold: true, color: TEAL, width: 2520 }),
          cell(v, { width: 6506 })
        ]}))
      }),
      esp(2),

      // Integrantes
      secao("Integrantes do Grupo"),
      esp(),
      new Table({
        width: { size: 9026, type: WidthType.DXA }, columnWidths: [6426, 2600],
        rows: [
          new TableRow({ children: [
            cell("Nome completo", { bg: TEAL, bold: true, color: BRANCO, width: 6426, borderColor: TEAL }),
            cell("RM",            { bg: TEAL, bold: true, color: BRANCO, width: 2600, align: AlignmentType.CENTER, borderColor: TEAL })
          ]}),
          ...[
            ["Beatriz Gonçalves",    "572149", BRANCO],
            ["Hugo Mariutti",        "568941", CINZA_CLARO],
            ["Kawuan Mizael",        "569474", BRANCO],
            ["Manoela de Almeida",   "571373", CINZA_CLARO],
          ].map(([n, rm, bg]) => new TableRow({ children: [
            cell(n,  { bg, width: 6426 }),
            cell(rm, { bg, width: 2600, align: AlignmentType.CENTER })
          ]}))
        ]
      }),
      esp(2),

      // ── SEÇÃO 1: DESCRIÇÃO DAS IDEIAS ─────────────────────────────────────
      secao("1. Descrição das Ideias para o Desenvolvimento do Projeto"),
      esp(),
      p("O projeto ASCEND propõe um sistema de estacionamento vertical 100% autônomo, desenvolvido em parceria com a OTIS Elevadores. A solução integra hardware de automação e software inteligente para receber, armazenar e devolver veículos sem intervenção humana, aproveitando o espaço vertical em estrutura cilíndrica."),
      esp(),

      subSecao("Hardware Planejado"),
      esp(),
      ...[
        ["Microcontrolador Arduino Uno",
         "Cérebro do sistema embarcado. Responsável por processar os sinais dos sensores, acionar os motores e executar a lógica de controle de posicionamento da plataforma."],
        ["Motor DC com caixa de redução (AK555/06PF24R350CE)",
         "Responsável pela movimentação vertical da plataforma do elevador. Opera a 24V com torque nominal de 5 kgf.cm, acionado por PWM para controle de velocidade."],
        ["Motor de passo (28BYJ-48)",
         "Utilizado para girar os anéis de vagas em cada andar, garantindo precisão de posicionamento angular sem necessidade de encoder externo."],
        ["Motores DC com redução (GA12-N20)",
         "2 unidades para acionar as esteiras de entrada e saída de veículos no térreo. Compactos, leves e controlados por PWM via Arduino."],
        ["Sensor ultrassônico HC-SR04",
         "Mede a posição vertical da plataforma do elevador em tempo real. Fixado na parte superior da estrutura, aponta para baixo e fornece dados de distância ao Arduino."],
        ["Célula de carga com módulo HX711",
         "Monitora o peso do veículo sobre a plataforma. Garante que o sistema não opere em sobrecarga, protegendo motores e estrutura em MDF."],
        ["Sensor infravermelho reflexivo",
         "Detecta a presença e o posicionamento correto do veículo na plataforma antes de liberar o acionamento do motor de elevação."],
        ["Módulo RFID",
         "Identifica cada veículo automaticamente ao entrar no sistema, associando-o a uma vaga disponível sem necessidade de intervenção do motorista."],
        ["Estrutura física em MDF 9mm e impressão 3D",
         "Carcaça cilíndrica, plataforma giratória, trilhos, suportes de motores e cancela serão fabricados em MDF cortado a laser e peças impressas em 3D (PLA+), modeladas no Autodesk Inventor."],
        ["Trava automática de rodas",
         "Dispositivo mecânico que fixa o veículo durante o transporte vertical, acionado assim que a plataforma confirma o posicionamento correto."],
      ].flatMap(([t, d]) => [caixaInfo(t, d), esp()]),

      esp(),
      subSecao("Software Planejado"),
      esp(),
      ...[
        ["Linguagem C/C++ (Arduino IDE)",
         "Programação do sistema embarcado: controle dos motores por PWM, leitura dos sensores, lógica de posicionamento e comunicação serial com o módulo ESP32."],
        ["Python — Lógica de Inteligência Artificial",
         "Algoritmo de gestão preditiva de vagas: calcula a melhor rota de entrada e saída, prioriza veículos com maior urgência de retirada e ajusta a ocupação das vagas dinamicamente conforme a demanda."],
        ["Aplicativo Mobile (interface do usuário)",
         "[A DEFINIR na Sprint 3 — tecnologia do app (React Native, Flutter ou outro) será escolhida após avaliação do grupo]"],
        ["Protocolo MQTT via ESP32",
         "Transmissão dos dados de posição, velocidade e status das vagas do Arduino para o servidor em tempo real, com latência inferior a 1 segundo."],
        ["Dashboard em tempo real",
         "Interface de monitoramento que exibe: posição atual da plataforma, velocidade, status de vagas ocupadas/livres, tempo estimado de retirada e alertas de falha."],
        ["Autodesk Inventor — CAD 3D",
         "Modelagem paramétrica de todos os componentes físicos do protótipo antes da fabricação, com simulação de movimentos e análise de interferências entre peças."],
      ].flatMap(([t, d]) => [caixaInfo(t, d), esp()]),

      esp(),
      destaque("Missão: integrar hardware de automação e software inteligente em um sistema coeso, escalável e 100% autônomo para estacionamento vertical urbano."),
      esp(2),

      // ── SEÇÃO 2: CRONOGRAMA ───────────────────────────────────────────────
      secao("2. Cronograma de Desenvolvimento"),
      esp(),
      p("O projeto é organizado em sprints quinzenais, desde a concepção até o pitch final. Abaixo, o status atual de cada etapa:"),
      esp(),

      // Legenda
      new Table({
        width: { size: 9026, type: WidthType.DXA }, columnWidths: [3008, 3009, 3009],
        rows: [new TableRow({ children: [
          cell("CONCLUÍDA",    { bg: TEAL,        bold: true, color: BRANCO, width: 3008, align: AlignmentType.CENTER }),
          cell("EM ANDAMENTO", { bg: AMARELO,     bold: true, color: TEAL,   width: 3009, align: AlignmentType.CENTER }),
          cell("FUTURA",       { bg: CINZA_CLARO, bold: true, color: PRETO,  width: 3009, align: AlignmentType.CENTER }),
        ]})]
      }),
      esp(),

      // Tabela de sprints
      new Table({
        width: { size: 9026, type: WidthType.DXA }, columnWidths: [1400, 3800, 2400, 1426],
        rows: [
          // Header
          new TableRow({ children: [
            cell("Sprint",  { bg: TEAL, bold: true, color: BRANCO, width: 1400, align: AlignmentType.CENTER, borderColor: TEAL }),
            cell("Foco",    { bg: TEAL, bold: true, color: BRANCO, width: 3800, borderColor: TEAL }),
            cell("Período", { bg: TEAL, bold: true, color: BRANCO, width: 2400, align: AlignmentType.CENTER, borderColor: TEAL }),
            cell("Status",  { bg: TEAL, bold: true, color: BRANCO, width: 1426, align: AlignmentType.CENTER, borderColor: TEAL }),
          ]}),
          // Dados
          ...[
            ["Sprint 0",  "Conceitual — DOD e planejamento",              "—",                   "CONCLUÍDA"],
            ["Sprint 1",  "Refinamento de escopo e funcionalidades",      "25/04 – 02/05/2026",  "CONCLUÍDA"],
            ["Sprint 2",  "Challenge Sprint — entrega macro do projeto",  "03/05 – 16/05/2026",  "CONCLUÍDA"],
            ["Sprint 3",  "Definição de tecnologias (HW e SW)",           "17/05 – 30/05/2026",  "ANDAMENTO"],
            ["Sprint 4",  "Protótipo inicial",                            "31/05 – 13/06/2026",  "FUTURA"],
            ["Sprint 5",  "Entrada — esteira e cancela",                  "14/06 – 27/06/2026",  "FUTURA"],
            ["Sprint 6",  "Movimentação vertical",                        "14/06 – 27/06/2026",  "FUTURA"],
            ["Sprint 7",  "Plataforma retrátil",                          "28/06 – 11/07/2026",  "FUTURA"],
            ["Sprint 8",  "Estrutura do prédio",                          "28/06 – 11/07/2026",  "FUTURA"],
            ["Sprint 9",  "Integração Software + Hardware",               "12/07 – 25/07/2026",  "FUTURA"],
            ["Sprint 10", "Aplicativo mobile",                            "26/07 – 08/08/2026",  "FUTURA"],
            ["Sprint 11", "Montagem e integração final",                  "09/08 – 22/08/2026",  "FUTURA"],
            ["Sprint 12", "Maquete final",                                "23/08 – 05/09/2026",  "FUTURA"],
            ["Sprint 13", "Pitch / Mentoria",                             "06/09 – 19/09/2026",  "FUTURA"],
            ["Sprint 14", "Brindes e encerramento",                       "06/09 – 19/09/2026",  "FUTURA"],
          ].map(([sp, foco, per, status]) => {
            let bg, fg;
            if (status === "CONCLUÍDA")      { bg = TEAL;        fg = BRANCO; }
            else if (status === "ANDAMENTO") { bg = AMARELO;     fg = TEAL; }
            else                             { bg = CINZA_CLARO; fg = PRETO; }
            return new TableRow({ children: [
              cell(sp,     { bg, bold: true, color: fg, width: 1400, align: AlignmentType.CENTER }),
              cell(foco,   { bg, bold: status !== "FUTURA", color: fg, width: 3800 }),
              cell(per,    { bg, color: fg, width: 2400, align: AlignmentType.CENTER }),
              cell(status, { bg, bold: true, color: fg, width: 1426, align: AlignmentType.CENTER }),
            ]});
          })
        ]
      }),
      esp(2),

      // ── SEÇÃO 3: CONSIDERAÇÕES FINAIS ─────────────────────────────────────
      secao("3. Considerações Finais"),
      esp(),
      p("O projeto ASCEND encontra-se em fase de desenvolvimento ativo, com as três primeiras sprints concluídas e a Sprint 3 em andamento, focada na definição final das tecnologias de hardware e software. O planejamento descrito neste documento representa o estado atual do projeto e será refinado conforme o grupo avança nas próximas sprints."),
      p("A combinação entre automação mecânica (motores, sensores, microcontroladores) e software inteligente (IA preditiva, aplicativo mobile, dashboard em tempo real) forma a base técnica do ASCEND. O cronograma estruturado em sprints garante controle progressivo das entregas, redução de riscos de integração e validação contínua dos mecanismos projetados."),
      esp(),
      destaque('"O futuro das cidades exige eficiência, automação e otimização." — ASCEND, 2026'),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("Sprint2_Michele_ASCEND.docx", buf);
  console.log("DOCX gerado com sucesso: Sprint2_Michele_ASCEND.docx");
}).catch(err => { console.error(err); process.exit(1); });