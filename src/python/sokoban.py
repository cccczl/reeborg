from reeborg_en import move, RUR

RUR.vis_robot.set_trace_style("none")


def up(n=1):
    RUR.CURRENT_WORLD.robots[0]._orientation = RUR.NORTH
    for _ in range(n):
        move()
haut = up


def down(n=1):
    RUR.CURRENT_WORLD.robots[0]._orientation = RUR.SOUTH
    for _ in range(n):
        move()
bas = down


def left(n=1):
    RUR.CURRENT_WORLD.robots[0]._orientation = RUR.WEST
    for _ in range(n):
        move()
gauche = left


def right(n=1):
    RUR.CURRENT_WORLD.robots[0]._orientation = RUR.EAST
    for _ in range(n):
        move()
droite = right
