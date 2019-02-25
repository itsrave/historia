from flask import Flask
from flask import render_template
from folderscan import *

app = Flask(__name__)


@app.route('/')
def hello_world():
    years_data = (years(get_directories()))
    title_data, text_data = text("1953")
    return render_template("story.html", range=years_data, title=title_data, text=text_data)


if __name__ == '__main__':
    app.run()
