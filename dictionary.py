from folderscan import *
import os
years_dictionary = {}
path = os.getcwd() + "/static/assets"

for i in get_directories():
    with open(path + "/" + i + "/" + i + ".txt", "r") as f:
        year = f.read()
    print(year)
