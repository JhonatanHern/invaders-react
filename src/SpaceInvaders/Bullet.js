import React, { Component } from 'react';

class Bullet extends Component {
    render() {
        const left = this.props.data.col + '%'
        const top = this.props.data.row * 12.5 + '%'
        const transitionDuration = this.props.speed + 'ms'
        return (
            <span className='bullet' style={{left,top,transitionDuration}} />
        );
    }
}

export default Bullet;