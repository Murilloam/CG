var index = 1

var selectedObject = 'player'

animation = false

let barycentric = false

let isTextureOn = false

const config = { 
  translationX: 0,
  translationY: -20, 
  translationZ: 90,
  rotationX: degToRad(2),
  rotationY: degToRad(46.5),
  rotationZ: degToRad(0),
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
  cameraPositionX: 0,
  cameraPositionY: 0,
  cameraPositionZ: 130,
  targetX: 0,
  targetY: 0,
  targetZ: 0,

  animationX: 0,
  animationY: 0,
  animationZ: 0,

  Cube: () => {
    const updatedValues = sceneDescription.children.map(item => {
      let name = item.name

      item.translation = nodeInfosByName[name].trs.translation
      item.rotation = nodeInfosByName[name].trs.rotation

      return item
    })

    sceneDescription.children = [...updatedValues]

    sceneDescription.children.push({
      name: `player-${index}`,
      translation: [0, 0, 90],
      rotation: [ degToRad(2), degToRad(46.5), degToRad(0)],
      bufferInfo: cubeBufferInfo,
      vertexArray: cubeVAO,
      children: []
    });

    objectsToDraw = [];
    objects = [];
    nodeInfosByName = {};

    scene = makeNode(sceneDescription);
    
    listOfObjects.push(`object-${index}`)

    index += 1

    gui.destroy();
    gui = null

  }, 

  Pyramid: () => {
    const updatedValues = sceneDescription.children.map(item => {
      let name = item.name

      item.translation = nodeInfosByName[name].trs.translation
      item.rotation = nodeInfosByName[name].trs.rotation

      return item
    })

    sceneDescription.children = [...updatedValues]

    sceneDescription.children.push({
      name: `object-${index}`,
      translation: [0, 0, 80],
      rotation: [ degToRad(2), degToRad(46.5), degToRad(0)],
      bufferInfo: pyramidBufferInfo,
      vertexArray: pyramidVAO,
      children: []
    });

    objectsToDraw = [];
    objects = [];
    nodeInfosByName = {};

    scene = makeNode(sceneDescription);

    listOfObjects.push(`object-${index}`)

    index += 1

    gui.destroy();
    gui = null

  },

  Triangle: () => {
    const updatedValues = sceneDescription.children.map(item => {
      let name = item.name

      item.translation = nodeInfosByName[name].trs.translation
      item.rotation = nodeInfosByName[name].trs.rotation

      return item
    })

    sceneDescription.children = [...updatedValues]

    sceneDescription.children.push({
      name: `object-${index}`,
      translation: [0, 0, 90],
      rotation: [ degToRad(2), degToRad(46.5), degToRad(0)],
      bufferInfo: triangleBufferInfo,
      vertexArray: triangleVAO,
      children: []
    });

    objectsToDraw = [];
    objects = [];
    nodeInfosByName = {};

    scene = makeNode(sceneDescription);

    listOfObjects.push(`object-${index}`)

    index += 1

    gui.destroy();
    gui = null
  },

  Animation: () => {
    animation = !animation

    console.log(animation)
  }
}

var settings = {
  checkbox: true,
  selectedObject: "player",
  speed:0,
};

var gui = null

var listOfObjects = ['player']

const loadGUI = () => {

  gui = new dat.GUI({closeFolders: false}); 
  gui.closed = false;

  gui.add(settings, 'selectedObject', listOfObjects ).onChange(event => {
    selectedObject = event
   
    config.translationX = nodeInfosByName[selectedObject].trs.translation[0]
    config.translationY = nodeInfosByName[selectedObject].trs.translation[1]
    config.translationZ = nodeInfosByName[selectedObject].trs.translation[2]

    config.rotationX = nodeInfosByName[selectedObject].trs.rotation[0]
    config.rotationY = nodeInfosByName[selectedObject].trs.rotation[1]
    config.rotationZ = nodeInfosByName[selectedObject].trs.rotation[2]

    config.scaleX = nodeInfosByName[selectedObject].trs.scale[0]
    config.scaleY = nodeInfosByName[selectedObject].trs.scale[1]
    config.scaleZ = nodeInfosByName[selectedObject].trs.scale[2]

    gui.destroy();
    gui = null

  });

  objects.closed = false

  const createObjects = gui.addFolder('Criar Objetos')
  createObjects.add(config, "Cube");
  createObjects.add(config, "Pyramid");

  createObjects.closed = false

  const transformations = gui.addFolder('Transformações')
  transformations.add(config, "translationX", -15, 15, 0.5);
  transformations.add(config, "translationY", -15, 15, 0.5);
  transformations.add(config, "translationZ", -50, 120, 0.5);
  transformations.add(config, "rotationX", 0, 30, 0.5);
  transformations.add(config, "rotationY", 0, 30, 0.5);
  transformations.add(config, "rotationZ", 0, 30, 0.5);
  transformations.add(config, "scaleX", -10, 10, 0.5);
  transformations.add(config, "scaleY", -10, 10, 0.5);
  transformations.add(config, "scaleZ", -10, 10, 0.5);
  transformations.closed = false

  const camera = gui.addFolder('Câmera')
  camera.add(config, "cameraPositionX", -20, 20, 0.5);
  camera.add(config, "cameraPositionY", -20, 20, 0.5);
  camera.add(config, "cameraPositionZ", -20, 200, 0.5);
  camera.add(config, "targetX", -100, 100, 0.5);
  camera.add(config, "targetY", -100, 100, 0.5);
  camera.add(config, "targetZ", -100, 100, 0.5);
  camera.closed = false

}