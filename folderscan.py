import os


def get_directories():
    path = os.getcwd() + "/static/assets"
    directories = sorted([i for i in os.listdir(path)])
    return directories


def years(directories):
    years_data = [min(directories), max(directories)]
    return years_data


def text(year):
    path = os.getcwd() + "/static/assets/" + year
    with open(path + "/title.txt", 'r') as f:
        title = f.read().splitlines()
    with open(path + "/text.txt", 'r') as f:
        content = f.read().splitlines()
    return title, content


print(years(get_directories()))

# i in directories:
#    print("hello")
