'use strict';
const $=id=>document.getElementById(id);
const V=(x,y,z)=>[x,y,z], add=(a,b)=>a.map((x,i)=>x+b[i]), mul=(a,k)=>a.map(x=>x*k);
const line=(name,p,d)=>({name,p,d});
const L=(p,d)=>line('ℓ',p,d), M=(p,d)=>line('m',p,d), N=(p,d)=>line('n',p,d);
const example=(name,ok,lines,text,detail,marks=[])=>({name,ok,lines,text,detail,marks});
const problems=[
{id:'5①',group:5,title:'交わらなければ、平行？',condition:'ℓ と m が交わらない',conclusion:'ℓ ∥ m',answer:false,reason:'同じ平面上にない「ねじれの位置」が反例。交わらないだけでは、平行とはいえません。',cases:[
example('平行な2直線',true,[L(V(0,-.9,0),V(1,0,0)),M(V(0,.9,0),V(1,0,0))],'交わらず、平行になる例。','この図では結論が成り立ちます。でも、この1例だけでは「つねに」とはいえません。'),
example('ねじれの位置',false,[L(V(0,0,1.05),V(1,0,0)),M(V(0,0,-.8),V(0,1,0))],'交わらないのに、平行ではありません。','ℓ と m は高さも向きも違います。同じ平面上になく、ねじれの位置にあります。'),
example('斜めのねじれ',false,[L(V(0,0,1.05),V(1,.35,0)),M(V(0,0,-.8),V(.5,1,0))],'向きが直角でなくても、ねじれの位置になります。','上の直線と下の直線は交わらず、向きもそろっていません。') ]},
{id:'5②',group:5,title:'平行をたどると？',condition:'ℓ ∥ m、m ∥ n',conclusion:'ℓ ∥ n',answer:true,reason:'同じ直線に平行な2直線は、互いに平行です。3直線が1つの平面上になくても成り立ちます。',cases:[
example('同じ平面に並ぶ',true,[L(V(0,-1,0),V(1,0,0)),M(V(0,0,0),V(1,0,0)),N(V(0,1,0),V(1,0,0))],'3本とも向きがそろっています。','ℓ と n も平行です。'),
example('高さを変える',true,[L(V(0,-1,1),V(1,0,0)),M(V(0,0,-.9),V(1,0,0)),N(V(0,1,.5),V(1,0,0))],'3本が1つの平面上になくても、平行です。','場所や高さが違っても、3本の直線の向きはそろっています。'),
example('斜めに並ぶ',true,[L(V(0,-1,1),V(1,.5,.35)),M(V(0,0,-.8),V(1,.5,.35)),N(V(0,1,.6),V(1,.5,.35))],'どの向きに傾けても成り立ちます。','ℓ ∥ m と m ∥ n によって、ℓ と n の向きもそろいます。') ]},
{id:'5③',group:5,title:'同じ直線に垂直なら、平行？',condition:'ℓ と m、ℓ と n が垂直に交わる',conclusion:'m ∥ n',answer:false,reason:'空間では、ℓ に垂直な直線の向きは1つに決まりません。m と n が交わる図や、ねじれる図が反例です。',cases:[
example('m と n が平行',true,[L(V(0,0,0),V(0,0,1)),M(V(0,0,.95),V(1,0,0)),N(V(0,0,-.95),V(1,0,0))],'同じ向きに伸ばせば、m と n は平行。','m と n は、それぞれ ℓ と直角に交わっています。',[{p:V(0,0,.95),u:V(0,0,1),v:V(1,0,0)},{p:V(0,0,-.95),u:V(0,0,1),v:V(1,0,0)}]),
example('m と n が交わる',false,[L(V(0,0,0),V(0,0,1)),M(V(0,0,0),V(1,0,0)),N(V(0,0,0),V(0,1,0))],'どちらも ℓ に垂直。でも m と n は交わります。','同じ点で、横向きの m と奥向きの n を ℓ に垂直に置いた反例です。',[{p:V(0,0,0),u:V(0,0,1),v:V(1,0,0)},{p:V(0,0,0),u:V(0,0,1),v:V(0,1,0)}]),
example('m と n がねじれる',false,[L(V(0,0,0),V(0,0,1)),M(V(0,0,1),V(1,0,0)),N(V(0,0,-1),V(0,1,0))],'交点の高さと向きが違うと、ねじれの位置に。','m と n はどちらも ℓ と直角に交わりますが、互いに平行ではありません。',[{p:V(0,0,1),u:V(0,0,1),v:V(1,0,0)},{p:V(0,0,-1),u:V(0,0,1),v:V(0,1,0)}]) ]},
{id:'7①',group:7,title:'平行な直線と、平面',condition:'ℓ ∥ m、ℓ ∥ P',conclusion:'m ∥ P',answer:true,reason:'ℓ に平行な m も平面 P と交わりません。ただし問題の指定どおり、m が P 上にある場合は除きます。',cases:[
example('同じ高さ',true,[L(V(0,-.8,1.2),V(1,0,0)),M(V(0,.8,1.2),V(1,0,0))],'ℓ も m も、平面 P と交わりません。','m は ℓ に平行で、平面からの高さが一定です。'),
example('高さが違う',true,[L(V(0,-.7,1.7),V(1,0,0)),M(V(0,.8,.6),V(1,0,0))],'高さが違っても、m ∥ P。','平面から離れている距離が違っても、結論は変わりません。'),
example('平面の上下',true,[L(V(0,-.7,1.2),V(1,.35,0)),M(V(0,.8,-1),V(1,.35,0))],'m が P の下側にあっても平行です。','破線は平面より下の部分です。上下の違いは平行かどうかに関係しません。') ]},
{id:'7②',group:7,title:'平面に垂直な直線に平行なら？',condition:'ℓ ∥ m、ℓ ⟂ P',conclusion:'m ⟂ P',answer:true,reason:'平面に垂直な直線と平行な直線は、その平面に垂直です。',cases:[
example('左右に離す',true,[L(V(-1,0,.5),V(0,0,1)),M(V(1,0,.5),V(0,0,1))],'ℓ も m も、P にまっすぐ立っています。','平面 P と交わる場所が違っても、どちらも P に垂直です。'),
example('奥行きを変える',true,[L(V(-.8,-1,.5),V(0,0,1)),M(V(.8,1,.5),V(0,0,1))],'奥と手前でも、m ⟂ P。','m を ℓ と平行に動かしても、平面に対する直角は保たれます。'),
example('近づける',true,[L(V(-.4,.2,.5),V(0,0,1)),M(V(.4,-.2,.5),V(0,0,1))],'2直線の間隔を変えても成り立ちます。','真上から見ると直線が点のように見えます。立体の視点に戻して確かめましょう。') ]},
{id:'7③',group:7,title:'直線に垂直なら、平面に平行？',condition:'ℓ と m が垂直に交わり、ℓ ∥ P',conclusion:'m ∥ P',answer:false,reason:'ℓ に垂直な m は、横にも縦にも傾けられます。平面 P と交わる m が反例です。',cases:[
example('m を横に伸ばす',true,[L(V(0,0,1.2),V(1,0,0)),M(V(0,0,1.2),V(0,1,0))],'横向きの m は、平面 P と平行。','この図では結論が成り立ちます。m と ℓ の交点は P より上にあります。',[{p:V(0,0,1.2),u:V(1,0,0),v:V(0,1,0)}]),
example('m を縦に伸ばす',false,[L(V(0,0,1.2),V(1,0,0)),M(V(0,0,1.2),V(0,0,1))],'m は ℓ に垂直ですが、P と交わります。','m ⟂ P となる反例です。直線に垂直であることと、平面に平行であることは別です。',[{p:V(0,0,1.2),u:V(1,0,0),v:V(0,0,1)}]),
example('m を斜めに伸ばす',false,[L(V(0,0,1.2),V(1,0,0)),M(V(0,0,1.2),V(0,.75,.8))],'斜めの m も、平面 P と交わります。','ℓ と直角を保ったまま m を傾けた反例です。平面との交点を白い点で示しています。',[{p:V(0,0,1.2),u:V(1,0,0),v:V(0,.75,.8)}]) ]},
{id:'7④',group:7,title:'同じ平面に平行なら、互いに平行？',condition:'ℓ ∥ P、m ∥ P',conclusion:'ℓ ∥ m',answer:false,reason:'同じ平面に平行でも、直線どうしの向きはそろうとは限りません。交わる図も、ねじれる図も反例です。',cases:[
example('向きをそろえる',true,[L(V(0,-.9,1.2),V(1,0,0)),M(V(0,.9,1.2),V(1,0,0))],'向きが同じなら、ℓ ∥ m。','この図では結論が成り立ちます。'),
example('P の上で交わる',false,[L(V(0,0,1.2),V(1,0,0)),M(V(0,0,1.2),V(0,1,0))],'どちらも P に平行。でも2直線は交わります。','平面 P の上で2直線を十字に置いた反例です。'),
example('高さも向きも変える',false,[L(V(0,0,1.8),V(1,0,0)),M(V(0,0,.6),V(0,1,0))],'どちらも P に平行。でも、ねじれの位置です。','高さも向きも違うため、ℓ と m は交わらず、平行でもありません。') ]},
{id:'7⑤',group:7,title:'同じ平面に垂直なら？',condition:'ℓ ⟂ P、m ⟂ P',conclusion:'ℓ ∥ m',answer:true,reason:'同じ平面に垂直な2直線は、互いに平行です。平面に垂直な向きはそろいます。',cases:[
example('左右に並べる',true,[L(V(-1,0,.5),V(0,0,1)),M(V(1,0,.5),V(0,0,1))],'同じ平面に立つ2本の柱は、平行です。','平面 P に垂直な2直線の向きはそろっています。'),
example('奥と手前に並べる',true,[L(V(-1,-1,.5),V(0,0,1)),M(V(1,1,.5),V(0,0,1))],'置く場所を変えても、平行です。','ℓ と m が P と交わる点を、奥と手前に離しています。'),
example('間隔を狭くする',true,[L(V(-.35,0,.5),V(0,0,1)),M(V(.35,0,.5),V(0,0,1))],'近づけても、ℓ ∥ m。','同じ平面に垂直であるかぎり、2直線の向きは変わりません。') ]}
];
let selected=0,caseIndex=0,answers=true,yaw=-.55,elevation=.48,zoom=1;
const colors=()=>{const s=getComputedStyle(document.body);return {'ℓ':s.getPropertyValue('--blue').trim(),m:s.getPropertyValue('--orange').trim(),n:s.getPropertyValue('--purple').trim(),plane:s.getPropertyValue('--plane').trim(),muted:s.getPropertyValue('--muted').trim(),text:s.getPropertyValue('--text').trim()}};
const svgNS='http://www.w3.org/2000/svg';
function el(name,attrs,parent=$('drawing')){const n=document.createElementNS(svgNS,name);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,String(v));parent.appendChild(n);return n}
let frame={x:0,y:0,scale:95};
function rawProject(p){const x=p[0]*Math.cos(yaw)-p[1]*Math.sin(yaw),d=p[0]*Math.sin(yaw)+p[1]*Math.cos(yaw);return [x,d*Math.sin(elevation)-p[2]*Math.cos(elevation)]}
function project(p){const[x,y]=rawProject(p);return [470+(x-frame.x)*frame.scale*zoom,235+(y-frame.y)*frame.scale*zoom]}
function fitFrame(p,c){const points=c.lines.flatMap(l=>{const d=mul(l.d,1/Math.hypot(...l.d));return [add(l.p,mul(d,-2.8)),add(l.p,mul(d,2.8))]});if(p.group===7)points.push(V(-3,-2.2,0),V(3,-2.2,0),V(3,2.2,0),V(-3,2.2,0));const projected=points.map(rawProject),xs=projected.map(v=>v[0]),ys=projected.map(v=>v[1]),left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);frame={x:(left+right)*.5,y:(top+bottom)*.5,scale:Math.min(105,820/Math.max(1,right-left),350/Math.max(1,bottom-top))}}
function path(points,attrs){return el('polyline',{points:points.map(p=>project(p).join(',')).join(' '),fill:'none',...attrs})}
function textAt(p,t,color,size=24){let [x,y]=project(p);const n=el('text',{x:x+10,y:y-9,fill:color,'font-size':size});n.textContent=t;return n}
function draw(){
 const p=problems[selected],c=p.cases[caseIndex],col=colors(),svg=$('drawing');fitFrame(p,c);svg.replaceChildren();const title=el('title',{id:'diagramTitle'});title.textContent=p.id+' '+c.name;const desc=el('desc',{id:'diagramDesc'});desc.textContent=p.condition+'。'+c.text+' '+c.detail;
 if(p.group===7){
  const corners=[V(-3,-2.2,0),V(3,-2.2,0),V(3,2.2,0),V(-3,2.2,0)];el('polygon',{points:corners.map(v=>project(v).join(',')).join(' '),fill:col.plane,'fill-opacity':'.10',stroke:col.plane,'stroke-width':1.5,'stroke-opacity':'.6'});
  for(let i=-2;i<=2;i++){path([V(i,-2.2,0),V(i,2.2,0)],{stroke:col.plane,'stroke-opacity':'.15'});path([V(-3,i,0),V(3,i,0)],{stroke:col.plane,'stroke-opacity':'.15'})}textAt(V(-2.8,1.9,0),'P',col.plane,30);
 }else{
  const vertices=[[-2.8,-1.7,-1.5],[2.8,-1.7,-1.5],[2.8,1.7,-1.5],[-2.8,1.7,-1.5],[-2.8,-1.7,1.8],[2.8,-1.7,1.8],[2.8,1.7,1.8],[-2.8,1.7,1.8]];for(const[a,b]of [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]])path([vertices[a],vertices[b]],{stroke:col.muted,'stroke-opacity':'.12','stroke-dasharray':'4 7'});
 }
 const sorted=[...c.lines].sort((a,b)=>(a.p[0]*Math.sin(yaw)+a.p[1]*Math.cos(yaw))-(b.p[0]*Math.sin(yaw)+b.p[1]*Math.cos(yaw)));
 for(const l of sorted){const len=Math.hypot(...l.d),d=mul(l.d,1/len),extent=2.6,a=add(l.p,mul(d,-extent)),b=add(l.p,mul(d,extent)),color=col[l.name];
  const segments=[];if(p.group===7&&a[2]*b[2]<0){const t=-a[2]/(b[2]-a[2]),q=add(a,mul(add(b,mul(a,-1)),t));segments.push([a,q,(a[2]+q[2])<0],[q,b,(b[2]+q[2])<0]);}else segments.push([a,b,p.group===7&&(a[2]+b[2])<0]);
  for(const[x,y,below]of segments)path([x,y],{stroke:color,'stroke-width':5,'stroke-linecap':'round','stroke-dasharray':below?'11 8':'none','stroke-opacity':below?'.65':'1'});
  for(const[q,dir]of [[a,d],[b,mul(d,-1)]]){let [x,y]=project(q),[ix,iy]=project(add(q,mul(dir,.15))),dx=x-ix,dy=y-iy,n=Math.hypot(dx,dy);if(n>1){dx/=n;dy/=n;el('path',{d:`M${x-dx*10-dy*4},${y-dy*10+dx*4} L${x},${y} L${x-dx*10+dy*4},${y-dy*10-dx*4}`,fill:'none',stroke:color,'stroke-width':2})}}
  textAt(add(l.p,mul(d,2.7)),l.name,color,30);
  if(p.group===7&&Math.abs(d[2])>.001){const q=add(l.p,mul(d,-l.p[2]/d[2]));if(Math.abs(q[0])<=3&&Math.abs(q[1])<=2.2){const[x,y]=project(q);el('circle',{cx:x,cy:y,r:5,fill:col.text,stroke:color,'stroke-width':2});if(Math.abs(d[2])>.999){for(const v of [V(1,0,0),V(0,1,0)])rightMark(q,V(0,0,1),v,col.muted)}}}
 }
 for(const m of c.marks)rightMark(m.p,m.u,m.v,col.text);
}
function rightMark(p,u,v,color){const un=mul(u,.23/Math.hypot(...u)),vn=mul(v,.23/Math.hypot(...v));path([add(p,un),add(add(p,un),vn),add(p,vn)],{stroke:color,'stroke-width':2,'stroke-opacity':'.85'})}
function renderNav(){const nav=$('problems');nav.replaceChildren();for(const group of [5,7]){let h=document.createElement('h2');h.textContent=group===5?'問5　直線と直線':'問7　直線と平面';nav.appendChild(h);problems.forEach((p,i)=>{if(p.group!==group)return;let b=document.createElement('button');b.innerHTML=`<span>${p.id}</span>${['交わらない2直線','平行な3直線','同じ直線に垂直','平行な直線と平面','平面に垂直な向き','直線に垂直・平面に平行','同じ平面に平行','同じ平面に垂直'][i]}`;b.setAttribute('aria-current',String(i===selected));b.onclick=()=>choose(i);nav.appendChild(b)})}}
function render(){const p=problems[selected],c=p.cases[caseIndex];$('sectionName').textContent=`問${p.group} ${p.group===5?'直線と直線':'直線と平面'}`;$('problemTitle').textContent=p.id+' '+p.title;$('condition').textContent=p.condition;$('conclusion').textContent=p.conclusion;$('overall').className='overall answer-part '+(p.answer?'good':'bad');$('overall').textContent=p.answer?'問題の答え ○ つねに成り立つ':'問題の答え × 反例がある';$('nLegend').hidden=!c.lines.some(l=>l.name==='n');$('pLegend').hidden=p.group!==7;$('caseCount').textContent=`${caseIndex+1} / ${p.cases.length} 図`;
 $('cases').replaceChildren();p.cases.forEach((e,i)=>{let b=document.createElement('button');b.innerHTML=`<span class="case-symbol answer-part ${e.ok?'good':'bad'}">${e.ok?'○':'×'}</span><span>${e.name}</span>`;b.setAttribute('aria-pressed',String(i===caseIndex));b.onclick=()=>{caseIndex=i;render()};$('cases').appendChild(b)});
 $('caseBadge').className='case-badge answer-part '+(c.ok?'good':'bad');$('caseBadge').textContent=c.ok?'○':'×';$('caseTitle').textContent=answers?(c.ok?'この図では結論が成り立つ':'この図が反例！ 結論が成り立たない'):'この図で、結論は成り立つ？';$('caseText').textContent=answers?c.text+' '+c.detail:'条件は満たしています。図を回して、直線や平面の位置関係を確かめましょう。';$('reason').textContent=answers?(p.answer?'○ どの図でも成り立つ。×になる図はありません。 ':'× 反例が1つでもあれば、問題全体の答えは×。 ')+p.reason:'';$('problemPosition').textContent=`${selected+1} / 8 問`;$('answerToggle').textContent=answers?'答えを隠す':'答えを表示';$('answerToggle').setAttribute('aria-pressed',String(answers));document.body.classList.toggle('hide-answers',!answers);renderNav();draw();}
function reset(){yaw=-.55;elevation=.48;zoom=1}
function choose(i){selected=(i+problems.length)%problems.length;caseIndex=0;reset();render()}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{const v=b.dataset.view;yaw=v==='space'?-.55:0;elevation=v==='top'?Math.PI*.5:v==='front'?0:.48;draw()});$('resetView').onclick=()=>{reset();draw()};$('previous').onclick=()=>choose(selected-1);$('next').onclick=()=>choose(selected+1);$('answerToggle').onclick=()=>{answers=!answers;render()};$('theme').onclick=()=>{document.body.classList.toggle('light');$('theme').textContent=document.body.classList.contains('light')?'暗く':'明るく';draw()};$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch(e){$('fullscreen').textContent='全画面にできません'}};
const pointers=new Map();let lastDistance=0;const scene=$('scene');
scene.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;pointers.set(e.pointerId,[e.clientX,e.clientY]);scene.setPointerCapture(e.pointerId);scene.classList.add('dragging');lastDistance=0});scene.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;const old=pointers.get(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY]);if(pointers.size===2){const[a,b]=[...pointers.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(lastDistance)zoom=Math.max(.55,Math.min(1.7,zoom*d/lastDistance));lastDistance=d;}else{yaw+=(e.clientX-old[0])*.008;elevation=Math.max(-1.5,Math.min(1.57,elevation+(e.clientY-old[1])*.008))}draw()});for(const event of ['pointerup','pointercancel','lostpointercapture'])scene.addEventListener(event,e=>{pointers.delete(e.pointerId);lastDistance=0;if(!pointers.size)scene.classList.remove('dragging')});scene.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.55,Math.min(1.7,zoom-e.deltaY*.001));draw()},{passive:false});
render();
