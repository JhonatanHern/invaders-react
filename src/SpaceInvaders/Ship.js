import React, { Component } from 'react'

class Ship extends Component {
    render() {
        if (!this.props.data.alive) {
            return null
        }
        const left = this.props.data.col + '%'
        const top = this.props.data.row + '%'
        const transitionDuration = this.props.speed + 'ms'
        return (

            <div className='ship' style={{left,top,transitionDuration}}>
                
            </div>
        )
    }
}

export default Ship;