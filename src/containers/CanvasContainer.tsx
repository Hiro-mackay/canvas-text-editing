import { ChangeEventHandler, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Cavnas } from '../components/Cavnas';
import { TextInput } from '../components/TextInput';
import { TextAdd } from '../components/TextAdd';

interface Text {
  id: number;
  inTime: number;
  outTime: number;
  deltaStart: number;
  element: PIXI.Text;
}

let delta = 0;

let id = 0;

let paused = true;
let firstTime = 0;
let currentTime = 0;
let deltaTime = 0;
let layers: Text[] = [];

let renderer: number[] = [];

export const CanvasContainer = () => {
  const [app, setApp] = useState<PIXI.Application>(null);
  const [text, setText] = useState('');
  const [textElement, setTextElement] = useState<PIXI.Text>(null);
  const [textElements, setTextElements] = useState<Text[]>([]);
  const [time, setTime] = useState(0);

  const initApp = (ref: HTMLCanvasElement) => {
    const _app = new PIXI.Application({
      view: ref,
      backgroundColor: 0x17184b
    });
    setApp(_app);
  };

  const inputValue = (inputText: string) => {
    if (!textElement) return;
    setText(inputText);
    textElement.text = inputText;

    textElement.texture.update();
  };

  function onSelected(event) {
    console.log(event.currentTarget);
    console.log(event.currentTarget.text);
    setTextElement(event.currentTarget);

    setText(event.currentTarget.text);
    this.data = event.data;
    this.dragging = true;
  }

  function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
  }

  function onDragMove() {
    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.parent);
      this.x = newPosition.x;
      this.y = newPosition.y;
    }
  }

  const addTextElement = () => {
    const style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fontWeight: 'bold',
      fill: '#ffffff',
      strokeThickness: 5,
      lineJoin: 'round'
    });
    const element = new PIXI.Text(`${id}`, style);

    element.x = 200;
    element.y = 200;

    element.interactive = true;
    element.buttonMode = true;
    element.anchor.set(0.5);

    element
      .on('pointerdown', onSelected)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove);

    const elm: Text = {
      id: id++,
      inTime: 0,
      outTime: 1000,
      deltaStart: delta,
      element: element
    };
    delta += 1000;
    setTextElements([...textElements, elm]);

    render(elm);
  };

  const update = (time: number) => {
    if (paused) {
      return;
    }

    if (firstTime === 0) {
      firstTime = time;
    }

    currentTime = time - firstTime + deltaTime;
    setTime(currentTime);

    layers = layers.filter((element) => {
      if (element.deltaStart + element.outTime < currentTime) {
        app.stage.removeChild(element.element);
        return false;
      }
      return true;
    });

    renderer = layers.map((layer) => layer.id);

    textElements.forEach((element) => {
      if (element.deltaStart + element.inTime <= currentTime && currentTime < element.deltaStart + element.outTime) {
        if (!renderer.includes(element.id)) {
          console.log('add');
          layers.push(element);
          renderer.push(element.id);
          app.stage.addChild(element.element);
        }
      }
    });
  };

  const _loop = (time) => {
    if (paused) return;
    update(time);
    requestAnimationFrame(_loop);
  };

  const loop = () => {
    requestAnimationFrame(_loop);
  };

  const play = () => {
    if (!paused) return;
    paused = false;
    loop();
  };

  const pause = () => {
    paused = true;
    firstTime = 0;
    deltaTime += currentTime;
    currentTime = 0;
    setTime(deltaTime);
  };

  const stop = () => {
    paused = true;
    firstTime = 0;
    currentTime = 0;
    setTime(currentTime);
    app.stage.removeChildren();

    layers = textElements.filter((elm) => {
      render(elm);
    });

    renderer = layers.map((layer) => {
      return layer.id;
    });
  };

  const render = (element: Text) => {
    if (element.deltaStart + element.inTime <= currentTime && currentTime < element.deltaStart + element.outTime) {
      app.stage.addChild(element.element);
      return true;
    }
    return false;
  };

  return (
    <div>
      <Cavnas initApp={initApp} />
      <p>{time}</p>
      <TextInput value={text} input={inputValue} />
      <TextAdd add={addTextElement} />

      <p className="p-5">
        <button onClick={play}>再生</button>
      </p>
      <p className="p-5">
        <button onClick={pause}>ポーズ</button>
      </p>
      <p className="p-5">
        <button onClick={stop}>停止</button>
      </p>
    </div>
  );
};
export default CanvasContainer;
