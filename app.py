from flask import Flask
from flask import render_template
from flask import request
from folderscan import *

app = Flask(__name__)


@app.route('/')
def hello_world():
    year_data = "1953"
    years_data = (years(get_directories()))
    title_data, text_data = text(year_data)
    images = img(year_data)

    return render_template("story.html", range=years_data, title=title_data, text=text_data,
                           img=images, year=year_data)


@app.route('/<yr>')
def story(yr):
    year_data = yr
    years_data = (years(get_directories()))
    title_data, text_data = text(year_data)
    images = img(year_data)
    return render_template("story.html", range=years_data, title=title_data, text=text_data,
                           img=images, year=year_data)


if __name__ == '__main__':
    app.run()
