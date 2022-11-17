for tour in range(20,1,-1):
    long = 9 if tour == 20 else tour // 2
    for _ in range(long):
        avance()
    tourne_a_gauche()