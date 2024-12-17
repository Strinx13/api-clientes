import json
import random
from faker import Faker

# Inicializar Faker
faker = Faker()

# Lista de comidas predefinidas
comidas_lista = [
    "Pizza", "Hamburguesa", "Tacos", "Sushi", "Pasta", "Ensalada", "Paella",
    "Ramen", "Burritos", "Chiles rellenos", "Empanadas", "Ceviche", "Pollo frito"
]

# Función para generar 10,000 registros
def generar_clientes(cantidad):
    clientes = []
    for i in range(cantidad):
        cliente = {
            "id": i + 1,
            "nombre": faker.name().encode('ascii', 'ignore').decode('ascii'),  # Evitar caracteres especiales
            "correo": faker.email(),
            "comidasFavoritas": random.sample(comidas_lista, 3),  # Selecciona 3 comidas aleatorias
            "descuentoNavideno": {
                "porcentaje": faker.random_int(min=5, max=50),
                "descripcion": "Descuento especial " + faker.word().encode('ascii', 'ignore').decode('ascii')
            }
        }
        clientes.append(cliente)
    return clientes

# Generar los datos
clientes = generar_clientes(10000)

# Guardar en un archivo JSON
with open('clientes.json', 'w', encoding='utf-8') as f:
    json.dump(clientes, f, indent=2, ensure_ascii=False)

print("Archivo clientes.json generado correctamente.")
