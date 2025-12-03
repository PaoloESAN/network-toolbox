import sys
import json

def ip_a_int(ip_str):
    octetos = ip_str.split('.')
    
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
    octeto1 = numero // (256**3)
    resto = numero % (256**3)
    
    octeto2 = resto // (256**2)
    resto = resto % (256**2)
    
    octeto3 = resto // 256
    octeto4 = resto % 256
    
    return f"{octeto1}.{octeto2}.{octeto3}.{octeto4}"


def int_a_binario(numero):
    binario = bin(numero)[2:].zfill(32)
    
    grupo1 = binario[0:8]
    grupo2 = binario[8:16]
    grupo3 = binario[16:24]
    grupo4 = binario[24:32]
    
    return f"{grupo1}.{grupo2}.{grupo3}.{grupo4}"


def calcular_mascara(netmask):
    bits_red = 2**netmask - 1
    bits_host = 32 - netmask
    mascara = bits_red * (2**bits_host)
    
    return mascara


def calcular_subred(ip, netmask):

    ip_int = ip_a_int(ip)
    
    if ip_int is None:
        return None
    
    mascara_int = calcular_mascara(netmask)
    
    wildcard_int = (2**32 - 1) - mascara_int
    
    network_int = ip_int & mascara_int
    
    broadcast_int = network_int | wildcard_int
    
    bits_host = 32 - netmask
    
    if netmask == 32:
        total_hosts = 1
        hostmin_int = network_int
        hostmax_int = network_int
    elif netmask == 31:
        total_hosts = 2
        hostmin_int = network_int
        hostmax_int = broadcast_int
    else:
        total_hosts = (2 ** bits_host) - 2
        hostmin_int = network_int + 1
        hostmax_int = broadcast_int - 1
    
    octetos_network = int_a_ip(network_int).split('.')
    primer_octeto = int(octetos_network[0])
    
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
    
    octeto2_network = int(octetos_network[1])
    
    es_privada = False
    if primer_octeto == 10:
        es_privada = True
    elif primer_octeto == 172 and 16 <= octeto2_network <= 31:
        es_privada = True
    elif primer_octeto == 192 and octeto2_network == 168:
        es_privada = True
    
    if es_privada:
        tipo_red = "Private Internet"
    else:
        tipo_red = "Public Internet"

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


def calcular_subredes(ip, netmask_original, nueva_mascara):
    
    if nueva_mascara == netmask_original:
        return None, "La nueva máscara debe ser diferente a la máscara original"
    
    if nueva_mascara < 1 or nueva_mascara > 32:
        return None, "La nueva máscara debe estar entre 1 y 32"
    
    # Obtener la red base
    ip_int = ip_a_int(ip)
    
    if nueva_mascara > netmask_original:
        mascara_original = calcular_mascara(netmask_original)
        network_base = ip_int & mascara_original
        
        bits_subredes = nueva_mascara - netmask_original
        num_subredes = 2 ** bits_subredes
        
        bits_host_nueva = 32 - nueva_mascara
        tamaño_subred = 2 ** bits_host_nueva
        
        subredes_lista = []
        for i in range(num_subredes):
            subred_network = network_base + (i * tamaño_subred)
            info = calcular_subred(int_a_ip(subred_network), nueva_mascara)
            if info:
                subredes_lista.append({
                    "numero": i + 1,
                    "network": info['Network']['decimal'],
                    "network_binary": info['Network']['binario'],
                    "hostmin": info['HostMin']['decimal'],
                    "hostmin_binary": info['HostMin']['binario'],
                    "hostmax": info['HostMax']['decimal'],
                    "hostmax_binary": info['HostMax']['binario'],
                    "broadcast": info['Broadcast']['decimal'],
                    "broadcast_binary": info['Broadcast']['binario'],
                    "hosts_net": info['Hosts/Net'],
                    "clase": info['Clase']
                })
        
        return subredes_lista, num_subredes, "subnet"
    else:
        mascara_nueva = calcular_mascara(nueva_mascara)
        network_supernet = ip_int & mascara_nueva
        
        info = calcular_subred(int_a_ip(network_supernet), nueva_mascara)
        if info:
            supernet_info = {
                "network": info['Network']['decimal'],
                "network_binary": info['Network']['binario'],
                "netmask": info['Netmask']['decimal'],
                "netmask_binary": info['Netmask']['binario'],
                "wildcard": info['Wildcard']['decimal'],
                "wildcard_binary": info['Wildcard']['binario'],
                "hostmin": info['HostMin']['decimal'],
                "hostmin_binary": info['HostMin']['binario'],
                "hostmax": info['HostMax']['decimal'],
                "hostmax_binary": info['HostMax']['binario'],
                "broadcast": info['Broadcast']['decimal'],
                "broadcast_binary": info['Broadcast']['binario'],
                "hosts_net": info['Hosts/Net'],
                "clase": info['Clase'],
                "tipo": info['Tipo']
            }
            return supernet_info, 1, "supernet"


if __name__ == "__main__":
    
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Uso: python mascaras-ips.py <ip> <netmask> [subredes]"}))
        sys.exit(1)
    
    ip = sys.argv[1]
    netmask = int(sys.argv[2])
    nueva_mascara = int(sys.argv[3]) if len(sys.argv) > 3 else None
    
    octetos = ip.split('.')
    if len(octetos) != 4:
        print(json.dumps({"error": "La IP debe tener 4 números (ej: 192.168.0.1)"}))
        sys.exit(1)
    
    if netmask < 1 or netmask > 32:
        print(json.dumps({"error": "La máscara debe estar entre 1 y 32"}))
        sys.exit(1)
    
    if nueva_mascara is not None:
        if nueva_mascara == netmask:
            print(json.dumps({"error": "La nueva máscara debe ser diferente a la máscara original"}))
            sys.exit(1)
        if nueva_mascara < 1 or nueva_mascara > 32:
            print(json.dumps({"error": "La nueva máscara debe estar entre 1 y 32"}))
            sys.exit(1)
    
    info = calcular_subred(ip, netmask)
    
    if info is None:
        print(json.dumps({"error": "IP inválida"}))
        sys.exit(1)
    
    resultado = {
        "address": info['Address']['decimal'],
        "address_binary": info['Address']['binario'],
        "netmask": info['Netmask']['decimal'],
        "netmask_binary": info['Netmask']['binario'],
        "wildcard": info['Wildcard']['decimal'],
        "wildcard_binary": info['Wildcard']['binario'],
        "network": info['Network']['decimal'],
        "network_binary": info['Network']['binario'],
        "hostmin": info['HostMin']['decimal'],
        "hostmin_binary": info['HostMin']['binario'],
        "hostmax": info['HostMax']['decimal'],
        "hostmax_binary": info['HostMax']['binario'],
        "broadcast": info['Broadcast']['decimal'],
        "broadcast_binary": info['Broadcast']['binario'],
        "hosts_net": info['Hosts/Net'],
        "clase": info['Clase'],
        "tipo": info['Tipo']
    }
    
    if nueva_mascara is not None:
        calc_resultado, num, tipo_calc = calcular_subredes(ip, netmask, nueva_mascara)
        if calc_resultado is None:
            print(json.dumps({"error": num}))
            sys.exit(1)
        
        resultado["nueva_mascara"] = nueva_mascara
        resultado["tipo_calculo"] = tipo_calc
        
        if tipo_calc == "subnet":
            resultado["subredes"] = calc_resultado
            resultado["total_subredes"] = num
        else:  # supernet
            resultado["supernet"] = calc_resultado
            resultado["total_subredes"] = 1
    
    print(json.dumps(resultado))
