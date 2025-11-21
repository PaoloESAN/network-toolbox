import sys

def ip_a_int(ip_str):
    """Convierte una IP de string a número entero"""
    octetos = ip_str.split('.')
    
    # Validar que cada octeto esté entre 0 y 255
    for octeto in octetos:
        valor = int(octeto)
        if valor < 0 or valor > 255:
            return None
    
    numero = 0
    numero = numero + int(octetos[0]) * 256**3
    numero = numero + int(octetos[1]) * 256**2
    numero = numero + int(octetos[2]) * 256
    numero = numero + int(octetos[3])
    return numero


def int_a_ip(numero):
    """Convierte un número entero a IP"""
    octeto1 = numero // (256**3)
    resto = numero % (256**3)
    
    octeto2 = resto // (256**2)
    resto = resto % (256**2)
    
    octeto3 = resto // 256
    octeto4 = resto % 256
    
    return f"{octeto1}.{octeto2}.{octeto3}.{octeto4}"


def int_a_binario(numero):
    """Convierte un número entero a formato binario con puntos cada 8 bits"""
    # Convertir a binario y llenar con ceros hasta 32 dígitos
    binario = bin(numero)[2:].zfill(32)
    
    # Dividir en 4 grupos de 8 bits
    grupo1 = binario[0:8]
    grupo2 = binario[8:16]
    grupo3 = binario[16:24]
    grupo4 = binario[24:32]
    
    return f"{grupo1}.{grupo2}.{grupo3}.{grupo4}"


def calcular_mascara(netmask):
    """Calcula la máscara de red en formato entero"""
    # Crear máscara con netmask bits en 1 y el resto en 0
    # Ejemplo: /24 = 11111111.11111111.11111111.00000000
    
    # Cálculo simple:
    # (2^netmask - 1) nos da netmask bits en 1
    # Luego multiplicamos por 2^(32-netmask) para desplazarlos a la izquierda
    bits_red = 2**netmask - 1
    bits_host = 32 - netmask
    mascara = bits_red * (2**bits_host)
    
    return mascara


def calcular_subred(ip, netmask):
    """
    Calcula toda la información de una subred IPv4
    
    Parámetros:
        ip (str): Dirección IP (ej: "192.168.0.1")
        netmask (int): Máscara de red en notación CIDR (ej: 24)
    
    Retorna:
        dict: Diccionario con toda la información de la red
    """
    
    # Convertir IP a entero
    ip_int = ip_a_int(ip)
    
    # Validar IP
    if ip_int is None:
        return None
    
    # Calcular máscara de red
    mascara_int = calcular_mascara(netmask)
    
    # Wildcard es lo opuesto de la máscara
    wildcard_int = (2**32 - 1) - mascara_int
    
    # Calcular IP de red (hacer AND entre IP y máscara)
    # Esto elimina los bits de host
    network_int = ip_int & mascara_int
    
    # Calcular broadcast (network OR wildcard)
    broadcast_int = network_int | wildcard_int
    
    # Calcular primer y último host
    hostmin_int = network_int + 1
    hostmax_int = broadcast_int - 1
    
    # Calcular cantidad de hosts (2^bits_host - 2)
    bits_host = 32 - netmask
    total_hosts = (2 ** bits_host) - 2
    
    # Obtener primer octeto para determinar clase
    octetos_network = int_a_ip(network_int).split('.')
    primer_octeto = int(octetos_network[0])
    
    # Determinar clase de red
    if primer_octeto < 128:
        clase = "Class A"
    elif primer_octeto < 192:
        clase = "Class B"
    elif primer_octeto < 224:
        clase = "Class C"
    elif primer_octeto < 240:
        clase = "Class D, Multicast"
    else:
        clase = "Class E, Reserved"
    
    # Determinar si es privada
    octeto2_network = int(octetos_network[1])
    
    es_privada = False
    if primer_octeto == 10:
        es_privada = True
    elif primer_octeto == 172 and 16 <= octeto2_network <= 31:
        es_privada = True
    elif primer_octeto == 192 and octeto2_network == 168:
        es_privada = True
    
    # Determinar si es red privada o pública
    if es_privada:
        tipo_red = "Private Internet"
    else:
        tipo_red = "Public Internet"
    
    # Construir resultado
    resultado = {
        "Address": {
            "decimal": ip,
            "binario": int_a_binario(ip_int)
        },
        "Netmask": {
            "decimal": f"{int_a_ip(mascara_int)} = {netmask}",
            "binario": int_a_binario(mascara_int)
        },
        "Wildcard": {
            "decimal": int_a_ip(wildcard_int),
            "binario": int_a_binario(wildcard_int)
        },
        "Network": {
            "decimal": f"{int_a_ip(network_int)}/{netmask}",
            "binario": int_a_binario(network_int)
        },
        "HostMin": {
            "decimal": int_a_ip(hostmin_int),
            "binario": int_a_binario(hostmin_int)
        },
        "HostMax": {
            "decimal": int_a_ip(hostmax_int),
            "binario": int_a_binario(hostmax_int)
        },
        "Broadcast": {
            "decimal": int_a_ip(broadcast_int),
            "binario": int_a_binario(broadcast_int)
        },
        "Hosts/Net": total_hosts,
        "Clase": clase,
        "Tipo": tipo_red
    }
    
    return resultado


def imprimir_subred(ip, netmask):
    """
    Calcula e imprime toda la información de una subred
    
    Parámetros:
        ip (str): Dirección IP (ej: "192.168.0.1")
        netmask (int): Máscara de red en notación CIDR (ej: 24)
    """
    info = calcular_subred(ip, netmask)
    
    if info is None:
        print("Error: IP inválida")
        return
    
    print(f"Address:    {info['Address']['decimal']:<20} {info['Address']['binario']}")
    print(f"Netmask:    {info['Netmask']['decimal']:<20} {info['Netmask']['binario']}")
    print(f"Wildcard:   {info['Wildcard']['decimal']:<20} {info['Wildcard']['binario']}")
    print(f"=>")
    print(f"Network:    {info['Network']['decimal']:<20} {info['Network']['binario']}")
    print(f"HostMin:    {info['HostMin']['decimal']:<20} {info['HostMin']['binario']}")
    print(f"HostMax:    {info['HostMax']['decimal']:<20} {info['HostMax']['binario']}")
    print(f"Broadcast:  {info['Broadcast']['decimal']:<20} {info['Broadcast']['binario']}")
    print(f"Hosts/Net:  {info['Hosts/Net']:<20} {info['Clase']}, {info['Tipo']}")


if __name__ == "__main__":
    # Recibir argumentos: python mascaras-ips.py <ip> <netmask>
    # Ejemplo: python mascaras-ips.py 192.168.0.1 24
    
    if len(sys.argv) < 3:
        print("Error: Uso: python mascaras-ips.py <ip> <netmask>")
        print("Ejemplo: python mascaras-ips.py 192.168.0.1 24")
        sys.exit(1)
    
    ip = sys.argv[1]
    netmask = int(sys.argv[2])
    
    # Validar que la IP tenga 4 octetos
    octetos = ip.split('.')
    if len(octetos) != 4:
        print("Error: La IP debe tener 4 números (ej: 192.168.0.1)")
        sys.exit(1)
    
    # Validar que la máscara esté entre 0 y 32
    if netmask < 0 or netmask > 32:
        print("Error: La máscara debe estar entre 0 y 32")
        sys.exit(1)
    
    imprimir_subred(ip, netmask)
