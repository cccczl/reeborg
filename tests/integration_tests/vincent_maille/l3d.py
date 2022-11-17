for tour in range(20,1,-1):
    long = tour // 2 - tour // 20
    for _ in range(long):
        avance()
        while objet_ici() != [] :
             prend()
    tourne_a_gauche()