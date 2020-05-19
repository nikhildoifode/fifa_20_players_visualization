from flask import Flask, render_template, request, jsonify
from utility import utilityFunctions


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


# @app.route("/displayVisualization")
# def displayCharts():
#     return jsonify(data = resultData)


if __name__ == "__main__":
    # global resultData
    # obj = utilityFunctions()
    # resultData = obj.getDataFromNew()
    app.run(debug = True)
