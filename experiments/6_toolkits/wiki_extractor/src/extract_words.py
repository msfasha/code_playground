# wikipedia dump is placed in parent folder under text folder
import os

# Getting the current work directory (cwd)
currentdir = os.getcwd()

# wikipedia dump is placed in parent folder under text folder
textdir = os.path.abspath('../text')


def ProcessFile(f):
    print(f)


for dir in os.listdir(textdir):
    dir = os.path.join(textdir, dir)
    if os.path.isdir(dir):
        for f in os.listdir(dir):
            f = os.path.join(dir, f)
            if os.path.isfile(f):
                ProcessFile(f)
