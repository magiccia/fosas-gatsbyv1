import json
import random
import pandas as pd
import numpy as np

def merge_data():
    lookup = {}

    with open("mapas-data-concentrado.xlsx", "rb") as f:
        dfs = pd.read_excel(f, sheet_name=None)

    for sheetname, df in dfs.items():
        state_code = int(sheetname.split(' ')[0])
        pivot = pd.pivot_table(df, index=["municipio_code", "year"], fill_value=0, aggfunc=np.sum, values=["num_cuerpos", "num_fosas"])

        pivot_dict = pivot.reset_index().to_dict("records")

        final_dict = {}
        for row in pivot_dict:
            if not final_dict.get(row['municipio_code']):
                final_dict[row['municipio_code']] = {}

            try:
                final_dict[row['municipio_code']][int(row['year'])] = {
                    'num_cuerpos': int(row.get('num_cuerpos', 0)),
                    'num_fosas': int(row.get('num_fosas', 0)),
                }
            except ValueError:
                print(sheetname)

        lookup[state_code] = final_dict

    with open('mx.json') as f:
        data = json.load(f)
        for feature in data['objects']['municipalities']['geometries']:
            total_fosas = 0
            state_code = feature['properties']['state_code']
            mun_code = feature['properties']['mun_code']
            mun_data = lookup[state_code].get(mun_code)
            for year in range(2006, 2017):
                if mun_data and mun_data.get(year):
                    feature['properties'][str(year) + '_fosas'] = mun_data[year].get('num_fosas')
                    total_fosas += mun_data[year].get('num_fosas')
                else:
                    feature['properties'][str(year) + '_fosas'] = 0

            feature['properties']['total_fosas'] = total_fosas

    with open('../static/map-data/mx-topojson-merged.json', 'w') as f:
        json.dump(data, f)

if __name__ == '__main__':
    merge_data()
