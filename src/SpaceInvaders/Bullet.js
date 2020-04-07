import React, { Component } from 'react';

class Bullet extends Component {
    render() {
        const left = this.props.data.col + '%'
        const top = this.props.data.row + '%'
        const transitionDuration = this.props.speed / 5 + 'ms'
        return (
            <span className='bullet' style={{left,top,transitionDuration}} />
        );
    }
}

export default Bullet;