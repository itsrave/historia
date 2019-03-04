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
    yearsdict = get_yearsdictionary()
    range_data = range(get_yearsdictionary().values())
    title_data, text_data = text(position)
    images = img(position)
    directories = get_directories()
    range_pos = get_yearsdictionary().get(position)
    preindex = int(get_directories().index(position) - 1)
    nexindex = int(get_directories().index(position) + 1)
    try:
        pre = get_directories()[preindex]
    except IndexError:
        pre = "error"
    try:
        nex = get_directories()[nexindex]
    except IndexError:
        nex = min(get_directories())
    return render_template("story.html", range=range_data, title=title_data, text=text_data,
                           img=images, current=position, dirs=directories, years=yearsdict,
                           sliderpos=range_pos, previous=pre, next=nex)


@app.route('/error')
def error():
    return render_template('error.html')


@app.errorhandler(404)
def page_not_found():
    return render_template('error.html'), 500


@app.errorhandler(500)
def service_error():
    return render_template('error.html'), 500


if __name__ == '__main__':
    app.run()
