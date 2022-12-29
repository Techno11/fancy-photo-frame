export const Snow = {preset: "snow", background: {color: "#000"}, particles: {move: {speed: 1}, wobble: {distance: 10}}}
export const Stars = {preset: "stars", background: {color: "#000"}}
export const Links = {preset: "links", particles: {move: {speed: .25}, links: {color: "#00b"}}}
export const Birthday: any = {preset: "stars", background: {color: "#000"}, particles: {shape: {options: {char: {value: ['🎁', '🎉', '🎈', '🥳', '🎊'], font: "Verdana", fill: true}}, type: "char"}, size: {value: 15, random: {enable: true, minimumValue: 10}}}}
export const Halloween = {preset: "fire"};
export const Patriotic = {preset: "fireworks"};
export const Anniversary: any = {preset: "snow", background: {color: "#000"}, particles: {move: {speed: 1}, wobble: {distance: 10}, shape: {type: "heart"}, color: "#b0b"}}
export const Christmas: any = {preset: "stars", background: {color: "#000"}, particles: {shape: {options: {char: {value: ['🎄'], font: "Verdana", fill: true}}, type: "char"}, size: {value: 15, random: {enable: true, minimumValue: 10}}}}
export const Rain = {preset: "snow", background: {color: "#000"}, particles: {move: {speed: 10, straight: true}, shape: {type: "square"}, wobble: {enable: false}, opacity: {value: .5}, size: {value: 2}}}

export enum ParticleLoader {
  Snow,
  Stars,
  Halloween,
  Christmas,
  NewYears,
  Rain,
  Anniversary,
  Patriotic,
  Birthday,
  Links,
}

