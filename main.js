import win from 'global';
import * as Three from 'three';
import './style.css';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
// first create a scene 

const scene = new Three.Scene();

// Three.js gives many default shapes (circle , square)

//adding sphere into the scene
//geometry is just the shape
const geometry = new Three.SphereGeometry(3, 64, 64);
//(radius , segment, segment);

//material is how it looks

const material = new Three.MeshStandardMaterial({
  color: '#00ff83'
})

// mesh = geometry + material

const mesh = new Three.Mesh(geometry, material);

//adding the shape to the scene 

scene.add(mesh);

//light 

const light = new Three.PointLight('0xffffff', 1 , 100);
light.position.set(0, 10 , 10);
light.intensity = 1.25
//(x , y , z) coordinate values
scene.add(light);

//sizes 

let sizes = {
  width : window.innerWidth,
  height: window.innerHeight
}

//Camera 
const camera = new Three.PerspectiveCamera(45, sizes.width / sizes.height , 0.1, 100);
//(fieldView, ascpect/ratio, near point, far point)
camera.position.z = 20;//even now you can't see something thats bcz there is no light 
//more the .z value farther you move from the object
scene.add(camera);


//render the whole thing on a html canvas
const canvas = document.querySelector('.webgl');
const renderer = new Three.WebGLRenderer({canvas});
renderer.setSize(sizes.width,sizes.height);
renderer.pixelRatio = 2;
renderer.render(scene, camera);
//now we screen a canvas on the screen but no sphere thats bcz camera and sphere are top of each other so set camera.position 



//orbit controls 

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false; // try removing this , it's actually fun
controls.enableZoom = false;
controls.autoRotate = true;

//window-resizing

window.addEventListener('resize', ()=>{
  sizes.width = innerWidth;
  sizes.height = innerHeight;
  //update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width,sizes.height);
})


const loop = ()=>{
  // mesh.rotation.x += 0.2;
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

loop();


//timeline magic

const t1 = gsap.timeline({defaults : {duration: 1}});
t1.fromTo(mesh.scale, {z:0 , x:0, y:0} , {z:1 , x:1, y:1});
t1.fromTo('nav' , {y:'-100%'} , {y:'0%'});
t1.fromTo('.title', {opacity: 0} , {opacity:1})

//color change

let mouseDown = false;
let rgb = [];
window.addEventListener('mousedown', ()=> {mouseDown = true});
window.addEventListener('mouseup', ()=> {mouseDown = false});


window.addEventListener('mousemove' , (e)=>{
  if(mouseDown){
  rgb = [Math.round(e.pageX / sizes.width) * 255 ,Math.round(e.pageY / sizes.height) * 255 , 150 ]
  //animate
  let newColor = new Three.Color(`rgb(${rgb.join(',')})`)
  gsap.to(mesh.material.color , {r: newColor.r , g: newColor.g , b: newColor.b});
  }
})