def hello_world(text):
    print(text)

def soma(a, b):
    return a + b

hello_world("print")

um = 1.1
print(str(um)) # float em string =)

s = 0
for i in range(0, 5):
    num = float(input("Digite um numero: "))
    print(f"O dobro do numero escolhido é {num*2:.2f}")
    s = soma(s, num)
    s += num*2

print(f"A soma dos numeros escolhidos é {s:.2f}")