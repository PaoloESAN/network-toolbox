# Funciones simples para convertir entre IPv4 e IPv6

def ipv4_a_ipv6(ipv4):
    """
    Convierte una dirección IPv4 a IPv6 (formato comprimido)
    Ejemplo: 192.168.1.1 -> ::c0a8:0101
    """
    # Validar que sea un IPv4 válido
    partes = ipv4.split('.')
    if len(partes) != 4:
        return "Error: IPv4 inválido"
    
    try:
        # Verificar que cada parte sea un número entre 0 y 255
        octetos = []
        for parte in partes:
            num = int(parte)
            if num < 0 or num > 255:
                return "Error: Números fuera de rango (0-255)"
            octetos.append(num)
    except ValueError:
        return "Error: IPv4 contiene valores no numéricos"
    
    # Convertir a IPv6: combinar pares de octetos IPv4 en hexadecimal
    # IPv6 tiene 8 grupos de 16 bits (4 dígitos hex cada uno)
    grupo1 = f"{octetos[0]:02x}{octetos[1]:02x}"
    grupo2 = f"{octetos[2]:02x}{octetos[3]:02x}"
    
    # Formar IPv6 en formato comprimido
    # Los primeros 6 grupos son 0, así que usamos ::
    ipv6 = f"::{grupo1}:{grupo2}"
    return ipv6


def ipv6_a_ipv4(ipv6):
    """
    Convierte una dirección IPv6 a IPv4
    Maneja notación comprimida (::) y ceros iniciales omitidos
    Ejemplo: ::c0a8:0101 -> 192.168.1.1
    """
    # Expandir la notación comprimida ::
    if '::' in ipv6:
        # Contar cuántos grupos hay
        partes = ipv6.split('::')
        
        if len(partes) > 2:
            return "Error: No puede haber más de un ::"
        
        # Expandir los grupos
        grupos_izq = partes[0].split(':') if partes[0] else []
        grupos_der = partes[1].split(':') if partes[1] else []
        
        # Filtrar strings vacíos
        grupos_izq = [g for g in grupos_izq if g]
        grupos_der = [g for g in grupos_der if g]
        
        # Llenar con ceros el medio
        ceros_faltantes = 8 - len(grupos_izq) - len(grupos_der)
        grupos = grupos_izq + ['0'] * ceros_faltantes + grupos_der
    else:
        # Si no hay ::, dividir normalmente
        grupos = ipv6.split(':')
        
        # Si tiene ceros iniciales omitidos, agregarlos
        grupos = [g if g else '0' for g in grupos]
    
    # Validar que tenga exactamente 8 grupos
    if len(grupos) != 8:
        return "Error: IPv6 debe expandirse a 8 grupos"
    
    try:
        # Obtener los últimos dos grupos (que contienen el IPv4)
        penultimo = grupos[6]
        ultimo = grupos[7]
        
        # Convertir de hexadecimal a decimal
        # Cada grupo tiene 2 octetos (4 dígitos hex)
        octeto1 = int(penultimo[:2], 16) if len(penultimo) >= 2 else 0
        octeto2 = int(penultimo[2:4], 16) if len(penultimo) >= 4 else int(penultimo[2:], 16) if len(penultimo) > 2 else 0
        octeto3 = int(ultimo[:2], 16) if len(ultimo) >= 2 else 0
        octeto4 = int(ultimo[2:4], 16) if len(ultimo) >= 4 else int(ultimo[2:], 16) if len(ultimo) > 2 else 0
        
        # Validar que estén en rango 0-255
        for octeto in [octeto1, octeto2, octeto3, octeto4]:
            if octeto < 0 or octeto > 255:
                return "Error: Valores fuera de rango"
    except ValueError:
        return "Error: Valores hexadecimales inválidos en IPv6"
    
    # Formar el IPv4
    ipv4 = f"{octeto1}.{octeto2}.{octeto3}.{octeto4}"
    return ipv4


# Ejemplo de uso
if __name__ == "__main__":
    # Prueba 1: IPv4 a IPv6 comprimido
    ipv4_original = "192.168.1.1"
    print(f"IPv4 original: {ipv4_original}")
    
    ipv6_convertido = ipv4_a_ipv6(ipv4_original)
    print(f"IPv6 convertido: {ipv6_convertido}")
    
    ipv4_reconvertido = ipv6_a_ipv4(ipv6_convertido)
    print(f"IPv4 reconvertido: {ipv4_reconvertido}")
    
    # Prueba 2: IPv6 comprimido a IPv4
    print("\n--- Prueba con notación comprimida ---")
    ipv6_test = "::0a00:0001"
    print(f"IPv6 original: {ipv6_test}")
    ipv4_test = ipv6_a_ipv4(ipv6_test)
    print(f"IPv4 convertido: {ipv4_test}")
    
    # Prueba 3: IPv6 expandido a IPv4
    print("\n--- Prueba con notación expandida ---")
    ipv6_expandido = "0:0:0:0:0:0:c0a8:0101"
    print(f"IPv6 original: {ipv6_expandido}")
    ipv4_from_expandido = ipv6_a_ipv4(ipv6_expandido)
    print(f"IPv4 convertido: {ipv4_from_expandido}")
