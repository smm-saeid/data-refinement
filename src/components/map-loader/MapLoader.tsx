import { useState, useEffect } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayerGroup,
  useMapEvent,
  GeoJSON,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { iranStates } from './States';
import './MapLoader.css';
import worldGeoJson from '../../data/countries.geo.json';
import MarkerIcon from '@/assets/marker.png';
import { FORCE_COLORS } from '@/modules/inspection-operation/planning-aja/types';

export const getColoredMarker = (color: string) =>
  L.divIcon({
    className: '',
    html: `
      <div style="
        background-color:${color};
        width:18px;
        height:18px;
        border-radius:50%;
        border:2px solid white;
        box-shadow:0 0 4px rgba(0,0,0,0.6);
      "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

export default function MapLoader({
  allowSetNew = false,
  allowFullscreen = false,
  newCoordinate,
  setNewCoordinate,
  newCoordinateHandler,
  cancelHandler,
  locs_data = null,
}) {
  const [initialMap, setInitialMap] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showSearchRes, setShowSearchRes] = useState(false);
  const [searchResDetail, setSearchResDetail] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [renderMap, setRenderMap] = useState(true);
  const [map, setMap] = useState(null);
  const iran_data = {
    id: 0,
    name: 'ایران',
    enName: 'iran',
    latitude: '54.240102',
    longitude: '32.9061634',
    zoom: 6,
  };
  const [mapPosition, setMapPosition] = useState({
    coordinates: [Number(iran_data.longitude), Number(iran_data.latitude)],
    zoom: iran_data.zoom,
  });

  const [data, setData] = useState([]);
  const [filtering, setFiltering] = useState([]);
  const [activeFiltering, setActiveFiltering] = useState(false);

  const [searchData, setSearchData] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [newCoordinateController, setNewCoordinateController] = useState(false);

  const [currentProvince, setCurrentProvince] = useState(null);
  const [province, setProvince] = useState([]);
  const [currentUnit, setCurrentUnit] = useState(null);
  const [type, setType] = useState(['1', '2']);

  const [tileLayerStyle, setTileLayerStyle] = useState(
    'http://192.180.9.151:3650/api/maps/iran/256/{z}/{x}/{y}.png'
  );

  const marker = L.divIcon({
    className: 'map-icons',
    html: ReactDOMServer.renderToString(
      <img
        src={MarkerIcon}
        style={{
          position: 'absolute',
          height: '30px',
          transform: 'translate(0%, -50%)',
          color: 'dodgerblue',
        }}
      />
    ),
  });

  useEffect(() => {
    if (map) map.setView(mapPosition.coordinates, mapPosition.zoom);
  }, [mapPosition]);

  const resetMapView = () => {
    if (map) map.setView(mapPosition.coordinates, mapPosition.zoom);
    setMapPosition({
      coordinates: [Number(iran_data.longitude), Number(iran_data.latitude)],
      zoom: iran_data.zoom,
    });
    setCoordinates(null);
  };

  const resetFiltering = () => {
    setType(['1', '2']);
    setCurrentUnit(null);
    setCurrentProvince(null);
    resetMapView();
  };

  const showSearchHandler = () => {
    setShowSearch(!showSearch);
    setShowFilter(false);
    setActiveFiltering(false);
    setFiltering(data);
    resetFiltering();
  };

  const showFilterHandler = () => {
    setShowFilter(!showFilter);
    setShowSearch(false);
    setShowSearchRes(false);
    setSearchResDetail(false);
    setSearchData([]);
  };

  useEffect(() => {
    if (initialMap) {
      if (currentProvince || type) {
        setActiveFiltering(true);
        let dataFiltering = [];
        if (currentProvince) {
          data.map(item => {
            if (item.townshipCommonBaseDataId === +currentProvince) {
              dataFiltering.push(item);
            }
          });

          province.map(item => {
            if (item.id === +currentProvince) {
              Object.values(iranStates).find(stateItem => {
                if (stateItem.name.trim() == item.value.trim()) {
                  setMapPosition({
                    coordinates: [
                      Number(stateItem.longitude),
                      Number(stateItem.latitude),
                    ],
                    zoom: stateItem.zoom,
                  });
                }
              });
            }
          });
          setFiltering(dataFiltering);
        } else {
          dataFiltering = [...data];
        }

        const unitFiltering = [];
        if (currentUnit) {
          dataFiltering.map(unitItem => {
            if (unitItem.unitCommonBaseDataId === +currentUnit)
              unitFiltering.push(unitItem);
          });
          setFiltering(unitFiltering);
        }

        const typeFiltering = [];
        if (type && type.length > 0) {
          let typeData = [];
          if (unitFiltering && unitFiltering.length > 0) {
            typeData = [...unitFiltering];
          } else {
            typeData = [...dataFiltering];
          }
          type.filter(item => {
            if (item === '1') {
              typeData.filter(
                dataItem =>
                  dataItem.typeMedicalCommonBaseDataId === 6 &&
                  typeFiltering.push(dataItem)
              );
            } else {
              typeData.filter(
                dataItem =>
                  dataItem.typeMedicalCommonBaseDataId !== 6 &&
                  typeFiltering.push(dataItem)
              );
            }
            if (item === '2') {
              typeData.filter(
                dataItem =>
                  dataItem.typeMedicalCommonBaseDataId === 7 &&
                  typeFiltering.push(dataItem)
              );
            } else {
              typeData.filter(
                dataItem =>
                  dataItem.typeMedicalCommonBaseDataId !== 7 &&
                  typeFiltering.push(dataItem)
              );
            }
            typeFiltering && setFiltering(typeFiltering);
          });
        } else {
          setFiltering([]);
        }
      }
    } else {
      setInitialMap(true);
    }
  }, [currentProvince, type, currentUnit]);

  useEffect(() => {
    setRenderMap(true);
  }, [fullScreen, tileLayerStyle]);

  const resetCallback = () => {
    setSearchResDetail(false);
    setShowSearchRes(false);
    setNewCoordinate(null);
    setSearchData(null);
  };

  useEffect(() => {
    if (map) {
      const handleClick = e => {
        setNewCoordinateController(true);
        resetCallback();
        setShowSearch(false);
        setNewCoordinate([
          Number(e.latlng.lat) + 0.0001,
          Number(e.latlng.lng) + 0.0001,
        ]);
      };
      if (coordinates) map.setView(coordinates, 16);

      if (allowSetNew) {
        map.addEventListener('click', handleClick);
      } else {
        setNewCoordinate(null);
        setNewCoordinateController(false);
        map.removeEventListener('click', handleClick);
      }
      return () => {
        map.removeEventListener('click', handleClick);
      };
    }
  }, [map, coordinates, allowSetNew]);

  // searchBar fields
  const searchElements = [
    {
      type: 'text',
      label: 'نام بیمارستان:',
      name: 'hospitalName',
      colSize: { xs: 24, sm: 12, lg: 24 },
      onChange: ({ target }) => {
        if (target.value) {
          searchHandler(null);
          setSearchResDetail(false);
          setShowSearchRes(true);
        } else {
          setSearchResDetail(false);
          setShowSearchRes(false);
        }
      },
    },
  ];

  const searchHandler = event => {
    event && event.preventDefault();
    setSearchResDetail(false);
    setShowSearchRes(true);
    return false;
  };

  const show = record => {
    setCoordinates([
      Number(record.geoLocationWidth),
      Number(record.geoLocationLength),
    ]);
    setSearchResDetail(record);
    setShowSearchRes(false);
  };

  function Locater() {
    const mapp = useMapEvent({
      click(event) {
        const { lat, lng } = event?.latlng;
        console.log(lat, lng);
      },
    });
    return <></>;
  }


  const countryStyle = feature => {
    const isIran =
      feature.properties.ADMIN === 'Iran' ||
      feature.properties.name === 'Iran' ||
      feature.properties.ISO_A3 === 'IRN';

    return {
      fillColor: isIran ? '#1abc9c' : '#cccccc',
      color: '#666',
      fillOpacity: isIran ? 0 : 0.9, // 👈 fade others
    };
  };

  return (
    <div className={`map-bg ${fullScreen ? 'full-screen' : ''}`}>
      {renderMap && (
        <MapContainer
          center={mapPosition.coordinates}
          zoom={mapPosition.zoom}
          scrollWheelZoom={true}
          wheelDebounceTime={40}
          wheelPxPerZoomLevel={5000} // 👈 higher = slower zoom
          style={{ height: 'calc(100vh - 270px)' }}
          ref={setMap}
        >
          <Locater />
          <TileLayer
            attribution='&copy; <a href="#">MATNA</a><img'
            url={tileLayerStyle}
          />
          <GeoJSON data={worldGeoJson} style={countryStyle} />
          <LayerGroup>
            {allowSetNew && newCoordinate && (
              <Marker
                position={newCoordinate}
                icon={null}
                eventHandlers={{
                  mouseover: event => event.target.openPopup(),
                  mouseout: event => event.target.closePopup(),
                }}
              >
                <Popup className="popup-bg">
                  <h3 className="title">راهنما</h3>
                  <p>
                    با کلیک بر روی نقشه نشانه را دقیقا در محل مورد نظر قرار
                    دهید.
                  </p>
                </Popup>
              </Marker>
            )}

            {Array.isArray(locs_data) &&
              locs_data?.map(prov => {
                for (const item of Object.values(iranStates)) {
                  if (prov.provinceKey == item.enName) {
                    const color = FORCE_COLORS[String(prov.forceOrganizationUnitId)] ?? '#555';
                    return (
                      <Marker
                        position={[
                          Number(item.longitude) + (Math?.random() - 0.5) * 0.4,
                          Number(item.latitude) + (Math?.random() - 0.5) * 0.4,
                        ]}
                        icon={getColoredMarker(color)}
                        eventHandlers={
                          {
                            // mouseover: (event) => {
                            //   event.target.openPopup();
                            // },
                            // mouseout: (event) => event.target.closePopup(),
                            // click: (event) => {
                            //   console.log("hereee", event);
                            // },
                          }
                        }
                      >
                        <Popup className="popup-bg">
                          <h3 className="title">
                            {prov?.organizationUnitName}
                          </h3>
                        </Popup>
                      </Marker>
                    );
                  }
                }
              })}

            {activeFiltering
              ? filtering.map(
                  item =>
                    item.geoLocationWidth &&
                    item.geoLocationLength && (
                      <Marker
                        position={[
                          Number(item.geoLocationWidth),
                          Number(item.geoLocationLength),
                        ]}
                        icon={
                          // item?.typeMedicalCommonBaseDataId === 6
                          //   ? item?.unitCommonBaseDataId === 30 // نزاجا
                          //     ? zaminiIcon
                          //     : item?.unitCommonBaseDataId === 31 // نهاجا
                          //     ? havayiIcon
                          //     : item?.unitCommonBaseDataId === 32 // نپاجا
                          //     ? padafandIcon
                          //     : item?.unitCommonBaseDataId === 33 // ستاد آجا
                          //     ? setadIcon
                          //     : item?.unitCommonBaseDataId === 34 // ساحفاجا
                          //     ? hefazatIcon
                          //     : item?.unitCommonBaseDataId === 14 // نداجا
                          //     ? daryayiIcon
                          //     : hospitalIcon
                          //   : clinicIcon
                          null
                        }
                        eventHandlers={{
                          mouseover: event => {
                            event.target.openPopup();
                          },
                          mouseout: event => event.target.closePopup(),

                          click: event => {
                            console.log('hereee', item);
                            setCoordinates([
                              Number(item.geoLocationWidth),
                              Number(item.geoLocationLength),
                            ]);
                            setSearchResDetail(item);
                            setShowSearchRes(false);
                          },
                        }}
                      >
                        <Popup className="popup-bg">
                          <h3 className="title">
                            {item.typeMedicalCommonBaseDataName} {item.title}
                          </h3>
                        </Popup>
                      </Marker>
                    )
                )
              : data &&
                data.length > 0 &&
                data.map(
                  item =>
                    item.geoLocationWidth &&
                    item.geoLocationLength && (
                      <Marker
                        position={[
                          Number(item.geoLocationWidth),
                          Number(item.geoLocationLength),
                        ]}
                        icon={
                          // item?.typeMedicalCommonBaseDataId === 6
                          //   ? item?.unitCommonBaseDataId === 30 // نزاجا
                          //     ? zaminiIcon
                          //     : item?.unitCommonBaseDataId === 31 // نهاجا
                          //     ? havayiIcon
                          //     : item?.unitCommonBaseDataId === 32 // نپاجا
                          //     ? padafandIcon
                          //     : item?.unitCommonBaseDataId === 33 // ستاد آجا
                          //     ? setadIcon
                          //     : item?.unitCommonBaseDataId === 34 // ساحفاجا
                          //     ? hefazatIcon
                          //     : item?.unitCommonBaseDataId === 14 // نداجا
                          //     ? daryayiIcon
                          //     : hospitalIcon
                          //   : clinicIcon
                          null
                        }
                        eventHandlers={{
                          mouseover: event => {
                            event.target.openPopup();
                          },
                          mouseout: event => event.target.closePopup(),

                          click: event => {
                            console.log('hereee', item);
                            setCoordinates([
                              Number(item.geoLocationWidth),
                              Number(item.geoLocationLength),
                            ]);
                            setSearchResDetail(item);
                            setShowSearchRes(false);
                          },
                        }}
                      >
                        <Popup className="popup-bg">
                          <h3 className="title">
                            {item.typeMedicalCommonBaseDataName} {item.title}
                          </h3>
                        </Popup>
                      </Marker>
                    )
                )}
          </LayerGroup>
        </MapContainer>
      )}
      {newCoordinateController ? (
        <div className="map-search">
          <button
            type="button"
            className="search-btn"
            onClick={() => {
              newCoordinateHandler();
              setNewCoordinateController(false);
            }}
          >
            ذخیره نشانه
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setNewCoordinate(null);
              setNewCoordinateController(false);
              cancelHandler();
            }}
          >
            حذف نشانه
          </button>
        </div>
      ) : (
        <>
          {/* <div className={`map-filter ${showFilter ? "active" : ""}`}>
            <button type="button" className="btn-style dark" onClick={() => showFilterHandler()}>
              {showFilter ? <>بستن</> : <>فیلتر ها</>}
            </button>
          </div>
          <div className={`map-search ${showSearch ? "active" : ""}`}>
            <button type="button" className="btn-style dark" onClick={() => showSearchHandler()}>
              {showSearch ? <>بستن</> : <>جستجو</>}
            </button>
          </div> */}
          {allowFullscreen && (
            <div className={`map-fullscreen ${showSearch ? 'active' : ''}`}>
              <button
                type="button"
                className="btn-style dark"
                onClick={() => {
                  setFullScreen(!fullScreen);
                  setRenderMap(false);
                }}
              >
                {fullScreen ? <>بستن</> : <>تمام صفحه</>}
              </button>
              <button
                onClick={() => {
                  setTileLayerStyle(preState =>
                    preState ===
                    'http://192.180.9.151:3650/api/maps/satellite-hybrid/256/{z}/{x}/{y}.png'
                      ? 'http://192.180.9.151:3650/api/maps/iran/256/{z}/{x}/{y}.png'
                      : 'http://192.180.9.151:3650/api/maps/satellite-hybrid/256/{z}/{x}/{y}.png'
                  );
                  setRenderMap(false);
                }}
                className="tile-theme-btn"
                style={{ zIndex: 10 }}
              >
                تغییر نوع
              </button>
            </div>
          )}
        </>
      )}
      {!allowSetNew && showSearchRes && (
        <div className="search-res">
          <div className="d-flex">
            <button
              className="close-search"
              onClick={() => setShowSearchRes(!showSearchRes)}
            >
              بستن
            </button>
            <h3 className="title">نتیجه جستجو:</h3>
          </div>
          {/* <Table
            bordered
            dataSource={searchData}
            columns={columns}
            pagination={false}
          /> */}
        </div>
      )}
      {!allowSetNew && searchResDetail && (
        <div className="marker-info-bg">
          <div className="d-flex">
            <button
              className="close-search"
              onClick={() => {
                setSearchResDetail(false);
                resetMapView();
              }}
            >
              بعدی
            </button>
            <h3 className="title">
              {searchResDetail.typeMedicalCommonBaseDataName}{' '}
              {searchResDetail.title}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}
