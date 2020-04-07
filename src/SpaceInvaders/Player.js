import React, { Component } from 'react';

class Player extends Component {
    render() {
        const left = this.props.data.col + '%'
        const top = this.props.data.row + '%'
        const transitionDuration = this.props.speed + 'ms'
        return (
            <div className='player' style={{left,top,transitionDuration}}>
            </div>
        );
    }
}

export default Player;