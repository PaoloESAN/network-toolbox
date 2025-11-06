import ipaddress

def ipv4_a_ipv6(ipv4):
    """
    Convierte una dirección IPv4 a su formato IPv6 (IPv4-mapped)
    Ejemplo: 192.168.1.1 -> ::ffff:192.168.1.1
    """
    try:
        # Crear objeto IPv4
        ip4 = ipaddress.IPv4Address(ipv4)
        
        # Convertir a formato IPv6 mapeado
        ip6 = ipaddress.IPv6Address('::ffff:' + str(ip4))
        
        return str(ip6)
    except ValueError as e:
        return f"Error: {e}"


def ipv6_a_ipv4(ipv6):
    """
    Convierte una dirección IPv6 mapeada de vuelta a IPv4
    Ejemplo: ::ffff:192.168.1.1 -> 192.168.1.1
    Solo funciona con direcciones IPv6 que son mapeos de IPv4
    """
    try:
        # Crear objeto IPv6
        ip6 = ipaddress.IPv6Address(ipv6)
        
        # Verificar si es un mapeo IPv4
        if ip6.ipv4_mapped:
            return str(ip6.ipv4_mapped)
        else:
            return "Esta dirección IPv6 no es un mapeo de IPv4"
    except ValueError as e:
        return f"Error: {e}"


def main():
    print("=== CONVERSOR IPv4 <-> IPv6 ===\n")
    
    while True:
        print("\nOpciones:")
        print("1. Convertir IPv4 a IPv6")
        print("2. Convertir IPv6 a IPv4")
        print("3. Salir")
        
        opcion = input("\nElige una opción (1-3): ")
        
        if opcion == "1":
            ipv4 = input("Ingresa la dirección IPv4: ")
            resultado = ipv4_a_ipv6(ipv4)
            print(f"\nIPv4: {ipv4}")
            print(f"IPv6: {resultado}")
            
        elif opcion == "2":
            ipv6 = input("Ingresa la dirección IPv6: ")
            resultado = ipv6_a_ipv4(ipv6)
            print(f"\nIPv6: {ipv6}")
            print(f"IPv4: {resultado}")
            
        elif opcion == "3":
            print("\n¡Hasta luego!")
            break
        else:
            print("\nOpción no válida. Intenta de nuevo.")



if __name__ == "__main__":

    main()