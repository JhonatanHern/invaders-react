import React, { Component } from 'react'

class Ship extends Component {
    render() {
        const left = this.props.data.col + '%'
        const top = this.props.data.row * 12 + '%'
        const transitionDuration = this.props.speed + 'ms'
        return (
            <div className='ship' style={{left,top,transitionDuration}}>
                
            </div>
        )
    }
}

export default Ship;