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
        row: row * 10, // Y axis
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
    intervalIDs = []
    componentDidMount(){
        this.startLevel()
        this.intervalIDs.push(setInterval(this.move, this.props.tickSpeed))
        this.intervalIDs.push(setInterval(this.moveBullets, this.props.tickSpeed / 5))
        this.intervalIDs.push(setInterval(this.checkAllCollisions, this.props.tickSpeed / 5))
    }
    componentWillUnmount(){
        for (let index = 0; index < this.intervalIDs.length; index++) {
            clearInterval(this.intervalIDs[index])
        }
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
            canMoveRight = canMoveRight && (element.type === 'player' || !element.alive || element.col < MAP_SIZE - SHIP_SIZE)
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
            canMoveLeft = canMoveLeft && (element.type === 'player' || !element.alive || element.col > 0)
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
    checkColission = bullet => {
        if (bullet.type === 'player-bullet') {
            if (!bullet.alive) {
                return
            }
            for (let index = 0; index < this.state.map.length; index++) {
                const ship = this.state.map[index]
                if (
                    ship.alive &&
                    bullet.row <= ship.row + SHIP_SIZE / 2 &&
                    bullet.row >= ship.row - SHIP_SIZE / 2 &&
                    bullet.col <= ship.col + SHIP_SIZE / 2 &&
                    bullet.col >= ship.col - SHIP_SIZE / 2
                    ) {
                    console.log('collision')
                    ship.alive = false
                    this.setState({map: this.state.map})
                    return {...bullet, alive: false}
                }
                
            }
            return bullet
        } else {// enemy bullet
            return bullet
        }
    }
    checkAllCollisions = () => {
        this.setState({
            bullets: this.state.bullets.map(bullet => this.checkColission(bullet)).filter(bullet => bullet)
        })
    }
    moveBullets = () => {
        this.setState({
            bullets: this.state.bullets.map(bullet => {
                return {
                    ...bullet,
                    row: bullet.row + (bullet.type === 'player-bullet' ? UP : DOWN)
                }
            }).filter(bullet => bullet.row >= -1 && bullet.row < MAP_SIZE + 1)
        })
    }
    move = () => {
        if (this.state.direction === LEFT) {
            this.moveShipsLeft()
        }else{
            this.moveShipsRight()
        }
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
                        return obj.alive ? <Bullet data={obj} key={index} speed={this.props.tickSpeed} /> : null
                    })
                }
            </div>
        )
    }
}

export default SpaceInvaders;