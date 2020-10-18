import React, {ChangeEvent, FormEvent, useState} from 'react'
import { Map, Marker, TileLayer } from 'react-leaflet'
import { FiPlus } from 'react-icons/fi'
import { LeafletMouseEvent } from 'leaflet'
import { useHistory } from 'react-router-dom'

import '../styles/pages/create-orphanage.css'

import Sidebar from '../components/Sidebar'
import mapIcon from '../utils/mapIcon'
import api from '../services/api'

let imagesIds: Number[] = []

export default function CreateOrphanage() {

  const history = useHistory()

  const [position, setPosition] = useState({lat: 0, lng: 0})
  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [instructions, setInstructions] = useState('')
  const [opening_hours, setOpeningHours] = useState('')
  const [open_on_weekends, setOpenOnWeekens] = useState(true)
  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

  function handleMapClick(event: LeafletMouseEvent) {
    setPosition(event.latlng)
    console.log(event.latlng)
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const selectedImages = Array.from(event.target.files)
      setImages(selectedImages)

      selectedImages.map(image => {
        const data = new FormData()
        data.append('image', image)
        api.post('images', data).then(response => imagesIds.push(response.data.id))
      })
      const selectedImagesPreview = selectedImages.map(image => URL.createObjectURL(image))
      setPreviewImages(selectedImagesPreview)
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const data = {
      latitude: position.lat,
      longitude: position.lng,
      nome: name, 
      about, 
      instructions,
      opening_hours,
      open_on_weekends,
      imagesIds: imagesIds
    }

    await api.post('orfanatos', data)
    imagesIds = []

    alert('Cadastro realizado com sucesso')

    history.push('/app')
  }

  return (
    <div id='page-create-orphanage'>
      <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className='create-orphanage-form'>
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-22.74039, -47.635195]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer
                  url='https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />

              {position.lat !== 0 &&
                (
                    <Marker
                        interactive={false}
                        icon={mapIcon}
                        position={[position.lat, position.lng]}
                    />
                )
              }
            </Map>

            <div className='input-block'>
              <label htmlFor='name'>Nome</label>
              <input id='name' value={name} onChange={event => setName(event.target.value)}/>
            </div>

            <div className='input-block'>
              <label htmlFor='about'>Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id='name' maxLength={300} value={about} onChange={event => setAbout(event.target.value)} />
            </div>

            <div className='input-block'>
              <label htmlFor='images'>Fotos</label>

              <div className='images-container'>
                {previewImages.map((image, key) => {
                  return (
                      <img key={key} src={image} alt={name} />
                  )
                })}
                <label htmlFor='image[]' className='new-image'>
                  <FiPlus size={24} color='#15b6d6' />
                </label>
              </div>

              <input multiple onChange={handleSelectImages} type='file' id='image[]'/>

            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className='input-block'>
              <label htmlFor='instructions'>Instruções</label>
              <textarea id='instructions' value={instructions} onChange={event => setInstructions(event.target.value)}/>
            </div>

            <div className='input-block'>
              <label htmlFor='opening_hours'>Horário de funcionamento</label>
              <input id='opening_hours' value={opening_hours} onChange={event => setOpeningHours(event.target.value)}/>
            </div>

            <div className='input-block'>
              <label htmlFor='open_on_weekends'>Atende fim de semana</label>

              <div className='button-select'>
                <button
                    type='button'
                    className={open_on_weekends ? 'active' : ''}
                    onClick={() => setOpenOnWeekens(true)}
                >
                  Sim
                </button>

                <button
                    type='button'
                    className={!open_on_weekends ? 'active' : ''}
                    onClick={() => setOpenOnWeekens(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className='confirm-button' type='submit'>
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}