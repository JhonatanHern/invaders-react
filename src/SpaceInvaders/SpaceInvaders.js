import React, { Component } from 'react'

import './invaders.css'

import Ship from './Ship'
import Player from './Player'
import Bullet from './Bullet'
import initialMap from './initialMap'

const MAP_SIZE = 100,
    SHIP_SIZE = 2,
    RIGHT = 1,
    LEFT = -1,
    UP = -1,
    DOWN = 1,
    RIGHT_KEY_CODE = 39,
    LEFT_KEY_CODE = 37,
    SPACEBAR_KEY_CODE = 32

const tileMapping = (tile,col,row) => {
    if (tile === 0) {
        return null
    }
    return {
        alive: true, // is the ship alive?
        col: col * 4, // X axis
        row, // Y axis
        type: tile === 1 ? 'ship' : 'player'
    }
}

class SpaceInvaders extends Component {
    state = {
        points: 0,
        map: [],
        bullets: [],
        direction: RIGHT
    }
    intervalID = null
    componentDidMount(){
        this.startLevel()
        console.log(this.props.tickSpeed)
        this.intervalID = setInterval(this.move, this.props.tickSpeed)
    }
    componentWillUnmount(){
        clearInterval(this.intervalID)
    }
    startLevel = () => {
        let map = initialMap.map(
            (row,rowIndex) => row.map(
                (tile,colIndex) => tileMapping(tile, colIndex, rowIndex)
            )
        )
        map = [].concat(...map)// turn 2d array into 1d array
        this.setState({
            map: map.filter(piece => piece)
        })
    }
    movePlayer = (direction) => {
        this.setState({
            map: this.state.map.map(ship =>
                ship.type === 'player' ? {...ship, col: ship.col + direction } : ship
            )
        })
    }
    playerFire = () => {
        const player = this.state.map.filter(ship => ship.type === 'player').pop()
        if (!player) {
            console.log('Player not found')
            return
        }
        const bullet = {
            type: 'player-bullet',
            alive: true,
            row: player.row,
            col: player.col + SHIP_SIZE
        }
        this.setState({bullets: [...this.state.bullets, bullet]})
    }
    keyHandle = e => {
        const player = this.state.map.filter(ship => ship.type === 'player').pop()
        if (!player) {
            console.log('Player not found')
            return
        }
        switch (e.keyCode){
            case RIGHT_KEY_CODE:
                if (player.col >= MAP_SIZE - 4) {
                    return
                }
                this.movePlayer(RIGHT)
                break
            case LEFT_KEY_CODE:
                if (player.col === 0) {
                    return
                }
                this.movePlayer(LEFT)
                break
            case SPACEBAR_KEY_CODE:
                this.playerFire()
                break
            default:
        }
    }
    moveShipsRight = () => {
        let canMoveRight = true
        for (let index = 0; index < this.state.map.length; index++) {
            const element = this.state.map[index];
            canMoveRight = canMoveRight && (element.type === 'player' || element.col < MAP_SIZE - 4)
        }
        if (!canMoveRight) {
            this.setState({direction: LEFT})
            return
        }
        const newMap = this.state.map.map(ship=>({
            ...ship,
            col: ship.col + (ship.type === 'ship' ? 1 : 0),
        }))
        this.setState({map:newMap})
    }
    moveShipsLeft = () => {
        let canMoveLeft = true
        for (let index = 0; index < this.state.map.length; index++) {
            const element = this.state.map[index];
            canMoveLeft = canMoveLeft && (element.type === 'player' || element.col > 0)
        }
        if (!canMoveLeft) {
            this.setState({direction: RIGHT})
            return
        }
        const newMap = this.state.map.map(ship=>({
            ...ship,
            col: ship.col - (ship.type === 'ship' ? 1 : 0),
        }))
        this.setState({map:newMap})
    }
    moveBullets = () => {
        this.setState({bullets: this.state.bullets.map(bullet => {
            return {
                ...bullet,
                row: bullet.row + (bullet.type === 'player-bullet' ? UP : DOWN)
            }
        })})
    }
    move = () => {
        if (this.state.direction === LEFT) {
            this.moveShipsLeft()
        }else{
            this.moveShipsRight()
        }
        this.moveBullets()
    }
    render() {
        return (
            <div
                id="space-invaders"
                style={this.props.style}
                onKeyDown={this.keyHandle}
                tabIndex="0"
                ref={elem=>{if(elem){elem.focus()}}}
                >
                {
                    this.state.map.map((obj,index) => {
                        return obj.type === 'ship' ? <Ship data={obj} key={index} speed={this.props.tickSpeed} /> : <Player data={obj} key={index} />
                    })
                }
                {
                    this.state.bullets.map((obj,index) => {
                        return <Bullet data={obj} key={index} speed={this.props.tickSpeed} />
                    })
                }
            </div>
        )
    }
}

export default SpaceInvaders;