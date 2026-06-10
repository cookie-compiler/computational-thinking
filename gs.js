const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageBreak, PageNumber, Header, Footer
} = require('docx');
const fs = require('fs');
const path = require('path');

const BLUE     = "1F3864";
const ACCENT   = "2E5FAB";
const LIGHT_BG = "EAF0FA";
const MID_BG   = "F5F8FF";
const WHITE    = "FFFFFF";
const BORDER_C = "C5D3E8";
const GRAY     = "666666";
const TEXT     = "2B2B2B";

const bdr = (c = BORDER_C) => ({ style: BorderStyle.SINGLE, size: 1, color: c });
const cellBorders = () => ({ top: bdr(), bottom: bdr(), left: bdr(), right: bdr() });
const W = 9360;

function sp(pts = 6) {
  return new Paragraph({ spacing: { before: 0, after: pts * 20 } });
}

function coverTitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 100 },
    children: [new TextRun({ text, font: "Arial", size: 52, bold: true, color: BLUE })]
  });
}
function coverSub(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 26, color: ACCENT })]
  });
}
function coverField(label, value) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 40 },
    children: [
      new TextRun({ text: label + " ", font: "Arial", size: 22, bold: true, color: BLUE }),
      new TextRun({ text: value, font: "Arial", size: 22, color: TEXT })
    ]
  });
}

function secTitle(num, text) {
  return new Paragraph({
    spacing: { before: 480, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: ACCENT, space: 4 } },
    children: [new TextRun({ text: `${num}. ${text}`, font: "Arial", size: 28, bold: true, color: BLUE })]
  });
}
function subTitle(text) {
  return new Paragraph({
    spacing: { before: 240, after: 100 },
    children: [new TextRun({ text, font: "Arial", size: 24, bold: true, color: ACCENT })]
  });
}
function body(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 0, after: 160 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: TEXT })]
  });
}
function mixed(runs) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 0, after: 160 },
    children: runs
  });
}
function b(text) { return new TextRun({ text, font: "Arial", size: 22, bold: true, color: TEXT }); }
function r(text) { return new TextRun({ text, font: "Arial", size: 22, color: TEXT }); }

function bullet(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 0, after: 80 },
    numbering: { reference: "bullets", level: 0 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: TEXT })]
  });
}
function weightNote(text) {
  return new Paragraph({
    spacing: { before: 0, after: 140 },
    children: [new TextRun({ text, font: "Arial", size: 20, italics: true, color: GRAY })]
  });
}
function formula(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 100 },
    children: [new TextRun({ text, font: "Arial", size: 24, bold: true, color: BLUE })]
  });
}
function refItem(num, text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 0, after: 120 },
    children: [
      new TextRun({ text: `${num}. `, font: "Arial", size: 22, bold: true, color: ACCENT }),
      new TextRun({ text, font: "Arial", size: 22, color: TEXT })
    ]
  });
}

function hRow(cells, widths) {
  return new TableRow({
    tableHeader: true,
    children: cells.map((text, i) => new TableCell({
      borders: { top: bdr(ACCENT), bottom: bdr(ACCENT), left: bdr(ACCENT), right: bdr(ACCENT) },
      width: { size: widths[i], type: WidthType.DXA },
      shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 140, right: 140 },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, font: "Arial", size: 20, bold: true, color: BLUE })]
      })]
    }))
  });
}
function dRow(cells, widths, shade = WHITE) {
  return new TableRow({
    children: cells.map((text, i) => new TableCell({
      borders: cellBorders(),
      width: { size: widths[i], type: WidthType.DXA },
      shading: { fill: shade, type: ShadingType.CLEAR },
      margins: { top: 60, bottom: 60, left: 140, right: 140 },
      children: [new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text, font: "Arial", size: 20, color: TEXT })]
      })]
    }))
  });
}
function tbl(headers, rows, widths) {
  return new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: widths,
    rows: [hRow(headers, widths), ...rows.map((r, i) => dRow(r, widths, i % 2 === 0 ? WHITE : MID_BG))]
  });
}

// ═══════════════════════════════════════════════
const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 560, hanging: 280 } } } }]
    }]
  },
  styles: { default: { document: { run: { font: "Arial", size: 22 } } } },
  sections: [

    // ── CAPA ──────────────────────────────────────
    {
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 } } },
      children: [
        sp(60),
        coverTitle("Space Structural Monitoring System"),
        sp(6),
        coverSub("Global Solution 2026.1"),
        coverSub("Energia, Cinemática, Forças e Ondas"),
        sp(50),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 500 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ACCENT, space: 4 } },
          children: []
        }),
        sp(30),
        coverField("Disciplina:", "Energia, Cinemática, Forças e Ondas (ECFO)"),
        coverField("Projeto:", "Global Solution 2026.1 — Space Structural Monitoring System"),
        coverField("Curso:", "Engenharia Mecatrônica"),
        coverField("Ano / Turma:", "1º Ano — 1EMR"),
        sp(20),
        coverField("Integrante 1:", "Beatriz Gonçalves | RM: 572149 | rm572149@fiap.com.br"),
        coverField("Integrante 2:", "Hugo Mariutti | RM: 568941 | rm568941@fiap.com.br"),
        new Paragraph({ children: [new PageBreak()] })
      ]
    },

    // ── CORPO ─────────────────────────────────────
    {
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1300, bottom: 1440, left: 1440 } } },
      headers: {
        default: new Header({ children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_C, space: 4 } },
          children: [new TextRun({ text: "Space Structural Monitoring System — ECFO | GS2026.1", font: "Arial", size: 18, color: "999999" })]
        })] })
      },
      footers: {
        default: new Footer({ children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_C, space: 4 } },
          children: [
            new TextRun({ text: "FIAP — Engenharia Mecatrônica — 1EMR    |    Página ", font: "Arial", size: 18, color: "999999" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "999999" })
          ]
        })] })
      },
      children: [

        // SUMÁRIO
        new Paragraph({ spacing: { before: 0, after: 200 },
          children: [new TextRun({ text: "Sumário", font: "Arial", size: 32, bold: true, color: BLUE })] }),
        ...["(a) O que é som e suas características",
            "(b) Sinais sonoros na detecção de problemas estruturais",
            "(c) Pesquisa de sensores sonoros (microfones)",
            "(d) Medição e quantificação — Intensidade sonora (dB)",
            "(e) Valores máximos e mínimos para a aplicação",
            "(f) Resolução adequada para medição",
            "(g) Escolha do sensor acústico",
            "(h) Procedimento de calibração",
            "Referências"
        ].map(item => new Paragraph({ spacing: { before: 0, after: 60 },
          children: [new TextRun({ text: item, font: "Arial", size: 22, color: TEXT })] })),
        new Paragraph({ children: [new PageBreak()] }),


        // ═══ a ══════════════════════════════════════
        secTitle("a", "O que é Som e suas Características"),
        weightNote("Peso: 1,50 ponto"),

        subTitle("O que é som"),
        body("O som é uma onda mecânica que se propaga através de meios materiais — sólidos, líquidos e gases — por meio de variações sucessivas de pressão. Diferente das ondas eletromagnéticas (como a luz), o som depende de um meio para se propagar: no vácuo, ele não existe."),
        body("Quando um objeto vibra, ele empurra as moléculas ao redor, que por sua vez empurram as seguintes, transmitindo a perturbação pelo material. Esse movimento alterna entre regiões de compressão (moléculas mais juntas, pressão alta) e rarefação (moléculas mais afastadas, pressão menor), formando a onda sonora."),
        body("Nos sólidos, a onda se propaga de forma bem mais rápida do que no ar — o alumínio, por exemplo, conduz o som a cerca de 6.400 m/s, contra 343 m/s no ar. Isso acontece porque nos metais as partículas estão muito mais próximas e interligadas, transmitindo a vibração quase que instantaneamente de uma para a outra. Essa propriedade é muito importante para o monitoramento estrutural: qualquer evento que ocorra na estrutura metálica do módulo espacial se propaga rapidamente pelos sensores."),

        subTitle("Características do som"),
        sp(2),
        tbl(
          ["Característica", "Unidade", "O que representa"],
          [
            ["Frequência", "Hz", "Número de oscilações completas por segundo. Determina se o som é grave (baixa frequência) ou agudo (alta frequência). O ouvido humano capta de 20 Hz a 20 kHz; sinais estruturais costumam estar em faixas ultrassônicas, acima disso."],
            ["Amplitude", "Pa", "Intensidade da variação de pressão — quanto mais alta, mais forte o som. Está diretamente ligada à energia da onda."],
            ["Velocidade", "m/s", "Quão rápido a onda viaja pelo meio. Depende da rigidez e densidade do material."],
            ["Comprimento de onda (λ)", "m", "Distância entre dois pontos consecutivos no mesmo estado de vibração. Relacionada à frequência e velocidade por: λ = v / f."],
            ["Timbre", "—", "Qualidade que diferencia sons de mesma frequência e amplitude vindos de fontes distintas. Definida pela composição harmônica do sinal."]
          ],
          [2000, 1000, 6360]
        ),
        sp(6),

        subTitle("Origens dos sinais sonoros no módulo espacial"),
        body("No contexto deste projeto, os sinais sonoros de interesse não são sons audíveis comuns, mas sim ondas acústicas geradas pela própria estrutura em resposta às condições de operação. As principais fontes são:"),
        bullet("Vibrações estruturais: cargas dinâmicas durante lançamento, manobras e acoplamentos fazem a estrutura vibrar, gerando ondas acústicas que se propagam pelo material."),
        bullet("Microfraturas e fadiga: quando uma trinca se abre no metal, ela libera energia na forma de uma onda acústica. Esses sinais, embora muito fracos, são indicadores precoces de falha estrutural."),
        bullet("Impactos de microdetritos: partículas de lixo espacial ou micrometeoritos colidindo com o casco geram pulsos acústicos rápidos e intensos."),
        bullet("Expansão e contração térmica: o módulo passa de -150°C (na sombra) para +120°C (sob radiação solar). Essa variação extrema dilata e contrai os materiais, gerando estalidos estruturais característicos."),
        bullet("Sistemas mecânicos internos: bombas, válvulas e motores têm seu próprio padrão sonoro durante operação normal. Mudanças nesse padrão podem indicar desgaste ou falha iminente."),
        sp(4),


        // ═══ b ══════════════════════════════════════
        secTitle("b", "Sinais Sonoros na Detecção de Problemas Estruturais"),
        weightNote("Peso: 1,50 ponto"),

        subTitle("Como funciona o monitoramento acústico"),
        body("Toda estrutura em operação normal produz um padrão sonoro estável — um conjunto de vibrações e ruídos que se repetem de forma previsível. Esse padrão é chamado de assinatura acústica. Quando algo muda na estrutura (uma trinca se forma, um parafuso se solta, um componente começa a desgastar), o padrão sonoro muda junto. O monitoramento acústico detecta essas mudanças comparando continuamente o sinal atual com o sinal de referência registrado durante a operação normal."),
        body("Essa abordagem é especialmente útil em módulos espaciais, onde inspecionar fisicamente a estrutura por fora é inviável na maior parte do tempo. Em vez de esperar que um problema apareça visualmente, o sistema detecta a anomalia pelo som antes que ela se torne perigosa."),

        subTitle("Principais técnicas utilizadas"),
        mixed([b("Emissão Acústica (AE): "), r("técnica passiva — o sensor fica instalado e escuta a estrutura. Quando ocorre uma deformação interna (início de trinca, deformação plástica), o material libera uma onda elástica que o sensor capta. Opera em frequências altas, acima da faixa audível, o que permite separar esses sinais do ruído de fundo.")]),
        mixed([b("Análise de frequência (FFT): "), r("o sinal sonoro captado é processado matematicamente para separar suas componentes de frequência. Comparando o espectro atual com o de referência, é possível identificar frequências novas ou alterações de amplitude que indiquem algum problema.")]),
        mixed([b("Monitoramento contínuo: "), r("o sistema opera o tempo todo, comparando automaticamente o sinal com limiares definidos. Quando um limiar é ultrapassado, um alerta é gerado — sem necessidade de intervenção humana, o que é fundamental para ambientes remotos como o espaço.")]),

        subTitle("O que cada tipo de problema soa"),
        sp(2),
        tbl(
          ["Problema", "Tipo de sinal", "Faixa de frequência típica"],
          [
            ["Trincas e microfissuras", "Pulsos de curta duração e alta frequência", "100 kHz a 1 MHz"],
            ["Juntas e parafusos soltos", "Vibração intermitente com padrão repetitivo", "1 kHz a 20 kHz"],
            ["Fadiga estrutural", "Mudança gradual no padrão ao longo do tempo", "Variável — deslocamento de frequências naturais"],
            ["Impacto de microdetritos", "Pulso único, intenso e de curta duração", "Ampla faixa, dependendo da energia do impacto"]
          ],
          [2500, 3000, 3860]
        ),
        sp(6),

        subTitle("Por que isso é crítico no espaço"),
        body("Em módulos espaciais, inspeções visuais externas são arriscadas, caras e pouco frequentes. O monitoramento acústico permite verificar a integridade da estrutura continuamente, de dentro para fora, sem precisar de acesso externo. Em um módulo habitado, uma falha estrutural pode levar à despressurização — uma emergência gravíssima. Detectar sinais acústicos anormais com horas ou dias de antecedência pode ser a diferença entre um reparo preventivo e uma emergência."),
        sp(4),


        // ═══ c ══════════════════════════════════════
        secTitle("c", "Pesquisa de Sensores Sonoros (Microfones)"),
        weightNote("Peso: 1,00 ponto"),

        subTitle("Para que servem"),
        body("Sensores sonoros são dispositivos que convertem variações de pressão acústica em sinais elétricos. Essa conversão permite que o sinal seja amplificado, processado e analisado por sistemas computacionais. No contexto deste projeto, eles servem para captar os sinais acústicos gerados pela estrutura do módulo espacial — tanto em frequências audíveis quanto ultrassônicas — e identificar padrões que indiquem problemas."),

        subTitle("Como funcionam — Principais tipos"),
        mixed([b("Sensor condensador (capacitivo): "), r("funciona com duas placas condutoras muito próximas, formando um capacitor. Uma das placas é um diafragma que vibra com o som. Essa vibração muda a distância entre as placas e, portanto, a capacitância do sistema, gerando um sinal elétrico proporcional ao som. É muito sensível, mas precisa de alimentação externa e é frágil para ambientes extremos.")]),
        mixed([b("Sensor piezoelétrico: "), r("usa um cristal (geralmente de PZT — titanato zirconato de chumbo) que gera tensão elétrica quando deformado mecanicamente. As ondas que se propagam pela estrutura deformam o cristal, que converte essa deformação em sinal elétrico. Não precisa de alimentação externa e funciona bem em temperaturas extremas, o que o torna o mais adequado para aplicações estruturais e aeroespaciais.")]),
        mixed([b("Sensor MEMS: "), r("é essencialmente um sensor condensador em escala microscópica, fabricado em silício. É o mesmo tipo de microfone presente em smartphones. Tem tamanho reduzido e baixo custo, mas sua faixa de frequência é limitada à faixa audível (até 20 kHz), o que o deixa fora da faixa de emissão acústica estrutural.")]),
        mixed([b("Sensor dinâmico (bobina móvel): "), r("uma bobina fixada ao diafragma se move dentro de um campo magnético. Pela Lei de Faraday, esse movimento gera uma corrente elétrica. É o princípio oposto ao de um alto-falante. Muito robusto e barato, porém com resposta de frequência limitada e pouco sensível a sinais fracos.")]),

        subTitle("Características importantes"),
        bullet("Sensibilidade: quanto menor o sinal que o sensor consegue captar, melhor. Para monitoramento estrutural, é essencial detectar sinais fracos gerados por microfraturas."),
        bullet("Faixa de frequência: a faixa de operação do sensor precisa cobrir as frequências de interesse da aplicação."),
        bullet("Temperatura de operação: em ambiente espacial, o sensor precisa funcionar em temperaturas muito baixas e muito altas."),
        bullet("Faixa dinâmica: diferença entre o menor e o maior sinal que o sensor consegue medir sem distorção."),
        bullet("Necessidade de alimentação: sensores que não precisam de alimentação externa são preferíveis em sistemas embarcados."),
        sp(2),

        subTitle("Quadro comparativo"),
        sp(2),
        tbl(
          ["Tipo", "Faixa de frequência", "Temp. operação", "Adequação para este projeto"],
          [
            ["Condensador", "20 Hz – 100 kHz", "-10°C a +60°C", "Baixa — frágil e sensível à temperatura extrema"],
            ["Piezoelétrico", "1 kHz – 1 MHz", "-40°C a +250°C", "Alta — robusto, ampla faixa, opera em extremos térmicos"],
            ["MEMS", "20 Hz – 20 kHz", "-40°C a +85°C", "Média — compacto, mas faixa limitada para sinais estruturais"],
            ["Dinâmico", "50 Hz – 15 kHz", "-20°C a +70°C", "Baixa — faixa insuficiente, pouco sensível"]
          ],
          [1600, 1900, 1760, 4100]
        ),
        sp(6),


        // ═══ d ══════════════════════════════════════
        secTitle("d", "Medição e Quantificação — Intensidade Sonora (dB)"),
        weightNote("Peso: 1,00 ponto"),

        subTitle("Intensidade sonora"),
        body("A intensidade sonora (I) é a quantidade de energia acústica que passa por uma área por segundo, medida em watts por metro quadrado (W/m²). Ela representa o \"quanto de energia\" uma onda sonora carrega:"),
        formula("I = P / A     [W/m²]"),
        body("A faixa de intensidades que o ouvido humano consegue perceber vai de 10⁻¹² W/m² (o mais suave possível) até cerca de 1 W/m² (limiar da dor) — uma diferença de um trilhão de vezes. Usar uma escala numérica direta para representar isso seria completamente impraticável."),

        subTitle("A escala decibel (dB)"),
        body("Para lidar com essa faixa enorme de valores, usa-se a escala logarítmica do decibel:"),
        formula("L = 10 · log₁₀ (I / I₀)     [dB]     onde I₀ = 10⁻¹² W/m²"),
        body("O valor I₀ é o limiar de audição humana, que serve como referência. A escala logarítmica é adequada porque comprime uma variação enorme em uma faixa de 0 a 130 dB, muito mais fácil de trabalhar. Outra vantagem é que ela reflete melhor a percepção humana do som: dobrar a intensidade física não parece \"duas vezes mais alto\" para nós — nosso sistema auditivo já funciona de forma logarítmica."),

        subTitle("Exemplos de referência"),
        sp(2),
        tbl(
          ["Situação", "Nível (dB)", "Intensidade (W/m²)"],
          [
            ["Silêncio absoluto (limiar da audição)", "0 dB", "10⁻¹² W/m²"],
            ["Sussurro", "20 dB", "10⁻¹⁰ W/m²"],
            ["Conversa normal", "60 dB", "10⁻⁶ W/m²"],
            ["Trânsito intenso", "80 dB", "10⁻⁴ W/m²"],
            ["Show de rock / limiar da dor", "120–130 dB", "1 W/m²"]
          ],
          [4000, 1800, 3560]
        ),
        sp(6),

        subTitle("Aplicação no projeto"),
        body("No Space Structural Monitoring System, os sinais acústicos captados serão quantificados em dB para definir limiares de operação normal, alerta e situação crítica. Além disso, a escala logarítmica facilita comparar sinais de origens muito diferentes — um sinal fraco de fadiga e um impacto energético de microdebris, por exemplo — dentro de um mesmo sistema de medição."),
        sp(4),


        // ═══ e ══════════════════════════════════════
        secTitle("e", "Valores Máximos e Mínimos para a Aplicação"),
        weightNote("Peso: 1,00 ponto"),

        subTitle("Faixa de operação"),
        body("Para definir os limites de medição do sistema, foi necessário considerar quais tipos de sinais o módulo espacial pode gerar e quais são relevantes para detectar problemas estruturais. Os valores abaixo foram definidos com base em pesquisas sobre monitoramento acústico em estruturas aeroespaciais:"),
        sp(2),
        tbl(
          ["Parâmetro", "Valor mínimo", "Valor máximo", "Justificativa"],
          [
            ["Amplitude do sinal", "25 dB", "100 dB", "Abaixo de 25 dB, o sinal se confunde com o ruído eletrônico do próprio sistema. Acima de 100 dB, trata-se de evento de alta energia (impacto significativo ou ruptura)."],
            ["Faixa de frequência", "20 kHz", "400 kHz", "Abaixo de 20 kHz predominam ruídos de equipamentos internos (bombas, motores), que não são relevantes para falhas estruturais. Acima de 400 kHz, o sinal se atenua muito rápido no alumínio e não chega aos sensores."]
          ],
          [1800, 1200, 1200, 5160]
        ),
        sp(6),

        subTitle("Limiares de decisão"),
        sp(2),
        tbl(
          ["Faixa", "Status", "O que fazer"],
          [
            ["Abaixo de 40 dB", "Normal", "Operação dentro do esperado. Registrar dados para manter o padrão de referência atualizado."],
            ["40 dB a 70 dB", "Alerta", "Atividade acústica elevada. Investigar a região de origem, aumentar a frequência de monitoramento e registrar o evento."],
            ["Acima de 70 dB", "Crítico", "Evento de alta energia detectado. Acionar alarme, registrar a forma de onda completa e iniciar protocolo de inspeção de emergência."]
          ],
          [1800, 1200, 6360]
        ),
        sp(6),


        // ═══ f ══════════════════════════════════════
        secTitle("f", "Resolução Adequada para Medição"),
        weightNote("Peso: 1,00 ponto"),

        subTitle("O que é resolução"),
        body("Resolução é a menor variação que o sistema consegue detectar e distinguir de forma confiável. Se a resolução for muito grossa, mudanças graduais importantes podem passar despercebidas. Se for excessivamente fina, o sistema gera dados em volume muito maior do que o necessário."),

        subTitle("Resoluções definidas para o sistema"),
        sp(2),
        tbl(
          ["Grandeza", "Resolução adotada", "Justificativa"],
          [
            ["Amplitude",  "1 dB",   "A faixa de operação é de 75 dB (de 25 a 100 dB). Com resolução de 1 dB, o sistema tem 75 níveis distintos para classificar a intensidade dos eventos — suficiente para identificar tendências de aumento gradual associadas à fadiga."],
            ["Frequência", "100 Hz", "Na faixa de 20 kHz a 400 kHz, uma resolução de 100 Hz gera detalhamento suficiente para distinguir sinais de origens diferentes na análise espectral."],
            ["Temporal",   "1 μs",   "Para capturar sinais de até 400 kHz sem distorção, pelo menos 800.000 amostras por segundo são necessárias (Teorema de Nyquist: mínimo 2× a frequência máxima). Optamos por 1 MHz — 1 milhão de amostras por segundo — para ter margem de segurança."]
          ],
          [1600, 1500, 6260]
        ),
        sp(6),

        subTitle("Volume de dados e modo de operação"),
        body("Gravar continuamente a 1 MHz geraria um volume de dados inviável para armazenamento a longo prazo. Por isso, o sistema opera em modo trigger: só registra quando o sinal ultrapassa o limiar mínimo de 25 dB. Fora dos eventos, apenas estatísticas resumidas são armazenadas, mantendo o volume de dados gerenciável."),
        sp(4),


        // ═══ g ══════════════════════════════════════
        secTitle("g", "Escolha do Sensor Acústico"),
        weightNote("Peso: 1,50 ponto"),

        subTitle("Sensor escolhido: VS900-M (Vallen Systeme)"),
        body("Após pesquisar e comparar os tipos de sensores disponíveis, escolhemos o VS900-M, um sensor piezoelétrico de banda larga fabricado pela empresa alemã Vallen Systeme. Ele é amplamente utilizado em aplicações de monitoramento estrutural, inclusive em contextos industriais e aeroespaciais, o que deu embasamento à nossa escolha."),

        subTitle("Principais especificações"),
        sp(2),
        tbl(
          ["Parâmetro", "Valor"],
          [
            ["Tipo",                     "Piezoelétrico (PZT) — banda larga"],
            ["Faixa de frequência",      "100 kHz a 900 kHz"],
            ["Faixa dinâmica",           "Acima de 90 dB"],
            ["Dimensões",                "Diâmetro 19 mm × altura 22 mm"],
            ["Temperatura de operação", "-40°C a +85°C"],
            ["Alimentação",              "Não requer (sensor passivo)"]
          ],
          [3500, 5860]
        ),
        sp(6),

        subTitle("Por que escolhemos esse sensor"),
        mixed([b("Faixa de frequência adequada: "), r("o VS900-M opera de 100 kHz a 900 kHz, cobrindo toda a faixa de interesse definida no item (e) (20–400 kHz) com margem.")]),
        mixed([b("Temperatura de operação: "), r("suporta de -40°C a +85°C, o que cobre bem a faixa interna de um módulo pressurizado. Para aplicações em superfícies externas, seria necessária proteção térmica adicional.")]),
        mixed([b("Não precisa de alimentação: "), r("como sensor passivo, simplifica o sistema elétrico do protótipo.")]),
        mixed([b("Tamanho compacto: "), r("o formato cilíndrico pequeno facilita a instalação em vários pontos da estrutura.")]),
        mixed([b("Faixa dinâmica acima de 90 dB: "), r("compatível com a resolução de 1 dB definida, cobrindo toda a faixa de 25 a 100 dB sem saturação.")]),
        sp(4),


        // ═══ h ══════════════════════════════════════
        secTitle("h", "Procedimento de Calibração"),
        weightNote("Peso: 1,50 ponto"),

        subTitle("Por que calibrar"),
        body("Calibrar um sensor significa verificar se ele mede corretamente, comparando suas leituras com valores de referência conhecidos. Sem calibração, não é possível confiar nos limiares definidos — um sensor descalibrado pode ignorar um evento real ou gerar alarmes falsos, ambos perigosos em ambiente espacial."),

        subTitle("Equipamentos necessários"),
        bullet("Fonte sonora de referência (calibrador acústico)"),
        bullet("Placa de alumínio com dimensões e propriedades conhecidas, para servir como meio de propagação"),
        bullet("Osciloscópio e sistema de aquisição de dados (taxa mínima de 1 MHz)"),
        bullet("Ambiente com isolamento acústico para evitar interferência externa"),

        subTitle("Etapas do procedimento"),
        sp(2),
        tbl(
          ["Etapa", "Descrição"],
          [
            ["1. Preparação",              "Acoplar o sensor à placa de alumínio com gel de contato. Conectar o sistema de aquisição, configurar para 1 MHz de taxa de amostragem e aguardar 15 minutos para estabilização térmica."],
            ["2. Verificação inicial",      "Realizar um teste simples de referência: bater suavemente na placa com um objeto metálico de ponta fina e verificar se o sensor detecta o impacto. Repetir 5 vezes para confirmar que o acoplamento está correto e as leituras são consistentes."],
            ["3. Varredura em frequência",  "Excitar a placa com sinais em diferentes frequências (dentro da faixa de 100 kHz a 400 kHz) mantendo amplitude constante. Registrar a resposta do sensor em cada frequência. O objetivo é verificar se o sensor responde de forma uniforme em toda a faixa."],
            ["4. Varredura em amplitude",   "Excitar o sensor com sinais de amplitude crescente (do mínimo ao máximo da faixa definida). Registrar a saída do sensor para cada nível e verificar se a relação entre entrada e saída é proporcional (linear)."],
            ["5. Repetibilidade",           "Repetir a mesma medição 10 vezes nas mesmas condições e verificar se os resultados são consistentes. Variações grandes indicam problema no acoplamento ou no sensor."],
            ["6. Comparação e correção",    "Comparar os valores medidos com os valores esperados (curva do fabricante ou sensor de referência calibrado). Calcular os desvios e, se necessário, gerar uma tabela de correção para aplicar às medições futuras."]
          ],
          [2200, 7160]
        ),
        sp(6),

        subTitle("Gráficos a serem obtidos"),
        mixed([b("Curva de resposta em frequência: "), r("eixo X com as frequências testadas e eixo Y com a sensibilidade medida. O resultado esperado é uma curva relativamente plana na faixa de 100–400 kHz, sem quedas ou picos bruscos.")]),
        mixed([b("Curva de linearidade: "), r("eixo X com o nível de excitação e eixo Y com a tensão de saída do sensor. O resultado esperado é uma reta. Quanto mais próximo de uma reta perfeita, mais confiável a medição.")]),
        mixed([b("Gráfico de erro: "), r("diferença entre o valor medido e o valor de referência em cada ponto. Todos os erros dentro de ±3 dB indicam que o sensor está calibrado adequadamente.")]),

        subTitle("Critérios de aprovação"),
        bullet("A resposta em frequência não deve variar mais do que ±3 dB dentro da faixa de operação."),
        bullet("A curva de linearidade deve ser aproximadamente uma reta (R² próximo de 1)."),
        bullet("As 10 medições de repetibilidade devem ter desvio padrão pequeno — menos de 2 dB entre elas."),
        bullet("O erro em relação à referência deve ser inferior a ±3 dB em todos os pontos testados."),
        body("Se o sensor reprovar em algum critério, recomenda-se verificar o acoplamento mecânico, repetir a calibração e, se o problema persistir, substituir o sensor."),
        sp(4),


        // ═══ REFERÊNCIAS ════════════════════════════
        new Paragraph({ children: [new PageBreak()] }),
        new Paragraph({ spacing: { before: 0, after: 200 },
          children: [new TextRun({ text: "Referências", font: "Arial", size: 28, bold: true, color: BLUE })] }),
        sp(4),
        refItem(1, "THE PHYSICS CLASSROOM. Sound is a Mechanical Wave. Disponível em: https://www.physicsclassroom.com/class/sound/Lesson-1/Sound-is-a-Mechanical-Wave. Acesso em: jun. 2026."),
        refItem(2, "THE PHYSICS CLASSROOM. The Speed of Sound. Disponível em: https://www.physicsclassroom.com/class/sound/Lesson-2/The-Speed-of-Sound. Acesso em: jun. 2026."),
        refItem(3, "ENGINEERING TOOLBOX. Speed of Sound in Solids and Metals. Disponível em: https://www.engineeringtoolbox.com/sound-speed-solids-d_713.html. Acesso em: jun. 2026."),
        refItem(4, "WIKIPEDIA. Acoustic Emission. Disponível em: https://en.wikipedia.org/wiki/Acoustic_emission. Acesso em: jun. 2026."),
        refItem(5, "NASA. Structural Health Monitoring for Aerospace Structures. NASA Technical Reports Server (NTRS), 2016. Disponível em: https://ntrs.nasa.gov/."),
        refItem(6, "SERWAY, R. A.; JEWETT, J. W. Física para Cientistas e Engenheiros — Vol. 1: Mecânica, Oscilações e Ondas. 9. ed. São Paulo: Cengage Learning, 2017."),
        refItem(7, "VALLEN SYSTEME GmbH. VS900-M Datasheet. Disponível em: https://www.vallen.de/products/sensors/vs900-m. Acesso em: jun. 2026."),
        refItem(8, "DROUILLARD, T. F. A History of Acoustic Emission. Journal of Acoustic Emission, v. 14, n. 1, p. 1-34, 1996."),

        sp(40),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 0 },
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_C, space: 4 } },
          children: [new TextRun({ text: "Documento elaborado como parte da avaliação GS2026.1 — FIAP | Engenharia Mecatrônica — 1EMR", font: "Arial", size: 18, italics: true, color: "999999" })]
        })
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buf => {
  const outDir = path.join(__dirname, 'outputs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'Space_Structural_Monitoring_System_v2.docx');
  fs.writeFileSync(outPath, buf);
  console.log('OK ->', outPath);
});