import json
from faker import Faker

# Inicializar Faker
faker = Faker()

# Función para generar 10,000 registros
def generar_clientes(cantidad):
    clientes = []
    for i in range(cantidad):
        cliente = {
            "id": i + 1,
            "nombre": faker.name().encode('ascii', 'ignore').decode('ascii'),  # Evitar caracteres especiales
            "correo": faker.email(),
            "comidasFavoritas": [
                faker.word().encode('ascii', 'ignore').decode('ascii'),
                faker.word().encode('ascii', 'ignore').decode('ascii'),
                faker.word().encode('ascii', 'ignore').decode('ascii')
            ],
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
    json.dump(clientes, f, indent=2, ensure_ascii=True)

print("Archivo clientes.json generado correctamente.")
