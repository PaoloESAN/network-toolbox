import sys

def ipv4_a_ipv6(ipv4):
    partes = ipv4.split('.')
    
    if len(partes) != 4:
        return "Error: IPv4 debe tener 4 números"
    
    try:
        octetos = [int(p) for p in partes]
        for num in octetos:
            if num < 0 or num > 255:
                return "Error: Cada número debe estar entre 0 y 255"
    except ValueError:
        return "Error: Los valores deben ser números"
    
    grupo1 = f"{octetos[0]:02x}{octetos[1]:02x}" #02x es para formato hexadecimal con dos dígitos
    grupo2 = f"{octetos[2]:02x}{octetos[3]:02x}" #02x es para formato hexadecimal con dos dígitos

    return f"::ffff:{grupo1}:{grupo2}"


def ipv6_a_ipv4(ipv6):
    """Convierte IPv6 a IPv4 - Ejemplo: ::ffff:c0a8:0101 -> 192.168.1.1"""
    # Expandir la notación comprimida (::)
    if '::' in ipv6:
        # Dividir en dos partes usando ::
        partes = ipv6.split('::')
        parte_izquierda = partes[0]
        parte_derecha = partes[1]
        
        # Convertir strings en listas de grupos
        if parte_izquierda:
            grupos_izq = parte_izquierda.split(':')
        else:
            grupos_izq = []
        
        if parte_derecha:
            grupos_der = parte_derecha.split(':')
        else:
            grupos_der = []
        
        # Rellenar con ceros en el medio
        ceros_faltantes = 8 - len(grupos_izq) - len(grupos_der)
        grupos = grupos_izq + ['0'] * ceros_faltantes + grupos_der
    else:
        # Si no hay ::, dividir normalmente
        grupos = ipv6.split(':')
    
    # Validar que tenga 8 grupos
    if len(grupos) != 8:
        return "Error: IPv6 inválido"
    
    try:
        # Tomar los dos últimos grupos (contienen el IPv4 en hexadecimal)
        hex_grupo_6 = grupos[6]  # Ejemplo: "c0a8"
        hex_grupo_7 = grupos[7]  # Ejemplo: "0101"
        
        # Convertir hexadecimal a decimal
        # Cada grupo tiene 4 dígitos hex = 2 octetos
        octeto1 = int(hex_grupo_6[:2], 16)    # c0 = 192
        octeto2 = int(hex_grupo_6[2:], 16)    # a8 = 168
        octeto3 = int(hex_grupo_7[:2], 16)    # 01 = 1
        octeto4 = int(hex_grupo_7[2:], 16)    # 01 = 1
        
        return f"{octeto1}.{octeto2}.{octeto3}.{octeto4}"
    except (ValueError, IndexError):
        return "Error: IPv6 con valores hexadecimales inválidos"


if __name__ == "__main__":
    
    if len(sys.argv) != 3:
        print("Error: Uso: python convertir-ips.py <ip> <direction>")
        sys.exit(1)
    
    ip = sys.argv[1]
    direction = sys.argv[2]
    
    if direction == "ipv4_to_ipv6":
        resultado = ipv4_a_ipv6(ip)
    elif direction == "ipv6_to_ipv4":
        resultado = ipv6_a_ipv4(ip)
    else:
        print("Error: direction debe ser 'ipv4_to_ipv6' o 'ipv6_to_ipv4'")
        sys.exit(1)
    
    print(resultado)
