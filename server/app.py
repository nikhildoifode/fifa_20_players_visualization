from flask import Flask, render_template, request, jsonify
from .utility import utilityFunctions


app = Flask(__name__)

@app.route("/displayVisualization")
def displayCharts():
    retData = []
    return jsonify(data = retData)


if __name__ == "__main__":
    app.run(debug = True)
