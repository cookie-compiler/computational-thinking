from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfgen import canvas as pdfcanvas

OUTPUT = "outputs/Sprint2_Michele_ASCEND.docx"

# Cores
TEAL        = colors.HexColor("#2D6E74")
TEAL_CLARO  = colors.HexColor("#E8F4F5")
AMARELO     = colors.HexColor("#F5F1A8")
BRANCO      = colors.white
CINZA_CLARO = colors.HexColor("#F4F4F4")
CINZA_TEXTO = colors.HexColor("#333333")

def header_footer(canvas, doc):
    canvas.saveState()
    w, h = A4
    canvas.setFillColor(TEAL)
    canvas.rect(0, h - 2*cm, w, 2*cm, fill=1, stroke=0)
    canvas.setFillColor(BRANCO)
    canvas.setFont("Helvetica-Bold", 13)
    canvas.drawString(1.5*cm, h - 1.35*cm, "ASCEND")
    canvas.setFont("Helvetica", 9)
    canvas.drawRightString(w - 1.5*cm, h - 1.35*cm, "Sprint 2 — Computational Thinking · FIAP")
    canvas.setFillColor(AMARELO)
    canvas.rect(0, h - 2.15*cm, w, 0.15*cm, fill=1, stroke=0)
    canvas.setFillColor(TEAL)
    canvas.rect(0, 0, w, 1.2*cm, fill=1, stroke=0)
    canvas.setFillColor(BRANCO)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(1.5*cm, 0.45*cm, "Engenharia Mecatronica · FIAP · 2026")
    canvas.drawRightString(w - 1.5*cm, 0.45*cm, f"Pagina {doc.page}")
    canvas.restoreState()

styles = getSampleStyleSheet()

def estilo(nome, pai='Normal', **kw):
    return ParagraphStyle(nome, parent=styles[pai], **kw)

s_titulo     = estilo('Titulo', fontSize=28, textColor=TEAL, fontName='Helvetica-Bold', alignment=TA_CENTER, spaceAfter=6)
s_subtitulo  = estilo('Sub',    fontSize=13, textColor=CINZA_TEXTO, fontName='Helvetica', alignment=TA_CENTER, spaceAfter=4)
s_corpo      = estilo('Corpo',  fontSize=10, textColor=CINZA_TEXTO, fontName='Helvetica', spaceAfter=6, leading=15, alignment=TA_JUSTIFY)
s_label      = estilo('Label',  fontSize=9,  textColor=TEAL, fontName='Helvetica-Bold', spaceAfter=1)
s_valor      = estilo('Valor',  fontSize=10, textColor=CINZA_TEXTO, fontName='Helvetica', spaceAfter=5)
s_secao_txt  = estilo('SecTxt', fontSize=13, textColor=BRANCO, fontName='Helvetica-Bold', spaceBefore=10, spaceAfter=4)
s_sub2       = estilo('Sub2',   fontSize=11, textColor=TEAL, fontName='Helvetica-Bold', spaceBefore=8, spaceAfter=4)

def secao(texto):
    data = [[Paragraph(f"  {texto}", s_secao_txt)]]
    t = Table(data, colWidths=[16.2*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), TEAL),
        ('TOPPADDING',    (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING',   (0,0), (-1,-1), 8),
    ]))
    return t

def destaque(texto):
    s = estilo('Dest', fontSize=10, fontName='Helvetica-Bold', textColor=TEAL, alignment=TA_CENTER)
    data = [[Paragraph(texto, s)]]
    t = Table(data, colWidths=[16.2*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), AMARELO),
        ('TOPPADDING',    (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 12),
    ]))
    return t

def caixaInfo(titulo, descricao):
    sT = estilo('CIT', fontSize=10, fontName='Helvetica-Bold', textColor=TEAL, spaceAfter=2)
    sD = estilo('CID', fontSize=10, fontName='Helvetica', textColor=CINZA_TEXTO, leading=14, alignment=TA_JUSTIFY)
    conteudo = [Paragraph(titulo, sT), Paragraph(descricao, sD)]
    marker = Spacer(0.3*cm, 0)
    data = [[marker, Table([[p] for p in conteudo], colWidths=[15.5*cm])]]
    t = Table(data, colWidths=[0.3*cm, 15.9*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), TEAL),
        ('BACKGROUND', (1,0), (1,-1), TEAL_CLARO),
        ('VALIGN',     (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING',    (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING',   (0,0), (0,-1), 0),
        ('RIGHTPADDING',  (0,0), (0,-1), 0),
        ('LEFTPADDING',   (1,0), (1,-1), 10),
    ]))
    return t

def esp(n=1):
    return Spacer(1, n * 0.3*cm)

doc = SimpleDocTemplate(
    OUTPUT, pagesize=A4,
    leftMargin=1.8*cm, rightMargin=1.8*cm,
    topMargin=2.8*cm, bottomMargin=2*cm,
    title="Sprint 2 — Computational Thinking — ASCEND",
    author="Grupo ASCEND – FIAP"
)

story = []

# ── CAPA ────────────────────────────────────────────────────────────────────
story.append(Spacer(1, 0.8*cm))
story.append(Paragraph("ASCEND", s_titulo))
story.append(Paragraph("Estacionamento Vertical Autonomo", s_subtitulo))
story.append(Spacer(1, 0.2*cm))
story.append(HRFlowable(width="100%", thickness=2, color=AMARELO, spaceAfter=16))

# Tabela de identificação
id_data = [
    [Paragraph("<b>Instituicao</b>", s_label),   Paragraph("FIAP", s_valor)],
    [Paragraph("<b>Curso</b>", s_label),          Paragraph("Engenharia Mecatronica", s_valor)],
    [Paragraph("<b>Turma</b>", s_label),          Paragraph("1EMR", s_valor)],
    [Paragraph("<b>Disciplina</b>", s_label),     Paragraph("Computational Thinking for Engineering", s_valor)],
    [Paragraph("<b>Professora</b>", s_label),     Paragraph("Michele Bazana de Souza", s_valor)],
    [Paragraph("<b>Empresa Parceira</b>", s_label), Paragraph("OTIS Elevadores", s_valor)],
    [Paragraph("<b>Entrega</b>", s_label),        Paragraph("Sprint 2 — 2 Entregavel", s_valor)],
    [Paragraph("<b>Ano</b>", s_label),            Paragraph("2026", s_valor)],
]
t_id = Table(id_data, colWidths=[4.5*cm, 11.7*cm])
t_id.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (0,-1), TEAL_CLARO),
    ('VALIGN',        (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING',    (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING',   (0,0), (-1,-1), 8),
    ('GRID',          (0,0), (-1,-1), 0.4, colors.HexColor("#DDDDDD")),
]))
story.append(t_id)
story.append(esp(2))

# Integrantes
membros = [
    ["Nome Completo", "RM"],
    ["Beatriz Goncalves", "572149"],
    ["Hugo Mariutti",     "568941"],
    ["Kawuan Mizael",     "569474"],
    ["Manoela de Almeida","571373"],
]
t_m = Table(membros, colWidths=[11*cm, 5.2*cm])
t_m.setStyle(TableStyle([
    ('BACKGROUND',    (0,0), (-1,0), TEAL),
    ('TEXTCOLOR',     (0,0), (-1,0), BRANCO),
    ('FONTNAME',      (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE',      (0,0), (-1,0), 10),
    ('ROWBACKGROUNDS',(0,1), (-1,-1), [BRANCO, CINZA_CLARO]),
    ('FONTNAME',      (0,1), (-1,-1), 'Helvetica'),
    ('FONTSIZE',      (0,1), (-1,-1), 10),
    ('ALIGN',         (1,0), (1,-1), 'CENTER'),
    ('VALIGN',        (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING',    (0,0), (-1,-1), 7),
    ('BOTTOMPADDING', (0,0), (-1,-1), 7),
    ('LEFTPADDING',   (0,0), (-1,-1), 10),
    ('GRID',          (0,0), (-1,-1), 0.4, colors.HexColor("#CCCCCC")),
]))
story.append(t_m)
story.append(esp(2))

# ── SEÇÃO 1: DESCRIÇÃO DAS IDEIAS ───────────────────────────────────────────
story.append(secao("1. Descricao das Ideias para o Desenvolvimento do Projeto"))
story.append(esp())
story.append(Paragraph(
    "O projeto ASCEND propoe um sistema de estacionamento vertical 100% autonomo, desenvolvido "
    "em parceria com a OTIS Elevadores. A solucao integra hardware de automacao e software "
    "inteligente para receber, armazenar e devolver veiculos sem intervencao humana, "
    "aproveitando o espaco vertical em estrutura cilindrica.",
    s_corpo))
story.append(esp())

story.append(Paragraph("Hardware Planejado", s_sub2))
story.append(esp(0.5))

hw_items = [
    ("Microcontrolador Arduino Uno",
     "Cerebro do sistema embarcado. Responsavel por processar os sinais dos sensores, "
     "acionar os motores e executar a logica de controle de posicionamento da plataforma."),
    ("Motor DC com caixa de reducao (AK555/06PF24R350CE)",
     "Responsavel pela movimentacao vertical da plataforma do elevador. Opera a 24V com "
     "torque nominal de 5 kgf.cm, acionado por PWM para controle de velocidade."),
    ("Motor de passo (28BYJ-48)",
     "Utilizado para girar os anis de vagas em cada andar, garantindo precisao de "
     "posicionamento angular sem necessidade de encoder externo."),
    ("Motores DC com reducao (GA12-N20)",
     "2 unidades para acionar as esteiras de entrada e saida de veiculos no terreo. "
     "Compactos, leves e controlados por PWM via Arduino."),
    ("Sensor ultrassonico HC-SR04",
     "Mede a posicao vertical da plataforma do elevador em tempo real. Fixado na parte "
     "superior da estrutura, aponta para baixo e fornece dados de distancia ao Arduino."),
    ("Celula de carga com modulo HX711",
     "Monitora o peso do veiculo sobre a plataforma. Garante que o sistema nao opere em "
     "sobrecarga, protegendo motores e estrutura em MDF."),
    ("Sensor infravermelho reflexivo",
     "Detecta a presenca e o posicionamento correto do veiculo na plataforma antes de "
     "liberar o acionamento do motor de elevacao."),
    ("Modulo RFID",
     "Identifica cada veiculo automaticamente ao entrar no sistema, associando-o a uma "
     "vaga disponivel sem necessidade de intervencao do motorista."),
    ("Estrutura fisica em MDF 9mm e impressao 3D",
     "Carcaca cilindrica, plataforma giratoria, trilhos, suportes de motores e cancela "
     "serao fabricados em MDF cortado a laser e pecas impressas em 3D (PLA+), "
     "modeladas no Autodesk Inventor."),
    ("Trava automatica de rodas",
     "Dispositivo mecanico que fixa o veiculo durante o transporte vertical, "
     "acionado assim que a plataforma confirma o posicionamento correto."),
]

for titulo, desc in hw_items:
    story.append(caixaInfo(titulo, desc))
    story.append(esp(0.5))

story.append(esp())
story.append(Paragraph("Software Planejado", s_sub2))
story.append(esp(0.5))

sw_items = [
    ("Linguagem C/C++ (Arduino IDE)",
     "Programacao do sistema embarcado: controle dos motores por PWM, leitura dos "
     "sensores, logica de posicionamento e comunicacao serial com o modulo ESP32."),
    ("Python — Logica de Inteligencia Artificial",
     "Algoritmo de gestao preditiva de vagas: calcula a melhor rota de entrada e saida, "
     "prioriza veiculos com maior urgencia de retirada e ajusta a ocupacao das vagas "
     "dinamicamente conforme a demanda."),
    ("Aplicativo Mobile (interface do usuario)",
     # DEIXAR EM BRANCO — tecnologia exata do app nao definida ainda
     "[A DEFINIR na Sprint 3 — tecnologia do app (React Native, Flutter ou outro) "
     "sera escolhida apos avaliacao do grupo]"),
    ("Protocolo MQTT via ESP32",
     "Transmissao dos dados de posicao, velocidade e status das vagas do Arduino para "
     "o servidor em tempo real, com latencia inferior a 1 segundo."),
    ("Dashboard em tempo real",
     "Interface de monitoramento que exibe: posicao atual da plataforma, velocidade, "
     "status de vagas ocupadas/livres, tempo estimado de retirada e alertas de falha."),
    ("Autodesk Inventor — CAD 3D",
     "Modelagem parametrica de todos os componentes fisicos do prototipo antes da "
     "fabricacao, com simulacao de movimentos e analise de interferencias entre pecas."),
]

for titulo, desc in sw_items:
    story.append(caixaInfo(titulo, desc))
    story.append(esp(0.5))

story.append(esp())
story.append(destaque(
    "Missao: integrar hardware de automacao e software inteligente em um sistema "
    "coeso, escalavel e 100% autonomo para estacionamento vertical urbano."
))
story.append(esp(2))

# ── SEÇÃO 2: CRONOGRAMA ─────────────────────────────────────────────────────
story.append(secao("2. Cronograma de Desenvolvimento"))
story.append(esp())
story.append(Paragraph(
    "O projeto e organizado em sprints quinzenais, desde a concepcao ate o pitch final. "
    "Abaixo, o status atual de cada etapa:",
    s_corpo))
story.append(esp())

# Legenda
leg_data = [
    [Paragraph("CONCLUIDA", estilo('lC', fontSize=8, fontName='Helvetica-Bold', textColor=BRANCO, alignment=TA_CENTER)),
     Paragraph("EM ANDAMENTO", estilo('lA', fontSize=8, fontName='Helvetica-Bold', textColor=TEAL, alignment=TA_CENTER)),
     Paragraph("FUTURA", estilo('lF', fontSize=8, fontName='Helvetica-Bold', textColor=CINZA_TEXTO, alignment=TA_CENTER))],
]
t_leg = Table(leg_data, colWidths=[5*cm, 5.6*cm, 5.6*cm])
t_leg.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (0,0), TEAL),
    ('BACKGROUND', (1,0), (1,0), AMARELO),
    ('BACKGROUND', (2,0), (2,0), CINZA_CLARO),
    ('TOPPADDING',    (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('GRID',          (0,0), (-1,-1), 0.4, colors.HexColor("#CCCCCC")),
]))
story.append(t_leg)
story.append(esp())

sprints = [
    ("Sprint 0", "Conceitual — DOD e planejamento",                    "—",                    "CONCLUIDA"),
    ("Sprint 1", "Refinamento de escopo e funcionalidades do app",     "25/04 – 02/05/2026",   "CONCLUIDA"),
    ("Sprint 2", "Challenge Sprint — entrega macro do projeto",        "03/05 – 16/05/2026",   "CONCLUIDA"),
    ("Sprint 3", "Definicao de tecnologias (hardware e software)",     "17/05 – 30/05/2026",   "ANDAMENTO"),
    ("Sprint 4", "Prototipo inicial",                                  "31/05 – 13/06/2026",   "FUTURA"),
    ("Sprint 5", "Entrada — esteira e cancela",                        "14/06 – 27/06/2026",   "FUTURA"),
    ("Sprint 6", "Movimentacao vertical",                              "14/06 – 27/06/2026",   "FUTURA"),
    ("Sprint 7", "Plataforma retratil",                                "28/06 – 11/07/2026",   "FUTURA"),
    ("Sprint 8", "Estrutura do predio",                                "28/06 – 11/07/2026",   "FUTURA"),
    ("Sprint 9", "Integracao Software + Hardware",                     "12/07 – 25/07/2026",   "FUTURA"),
    ("Sprint 10","Aplicativo mobile",                                  "26/07 – 08/08/2026",   "FUTURA"),
    ("Sprint 11","Montagem e integracao final",                        "09/08 – 22/08/2026",   "FUTURA"),
    ("Sprint 12","Maquete final",                                      "23/08 – 05/09/2026",   "FUTURA"),
    ("Sprint 13","Pitch / Mentoria",                                   "06/09 – 19/09/2026",   "FUTURA"),
    ("Sprint 14","Brindes e encerramento",                             "06/09 – 19/09/2026",   "FUTURA"),
]

header_sprint = [
    Paragraph("<b>Sprint</b>", estilo('sh', fontSize=9, fontName='Helvetica-Bold', textColor=BRANCO, alignment=TA_CENTER)),
    Paragraph("<b>Foco</b>",   estilo('sh2',fontSize=9, fontName='Helvetica-Bold', textColor=BRANCO)),
    Paragraph("<b>Periodo</b>",estilo('sh3',fontSize=9, fontName='Helvetica-Bold', textColor=BRANCO, alignment=TA_CENTER)),
    Paragraph("<b>Status</b>", estilo('sh4',fontSize=9, fontName='Helvetica-Bold', textColor=BRANCO, alignment=TA_CENTER)),
]

rows = [header_sprint]
for sp, foco, per, status in sprints:
    if status == "CONCLUIDA":
        bg, fg, bold = TEAL, BRANCO, True
    elif status == "ANDAMENTO":
        bg, fg, bold = AMARELO, TEAL, True
    else:
        bg, fg, bold = CINZA_CLARO, CINZA_TEXTO, False

    rows.append([
        Paragraph(f"<b>{sp}</b>" if bold else sp, estilo(f's{sp}', fontSize=9, fontName='Helvetica-Bold' if bold else 'Helvetica', textColor=fg, alignment=TA_CENTER)),
        Paragraph(f"<b>{foco}</b>" if bold else foco, estilo(f'f{sp}', fontSize=9, fontName='Helvetica-Bold' if bold else 'Helvetica', textColor=fg)),
        Paragraph(per, estilo(f'p{sp}', fontSize=9, fontName='Helvetica', textColor=fg, alignment=TA_CENTER)),
        Paragraph(status, estilo(f'st{sp}', fontSize=8, fontName='Helvetica-Bold', textColor=fg, alignment=TA_CENTER)),
    ])

t_cron = Table(rows, colWidths=[2.2*cm, 7.5*cm, 4*cm, 2.5*cm])
style_cron = TableStyle([
    ('BACKGROUND',    (0,0), (-1,0), TEAL),
    ('VALIGN',        (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING',    (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('LEFTPADDING',   (0,0), (-1,-1), 8),
    ('GRID',          (0,0), (-1,-1), 0.3, colors.HexColor("#CCCCCC")),
])

# Colorir linhas por status
for i, (sp, foco, per, status) in enumerate(sprints, start=1):
    if status == "CONCLUIDA":
        style_cron.add('BACKGROUND', (0,i), (-1,i), TEAL)
    elif status == "ANDAMENTO":
        style_cron.add('BACKGROUND', (0,i), (-1,i), AMARELO)
    else:
        style_cron.add('BACKGROUND', (0,i), (-1,i), CINZA_CLARO)

t_cron.setStyle(style_cron)
story.append(t_cron)
story.append(esp(2))

# ── CONSIDERAÇÕES FINAIS ────────────────────────────────────────────────────
story.append(secao("3. Consideracoes Finais"))
story.append(esp())
story.append(Paragraph(
    "O projeto ASCEND encontra-se em fase de desenvolvimento ativo, com as tres primeiras sprints "
    "concluidas e a Sprint 3 em andamento, focada na definicao final das tecnologias de hardware "
    "e software. O planejamento descrito neste documento representa o estado atual do projeto e "
    "sera refinado conforme o grupo avanca nas proximas sprints.",
    s_corpo))
story.append(Paragraph(
    "A combinacao entre automacao mecanica (motores, sensores, microcontroladores) e software "
    "inteligente (IA preditiva, aplicativo mobile, dashboard em tempo real) forma a base tecnica "
    "do ASCEND. O cronograma estruturado em sprints garante controle progressivo das entregas, "
    "reducao de riscos de integracao e validacao continua dos mecanismos projetados.",
    s_corpo))
story.append(esp())
story.append(destaque(
    '"O futuro das cidades exige eficiencia, automacao e otimizacao." — ASCEND, 2026'
))

doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
print("PDF gerado com sucesso:", OUTPUT)