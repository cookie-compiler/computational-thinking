# [LINK DO VÍDEO AQUI]
# | Beatriz Gonçalves (RM: 572149) | 
# | Hugo Mariutti (RM: 568941)     |

# Códigos ANSI para cores no terminal
VERMELHO = "\033[91m"
AMARELO = "\033[93m"
VERDE = "\033[92m"
AZUL = "\033[94m"
CIANO = "\033[96m"
NEGRITO = "\033[1m"
RESET = "\033[0m"

print(str(int((50-len("Ciclos realizados: 10"))/2)))

print(CIANO + NEGRITO + "=" * 50)
print(" "*8 + "SPACE STRUCTURAL MONITORING SYSTEM")
print(" "*6 + "OrbitalTech - Monitoramento Estrutural")
print("=" * 50 + RESET)
print()

# --- Entrada de Dados (Ciclos) ---
total_ciclos = 0
while total_ciclos < 3:
    try:
        total_ciclos = int(input("Quantos ciclos de leitura serão realizados? "))
        if total_ciclos < 3:
            print(VERMELHO + "ERRO: o mínimo de ciclos é 3." + RESET)
    except Exception:
        print(VERMELHO + "ERRO: digite um número inteiro válido." + RESET)
print()

# --- Pré-leiura: Inicialização de variáveis ---

# Acumuladores
soma_vibracao = 0.0
soma_temperatura = 0.0
soma_deformacao = 0.0
soma_pressao = 0.0

# Contadores
total_leituras = 0
leituras_criticas = 0

# Máximos e mínimos
max_vibracao = None
min_vibracao = None
max_temperatura = None
min_temperatura = None
max_deformacao = None
min_deformacao = None
max_pressao = None
min_pressao = None

# Variáveis de alerta
modulo = None
valor = None
un_medida = None

# Alertas
alertas = ""

# Contador (loop principal)
ciclo = 1

# --- Leitura dos Sensores (Ciclos) ---
while ciclo <= total_ciclos:
    print(AZUL + NEGRITO + f"--- Ciclo {ciclo} ---" + RESET)

    # While + Try/Except por sensor para capturar um valor válido
    value_error_message = VERMELHO + "  ERRO: digite um valor numérico." + RESET
    
    # Leitura dos 5 Sensores Principais (S1 - S5)
    sensor = 1
    while sensor <= 5:
        print(CIANO + f"Sensor S{sensor}:" + RESET)

        vibracao = None
        while vibracao == None:
            try:
                vibracao = float(input("  Vibração (g): "))
            except Exception:
                print(value_error_message)

        temperatura = None
        while temperatura == None:
            try:
                temperatura = float(input("  Temperatura (°C): "))
            except Exception:
                print(value_error_message)

        deformacao = None
        while deformacao == None:
            try:
                deformacao = float(input("  Deformação (mm): "))
            except Exception:
                print(value_error_message)

        # Somar valores das leituras
        soma_vibracao = soma_vibracao + vibracao
        soma_temperatura = soma_temperatura + temperatura
        soma_deformacao = soma_deformacao + deformacao

        # Atualizar vibração (máximo e mínimo)
        if max_vibracao == None or vibracao > max_vibracao:
            max_vibracao = vibracao
        if min_vibracao == None or vibracao < min_vibracao:
            min_vibracao = vibracao

        # Atualizar temperatura (máximo e mínimo)
        if max_temperatura == None or temperatura > max_temperatura:
            max_temperatura = temperatura
        if min_temperatura == None or temperatura < min_temperatura:
            min_temperatura = temperatura

        # Atualizar deformação (máximo e mínimo)
        if max_deformacao == None or deformacao > max_deformacao:
            max_deformacao = deformacao
        if min_deformacao == None or deformacao < min_deformacao:
            min_deformacao = deformacao

        # Verificar condições críticas: vibração
        if vibracao > 5.0 or vibracao < -5.0:
            alertas = alertas + VERMELHO + f"    ALERTA: Vibração crítica de {vibracao:.2f}g detectada no sensor S{sensor} (ciclo {ciclo})!" + RESET + "\n"
            leituras_criticas = leituras_criticas + 1

        # Verificar condições críticas: temperatura
        if temperatura < -150 or temperatura > 120:
            alertas = alertas + VERMELHO + f"    ALERTA: Temperatura crítica de {temperatura:.2f}°C detectada no sensor S{sensor} (ciclo {ciclo})!" + RESET + "\n"
            leituras_criticas = leituras_criticas + 1

        # Verificar condições críticas: deformação
        if deformacao > 2.5:
            alertas = alertas + VERMELHO + f"    ALERTA: Deformação crítica de {deformacao:.2f}mm detectada no sensor S{sensor} (ciclo {ciclo})!" + RESET + "\n"
            leituras_criticas = leituras_criticas + 1

        sensor = sensor + 1

    # Leitura da Pressão Interna
    pressao = None
    while pressao == None:
        try:
            pressao = float(input("Pressão interna do módulo (kPa): "))
        except Exception:
            print(value_error_message)

    # Somar pressão
    soma_pressao = soma_pressao + pressao

    # Atualizar pressão (máximo e mínimo)
    if max_pressao == None or pressao > max_pressao:
        max_pressao = pressao
    if min_pressao == None or pressao < min_pressao:
        min_pressao = pressao

    # Verificar condições críticas: pressão
    if pressao < 90 or pressao > 110:
        alertas = alertas + VERMELHO + f"    ALERTA: Pressão crítica de {pressao:.2f}kPa detectada (ciclo {ciclo})!" + RESET + "\n"
        leituras_criticas = leituras_criticas + 1

    # Somar leituras do ciclo
    total_leituras = total_leituras + 4

    print()
    ciclo = ciclo + 1

# --- Cálculos Finais ---
total_leituras_por_param = total_ciclos * 5

media_vibracao = soma_vibracao / total_leituras_por_param
media_temperatura = soma_temperatura / total_leituras_por_param
media_deformacao = soma_deformacao / total_leituras_por_param
media_pressao = soma_pressao / total_ciclos

porcentagem_criticas = (leituras_criticas / total_leituras) * 100

# --- Classificação do Estado Geral ---
if porcentagem_criticas > 30:
    classificacao = VERMELHO + NEGRITO + "ESTADO GERAL: RISCO ESTRUTURAL ELEVADO - Acionar protocolo de emergência" + RESET
elif porcentagem_criticas >= 10:
    classificacao = AMARELO + NEGRITO + "ESTADO GERAL: ATENÇÃO - Monitoramento intensificado recomendado" + RESET
else:
    classificacao = VERDE + NEGRITO + "ESTADO GERAL: NORMAL - Estrutura operando dentro dos limites de segurança" + RESET

# --- Relatório Final ---
print(CIANO + NEGRITO + "=" * 50)
print(" "*17 + "RELATÓRIO FINAL")
print(" "*14 + f"Ciclos realizados: {total_ciclos}")
print("=" * 50 + RESET)
print()

# Alertas
if alertas != "":
    print(NEGRITO + "--- ALERTAS CRÍTICOS ---" + RESET)
    print(alertas)
else:
    print(VERDE + "Nenhum alerta crítico detectado." + RESET)
    print()

# Estatísticas por parâmetro
print(NEGRITO + "--- ESTATÍSTICAS POR PARÂMETRO ---" + RESET)
print(f"Vibração    -> Média: {media_vibracao:.2f} g   | Máx: {max_vibracao:.2f} g   | Mín: {min_vibracao:.2f} g")
print(f"Temperatura -> Média: {media_temperatura:.2f} °C  | Máx: {max_temperatura:.2f} °C  | Mín: {min_temperatura:.2f} °C")
print(f"Deformação  -> Média: {media_deformacao:.2f} mm  | Máx: {max_deformacao:.2f} mm  | Mín: {min_deformacao:.2f} mm")
print(f"Pressão     -> Média: {media_pressao:.2f} kPa | Máx: {max_pressao:.2f} kPa | Mín: {min_pressao:.2f} kPa")
print()

# Classificação
print(NEGRITO + "--- CLASSIFICAÇÃO ---" + RESET)
print(f"Leituras críticas: {leituras_criticas}/{total_leituras} ({porcentagem_criticas:.1f}%)")
print(classificacao)
print(CIANO + "=" * 50 + RESET)