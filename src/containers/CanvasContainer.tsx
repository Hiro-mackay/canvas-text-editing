import { ChangeEventHandler, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Cavnas } from '../components/Cavnas';
import { TextInput } from '../components/TextInput';
import { TextAdd } from '../components/TextAdd';
import { Texture } from 'pixi.js';

interface Text {
  id: number;
  inTime: number;
  outTime: number;
  deltaStart: number;
  element: PIXI.Text;
}

let delta = 0;

let id = 0;

let layers: Text[] = [];
let currentTime = 0;
let renderer: number[] = [];

// Video Elementを作成し、video pathを読み込ませる
const loadVideoRef = (pathVideo: string) => {
  const video = document.createElement('video');
  video.crossOrigin = 'anonymous';
  video.preload = '';
  video.src = pathVideo;

  return video;
};

// ファイルからpathを生成する
const loadVideoPath = (file: File) => URL.createObjectURL(file);

const loadVideoElement = (file: File) => {
  const path = loadVideoPath(file);
  const video = loadVideoRef(path);
  return video;
};

const loadVideo = (file: File): Promise<HTMLVideoElement> => {
  const video = loadVideoElement(file);

  return new Promise((resolve, reject) => {
    video.play().then(() => {
      video.pause();
      resolve(video);
    });
  });
};

const loadVideoTexture = (video: HTMLVideoElement) => {
  return PIXI.Texture.from(video);
};

export const CanvasContainer = () => {
  const [app, setApp] = useState<PIXI.Application>(null);
  const [text, setText] = useState('');
  const [textElement, setTextElement] = useState<PIXI.Text>(null);
  const [textElements, setTextElements] = useState<Text[]>([]);
  const [time, setTime] = useState(0);
  const [sprite, setSprite] = useState<PIXI.Sprite>(null);
  const [video, setVideo] = useState<HTMLVideoElement>(null);

  const initApp = (ref: HTMLCanvasElement) => {
    const _app = new PIXI.Application({
      view: ref,
      backgroundColor: 0x333333
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
    setTime(time);

    layers = layers.filter((element) => {
      if (element.deltaStart + element.outTime < time) {
        app.stage.removeChild(element.element);
        return false;
      }
      return true;
    });

    renderer = layers.map((layer) => layer.id);

    textElements.forEach((element) => {
      if (element.deltaStart + element.inTime <= time && time < element.deltaStart + element.outTime) {
        if (!renderer.includes(element.id)) {
          console.log('add');
          layers.push(element);
          renderer.push(element.id);
          app.stage.addChild(element.element);
        }
      }
    });
  };

  const loop = () => {
    if (video.paused) return;

    currentTime = video.currentTime * 1000;
    update(currentTime);

    requestAnimationFrame(loop);
  };

  const play = () => {
    if (!video.paused) return;
    video.play();
    loop();
  };

  const pause = () => {
    video.pause();
  };

  const stop = () => {
    video.pause();
    video.currentTime = 0;
    currentTime = 0;
    sprite.texture.update();
    setTime(0);
    app.stage.removeChildren();

    layers = textElements.filter((elm) => {
      render(elm);
    });

    renderer = layers.map((layer) => {
      return layer.id;
    });

    app.stage.addChild(sprite);
  };

  const render = (element: Text) => {
    if (element.deltaStart + element.inTime <= currentTime && currentTime < element.deltaStart + element.outTime) {
      app.stage.addChild(element.element);
      return true;
    }
    return false;
  };

  const getVideoResource = (texture: Texture) => {
    // @ts-ignore
    return texture.baseTexture.resource.source as HTMLVideoElement;
  };

  const uploadVideo: ChangeEventHandler<HTMLInputElement> = async (e) => {
    console.log(e.currentTarget.files[0].name);
    const video = await loadVideo(e.currentTarget.files[0]);
    const texture = loadVideoTexture(video);

    const sprite = PIXI.Sprite.from(texture);
    sprite.width = app.view.width;
    sprite.height = app.view.height;

    app.stage.addChild(sprite);

    const v = getVideoResource(sprite.texture);
    v.pause();

    setVideo(v);
    setSprite(sprite);
  };

  return (
    <div>
      <Cavnas initApp={initApp} />
      <p>{time}</p>
      <TextInput value={text} input={inputValue} />
      <TextAdd add={addTextElement} />

      <p className="p-5">
        <input type="file" onChange={uploadVideo} />
      </p>

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
