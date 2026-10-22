/* Isometric hinge unfolding for prisms, analytic development for cones and cylinders. */
window.SurfaceUnfold=(()=>{
const sub=(a,b)=>a.map((v,i)=>v-b[i]),plus=(a,b)=>a.map((v,i)=>v+b[i]),mul=(a,s)=>a.map(v=>v*s),dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],unit=a=>mul(a,1/(Math.hypot(...a)||1));
function rotate(v,axis,angle){const c=Math.cos(angle),s=Math.sin(angle);return plus(plus(mul(v,c),mul(cross(axis,v),s)),mul(axis,dot(axis,v)*(1-c)));}
function align(from,to){const d=Math.max(-1,Math.min(1,dot(unit(from),unit(to))));return {axis:d<-.999999?unit(cross(from,Math.abs(from[0])<.8?[1,0,0]:[0,1,0])):unit(cross(from,to)),angle:Math.acos(d)};}
function normal(f,v){const old=cross(sub(f.v[1],f.v[0]),sub(f.v[2],f.v[0])),now=cross(sub(v[1],v[0]),sub(v[2],v[0]));return mul(unit(now),dot(old,f.n)>=0?1:-1);}
function bounds(points){return {lo:[0,1,2].map(k=>Math.min(...points.map(v=>v[k]))),hi:[0,1,2].map(k=>Math.max(...points.map(v=>v[k])))};}
const key=p=>p.map(v=>v.toFixed(7)).join(',');
function shared(a,b){const v=a.v.filter(p=>b.v.some(q=>Math.hypot(...sub(p,q))<1e-6));return v.length>=2?[v[0],v[1]]:null;}
function prism(source){const cap=source.find(f=>f.id===0),sides=source.filter(f=>f.id>=2);let root=sides[0],longest=0;
for(const side of sides){const edge=shared(cap,side);if(edge){const length=Math.hypot(...sub(edge[1],edge[0]));if(length>longest){longest=length;root=side}}}
const first=sides.indexOf(root),order=Array.from({length:sides.length},(_,i)=>sides[(first+i)%sides.length]),links=[];
for(let i=1;i<order.length;i++)links.push([order[i],order[i-1]]);links.push([source.find(f=>f.id===0),root],[source.find(f=>f.id===1),root]);
const hinges=links.map(([child,parent])=>{const edge=shared(child,parent);if(!edge)throw Error('Missing prism hinge');const axis=unit(sub(edge[1],edge[0])),angle=Math.atan2(dot(axis,cross(child.n,parent.n)),dot(child.n,parent.n));return {child,parent,point:edge[0],axis,angle};});
const facing=align(root.n,[0,0,1]),edge=shared(cap,root),along=rotate(unit(sub(edge[1],edge[0])),facing.axis,facing.angle),turn=-Math.atan2(along[1],along[0]);
const raw=t=>{const fn=new Map([[root.id,v=>v]]);for(const h of hinges){const parent=fn.get(h.parent.id);fn.set(h.child.id,v=>parent(plus(h.point,rotate(sub(v,h.point),h.axis,h.angle*t))));}return source.map(f=>{const v=f.v.map(p=>rotate(rotate(fn.get(f.id)(p),facing.axis,facing.angle*t),[0,0,1],turn*t));return {...f,v,n:normal(f,v)};});};
const end=bounds(raw(1).flatMap(f=>f.v)),center=end.lo.map((v,k)=>(v+end.hi[k])/2);return t=>raw(t).map(f=>({...f,v:f.v.map(v=>sub(v,mul(center,t)))}));
}
function pack(panels){const gap=.55,ordered=[...panels].sort((a,b)=>b.h-a.h),max=Math.max(...ordered.map(p=>p.w)),sum=ordered.reduce((s,p)=>s+p.w+gap,0);let best=null;
for(let step=0;step<=24;step++){const limit=max+(sum-max)*step/24;let x=0,y=0,row=0,w=0;const positions=new Map();for(const p of ordered){if(x&&x+p.w>limit){x=0;y+=row+gap;row=0}positions.set(p.id,[x+p.w/2,y+p.h/2]);w=Math.max(w,x+p.w);row=Math.max(row,p.h);x+=p.w+gap}const h=y+row,fit=Math.max(w/1.8,h);if(!best||fit<best.fit)best={fit,w,h,positions};}
return new Map([...best.positions].map(([id,[x,y]])=>[id,[x-best.w/2,y-best.h/2,0]]));}
function pieces(source){const groups=new Map();for(const f of source){if(!groups.has(f.id))groups.set(f.id,[]);groups.get(f.id).push(f)}const panels=[];
for(const [id,faces]of groups){const points=faces.flatMap(f=>f.v),planar=faces.every(f=>dot(f.n,faces[0].n)>.999999);let deform;
if(planar)deform=(p,t)=>p;
else if(faces.every(f=>f.v.length===3)){
const counts=new Map();for(const p of points){const k=key(p);counts.set(k,(counts.get(k)||0)+1)}const apex=points.find(p=>counts.get(key(p))>=faces.length),ring=points.filter(p=>Math.hypot(...sub(p,apex))>1e-6),axis=[0,1,2].sort((a,b)=>(Math.max(...ring.map(p=>p[a]))-Math.min(...ring.map(p=>p[a])))-(Math.max(...ring.map(p=>p[b]))-Math.min(...ring.map(p=>p[b]))))[0],rad=[0,1,2].filter(k=>k!==axis),r=Math.hypot(ring[0][rad[0]]-apex[rad[0]],ring[0][rad[1]]-apex[rad[1]]),l=Math.hypot(...sub(ring[0],apex)),beta=Math.asin(r/l),sign=Math.sign(apex[axis]-ring[0][axis]);
deform=(p,t)=>{const rho=Math.hypot(...sub(p,apex));if(rho<1e-9)return [...apex];let theta=Math.atan2(p[rad[1]]-apex[rad[1]],p[rad[0]]-apex[rad[0]]);if(theta<0)theta+=Math.PI*2;const b=beta+(Math.PI/2-beta)*t,a=(theta-Math.PI)*Math.sin(beta)/Math.sin(b),v=[...p];v[rad[0]]=apex[rad[0]]-rho*Math.sin(b)*Math.cos(a);v[rad[1]]=apex[rad[1]]-rho*Math.sin(b)*Math.sin(a);v[axis]=apex[axis]-sign*rho*Math.cos(b);return v;};
}else{
const axis=[0,1,2].find(k=>faces.every(f=>Math.abs(f.n[k])<1e-6)),rad=[0,1,2].filter(k=>k!==axis),r=Math.hypot(points[0][rad[0]],points[0][rad[1]]);
deform=(p,t)=>{let theta=Math.atan2(p[rad[1]],p[rad[0]]);if(theta<0)theta+=Math.PI*2;const u=theta-Math.PI,k=1-t,v=[...p];v[rad[0]]=k<1e-7?-r:-(r+r*(Math.cos(k*u)-1)/k);v[rad[1]]=k<1e-7?-r*u:-r*Math.sin(k*u)/k;return v;};
}
const flat=faces.map(f=>f.v.map(p=>deform(p,1))),n=normal(faces[0],flat[0]),facing=align(n,[0,0,1]),raw=(p,t)=>rotate(deform(p,t),facing.axis,facing.angle*t),box=bounds(points.map(p=>raw(p,1))),center=box.lo.map((v,k)=>(v+box.hi[k])/2);panels.push({id,faces,raw,center,w:box.hi[0]-box.lo[0],h:box.hi[1]-box.lo[1]});
}
const targets=pack(panels);return t=>panels.flatMap(panel=>panel.faces.map(f=>{const delta=mul(sub(targets.get(panel.id),panel.center),t),v=f.v.map(p=>plus(panel.raw(p,t),delta));return {...f,v,n:normal(f,v)};}));
}
function cutEdges(mesh){const edges=new Map();for(const f of mesh){f.edges=[...f.edges];f.v.forEach((p,a)=>{const b=(a+1)%f.v.length,k=[key(p),key(f.v[b])].sort().join('|');if(!edges.has(k))edges.set(k,[]);edges.get(k).push({f,a,b});});}for(const refs of edges.values())if(refs.length===1){const {f,a,b}=refs[0];if(!f.edges.some(([u,v])=>u===a&&v===b||u===b&&v===a))f.edges.push([a,b]);}return mesh;}
function prepare(index,polys){const source=polys.map(f=>({...f,v:f.v.map(p=>[...p]),n:[...f.n],edges:f.edges.map(e=>[...e])})),develop=[0,3,4,5].includes(index)?prism(source):pieces(source);return t=>t?cutEdges(develop(t)):develop(0);}
return {prepare};
})();
