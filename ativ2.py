velocidade = float(input("Qual a velocidade do veículo? "))
print("Você está acima do limite permitido (80km/h). Foi aplicada uma multa de R${:.2f}".format((velocidade - 80) * 5) if velocidade > 80 else "Tudo certo! Pode continuar!")

numeros = [float(input(f"Número {i+1}: ")) for i in range(3)]
maior = max(numeros)
menor = min(numeros)

print(f"Maior: {maior}\nMenor: {menor}")

salario = float(input("Qual seu salário? "))

if salario > 1250:
    desconto = 10
else:
    desconto = 15

print(f"Novo salário: {salario+(salario*(desconto/100))}")

distancia = float(input("Qual a distância da viagem? "))
if distancia <= 200:
    valor = distancia * 0.50
else:
    valor = distancia * 0.45

print(f"O valor da passagem é: R${valor:.2f}")