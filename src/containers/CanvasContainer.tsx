import { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Cavnas } from '../components/Cavnas';
import { TextInput } from '../components/TextInput';
import { TextAdd } from '../components/TextAdd';

export const CanvasContainer = () => {
  const [app, setApp] = useState<PIXI.Application>(null);
  const [text, setText] = useState('');
  const [elements, setElements] = useState<PIXI.Text[]>([]);
  const [targetElement, setTargetElement] = useState<PIXI.Text>(null);

  const initApp = (ref: HTMLCanvasElement) => {
    const _app = new PIXI.Application({
      view: ref,
      backgroundColor: 0x17184b
    });
    setApp(_app);
  };

  const inputValue = (inputText: string) => {
    if (!targetElement) return;
    setText(inputText);
    targetElement.text = inputText;

    targetElement.texture.update();
  };

  function onSelected(event) {
    console.log(event.currentTarget)
    console.log(event.currentTarget.text)
    setTargetElement(event.currentTarget);
    setText(event.currentTarget.text);
    this.data = event.data;
    this.dragging = true;
  }

  function onDragStart(event) {
    this.data = event.data;
    this.alpha = 0.5;
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
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440,
      lineJoin: 'round'
    });
    const element = new PIXI.Text('入力してください', style);

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

    app.stage.addChild(element);

    setElements([...elements, element]);
  };

  return (
    <div>
      <Cavnas initApp={initApp} />
      <TextInput value={text} input={inputValue} />
      <TextAdd add={addTextElement} />
    </div>
  );
};
export default CanvasContainer;
