(function() {
    let scene,  
      renderer,
      camera,
      model,                              
      neck,                               
      head,
      torso,                              
      possibleAnims,                      
      mixer,                              
      idle,
      click_anim,                               
      clock = new THREE.Clock(),          
      currentlyAnimating = false,         
      raycaster = new THREE.Raycaster(), 
      loaderAnim = document.getElementById('js-loader');
    init(); 


    function onModelLoad(gltf)
    {
        model = gltf.scene;
        let fileAnimations = gltf.animations;

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

        model.scale.set(3.5, 3.5, 3.5);

        model.position.y = -11;
        model.rotation.y = 0.3;
    
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        console.log(fileAnimations);

        let idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'Idle');

        idle = mixer.clipAction(idleAnim);
        idle.play();

        click_anim = mixer.clipAction(THREE.AnimationClip.findByName(fileAnimations, 'Eating'));
    }

    function init() {

        const modelPath = 'animationModels/pixelDog.glb';
        
        let loader = new THREE.GLTFLoader();

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

        const dogBowlPath = 'animationModels/bowl.glb';

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


        const canvas = document.querySelector('#canvas');
        const backgroundColor = 0xf1f1f1;
        
        scene = new THREE.Scene();
        scene.background = new THREE.Color(backgroundColor);

        // Init the renderer
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        // Add a camera
        camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 40 
        camera.position.x = 0;
        camera.position.y = -3;

        // Add lights
        let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
        hemiLight.position.set(0, 50, 0);
        // Add hemisphere light to scene
        scene.add(hemiLight);

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
        // Add directional Light to scene
        scene.add(dirLight);

        // Floor
        let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
        let floorMaterial = new THREE.MeshPhongMaterial({
        color: 0xeeeeee,
        shininess: 0,
        });

        let floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -0.5 * Math.PI; 
        floor.receiveShadow = true;
        floor.position.y = -11;
        scene.add(floor);

        // let geometry = new THREE.SphereGeometry(8, 32, 32);
        // let material = new THREE.MeshBasicMaterial({ color: 0x9bffaf }); // 0xf2ce2e 
        // let sphere = new THREE.Mesh(geometry, material);
        // sphere.position.z = -15;
        // sphere.position.y = -2.5;
        // sphere.position.x = -0.25;
        // scene.add(sphere);
        
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

    function update() {

        if (mixer) {
            mixer.update(clock.getDelta());
        }

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);
        requestAnimationFrame(update);
    }

    update();
})();