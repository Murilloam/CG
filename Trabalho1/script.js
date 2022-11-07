var programInfo
var scene
var texture
var programInfoTexture

var objectsToDraw = [];
var objects = [];
var nodeInfosByName = {};

function makeNode(nodeDescription) {
    var trs = new TRS();
    var node = new Node(trs);
  
    nodeInfosByName[nodeDescription.name] = {
      trs: trs,
      node: node,
    };
  
    trs.translation = nodeDescription.translation || trs.translation;
    trs.rotation = nodeDescription.rotation || trs.rotation;
  
    if (nodeDescription.draw !== false) {
      
        node.drawInfo = {
            uniforms: {
                // u_colorOffset: [0, 0, 0.6, 0],
                // u_colorMult: [0.4, 0.4, 0.4, 1],
            },
            programInfo: programInfo,
            bufferInfo: nodeDescription.bufferInfo,
            vertexArray: nodeDescription.vertexArray,
        };
        objectsToDraw.push(node.drawInfo);
        objects.push(node);
    }
  
    makeNodes(nodeDescription.children).forEach(function(child) {
        child.setParent(node);
      });
  
    return node;
  }
  
  function makeNodes(nodeDescriptions) {
    return nodeDescriptions ? nodeDescriptions.map(makeNode) : [];
  }

  function main() {

    const initialize = initializeWebgl()

    const { gl } = initialize
  
    programInfo = initialize.programInfo
    programInfoTexture = twgl.createProgramInfo(gl, [vst, fst])

    const arrayCube = {
        position: { numComponents: 3, data: cubeFormat.position, },
        indices:{ numComponents: 3, data: cubeFormat.indices, },
        color: { numComponents: 4, data: cubeFormat.color, },
      };

    const arrayPyramid = {
      position: { numComponents: 3, data: pyramidFormat.position, },
      indices:{ numComponents: 3, data: pyramidFormat.indices, },
      color: { numComponents: 4, data: pyramidFormat.color, },
      };

    const arrayTriangle = {
      position: { numComponents: 3, data: triangleFormat.position, },
      indices:{ numComponents: 3, data: triangleFormat.indices, },
      color: { numComponents: 4, data: triangleFormat.color, },
      };

      arrayCube.normal = calculateNormal(cubeFormat.position, cubeFormat.indices);
      arrayPyramid.normal = calculateNormal(pyramidFormat.position, pyramidFormat.indices)
      arrayTriangle.normal = calculateNormal(triangleFormat.position, triangleFormat.indices)

      console.log(arrayCube)

      cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, arrayCube);
      pyramidBufferInfo = twgl.createBufferInfoFromArrays(gl,arrayPyramid);
      triangleBufferInfo = twgl.createBufferInfoFromArrays(gl, arrayTriangle)

      cubeVAO = twgl.createVAOFromBufferInfo(gl, programInfo, cubeBufferInfo);
      pyramidVAO = twgl.createVAOFromBufferInfo(gl, programInfo, pyramidBufferInfo);
      triangleVAO = twgl.createVAOFromBufferInfo(gl, programInfo, triangleBufferInfo)

      texture = twgl.createTextures(gl, {clover: {src: "texture.png"}})

      const fieldOfViewRadians = degToRad(60);

    sceneDescription = {
        name: "Center of the world",
          draw: false,
          children: [
            {
              name: "object-0",
              draw: true,
              translation: [0, 0, 90],
              rotation: [degToRad(0), degToRad(0), degToRad(0)],
              bufferInfo: cubeBufferInfo,
              vertexArray: cubeVAO,
              children: [],
            }
        ]
      }

    scene = makeNode(sceneDescription); //*

    requestAnimationFrame(drawScene);
    loadGUI()

    function drawScene(time) {
        time = time * 0.05;

        if (gui == null)
            loadGUI()

        twgl.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.75, 0.85, 0.8, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.disable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        // Compute the projection matrix
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 200);

        // Compute the camera's matrix using look at.
        const cameraPosition = [config.cameraPositionX, config.cameraPositionY, config.cameraPositionZ];
        const target = [config.targetX, config.targetY, config.targetZ];
        const up = [0, 1, 0];

        const cameraMatrix = m4.lookAt(cameraPosition, target, up);
        const viewMatrix = m4.inverse(cameraMatrix);
        const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

        computeMatrix(nodeInfosByName[selectedObject], config)

        nodeInfosByName[selectedObject].trs.rotation[1] = degToRad(time)

        // Update all world matrices in the scene graph
        scene.updateWorldMatrix();

        // Compute all the matrices for rendering
        objects.forEach(function(object) {
          object.drawInfo.uniforms.u_matrix = m4.multiply(viewProjectionMatrix, object.worldMatrix);

          object.drawInfo.uniforms.u_world = m4.multiply(object.worldMatrix, m4.yRotation(degToRad(0)));
  
          object.drawInfo.uniforms.u_worldViewProjection = m4.multiply(viewProjectionMatrix, object.worldMatrix);
  
          object.drawInfo.uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(object.worldMatrix));

          object.drawInfo.uniforms.u_color = [0.2, 1, 0.2, 1]
          // object.drawInfo.uniforms.u_color = [10.3, -5, 0.2, 1]

          object.drawInfo.uniforms.u_lightWorldPosition = [0, 0, 100]

          object.drawInfo.uniforms.u_viewWorldPosition = cameraPosition

          object.drawInfo.uniforms.u_shininess = 300

          object.drawInfo.uniforms.u_lightColor = [1, 0.6, 0.6]

          object.drawInfo.uniforms.u_specularColor = [2, 0.6, 0.6]
        });

        // ------ Draw the objects --------
        twgl.drawObjectList(gl, objectsToDraw);

        requestAnimationFrame(drawScene); //*
    }
  }

  main();