const fs=require('fs'),vm=require('vm'),assert=require('assert');
const make=()=>({dataset:{},classList:{add(){},toggle(){}},setAttribute(){},append(){},replaceChildren(){},addEventListener(){},showModal(){this.open=true},close(){this.open=false},style:{}});
const nodes={},root=make();let fullscreenCalls=0;root.requestFullscreen=async()=>{fullscreenCalls++};const listeners={};const ctx={document:{documentElement:root,getElementById:id=>nodes[id]??=make(),createElement:make,createElementNS:make,querySelector:selector=>nodes[selector]??=make(),querySelectorAll:()=>[],addEventListener:(event,callback)=>listeners[event]=callback},console,Math,setTimeout,clearTimeout};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('app.js','utf8'),ctx);
vm.runInContext(`
const expected={ep:['CD','EF','GH'],ev:['BC','DA','AE','BF'],es:['FG','HE','CG','DH'],fp:['EFGH','DHGC'],fv:['BFGC','AEHD']};
for(const [id,answers]of Object.entries(expected)){let d=definitions.find(d=>d.id===id);let got=(d.out==='edge'?edges:faces).filter(x=>d.test('AB',x));if([...got].sort().join()!==[...answers].sort().join())throw Error(id+': '+got)}
let count=0;for(const d of definitions)for(const ref of d.ref==='edge'?edges:faces){let answers=(d.out==='edge'?edges:faces).filter(x=>d.test(ref,x));let expectedCount={ep:3,ev:4,es:4,fp:2,fv:2,in:4,ffp:1,ffv:4}[d.id];if(answers.length!==expectedCount)throw Error('Invalid '+d.id+' '+ref);count++}
toggle('CD');toggle('EF');toggle('GH');grade();if(correct!==1||total!==1)throw Error('Correct grading failed');grade();if(total!==1)throw Error('Double grading');nextQuestion();grade();if(correct!==1||total!==2)throw Error('Empty answer grading');
group='faces';deck=[];nextQuestion();if(q.d.group!=='faces')throw Error('Filter');
console.log('PASS: '+count+' question combinations, reference answers, selection, grading, repeat grading protection and theme filter.');
if(document.documentElement.dataset.theme!=='dark')throw Error('Default dark theme');
$('theme').onclick();if(document.documentElement.dataset.theme!=='light')throw Error('Light mode');$('theme').onclick();if(document.documentElement.dataset.theme!=='dark')throw Error('Dark mode');
$('explain').onclick();if(!$('explanationDialog').open)throw Error('Explanation popup');$('closeExplanation').onclick();if($('explanationDialog').open)throw Error('Popup close');
$('fullscreen').onclick();console.log('PASS: theme switching, explanation popup and fullscreen request.');
`,ctx);
assert.equal(fullscreenCalls,1);
vm.runInContext(`
let combinations=0;
for(let i=0;i<solids.length;i++){
chooseSolid(i);
if(Object.keys(V).length-edges.length+faces.length!==2)throw Error('Euler '+i);
for(const edge of edges)if(faces.filter(f=>[...edge].every(v=>f.includes(v))).length!==2)throw Error('Topology '+i+' '+edge);
for(const f of faces){if(!near(norm(normals[f])-1))throw Error('Normal length');for(const v of f)if(!near(dot(sub(V[v],V[f[0]]),normals[f])))throw Error('Nonplanar face '+f);}
for(const d of definitions)for(const ref of d.ref==='edge'?edges:faces){
const answers=(d.out==='edge'?edges:faces).filter(x=>d.test(ref,x));
if(d.id==='in'&&answers.length!==ref.length)throw Error('Face boundary '+ref);
if(['ep','ev','es','ffp','ffv'].includes(d.id))for(const x of answers)if(!d.test(x,ref))throw Error('Asymmetric relation');
if(d.id==='ev')for(const x of answers)if(!share(ref,x)||!near(dot(direction(ref),direction(x))))throw Error('Perpendicular');
if(d.id==='es')for(const x of answers)if(share(ref,x)||parallel(direction(ref),direction(x)))throw Error('Skew');
combinations++;
}
for(const item of makeDeck()){q={...item,answers:(item.d.out==='edge'?edges:faces).filter(x=>item.d.test(item.ref,x))};if(!q.answers.length)throw Error('Empty question');selected=new Set(q.answers);graded=false;grade();if($('feedback').className==='fail')throw Error('Grading '+i);}
for(const angles of [[-.55,.32],[0,0],[0,1.4],[2,1]]){[yaw,pitch]=angles;render()}
}
chooseSolid(1);if(!definitions.find(d=>d.id==='ep').test('AD','BC'))throw Error('Trapezoid parallel bases');if(definitions.find(d=>d.id==='es').test('AB','CD'))throw Error('Coplanar trapezoid sides are not skew');if(definitions.find(d=>d.id==='ev').test('AD','CD'))throw Error('Slanted side is not perpendicular');
chooseSolid(5);if(!definitions.find(d=>d.id==='ev').test('AB','BC'))throw Error('Right triangle angle');if(!definitions.find(d=>d.id==='ffv').test('ABED','BCEF'))throw Error('Perpendicular side faces');
chooseSolid(4);if(edges.length!==18||faces.length!==8||Object.keys(V).length!==12)throw Error('Hexagonal prism');
console.log('PASS: all 6 solids, '+combinations+' relation combinations, planar faces, outward unit normals, topology, complete-answer grading, camera rendering and image-specific reference answers.');
`,ctx);
