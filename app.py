from flask import Flask
from flask import render_template
from flask import request
from folderscan import *

app = Flask(__name__)


@app.route("/")
def index():
   return render_template("index.html")

@app.route('/<yr>')
def story(yr):
    year_data = yr
    years_data = years(get_directories())
    title_data, text_data = text(year_data)
    images = img(year_data)
    directories = get_directories()
    return render_template("story.html", range=years_data, title=title_data, text=text_data,
                           img=images, year=year_data, dirs=directories)


if __name__ == '__main__':
    app.run()
