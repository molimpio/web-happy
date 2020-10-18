import React from "react"
import { FiInfo } from "react-icons/fi"
import '../styles/components/open-on-weekends.css'

interface OpenOnWeekendsProps {
    isOpenOnWeekends: boolean
}

function OpenOnWeekends({ isOpenOnWeekends }: OpenOnWeekendsProps) {
    return (
        <div className={isOpenOnWeekends ? "open-on-weekends" : "open-on-weekends dont-open"}>
            <FiInfo 
                size={32} 
                color={isOpenOnWeekends ? "#39CC83" : "#FF6690"} 
            />
                {isOpenOnWeekends ? "Atendemos" : "Não atendemos"} <br />
                fim de semana
        </div>
    )
}

export default OpenOnWeekends