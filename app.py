from flask import Flask, render_template, request, jsonify
from utility import utilityFunctions
import numpy as np
import pandas as pd
import json

app = Flask(__name__)


@app.route("/")
def index():
    global df

    values = df['value_eur'].value_counts()
    values = pd.DataFrame({'value':values.index, 'count':values.values})
    values = values.to_dict(orient='records')
    values = json.dumps(values, indent=2)

    wages = df['wage_eur'].value_counts()
    wages = pd.DataFrame({'value':wages.index, 'count':wages.values})
    wages = wages.to_dict(orient='records')
    wages = json.dumps(wages, indent=2)

    dt = {'value_data':values}
    dt['wage_data'] = wages
    return render_template("index.html", data=dt)


# @app.route("/displayVisualization")
# def displayCharts():
#     return jsonify(data = resultData)


if __name__ == "__main__":

    # global resultData
    df = pd.read_csv("newPlayers.csv")
    # obj = utilityFunctions()
    # resultData = obj.setData()

    app.run(debug = True)
