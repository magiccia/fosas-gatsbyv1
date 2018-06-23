GEOGRAPHIES = municipales estatales

.PHONY: all geojson merge
all: geojson
geojson: $(patsubst %, data/source-geojson/%.json, $(GEOGRAPHIES))
merge: data/processed-geojson/municipales.json data/processed-geojson/municipales-centroids.json data/processed-geojson/estatales.json data/processed-geojson/estatales-centroids.json src/data/mxstates.json
tiles: $(patsubst %, data/mbtiles/%.mbtiles, $(GEOGRAPHIES)) $(patsubst %, data/mbtiles/%-centroids.mbtiles, $(GEOGRAPHIES))

data/source-geojson/%.json : data/shapefiles/areas_geoestadisticas_%.shp
	ogr2ogr $@ $< -f GeoJSON -t_srs "+proj=longlat +ellps=WGS84 +no_defs +towgs84=0,0,0"

# this is UGLY
data/processed-geojson/municipales.json data/processed-geojson/municipales-centroids.json data/processed-geojson/estatales.json data/processed-geojson/estatales-centroids.json src/data/mxstates.json : data/source-geojson/municipales.json data/source/mapas-data-concentrado.xlsx
	python scripts/merge_data.py


data/mbtiles/%.mbtiles : data/processed-geojson/%.json
	tippecanoe -o $@ -Z 3 -z 8 $<

data/mbtiles/%-centroids.mbtiles : data/processed-geojson/%-centroids.json
	tippecanoe -o $@ -Z 3 -z 8 $<
