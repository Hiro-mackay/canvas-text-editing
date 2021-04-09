import { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Cavnas } from '../components/Cavnas';
import { TextInput } from '../components/TextInput';
import { TextAdd } from '../components/TextAdd';

export const CanvasContainer = () => {
  const [app, setApp] = useState<PIXI.Application>(null);
  const [text, setText] = useState('');
  const [textElement, setTextElement] = useState<PIXI.Text>(null);

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

    app.stage.addChild(element);

    setTextElement(element);
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
