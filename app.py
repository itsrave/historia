from flask import Flask
from flask import render_template
from flask import send_from_directory
from folderscan import *

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico',
                               mimetype='image/vnd.microsoft.icon')


@app.route('/<position>')
def story(position):
    position = position
    range_data = range(get_yearsdictionary().values())
    title_data, text_data = text(get_yearsdictionary().get(position))
    images = img(position)
    directories = get_directories()
    return render_template("story.html", range=range_data, title=title_data, text=text_data,
                           img=images, current=position, dirs=directories)


if __name__ == '__main__':
    app.run()
