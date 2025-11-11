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
    def ip_a_int(ip_str):
        octetos = ip_str.split('.')
        return (int(octetos[0]) << 24) + (int(octetos[1]) << 16) + \
               (int(octetos[2]) << 8) + int(octetos[3])
    
    # Convertir entero a IP
    def int_a_ip(num):
        return f"{(num >> 24) & 0xFF}.{(num >> 16) & 0xFF}.{(num >> 8) & 0xFF}.{num & 0xFF}"
    
    # Convertir entero a binario de 32 bits con puntos cada 8 bits
    def int_a_binario(num):
        binario = format(num, '032b')
        return f"{binario[0:8]}.{binario[8:16]}.{binario[16:24]}.{binario[24:32]}"
    
    # Calcular máscara de red
    mascara_int = (0xFFFFFFFF << (32 - netmask)) & 0xFFFFFFFF
    mascara_wildcard_int = ~mascara_int & 0xFFFFFFFF
    
    # Calcular IP de red (address AND mask)
    ip_int = ip_a_int(ip)
    network_int = ip_int & mascara_int
    
    # Calcular broadcast (network OR wildcard)
    broadcast_int = network_int | mascara_wildcard_int
    
    # Calcular primer y último host
    hostmin_int = network_int + 1
    hostmax_int = broadcast_int - 1
    
    # Calcular cantidad de hosts (2^(32-netmask) - 2)
    total_hosts = (2 ** (32 - netmask)) - 2
    
    # Determinar clase de red
    primer_octeto = (network_int >> 24) & 0xFF
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
    es_privada = False
    if (primer_octeto == 10) or \
       (primer_octeto == 172 and 16 <= ((network_int >> 16) & 0xFF) <= 31) or \
       (primer_octeto == 192 and ((network_int >> 16) & 0xFF) == 168):
        es_privada = True
    
    tipo_red = "Private Internet" if es_privada else "Public Internet"
    
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
            "decimal": int_a_ip(mascara_wildcard_int),
            "binario": int_a_binario(mascara_wildcard_int)
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
    
    print(f"Address:    {info['Address']['decimal']:<20} {info['Address']['binario']}")
    print(f"Netmask:    {info['Netmask']['decimal']:<20} {info['Netmask']['binario']}")
    print(f"Wildcard:   {info['Wildcard']['decimal']:<20} {info['Wildcard']['binario']}")
    print(f"=>")
    print(f"Network:    {info['Network']['decimal']:<20} {info['Network']['binario']}")
    print(f"HostMin:    {info['HostMin']['decimal']:<20} {info['HostMin']['binario']}")
    print(f"HostMax:    {info['HostMax']['decimal']:<20} {info['HostMax']['binario']}")
    print(f"Broadcast:  {info['Broadcast']['decimal']:<20} {info['Broadcast']['binario']}")
    print(f"Hosts/Net:  {info['Hosts/Net']:<20} {info['Clase']}, {info['Tipo']}")


# Ejemplo de uso
if __name__ == "__main__":
    # Ejemplo 1: igual que la imagen
    print("=== Ejemplo 1: 192.168.0.1/24 ===")
    imprimir_subred("192.168.0.1", 24)
    
    print("\n=== Ejemplo 2: 10.0.0.5/8 ===")
    imprimir_subred("10.0.0.5", 8)
    
    print("\n=== Ejemplo 3: 172.16.50.100/16 ===")
    imprimir_subred("172.16.50.100", 16)
    
    # También puedes usar la función y obtener el diccionario
    print("\n=== Usando la función directamente ===")
    info = calcular_subred("192.168.1.50", 26)
    print(f"Network: {info['Network']['decimal']}")
    print(f"HostMin: {info['HostMin']['decimal']}")
    print(f"HostMax: {info['HostMax']['decimal']}")
    print(f"Broadcast: {info['Broadcast']['decimal']}")
    print(f"Total Hosts: {info['Hosts/Net']}")
