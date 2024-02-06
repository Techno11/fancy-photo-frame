import Home from "./views/Home";
import {useEffect, useState} from "preact/hooks";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type {Engine} from "@tsparticles/engine";
import * as PC from "./data/helpers/ParticleConfigs";
import {ParticleLoader} from "./data/helpers/ParticleConfigs";
import {useSocket} from "./data/hooks/useSocket";
import {Theme} from "./models/SocketMessage";
import {loadStarsPreset} from "@tsparticles/preset-stars";
import {loadSnowPreset} from "@tsparticles/preset-snow";
import {loadLinksPreset} from "@tsparticles/preset-links";
import {loadFirePreset} from "@tsparticles/preset-fire";
import {loadHeartShape} from "@tsparticles/shape-heart";
import {loadTextShape} from "@tsparticles/shape-text";
import {loadFireworksPreset} from "@tsparticles/preset-fireworks";
import {loadConfettiPreset} from "@tsparticles/preset-confetti";
import { loadFull } from "tsparticles";

export default function App() {

  const socket = useSocket();
  const [opts, setOpts] = useState<any>(PC.Links);
  const [loader, setLoader] = useState<ParticleLoader>(ParticleLoader.Links);
  const [particleInit, setParticleInit] = useState<boolean>(false);

  useEffect(() => {
    socket.removeListener("theme", handleTheme)
    socket.addListener("theme", handleTheme)
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setParticleInit(false);
    initParticlesEngine(async (engine) => {
      await initCustomParticles(engine);
      await loadFull(engine);
    })
  }, [loader]);

  const handleTheme = ({weatherTheme, greetingTheme}: {weatherTheme: "snow" | "rain" | "clear" | "windy", greetingTheme: Theme}) => {
    console.log("Handling theme change", weatherTheme, greetingTheme);
    if(greetingTheme === Theme.christmas) {
      if(loader === ParticleLoader.Christmas) return;
      setLoader(ParticleLoader.Christmas);
      setOpts(PC.Christmas);
    } else if(greetingTheme === Theme.anniversary) {
      if(loader === ParticleLoader.Anniversary) return;
      setLoader(ParticleLoader.Anniversary);
      setOpts(PC.Anniversary);
    } else if (greetingTheme === Theme.birthday) {
      if(loader === ParticleLoader.Birthday) return;
      setLoader(ParticleLoader.Birthday);
      setOpts(PC.Birthday);
    } else if (greetingTheme === Theme.halloween) {
      if(loader === ParticleLoader.Halloween) return;
      setLoader(ParticleLoader.Halloween);
      setOpts(PC.Halloween);
    } else if (greetingTheme === Theme.patriotic || greetingTheme === Theme.newYears) {
      if(loader === ParticleLoader.Patriotic) return;
      setLoader(ParticleLoader.Patriotic);
      setOpts(PC.Patriotic);
    } else if (weatherTheme === "snow") {
      if(loader === ParticleLoader.Snow) return;
      setLoader(ParticleLoader.Snow);
      setOpts(PC.Snow);
    } else if (weatherTheme === "rain") {
      if(loader === ParticleLoader.Rain) return;
      setLoader(ParticleLoader.Rain);
      setOpts(PC.Rain);
    } else if (weatherTheme === "clear" && greetingTheme === Theme.night) {
      if(loader === ParticleLoader.Stars) return;
      setLoader(ParticleLoader.Stars);
      setOpts(PC.Stars);
    } else if (weatherTheme === "clear" && (greetingTheme === Theme.day || greetingTheme === Theme.morning)) {
      if(loader === ParticleLoader.Links) return;
      setLoader(ParticleLoader.Links);
      setOpts(PC.Links);
    } else if (weatherTheme === "windy") {
      if(loader === ParticleLoader.Links) return;
      setLoader(ParticleLoader.Links);
      setOpts(PC.Links);
    } else {
      if(loader === ParticleLoader.Links) return;
      setLoader(ParticleLoader.Links);
      setOpts(PC.Links);
    }
  }

  const initCustomParticles = async (engine: Engine) => {
    switch (loader) {
      case ParticleLoader.Stars:
        await loadStarsPreset(engine);
        await engine.load({ id: "tsParticles", options: PC.Stars });
        break;
      case ParticleLoader.Snow:
        await loadSnowPreset(engine);
        await engine.load({ id: "tsparticles", options: PC.Snow });
        break;
      case ParticleLoader.Links:
        await loadLinksPreset(engine);
        await engine.load({ id: "tsparticles", options: PC.Links });
        break;
      case ParticleLoader.Halloween:
        await loadFirePreset(engine);
        await engine.load({ id: "tsparticles", options: PC.Halloween });
        break;
      case ParticleLoader.Anniversary:
        await loadHeartShape(engine);
        await loadSnowPreset(engine);
        await engine.load({ id: "tsparticles", options: PC.Anniversary });
        break;
      case ParticleLoader.Christmas:
        await loadTextShape(engine);
        await loadStarsPreset(engine);
        await engine.load({ id: "tsparticles", options: PC.Christmas });
        break;
      case ParticleLoader.Birthday:
        await loadTextShape(engine);
        await loadStarsPreset(engine);
        await engine.load({ id: "tsparticles", options: PC.Birthday });
        break;
      case ParticleLoader.Patriotic:
        await loadFireworksPreset(engine);
        await engine.load({ id: "tsparticles", options: PC.Patriotic });
        break;
      case ParticleLoader.Rain:
        await loadConfettiPreset(engine);
        await loadSnowPreset(engine);
        await engine.load({ id: "tsparticles", options: PC.Patriotic });
        break;
      default:
        await loadLinksPreset(engine);
        await engine.load({ id: "tsparticles", options: PC.Links });
        break;
    }
  }

  const style: any = {
    height: '99vh',
    width: '99vw',
    overflow: 'hidden',
    '*::-webkit-scrollbar': {
      width: '0'
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 0px rgba(0,0,0,0.00)'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,0)',
      outline: '0px solid black'
    }
  }

  return (
    <div style={style}>
      <div style={{zIndex: -1, position: "absolute"}}>
        {particleInit && loader && <Particles id="tsparticles" options={opts} />}
      </div>
      <Home/>
    </div>
  );
}
