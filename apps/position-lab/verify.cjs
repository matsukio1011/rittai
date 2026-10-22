const fs=require('fs'),vm=require('vm'),assert=require('assert');
function node(){return{children:[],dataset:{},hidden:false,classList:{toggle(){},add(){},remove(){},contains(){return false}},setAttribute(){},appendChild(n){this.children.push(n)},replaceChildren(){this.children=[]},addEventListener(){}}}
const nodes={};const context={document:{getElementById:id=>nodes[id]??=node(),createElement:node,createElementNS:node,querySelectorAll:()=>[],body:node(),documentElement:node()},getComputedStyle:()=>({getPropertyValue:()=> '#999'}),console,Math,Map};vm.createContext(context);vm.runInContext(fs.readFileSync('app.js','utf8'),context);
vm.runInContext(`
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],sub=(a,b)=>a.map((v,i)=>v-b[i]),near=x=>Math.abs(x)<1e-8;
const parallel=(a,b)=>Math.hypot(...cross(a.d,b.d))<1e-8;
const meet=(a,b)=>!parallel(a,b)&&near(dot(sub(b.p,a.p),cross(a.d,b.d)));
const perp=(a,b)=>meet(a,b)&&near(dot(a.d,b.d));
const planePar=a=>near(a.d[2])&&!near(a.p[2]);
const planePerp=a=>near(a.d[0])&&near(a.d[1])&&!near(a.d[2]);
let count=0;
for(const [i,p] of problems.entries())for(const [j,c] of p.cases.entries()){
const [l,m,n]=c.lines;
const condition=[()=>!meet(l,m),()=>parallel(l,m)&&parallel(m,n),()=>perp(l,m)&&perp(l,n),()=>parallel(l,m)&&planePar(l)&&!near(m.p[2]),()=>parallel(l,m)&&planePerp(l),()=>perp(l,m)&&planePar(l),()=>planePar(l)&&planePar(m),()=>planePerp(l)&&planePerp(m)][i]();
const conclusion=[()=>parallel(l,m),()=>parallel(l,n),()=>parallel(m,n),()=>planePar(m),()=>planePerp(m),()=>planePar(m),()=>parallel(l,m),()=>parallel(l,m)][i]();
if(!condition)throw Error(p.id+' case '+j+' violates its condition');if(conclusion!==c.ok)throw Error(p.id+' case '+j+' verdict incorrect');
selected=i;caseIndex=j;render();for(const yawValue of [-2,0,2])for(const elValue of [-1.5,0,1.57]){yaw=yawValue;elevation=elValue;draw()}count++;
}
if(problems.map(p=>p.answer?'○':'×').join('')!=='×○×○○××○')throw Error('Wrong overall answers');
for(const p of problems){if(p.answer&&p.cases.some(c=>!c.ok))throw Error('True problem has counterexample');if(!p.answer&&!p.cases.some(c=>!c.ok))throw Error('Missing counterexample');}
choose(0);$('answerToggle').onclick();if(answers||!$('caseTitle').textContent.includes('？'))throw Error('Hide answers');$('answerToggle').onclick();if(!answers)throw Error('Show answers');$('next').onclick();if(selected!==1)throw Error('Next');$('previous').onclick();if(selected!==0)throw Error('Previous');choose(-1);if(selected!==7)throw Error('Wrap');
console.log('PASS: '+count+' figures satisfy conditions and verdicts; 216 rotated renders; all 8 answers; answer toggle and navigation.');
`,context);
for(const n of nodes.drawing.children)for(const v of Object.values(n))if(typeof v==='string')assert(!v.includes('NaN'));
