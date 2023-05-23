(function() {
    let scene,  
      renderer,
      camera,
      model,                              
      neck,                               
      head,
      torso,                                                
      mixer,                              
      idle,
      click_anim,                               
      clock = new THREE.Clock(),
      loader,
      fileAnimations,
      currentlyAnimating = false,    
      raycaster = new THREE.Raycaster();

      const modelPath = 'animationModels/pets/pixelDog.glb';
      const dogBowlPath = 'animationModels/pets/bowl.glb';
      const naturePrefixPath = 'animationModels/nature/';
      const housePrefixPath = 'animationModels/house/';

    init(); 


    function onModelLoad(gltf)
    {
        model = gltf.scene;
        fileAnimations = gltf.animations;

        model.traverse(o => {
            if (o.isMesh) {
              o.castShadow = true;
              o.receiveShadow = true;
            }
            if(o.isBone){
                switch(o.name)
                {
                    case 'Neck1':
                        neck = o;
                    break;

                    case 'Head':
                        head = o;
                    break;

                    case 'Torso3':
                        torso = o;
                    break;
                }
            }
            
          });

        model.scale.set(3, 3, 3);

        model.position.y = -11;
        model.rotation.y = 0.3;
    
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        console.log(fileAnimations);

        let idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'Idle');

        idle = mixer.clipAction(idleAnim);
        idle.play();

        click_anim = mixer.clipAction(THREE.AnimationClip.findByName(fileAnimations, 'Attack'));
    }

    function createPathStrings(filename) {
        const basePath = "textures/clouds/";
        const baseFilename = basePath + filename;
        const fileType = ".jpg";
        const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
        const pathStings = sides.map(side => {
            return baseFilename + "_" + side + fileType;
        });
        console.log(pathStings)
        return pathStings;
    }

    //function to create the floor,sky
    function loadBackground()
    {
        let groundTexture = new THREE.TextureLoader().load( 'textures/Grass_01.png' );
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set( 10000, 10000 );

        const normalTexture = new THREE.TextureLoader().load(
            'textures/Grass_01_Nrm.png'
        )

        let groundMaterial = new THREE.MeshStandardMaterial( { map: groundTexture } );

        let floorMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 10000, 10000 ), groundMaterial );
        floorMesh.rotation.x = -0.5 * Math.PI; 
        floorMesh.receiveShadow = true;
        floorMesh.position.y = -11;
        floorMesh.normalTexture = normalTexture;
        scene.add( floorMesh );

        let ctl = new THREE.CubeTextureLoader();
        let cubeTexture = ctl.load(createPathStrings('bluecloud'));
        scene.background = cubeTexture;
    }

    function createModel(gltf,scale,x,y,z,randomness)
    {
        model = gltf.scene.clone();
        model.traverse(o => {
            if (o.isMesh) {

              o.castShadow = false;
              o.receiveShadow = false;
            }
          });

        model.scale.set(scale,scale,scale);
        model.position.set(x + randomness,y,z + randomness*2);
        return model;

    }

    function loadNature()
    {
        let randomMove;
        loader.load(
            naturePrefixPath + 'tree_oak.glb',
            function(gltf) {

                for (let x = -40; x < 0; x = x +10) {
                    randomMove = Math.floor(Math.random() * 5 );
                    scene.add(createModel(gltf,15,x,-7.5,-13,randomMove));   
                }
            }
        );

        loader.load(
            naturePrefixPath + 'tree_pineSmallA.glb',
            function(gltf) {
                for (let x = -70; x <= -10; x = x +10) {
                    randomMove = Math.floor(Math.random() * 5 );
                    scene.add(createModel(gltf,15,x,-7.5,-40,randomMove));

                }
            }
        );

        loader.load(
            naturePrefixPath + 'path_stone.glb',
            function(gltf) {

                let model = createModel(gltf,9,-25,-10.5,-10,0);
                model.rotation.y = -0.4 * Math.PI;
                scene.add(model);

                model = createModel(gltf,9,-20,-10.5,2,0);
                model.rotation.y = -0.4 * Math.PI;
                scene.add(model);

                model = createModel(gltf,8,-16,-10.5,12,0);
                model.rotation.y = -0.4 * Math.PI;
                scene.add(model);
            }
        );

        loader.load(
            naturePrefixPath + 'grass_large.glb',
            function(gltf) {
                for (let x = -45; x <= -30; x = x +5) {
                    randomMove = Math.floor(Math.random() * (2) - 2)
                    let model = createModel(gltf,20,x,-7,-12,0);
                    scene.add(model);
                }

                for (let x = -17; x <= 2; x = x +5) {
                    randomMove = Math.floor(Math.random() * (2) - 2)
                    let model = createModel(gltf,20,x,-7,-12,0);
                    scene.add(model);
                }

            }
        );
    }

    function loadHouse()
    {
        loader.load(
            housePrefixPath + 'house_type03.glb',
            function(gltf) {
                let model = createModel(gltf,20,20,-5,-10,0);
                model.rotation.y = -0.1 * Math.PI;
                scene.add(model);
            }
        );

        loader.load(
            housePrefixPath + 'path_tilesLong.glb',
            function(gltf) {
                let model = createModel(gltf,20,9.7,-5,9,0);
                model.rotation.y = -0.1 * Math.PI;
                model.scale.set(20,20,40);
                scene.add(model);
                    
            }
        );
    }

    function loadButtons()
    {
        let feedBtn = document.getElementById("feedBtn");
        feedBtn.addEventListener("click", function() {

            let anim = mixer.clipAction(THREE.AnimationClip.findByName(fileAnimations, 'Eating'));
            playModifierAnimation(idle, 0.25, anim, 0.25);
        });


//TODO: do a walk animation
//TODO: Do something for vet and cleaning
        let walkBtn = document.getElementById("walkBtn");
        walkBtn.addEventListener("click", function() {

            let anim = mixer.clipAction(THREE.AnimationClip.findByName(fileAnimations, 'Walk'));
            playModifierAnimation(idle, 0.05, anim, 0.05);
        });

        let cleanBtn = document.getElementById("cleanBtn");
        cleanBtn.addEventListener("click", function() {

            let anim = mixer.clipAction(THREE.AnimationClip.findByName(fileAnimations, 'Idle_2_HeadLow'));
            playModifierAnimation(idle, 0.05, anim, 0.05);
        });

        let healBtn = document.getElementById("healBtn");
        healBtn.addEventListener("click", function() {

            let anim = mixer.clipAction(THREE.AnimationClip.findByName(fileAnimations, 'Attack'));
            playModifierAnimation(idle, 0.05, anim, 0.05);
        });
    }

    function init() {

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 40 
        camera.position.x = 0;
        camera.position.y = -3;

        const canvas = document.getElementById("canvas");
        laoderAnim = document.getElementById('js-loader');
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);
        loader = new THREE.GLTFLoader();

        loader.load(
            modelPath,
            function(gltf) {

                onModelLoad(gltf);
                
            },
            undefined,
            function(error) {
                console.error(error);
            }
        );
    //TODO: use the other functions to make this neater

        loader.load(
            dogBowlPath,
            function(gltf) {

                model = gltf.scene;
                model.traverse(o => {
                    if (o.isMesh) {
                        o.castShadow = true;
                        o.receiveShadow = true;
                    }
                });

                model.scale.set(5, 5, 5);
                model.position.y = -10;
                model.position.z = 9;
                model.position.x = 2;
                model.name = 'bowl';
                scene.add(model);
                model.visible = false;

            },
            undefined,
            function(error) {
                console.error(error);
            }
        );

        loadBackground();
        loadNature();
        loadHouse();
        loadButtons();

        // Add lights
        let ambLight = new THREE.AmbientLight(0xffffff, 0.4);
        ambLight.position.set(0, 50, 0);
        scene.add(ambLight);

        let d = 8.25;
        let dirLight = new THREE.DirectionalLight(0xffffff, 3.5);
        dirLight.position.set(-10, 15, 8);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 1500;
        dirLight.shadow.camera.left = d * -1;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = d * -1;
        scene.add(dirLight);

        console.log("I run");


    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        let width = (window.innerWidth);
        let height = (window.innerHeight);
        let canvasPixelWidth = canvas.width / window.devicePixelRatio;
        let canvasPixelHeight = canvas.height / window.devicePixelRatio;
      
        const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function currMouseDegrees(x, y, degreeLimit) {
        let dx = 0,
            dy = 0,
            xdiff,
            xPercentage,
            ydiff,
            yPercentage;
      
        let w = { x: window.innerWidth, y: window.innerHeight };
        
         // 1. If cursor is in the left half of screen
        if (x <= w.x / 2) {
          xdiff = w.x / 2 - x;  
          
          xPercentage = (xdiff / (w.x / 2)) * 100;

          dx = ((degreeLimit * xPercentage) / 100) * -1; }
      // Right
        if (x >= w.x / 2) {
          xdiff = x - w.x / 2;
          xPercentage = (xdiff / (w.x / 2)) * 100;
          dx = (degreeLimit * xPercentage) / 100;
        }
        // Up 
        if (y <= w.y / 2) {
          ydiff = w.y / 2 - y;
          yPercentage = (ydiff / (w.y / 2)) * 100;
          dy = (((degreeLimit * 0.5) * yPercentage) / 100) * -1;
          }
        
        // Down 
        if (y >= w.y / 2) {
          ydiff = y - w.y / 2;
          yPercentage = (ydiff / (w.y / 2)) * 100;
          dy = (degreeLimit * yPercentage) / 100;
        }
        return { x: dx, y: dy };
      }

        function getMousePos(e) {   
            return { x: e.clientX, y: e.clientY };
        }

        function moveJoint(mouse, joint, degreeLimit) {
            let degrees = currMouseDegrees(mouse.x, mouse.y-400, degreeLimit);
            joint.rotation.y = THREE.Math.degToRad(degrees.x);
            joint.rotation.x = -THREE.Math.degToRad(degrees.y);

        }

        document.addEventListener('mousemove', function(e) {
            let mousecoords = getMousePos(e);
    
            if (neck && torso && head) {
                moveJoint(mousecoords, neck, 40);
                moveJoint(mousecoords, torso, 40);
                moveJoint(mousecoords, head, 40);
            }
        });

        function playModifierAnimation(from, fSpeed, to, tSpeed) {

            let object = scene.getObjectByName("bowl");
            if(to._clip.name == "Eating")
            {
                object.visible = true;
            }
            to.setLoop(THREE.LoopOnce);
            to.reset();
            to.play();
            from.crossFadeTo(to, fSpeed, true);
            setTimeout(function() {
              from.enabled = true;
              to.crossFadeTo(from, tSpeed, true);
              currentlyAnimating = false;

              object.visible = false; //removes the bowl after

            }, to._clip.duration * 1500 - ((tSpeed + fSpeed) * 1500));

        }

        function playOnClick() {
            playModifierAnimation(idle, 0.25, click_anim, 0.25);
        }

        window.addEventListener('click', e => raycast(e));
        window.addEventListener('touchend', e => raycast(e, true));
      
        function raycast(e, touch = false) {
            let mouse = {};
            if (touch) {
                mouse.x = 2 * (e.changedTouches[0].clientX / window.innerWidth) - 1;
                mouse.y = 1 - 2 * (e.changedTouches[0].clientY / window.innerHeight);
            } else {
                mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
                mouse.y = 1 - 2 * (e.clientY / window.innerHeight);
            }
            raycaster.setFromCamera(mouse, camera);
        
            let intersects = raycaster.intersectObjects(scene.children, true);
            console.log(intersects);
            if (intersects[0]) {
                let object = intersects[0].object;
            
                if (object.name === 'ShibaInu_1' || object.name === 'ShibaInu_0') {
                    playOnClick();
                }
            }
      }

    function animate() {

        if (mixer) {
            mixer.update(clock.getDelta());
        }

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();

})();