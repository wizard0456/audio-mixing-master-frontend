// src/components/Preloader.js
import { Bars } from 'react-loader-spinner'

function Preloader() {
    return (
        <div className="preloader">
            <Bars
                height="80"
                width="80"
                color="#4CC800"
                ariaLabel="loading"
            />
        </div>
    )
}

export default Preloader