import pandas as pd
import numpy as np
import unidecode

from sklearn.preprocessing import normalize, scale, MinMaxScaler
from sklearn.decomposition import PCA


class utilityFunctions(object):
    def __init__(self):
        return


    def readCSV(self):
        dataframe = pd.read_csv("players_20.csv")
        dataframe.fillna(0, inplace=True)

        dataframe['short_name'] = dataframe['short_name'].apply(lambda x: unidecode.unidecode(x))
        dataframe['nationality'] = dataframe['nationality'].apply(lambda x: unidecode.unidecode(x))
        dataframe['club'] = dataframe['club'].apply(lambda x: unidecode.unidecode(x))

        return dataframe


    def cleanData(self, data):
        modifiedData = data
        modifiedData = data.drop(['sofifa_id', 'short_name'], axis = 1)

        modifiedData.loc[modifiedData['work_rate'] == 'Low', 'work_rate'] = 0
        modifiedData.loc[modifiedData['work_rate'] == 'Medium', 'work_rate'] = 1
        modifiedData.loc[modifiedData['work_rate'] == 'High', 'work_rate'] = 2

        modifiedData = pd.get_dummies(modifiedData, columns=['team_position'], prefix=["Position_Type"])
        # modifiedData = pd.get_dummies(modifiedData, columns=['league'], prefix=["Leagu_Type"])
        modifiedData = pd.get_dummies(modifiedData, columns=['preferred_foot'], prefix=["Preferred_Foot_Type"])
        modifiedData = pd.get_dummies(modifiedData, columns=['nationality'], prefix=["Nationality_Type"])
        modifiedData = pd.get_dummies(modifiedData, columns=['club'], prefix=["Club_Type"])

        return modifiedData


    def noSampling(self, data):
        return data, [0] * data.shape[0]


    def PCA(self, data, sampleData, labels):
        pca = PCA()
        # data_changed = normalize(sampleData, norm='l2')
        # data_changed = scale(sampleData)
        data_changed = MinMaxScaler().fit_transform(sampleData)
        pca.fit(data_changed)
        transformedData = pca.transform(data_changed)

        pcaData = []
        for i, row in enumerate(transformedData):
            rowdata = {}
            rowdata['sofifaid'] = int(data.iloc[i][0])
            rowdata['playername'] = data.iloc[i][1]
            rowdata['xvalue'] = row[0]
            rowdata['yvalue'] = row[1]
            rowdata['cluster'] = labels[i]
            pcaData.append(rowdata)

        return pcaData


    def setData(self):
        data = self.readCSV()
        modifiedData = self.cleanData(data)

        # No sampling
        sampleData, clusterLabels = self.noSampling(modifiedData)
        resultData = self.PCA(data, sampleData, clusterLabels)

        return resultData


    def getDataFromNew(self):
        dataframe = pd.read_csv("newPlayers.csv")
        pcaData = []
        for _, row in dataframe.iterrows():
            rowdata = {}
            rowdata['sofifaid'] = int(row['sofifa_id'])
            rowdata['playername'] = row['short_name']
            rowdata['xvalue'] = float(row['pca0'])
            rowdata['yvalue'] = float(row['pca1'])
            rowdata['cluster'] = int(row['cluster'])
            pcaData.append(rowdata)

        return pcaData


# ut = utilityFunctions()
# data = ut.readCSV()
# modifiedData = ut.cleanData(data)
# sampleData, clusterLabels = ut.noSampling(modifiedData)
# resultData = ut.PCA(data, sampleData, clusterLabels)

# print(data)
