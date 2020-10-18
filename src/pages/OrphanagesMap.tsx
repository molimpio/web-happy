import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiArrowRight } from 'react-icons/fi'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

import mapMarkerImg from '../images/map-marker.svg'

import '../styles/pages/orphanages-map.css'
import mapIcon from "../utils/mapIcon";
import api from "../services/api";

interface Orfanato {
    id: number
    latitude: number
    longitude: number
    nome: string
}

function OrphanagesMap() {

    const [orfanatos, setOrfanatos] = useState<Orfanato[]>([])

    useEffect(() => {
        api.get('orfanatos').then(response => {
            setOrfanatos(response.data)
        })
    }, [])

    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarkerImg} alt="Happy"/>

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>

                <footer>
                    <strong>Piracicaba</strong>
                    <span>São Paulo</span>
                </footer>
            </aside>

            <Map
                center={[-22.7372871,-47.6750529]}
                zoom={15}
                style={{ width: '100%', height: '100%' }}
            >
                <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {/* <TileLayer 
                    url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                /> */}

                {orfanatos.map(orfanato => {
                    return (
                        <Marker
                            key={orfanato.id}
                            position={[orfanato.latitude, orfanato.longitude]}
                            icon={mapIcon}>

                            <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
                                {orfanato.nome}
                                <Link to={`/orphanages/${orfanato.id}`}>
                                    <FiArrowRight size={20} color="#FFF" />
                                </Link>
                            </Popup>
                        </Marker>
                    )
                })}
            </Map>

            <Link to="/orphanages/create" className="create-orphanage">
                <FiPlus size={32} color="#FFF" />
            </Link>
        </div>
    );
}

export default OrphanagesMap;
