import os


def get_directories():
    path = os.getcwd() + "/static/assets"
    directories = sorted([i for i in os.listdir(path)])
    return directories


def text(year):
    path = os.getcwd() + "/static/assets/" + year
    with open(path + "/title.txt", 'r') as f:
        title = f.read()
    with open(path + "/text.txt", 'r') as f:
        content = f.read()
    return title, content


def img(dir):
    path = os.getcwd() + "/static/assets/" + dir + "/img"
    files = os.listdir(path)
    return files


def get_yearsdictionary():
    path = os.getcwd() + "/static/assets"
    years_dictionary = {}
    number = 1
    for i in get_directories():
        with open(path + "/" + i + "/" + i + ".txt", "r"):
            years_dictionary[i] = number
        number = number + 1
    return years_dictionary


def range(dictionary):
    range_data = [min(dictionary), max(dictionary)]
    return range_data
# .values for numbers
# .items for all
# nothing for default

# i in directories:
#    print("hello")
