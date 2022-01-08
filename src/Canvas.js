import React, { Component } from 'react'
import Konva from 'konva'
import * as d3 from 'd3'

import Physics from './Physics'
import ContextMenu from './ContextMenu'
import Morph from './Morph'
import Parameterize from './Parameterize'
import Graph from './Graph'
import Event from './Event'

import pasition from 'pasition'
import svgPathBbox from 'svg-path-bbox'
import pathseg from 'pathseg'
import polyDecomp from 'poly-decomp'
import { pathParse, serializePath } from 'svg-path-parse'

window.Konva = Konva
window.d3 = d3
window.pasition = pasition
window.svgPathBbox = svgPathBbox
window.pathseg = pathseg
window.polyDecomp = polyDecomp
window.pathParse = pathParse
window.serializePath = serializePath

let currentShape

class Canvas extends Component {
  constructor(props) {
    super(props)

    this.state = {
      num: 0,
      lastLine: null,
      ball: null,
      line: null,
    }
  }

  componentDidMount() {
    window.Canvas = this

    this.stage = new Konva.Stage({
      container: 'konva',
      width: 2000,
      height: 2000
    })
    this.layer = new Konva.Layer()
    this.lineLayer = new Konva.Layer()
    this.graphLayer = new Konva.Layer()
    this.stage.add(this.layer)
    this.stage.add(this.lineLayer)
    this.stage.add(this.graphLayer)

    this.physics = new Physics()
    this.contextMenu = new ContextMenu()
    this.parameterize = new Parameterize()
    this.graph = new Graph()
    this.morph = new Morph()
    this.event = new Event()

    this.stage.on('contextmenu', (e) => {
      this.contextMenu.show(e)
    })
    this.stage.on('mousedown touchstart', (e) => {
      this.event.mouseDown(e)
    })
    this.stage.on('mousemove touchmove', (e) => {
      this.event.mouseMove(e)
    })
    this.stage.on('mouseup touchend', (e) => {
      this.event.mouseUp(e)
    })
    this.layer.on('dragmove', (e) => {
      this.event.dragMove(e)
    })
    this.layer.on('dragend', (e) => {
      this.event.dragEnd(e)
    })

    this.circle = new Konva.Circle({
      x: 0,
      y: 0,
      radius: 10,
      fill: 'red'
    })
    this.layer.add(this.circle)

    document.getElementById('parameterize-button')
    .addEventListener('click', (e) => {
      this.event.mode = 'parameterize'
    })

    document.getElementById('axis-button')
    .addEventListener('click', (e) => {
      this.event.mode = 'graph'
    })
  }

  render() {
    return (
      <div id="workarea">
        <button id="parameterize-button">Parameter Line</button>
        <button id="axis-button">Axis Line</button>
        <div id="konva" className="svgcanvas" style={{ position: 'relative' }}></div>
        <div id="menu" style={{ position: 'absolute', zIndex: 1000 }}>
          <div>
            <button id="mass-button">Add mass</button>
            <button id="static-button">Static body</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Canvas