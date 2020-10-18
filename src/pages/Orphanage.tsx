import React, {useEffect, useState} from "react";
import { FiClock } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { useParams } from "react-router-dom"
import Sidebar from "../components/Sidebar";
import OpenOnWeekends from "../components/OpenOnWeekends"
import mapIcon from "../utils/mapIcon";
import api from "../services/api";
import Orfanato from "../models/Orfanato.model"
import "../styles/pages/orphanage.css";

interface RouteParams {
  id: string
}

export default function Orphanage() {
  const params = useParams<RouteParams>()
  const [orfanato, setOrfanato] = useState<Orfanato>()
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    api.get(`/orfanatos/${params.id}`).then(response => {
      setOrfanato(response.data)
    })
  }, [params.id])

  if (!orfanato) {
    return <p>Carregando...</p>
  }

  return (
    <div id="page-orphanage">

      <Sidebar />

      <main>
        <div className="orphanage-details">
          <img src={orfanato.images[activeImageIndex].url} alt={orfanato.nome} />

          <div className="images">
            {orfanato.images.map((image, index) => {
              return (
                  <button
                      key={image.id}
                      className={activeImageIndex === index ? "active" : ""}
                      type="button"
                      onClick={() => {
                        setActiveImageIndex(index)
                      }}>
                    <img src={image.url} alt={orfanato?.nome} />
                  </button>
              )
            })}
          </div>
          
          <div className="orphanage-details-content">
            <h1>{orfanato.nome}</h1>
            <p>{orfanato.description}</p>

            <div className="map-container">
              <Map
                  center={[-22.74039, -47.635195]}
                  zoom={16}
                  style={{ width: "100%", height: 280 }}
                  dragging={false}
                  touchZoom={false}
                  zoomControl={false}
                  scrollWheelZoom={false}
                  doubleClickZoom={false}
              >
                <TileLayer
                    url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker interactive={false} icon={mapIcon} position={[-22.74039, -47.635195]} />
              </Map>

              <footer>
                <a target="_blank" rel="noopener noreferrer"
                   href={`https://www.google.com/maps/dir/?api=1&destination=${orfanato.latitude}, ${orfanato.longitude}`}>
                  Ver rotas no Google Maps
                </a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orfanato.about}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {orfanato.open_hours}
              </div>

              {orfanato.open_on_weekens ? 
                <OpenOnWeekends isOpenOnWeekends={true} />
               : 
                <OpenOnWeekends isOpenOnWeekends={false} />
              }

            </div>

            {/*<button type="button" className="contact-button">*/}
            {/*  <FaWhatsapp size={20} color="#FFF" />*/}
            {/*  Entrar em contato*/}
            {/*</button>*/}
          </div>
        </div>
      </main>
    </div>
  );
}
